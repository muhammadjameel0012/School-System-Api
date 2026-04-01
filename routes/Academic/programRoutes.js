const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  getAllPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram
} = require("../../controllers/Academic/ProgramsController");

const { programValidationSchema, programUpdateSchema } = require("../../validation/academics/programValidation");

const validation = require("../../middleware/validationFunction");

const router = express.Router();

router.use(protect);

router.route("/")
  .post(restrictTo('admin'), validation(programValidationSchema), createProgram)
  .get(restrictTo('admin', 'teacher', 'student'), getAllPrograms);

router.route("/:id")
  .get(restrictTo('admin'), getProgram)
  .patch(restrictTo('admin'), validation(programUpdateSchema), updateProgram)
  .delete(restrictTo('admin'), deleteProgram);

module.exports = router;
