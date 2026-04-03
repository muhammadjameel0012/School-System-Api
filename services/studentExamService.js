const mongoose = require("mongoose");
const Exam = require("../models/Academic/Exam");
const Question = require("../models/Academic/Questions");
const ExamAttempt = require("../models/Academic/ExamAttempt");
const ExamResult = require("../models/Academic/ExamResults");
const Student = require("../models/Academic/Student");
const AppError = require("../utils/appErrors");

const DEFAULT_DURATION_MS = 60 * 60 * 1000; // 1 hour mock fallback

/** Set STUDENT_EXAM_MOCK_FALLBACK=1 to return a placeholder when no exams exist in DB. */
const MOCK_EXAMS_FALLBACK = process.env.STUDENT_EXAM_MOCK_FALLBACK === "1";

function mockExamList() {
  const id = new mongoose.Types.ObjectId();
  return [
    {
      id: id.toString(),
      _id: id,
      name: "Sample Quiz (mock)",
      description:
        "No exams in database — seed exams or set STUDENT_EXAM_MOCK_FALLBACK=0 to hide this placeholder.",
      duration: "60 minutes",
      examStatus: "live",
      passMark: 50,
      totalMark: 100,
      questions: [],
    },
  ];
}

/**
 * Parse duration strings like "30 minutes", "45 min", "1 hour" to milliseconds.
 */
function parseDurationToMs(durationInput) {
  if (durationInput == null || durationInput === "") {
    return DEFAULT_DURATION_MS;
  }
  if (typeof durationInput === "number" && !Number.isNaN(durationInput)) {
    return durationInput;
  }
  const s = String(durationInput).trim().toLowerCase();
  const num = parseFloat(s);
  if (Number.isNaN(num)) {
    return DEFAULT_DURATION_MS;
  }
  if (s.includes("hour") || s.includes("hr")) {
    return Math.round(num * 60 * 60 * 1000);
  }
  if (s.includes("minute") || s.includes("min") || s.includes("mins")) {
    return Math.round(num * 60 * 1000);
  }
  if (s.includes("sec")) {
    return Math.round(num * 1000);
  }
  return DEFAULT_DURATION_MS;
}

const OPTION_KEYS = ["optionA", "optionB", "optionC", "optionD"];

function letterToOptionKey(letter) {
  const L = String(letter || "").toUpperCase();
  const m = { A: "optionA", B: "optionB", C: "optionC", D: "optionD" };
  return m[L] || null;
}

/** Accepts legacy "A"–"D" or canonical optionA–optionD */
function selectionToLetter(input) {
  if (input == null || input === "") return null;
  const s = String(input).trim();
  const upper = s.toUpperCase();
  if (["A", "B", "C", "D"].includes(upper)) return upper;
  const keyToLetter = { optionA: "A", optionB: "B", optionC: "C", optionD: "D" };
  if (OPTION_KEYS.includes(s)) {
    return keyToLetter[s] || null;
  }
  return null;
}

function normalizeCorrectLetter(question) {
  const ca = String(question.correctAnswer ?? "").trim();
  const upper = ca.toUpperCase();
  if (["A", "B", "C", "D"].includes(upper)) {
    return upper;
  }
  /** DB may store field names e.g. "optionA" or "optionA " (trimmed above) */
  const keyNorm = ca.toLowerCase();
  const optionNameToLetter = {
    optiona: "A",
    optionb: "B",
    optionc: "C",
    optiond: "D",
  };
  if (optionNameToLetter[keyNorm]) {
    return optionNameToLetter[keyNorm];
  }
  const pairs = [
    ["A", question.optionA],
    ["B", question.optionB],
    ["C", question.optionC],
    ["D", question.optionD],
  ];
  for (const [letter, text] of pairs) {
    if (text != null && String(text).trim() === ca) {
      return letter;
    }
  }
  return null;
}

function normalizeCorrectOptionKey(question) {
  const letter = normalizeCorrectLetter(question);
  return letter ? letterToOptionKey(letter) : null;
}

function isAnswerCorrect(question, selectedOptionOrLegacyLetter) {
  const letter = selectionToLetter(selectedOptionOrLegacyLetter);
  const correct = normalizeCorrectLetter(question);
  if (!correct || !letter) {
    return false;
  }
  return correct === letter;
}

