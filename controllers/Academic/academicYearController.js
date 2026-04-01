const AcademicYear = require('../../models/Academic/AcademicYear');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/appErrors');
const Admin = require('../../models/Staff/Admin');
const { sendSuccess } = require('../../utils/response');

exports.CreateAcademicYear = asyncHandler(async (req, res, next) => {
  const { name, fromYear, toYear, isCurrent, students, teachers } = req.body;
  const createdBy = req.user.id;

  const academicYearFound = await AcademicYear.findOne({ name });
  if (academicYearFound) {
    return next(new AppError("Academic year already exist!", 400));
  }

  const newAcademicYear = await AcademicYear.create({
    name,
    fromYear,
    toYear,
    isCurrent: isCurrent ?? false,
    createdBy,
    students: students ?? [],
    teachers: teachers ?? [],
  });

  const admin = await Admin.findById(createdBy)
  admin.academicYears.push(newAcademicYear.id)
  await admin.save({ validateBeforeSave: false })

  sendSuccess(res, 201, 'Success', { academicYear: newAcademicYear });
});

exports.getAllAcademicYears = asyncHandler(async (req, res, next) => {

  const academicYears = await AcademicYear.find()

  sendSuccess(res, 200, 'Success', academicYears);
});

exports.getAcademicYear = asyncHandler(async (req, res, next) => {

  const academicYear = await AcademicYear.findById(req.params.id)

  if (!academicYear) {
    return next(new AppError("No Academic year with that id !", 404))
  }

  sendSuccess(res, 200, 'Success', { academicYear });
});

exports.updateAcademicYear = asyncHandler(async (req, res, next) => {
  const { name, fromYear, toYear } = req.body;

  // Avoid changing name to existing academic year (exclude current document)
  if (name) {
    const academicYearFound = await AcademicYear.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (academicYearFound) {
      return next(new AppError("Academic year already exist!", 400));
    }
  }

  const updatedAcademicYear = await AcademicYear.findByIdAndUpdate(
    req.params.id,
    { name, fromYear, toYear },
    { new: true, runValidators: true }
  );

  if (!updatedAcademicYear) {
    return next(new AppError("No academic year with that id !", 404))
  }

  res.status(201).json({
    status: "success",
    updatedAcademicYear
  })
})

exports.deleteAcademicYear = asyncHandler(async (req, res, next) => {
  const academicYear = await AcademicYear.findByIdAndDelete(req.params.id)
  if (!academicYear) {
    return next(new AppError("No academic year with that id !", 404))
  }
  sendSuccess(res, 204, 'Success', null);
});