const Student = require('../../models/Academic/Student');
const ExamResults = require('../../models/Academic/ExamResults');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/appErrors');
const { sendSuccess } = require('../../utils/response');


const populateExamResult = (query) =>
  query
    .populate({
      path: "exam",
      populate: {
        path: "questions",
      },
    })
    .populate("classLevel")
    .populate("academicTerm")
    .populate("academicYear");

exports.checkExamResults = asyncHandler(async (req, res, next) => {
  const examResultId = req.params.id;
  const role = req.user.role;

  if (role === "student") {
    const studentFound = await Student.findById(req.user.id);
    if (!studentFound) {
      return next(new AppError("No Student Found"));
    }
    const examResult = await populateExamResult(
      ExamResults.findOne({
        student: studentFound.id,
        _id: examResultId,
      })
    );
    if (!examResult) {
      return next(new AppError("No exam result found", 404));
    }
    if (examResult.isPublished === false) {
      return next(new AppError("Exam result is not available, check out later"));
    }
    return res.json({
      status: "success",
      data: examResult,
      student: studentFound,
    });
  }

  const examResult = await populateExamResult(ExamResults.findById(examResultId));
  if (!examResult) {
    return next(new AppError("No exam result found", 404));
  }
  res.json({
    status: "success",
    data: examResult,
  });
});


exports.getAllExamResults = asyncHandler(async (req, res, next) => {
  const filter =
    req.user.role === "student" ? { student: req.user.id } : {};
  const results = await ExamResults.find(filter).select("exam").populate("exam");
  sendSuccess(res, 200, 'Success', results);
});


exports.adminToggleExamResult = asyncHandler(async (req, res, next) => {
  const examResult = await ExamResults.findById(req.params.id);
  if (!examResult) {
    return next(new AppError("Exam result not found", 404));
  }

  let nextPublished;
  if (typeof req.body.isPublished === 'boolean') {
    nextPublished = req.body.isPublished;
  } else if (typeof req.body.publish === 'boolean') {
    nextPublished = req.body.publish;
  } else {
    nextPublished = !examResult.isPublished;
  }

  const publishResult = await ExamResults.findByIdAndUpdate(
    req.params.id,
    { isPublished: nextPublished },
    { new: true, runValidators: true }
  );
  sendSuccess(res, 200, 'Success', publishResult);
});
