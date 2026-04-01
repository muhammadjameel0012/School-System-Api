const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  getAllYearGroups,
  getYearGroup,
  createYearGroup,
  updateYearGroup,
  deleteYearGroup
} = require("../../controllers/Academic/yearGroupsController");

const validationFunction = require('../../middleware/validationFunction');
const { yearGroupValidationSchema, yearGroupUpdateSchema } = require('../../validation/academics/yearGroupValidation');

const router = express.Router();

router.use(protect);

router.route("/")
  .post(restrictTo('admin'), validationFunction(yearGroupValidationSchema), createYearGroup)
  .get(restrictTo('admin', 'teacher', 'student'), getAllYearGroups);

router.route("/:id")
  .get(restrictTo('admin'), getYearGroup)
  .patch(restrictTo('admin'), validationFunction(yearGroupUpdateSchema), updateYearGroup)
  .delete(restrictTo('admin'), deleteYearGroup);

module.exports = router;
