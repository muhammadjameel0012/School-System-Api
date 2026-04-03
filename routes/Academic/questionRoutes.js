const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  createQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
} = require("../../controllers/Academic/questionsController");

const { questionValidationSchema, questionUpdateSchema } = require("../../validation/academics/questionsValidation");

const validationFunction = require('../../middleware/validationFunction');

const router = express.Router();

const allRoles = restrictTo('admin', 'teacher', 'student');

router.use(protect);

router.post("/:examId", restrictTo('teacher'), validationFunction(questionValidationSchema), createQuestion);
router.get("/", allRoles, getAllQuestions);
router
  .route('/:id')
  .get(allRoles, getQuestion)
  .patch(restrictTo('teacher'), validationFunction(questionUpdateSchema), updateQuestion);

module.exports = router;
