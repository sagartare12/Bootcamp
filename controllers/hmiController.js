const HMI = require('./../models/hmiData');
const catchAsync = require('./../alias/catchAsync');



exports.createHmiData = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({});
  // newTour.save()

  const createHmi = await HMI.create(req.body);
  res.status(200).json({
    status: 'Suceess',
    data: {
      createHmi,
    },
  });
});

exports.getHmiData = catchAsync(async (req, res, next) => {
  const hmi = await HMI.findById(req.params.id);

  if (!hmi) {
    return next(new AppError('hmi data not found', 404));
  }
  res.status(200).json({
    status: 'Success',
    data: {
      hmi,
    },
  });
  next();
});

exports.updateHmiData = catchAsync(async (req, res, next) => {
  const hmi = await HMI.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!hmi) {
    return next(new AppError('Not hmi data found with that ID', 404));
  }
  res.status(200).json({
    status: 'Success',
    data: {
      hmi,
    },
  });
});
