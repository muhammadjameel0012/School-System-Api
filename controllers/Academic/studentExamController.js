const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess } = require("../../utils/response");
const studentExamService = require("../../services/studentExamService");

exports.listStudentExams = asyncHandler(async (req, res) => {
  const exams = await studentExamService.listExamsWithStatus(req.user.id);
  sendSuccess(res, 200, "Success", { exams });
});

exports.startExam = asyncHandler(async (req, res) => {
  const data = await studentExamService.startOrResumeExam(req.user.id, req.params.examId);
  sendSuccess(res, 201, "Success", data);
});

exports.getAttempt = asyncHandler(async (req, res) => {
  const data = await studentExamService.getAttemptPaper(req.user.id, req.params.examId);
  sendSuccess(res, 200, "Success", data);
});

exports.saveAnswer = asyncHandler(async (req, res) => {
  const data = await studentExamService.saveAnswer(req.user.id, req.params.examId, req.body);
  sendSuccess(res, 200, "Success", data);
});

exports.submitExam = asyncHandler(async (req, res) => {
  const data = await studentExamService.submitExam(req.user.id, req.params.examId);
  sendSuccess(res, 200, "Success", data);
});

exports.getResult = asyncHandler(async (req, res) => {
  const data = await studentExamService.getResult(req.user.id, req.params.examId);
  sendSuccess(res, 200, "Success", data);
});

exports.getReview = asyncHandler(async (req, res) => {
  const data = await studentExamService.getReview(req.user.id, req.params.examId);
  sendSuccess(res, 200, "Success", data);
});
