const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  checkExamResults,
  getAllExamResults,
  adminToggleExamResult,
} = require("../../controllers/Academic/examResultsController");

const router = express.Router();

const allRoles = restrictTo('admin', 'teacher', 'student');

router.use(protect);

router.get("/", allRoles, getAllExamResults);

router.get("/:id/checking", allRoles, checkExamResults);

router.patch("/:id/admin-toggle-publish", restrictTo('admin'), adminToggleExamResult);

module.exports = router;
