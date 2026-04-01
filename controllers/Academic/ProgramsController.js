const Admin = require('../../models/Staff/Admin');
const asyncHandler = require('../../utils/asyncHandler');
const Program = require('../../models/Academic/Program');
const AppError = require('../../utils/appErrors');
const { sendSuccess } = require('../../utils/response');


exports.createProgram = asyncHandler(async (req, res, next) => {
  const { name, description, duration, code, teachers, students, subjects } = req.body;
  const createdBy = req.user.id;
  //check if exists
  const programFound = await Program.findOne({ name });
  if (programFound) {
    return next(new AppError("Program  already exists"))
  }
  //create
  const programCreated = await Program.create({
    name,
    description,
    duration: duration ?? '4 years',
    ...(code != null && code !== '' ? { code } : {}),
    createdBy,
    teachers: teachers ?? [],
    students: students ?? [],
    subjects: subjects ?? [],
  });
  //push program into admin
  const admin = await Admin.findById(createdBy);
  admin.programs.push(programCreated._id);
  //save
  await admin.save({ validateBeforeSave: false });

  sendSuccess(res, 201, 'Success', { program: programCreated });
});

exports.getAllPrograms = asyncHandler(async (req, res, next) => {
  const programs = await Program.find();
  res.status(200).json({
    status: "success",
    programs,
  });
});

exports.getProgram = asyncHandler(async (req, res, next) => {
  const program = await Program.findById(req.params.id);

  if (!program) {
    return next(new AppError('No program with that id', 404))
  }

  sendSuccess(res, 200, 'Success', { program });
});

exports.updateProgram = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  if (name) {
    const programFound = await Program.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (programFound) {
      return next(new AppError("Program  already exists"))
    }
  }
  const program = await Program.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!program) {
    return next(new AppError('No program with that id', 404))
  }

  res.status(200).json({
    status: "success",
    program,
  });
});

exports.deleteProgram = asyncHandler(async (req, res, next) => {
  const program = await Program.findByIdAndDelete(req.params.id);

  if (!program) {
    return next(new AppError('No program with that id', 404))
  }

  sendSuccess(res, 204, 'Success', null);
});
