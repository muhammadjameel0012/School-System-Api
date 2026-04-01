const express = require('express');
const { protect, restrictTo } = require('../../controllers/staff/adminController');
const {
  CreateAcademicYear,
  getAllAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} = require('../../controllers/Academic/academicYearController');
const { academicYearValidationSchema, academicYearUpdateSchema } = require('../../validation/academics/academicYearValidation');
const validationFunction = require('../../middleware/validationFunction');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(restrictTo('admin', 'teacher', 'student'), getAllAcademicYears)
  .post(restrictTo('admin'), validationFunction(academicYearValidationSchema), CreateAcademicYear);

router
  .route('/:id')
  .get(restrictTo('admin'), getAcademicYear)
  .patch(restrictTo('admin'), validationFunction(academicYearUpdateSchema), updateAcademicYear)
  .delete(restrictTo('admin'), deleteAcademicYear);

module.exports = router;