function mapRemarksForExamResult(percentage) {
  if (percentage >= 80) return "Excellent";
  if (percentage >= 60) return "Good";
  return "Poor";
}

/**
 * Strip sensitive fields from a question object for "during exam" views.
 */
function sanitizeQuestionForStudent(q) {
  if (!q) return null;
  const o = q.toObject ? q.toObject() : { ...q };
  delete o.correctAnswer;
  delete o.isCorrect;
  return o;
}

async function loadExamLean(examId) {
  if (!mongoose.Types.ObjectId.isValid(examId)) {
    return null;
  }
  // Use collection query to avoid Exam schema `find` middleware (heavy populate on questions).
  return Exam.collection.findOne({
    _id: new mongoose.Types.ObjectId(examId),
  });
}

async function loadQuestionsForExam(exam) {
  if (!exam || !exam.questions?.length) {
    return [];
  }
  return Question.find({ _id: { $in: exam.questions } }).lean();
}

/**
 * Auto-submit if past expiresAt while still in_progress.
 */
async function refreshAttemptIfExpired(attempt) {
  if (!attempt || attempt.status !== "in_progress") {
    return attempt;
  }
  if (new Date() <= new Date(attempt.expiresAt)) {
    return attempt;
  }
  return submitAttemptInternal(attempt, { auto: true });
}

async function getAttemptOrThrow(studentId, examId) {
  const attempt = await ExamAttempt.findOne({
    student: studentId,
    exam: examId,
  });
  if (!attempt) {
    throw new AppError("No attempt found for this exam. Start the exam first.", 404);
  }
  return refreshAttemptIfExpired(attempt);
}

function buildAnswersMap(attempt) {
  const map = new Map();
  for (const a of attempt.answers || []) {
    let key = a.selectedOption;
    if (!key && a.selectedOptionId) {
      key = letterToOptionKey(a.selectedOptionId);
    }
    map.set(String(a.questionId), key || null);
  }
  return map;
}

async function submitAttemptInternal(attempt, { auto = false } = {}) {
  if (attempt.status === "completed") {
    return attempt;
  }

  const exam = await loadExamLean(attempt.exam);
  if (!exam) {
    throw new AppError("Exam not found", 404);
  }

  const questions = await loadQuestionsForExam(exam);
  const totalQuestions = questions.length;
  const answerMap = buildAnswersMap(attempt);

  let correctCount = 0;
  for (const q of questions) {
    const qid = String(q._id);
    const selected = answerMap.get(qid);
    if (selected && isAnswerCorrect(q, selected)) {
      correctCount += 1;
    }
  }

  const incorrectCount = totalQuestions - correctCount;
  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 10000) / 100 : 0;

  const passMark = exam.passMark != null ? Number(exam.passMark) : 50;
  const totalMark = exam.totalMark != null ? Number(exam.totalMark) : 100;
  const marksPerQuestion =
    totalQuestions > 0 ? totalMark / totalQuestions : 0;
  const score = Math.round(correctCount * marksPerQuestion * 100) / 100;
  const passed = percentage >= passMark;

  attempt.status = "completed";
  attempt.submittedAt = new Date();
  attempt.totalQuestions = totalQuestions;
  attempt.correctCount = correctCount;
  attempt.incorrectCount = incorrectCount;
  attempt.percentage = percentage;
  attempt.score = score;
  attempt.passed = passed;
  attempt.passMarkSnapshot = passMark;
  await attempt.save();

  await upsertExamResultForAttempt({
    attempt,
    exam,
    studentId: attempt.student,
    percentage,
    scorePoints: score,
    passMark,
    passed: passed ? "Pass" : "Fail",
    remarks: mapRemarksForExamResult(percentage),
  });

  return attempt;
}

