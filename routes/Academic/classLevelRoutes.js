const express = require("express");
const { getAllClassLevel, getClassLevel, createClassLevel, updateClassLevel, deleteClassLevel } = require("../../controllers/Academic/classLevelController");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const { classLevelValidationSchema, classLevelUpdateSchema } = require("../../validation/academics/classLevelValidation");
const validationFunction = require("../../middleware/validationFunction");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(restrictTo('admin'), validationFunction(classLevelValidationSchema), createClassLevel)
  .get(restrictTo('admin', 'teacher', 'student'), getAllClassLevel);

router
  .route("/:id")
  .get(restrictTo('admin', 'teacher', 'student'), getClassLevel)
  .patch(restrictTo('admin'), validationFunction(classLevelUpdateSchema), updateClassLevel)
  .delete(restrictTo('admin'), deleteClassLevel);

module.exports = router;
