const Teacher = require('../../models/Staff/Teacher');
const Exam = require('../../models/Academic/Exam');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/appErrors');
const { sendSuccess } = require('../../utils/response');

// Create a new exam
exports.createExam = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    examStatus,
    academicYear,
    classLevel,
    passMark,
    totalMark,
  } = req.body;

  // Find the teacher
  const teacherFound = await Teacher.findById(req.user.id);
  if (!teacherFound) {
    return next(new AppError('Teacher Not Found', 404));
  }

  // Check if exam already exists
  const examExists = await Exam.findOne({ name });
  if (examExists) {
    return next(new AppError("Exam already exists", 400));
  }

  // Create the exam (questions are added afterward via POST /questions/:examId)
  const newExam = await Exam.create({
    name,
    description,
    academicTerm,
    academicYear,
    classLevel,
    duration,
    examDate,
    examTime,
    examType,
    examStatus: examStatus ?? 'pending',
    subject,
    program,
    passMark: passMark ?? 50,
    totalMark: totalMark ?? 100,
    createdBy: req.user.id,
  });

  // Link the exam to the teacher
  teacherFound.examsCreated.push(newExam.id);
  await teacherFound.save({ validateBeforeSave: false });

  res.status(201).json({
    status: "success",
    newExam,
  });
});

// Get all exams
exports.getAllExams = asyncHandler(async (req, res, next) => {
  const exams = await Exam.find();
  sendSuccess(res, 200, 'Success', exams);
});

// Get a specific exam
exports.getExam = asyncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(new AppError('No exams with that id!', 404));
  }

  res.status(200).json({
    status: "success",
    exam,
  });
});

// Update an exam
exports.updateExam = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    academicYear,
    classLevel,
  } = req.body;

  if (name) {
    const examFound = await Exam.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (examFound) {
      return next(new AppError("Exam already exists", 400));
    }
  }

  // Update the exam
  const updatedExam = await Exam.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      subject,
      program,
      academicTerm,
      duration,
      examDate,
      examTime,
      examType,
      academicYear,
      classLevel,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedExam) {
    return next(new AppError('No exams with that id!', 404));
  }

  sendSuccess(res, 200, 'Success', { exam: updatedExam });
});