async function upsertExamResultForAttempt({
  attempt,
  exam,
  studentId,
  percentage,
  scorePoints,
  passMark,
  passed,
  remarks,
}) {
  const existing = await ExamResult.findOne({
    student: studentId,
    exam: exam._id,
  });

  const payload = {
    student: studentId,
    exam: exam._id,
    grade: percentage,
    score: scorePoints,
    passMark,
    status: passed,
    remarks,
    subject: exam.subject,
    classLevel: exam.classLevel,
    academicTerm: exam.academicTerm,
    academicYear: exam.academicYear,
    isPublished: false,
  };

  if (existing) {
    Object.assign(existing, payload);
    await existing.save();
    return existing;
  }

  const created = await ExamResult.create(payload);
  await Student.findByIdAndUpdate(studentId, {
    $addToSet: { examResults: created._id },
  });
  return created;
}

async function listExamsWithStatus(studentId) {
  const inProgress = await ExamAttempt.find({
    student: studentId,
    status: "in_progress",
  });
  for (const a of inProgress) {
    if (new Date() > new Date(a.expiresAt)) {
      await refreshAttemptIfExpired(a);
    }
  }

  let exams = await Exam.aggregate([
    {
      $project: {
        name: 1,
        description: 1,
        duration: 1,
        passMark: 1,
        totalMark: 1,
        examStatus: 1,
        examDate: 1,
        examTime: 1,
        subject: 1,
        program: 1,
        classLevel: 1,
        academicYear: 1,
        academicTerm: 1,
        questions: 1,
      },
    },
  ]);

  if ((!exams || exams.length === 0) && MOCK_EXAMS_FALLBACK) {
    exams = mockExamList();
  }

  const attempts = await ExamAttempt.find({ student: studentId }).lean();
  const byExam = new Map(attempts.map((a) => [String(a.exam), a]));

  return exams.map((exam) => {
    const eid = String(exam._id);
    const att = byExam.get(eid);
    let attemptStatus = "not-started";
    if (att) {
      if (att.status === "completed") {
        attemptStatus = "completed";
      } else if (att.status === "in_progress") {
        attemptStatus =
          new Date() > new Date(att.expiresAt) ? "completed" : "in-progress";
      }
    }
    return {
      exam: { ...exam, id: exam._id },
      attemptStatus,
      attemptId: att ? String(att._id) : null,
    };
  });
}

async function startOrResumeExam(studentId, examId) {
  if (!mongoose.Types.ObjectId.isValid(examId)) {
    throw new AppError("Invalid exam id", 400);
  }

  const exam = await loadExamLean(examId);
  if (!exam) {
    throw new AppError("Exam not found", 404);
  }

  const questions = await loadQuestionsForExam(exam);
  if (questions.length === 0) {
    throw new AppError("This exam has no questions yet.", 400);
  }

  let attempt = await ExamAttempt.findOne({ student: studentId, exam: examId });
  if (attempt) {
    attempt = await refreshAttemptIfExpired(attempt);
  }

  if (attempt && attempt.status === "completed") {
    throw new AppError("This exam has already been submitted.", 409);
  }

  const durationMs = parseDurationToMs(exam.duration);
  const now = new Date();

  if (attempt && attempt.status === "in_progress") {
    return {
      attemptId: String(attempt._id),
      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
      resumed: true,
    };
  }

  const expiresAt = new Date(now.getTime() + durationMs);

  const created = await ExamAttempt.create({
    student: studentId,
    exam: examId,
    status: "in_progress",
    startedAt: now,
    expiresAt,
    answers: [],
    totalQuestions: questions.length,
  });

  return {
    attemptId: String(created._id),
    startedAt: created.startedAt,
    expiresAt: created.expiresAt,
    resumed: false,
  };
}

async function getAttemptPaper(studentId, examId) {
  if (!mongoose.Types.ObjectId.isValid(examId)) {
    throw new AppError("Invalid exam id", 400);
  }

  let attempt = await getAttemptOrThrow(studentId, examId);
  if (attempt.status !== "in_progress") {
    throw new AppError("No active attempt. Exam is already submitted or expired.", 400);
  }

  const exam = await loadExamLean(examId);
  const questions = await loadQuestionsForExam(exam);
  const answerMap = buildAnswersMap(attempt);

  const questionsOut = questions.map((q) => {
    const sanitized = sanitizeQuestionForStudent(q);
    return {
      ...sanitized,
      selectedOption: answerMap.get(String(q._id)) || null,
    };
  });

  return {
    attemptId: String(attempt._id),
    startedAt: attempt.startedAt,
    expiresAt: attempt.expiresAt,
    questions: questionsOut,
  };
}

