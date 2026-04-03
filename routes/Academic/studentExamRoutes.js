const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  listStudentExams,
  startExam,
  getAttempt,
  saveAnswer,
  submitExam,
  getResult,
  getReview,
} = require("../../controllers/Academic/studentExamController");
const validationFunction = require("../../middleware/validationFunction");
const { studentExamAnswerSchema } = require("../../validation/academics/studentExamValidation");

const router = express.Router();

router.use(protect, restrictTo("student"));

router.get("/", listStudentExams);
router.post("/:examId/start", startExam);
router.get("/:examId/attempt", getAttempt);
router.patch("/:examId/answer", validationFunction(studentExamAnswerSchema), saveAnswer);
router.post("/:examId/submit", submitExam);
router.get("/:examId/result", getResult);
router.get("/:examId/review", getReview);

module.exports = router;
