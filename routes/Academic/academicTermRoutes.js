const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  createAcademicTerm,
  getAcademicTerms,
  getAcademicTerm,
  updateAcademicTerm,
  deleteAcademicTerm,
} = require("../../controllers/Academic/academicTermController");
const validationFunction = require('../../middleware/validationFunction');
const { academicTermValidationSchema, academicTermUpdateSchema } = require('../../validation/academics/academicTermValidation');

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(restrictTo("admin"), validationFunction(academicTermValidationSchema), createAcademicTerm)
  .get(restrictTo("admin", "teacher", "student"), getAcademicTerms);

router
  .route("/:id")
  .get(restrictTo("admin"), getAcademicTerm)
  .patch(restrictTo("admin"), validationFunction(academicTermUpdateSchema), updateAcademicTerm)
  .delete(restrictTo("admin"), deleteAcademicTerm);

module.exports = router;