async function saveAnswer(studentId, examId, { questionId, selectedOption }) {
  if (!mongoose.Types.ObjectId.isValid(examId) || !mongoose.Types.ObjectId.isValid(questionId)) {
    throw new AppError("Invalid id", 400);
  }

  if (!selectedOption || !OPTION_KEYS.includes(String(selectedOption))) {
    throw new AppError(
      `selectedOption must be one of: ${OPTION_KEYS.join(", ")}`,
      400
    );
  }

  let attempt = await getAttemptOrThrow(studentId, examId);
  if (attempt.status !== "in_progress") {
    throw new AppError("Cannot update answers after submit.", 400);
  }

  const exam = await loadExamLean(examId);
  const qIds = (exam.questions || []).map((id) => String(id));
  if (!qIds.includes(String(questionId))) {
    throw new AppError("Question does not belong to this exam.", 400);
  }

  const answers = [...(attempt.answers || [])].filter(
    (a) => String(a.questionId) !== String(questionId)
  );
  answers.push({ questionId, selectedOption: String(selectedOption) });
  attempt.answers = answers;
  await attempt.save();

  return { saved: true, questionId: String(questionId), selectedOption: String(selectedOption) };
}

async function submitExam(studentId, examId) {
  if (!mongoose.Types.ObjectId.isValid(examId)) {
    throw new AppError("Invalid exam id", 400);
  }

  let attempt = await getAttemptOrThrow(studentId, examId);
  if (attempt.status === "completed") {
    return summarizeResult(attempt);
  }
  if (attempt.status !== "in_progress") {
    throw new AppError("Invalid attempt state", 400);
  }

  attempt = await submitAttemptInternal(attempt, { auto: false });
  return summarizeResult(attempt);
}

function summarizeResult(attempt) {
  return {
    attemptId: String(attempt._id),
    submittedAt: attempt.submittedAt,
    score: attempt.score,
    percentage: attempt.percentage,
    correct: attempt.correctCount,
    incorrect: attempt.incorrectCount,
    totalQuestions: attempt.totalQuestions,
    passed: attempt.passed,
    passMark: attempt.passMarkSnapshot,
  };
}

async function getResult(studentId, examId) {
  if (!mongoose.Types.ObjectId.isValid(examId)) {
    throw new AppError("Invalid exam id", 400);
  }

  let attempt = await ExamAttempt.findOne({ student: studentId, exam: examId });
  if (!attempt) {
    throw new AppError("No attempt found for this exam.", 404);
  }
  attempt = await refreshAttemptIfExpired(attempt);
  if (attempt.status !== "completed") {
    throw new AppError("Exam not submitted yet.", 400);
  }
  return summarizeResult(attempt);
}

async function getReview(studentId, examId) {
  if (!mongoose.Types.ObjectId.isValid(examId)) {
    throw new AppError("Invalid exam id", 400);
  }

  let attempt = await ExamAttempt.findOne({ student: studentId, exam: examId });
  if (!attempt) {
    throw new AppError("No attempt found for this exam.", 404);
  }
  attempt = await refreshAttemptIfExpired(attempt);
  if (attempt.status !== "completed") {
    throw new AppError("Exam not submitted yet. Review is available after submit.", 400);
  }

  const exam = await loadExamLean(examId);
  const questions = await loadQuestionsForExam(exam);
  const answerMap = buildAnswersMap(attempt);

  const items = questions.map((q) => {
    const selected = answerMap.get(String(q._id)) || null;
    const correctOptionKey = normalizeCorrectOptionKey(q);
    return {
      questionId: String(q._id),
      prompt: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      selectedOption: selected,
      correctOption: correctOptionKey,
      isCorrect: selected ? isAnswerCorrect(q, selected) : false,
    };
  });

  return {
    attemptId: String(attempt._id),
    summary: summarizeResult(attempt),
    questions: items,
  };
}

module.exports = {
  listExamsWithStatus,
  startOrResumeExam,
  getAttemptPaper,
  saveAnswer,
  submitExam,
  getResult,
  getReview,
  parseDurationToMs,
  refreshAttemptIfExpired,
};
