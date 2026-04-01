const Admin = require('../../models/Staff/Admin');
const asyncHandler = require('../../utils/asyncHandler');
const ClassLevel = require('../../models/Academic/ClassLevel');
const AppError = require('../../utils/appErrors');
const { sendSuccess } = require('../../utils/response');

exports.createClassLevel = asyncHandler(async (req, res, next) => {
  const { name, description, students, subjects, teachers } = req.body;
  const createdBy = req.user.id;
  //check if exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    return next(new AppError("Class  already exists"))
  }
  //create
  const classCreated = await ClassLevel.create({
    name,
    description,
    createdBy,
    students: students ?? [],
    subjects: subjects ?? [],
    teachers: teachers ?? [],
  });
  //push class into admin
  const admin = await Admin.findById(createdBy);
  admin.classLevels.push(classCreated._id);
  //save
  await admin.save({ validateBeforeSave: false });

  res.status(201).json({
    status: "success",
    classCreated,
  });
});

exports.getAllClassLevel = asyncHandler(async (req, res, next) => {
  const classes = await ClassLevel.find();
  sendSuccess(res, 200, 'Success', classes);
});

exports.getClassLevel = asyncHandler(async (req, res, next) => {
  const classLevel = await ClassLevel.findById(req.params.id);

  if (!classLevel) {
    return next(new AppError('No class level with that id !'))
  }

  res.status(200).json({
    status: "success",
    classLevel,
  });
});

exports.updateClassLevel = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  if (name) {
    const classFound = await ClassLevel.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (classFound) {
      return next(new AppError("Class  already exists"))
    }
  }
  const classLevel = await ClassLevel.findByIdAndUpdate(
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

  if (!classLevel) {
    return next(new AppError('No class level with that id !'))
  }

  sendSuccess(res, 200, 'Success', { classLevel });
});

exports.deleteClassLevel = asyncHandler(async (req, res, next) => {
  const classLevel = await ClassLevel.findByIdAndDelete(req.params.id);

  if (!classLevel) {
    return next(new AppError('No class level with that id !'))
  }

  sendSuccess(res, 204, 'Success', null);
});
