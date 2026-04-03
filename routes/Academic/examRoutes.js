const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  createExam,
  getAllExams,
  getExam,
  updateExam,
} = require("../../controllers/Academic/examsController");

const { examValidationSchema, examUpdateSchema } = require("../../validation/academics/examValidation");
const validationFunction = require("../../middleware/validationFunction");

const router = express.Router();

const allRoles = restrictTo('admin', 'teacher', 'student');

router.use(protect);

router.route("/")
  .post(restrictTo('teacher'), validationFunction(examValidationSchema), createExam)
  .get(allRoles, getAllExams);

router.route("/:id")
  .get(allRoles, getExam)
  .patch(restrictTo('teacher'), validationFunction(examUpdateSchema), updateExam);

module.exports = router;
