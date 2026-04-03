const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  getAllSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} = require("../../controllers/Academic/subjectsController");

const validationFunction = require('../../middleware/validationFunction');
const { subjectValidationSchema, subjectUpdateSchema } = require('../../validation/academics/subjectValidation');

const router = express.Router();

router.use(protect);

router.post("/:programId", restrictTo('admin'), validationFunction(subjectValidationSchema), createSubject);
router.get('/', restrictTo('admin', 'teacher', 'student'), getAllSubjects);

router.route("/:id")
  .get(restrictTo('admin', 'teacher', 'student'), getSubject)
  .patch(restrictTo('admin'), validationFunction(subjectUpdateSchema), updateSubject)
  .delete(restrictTo('admin'), deleteSubject);

module.exports = router;
