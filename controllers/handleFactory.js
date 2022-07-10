const catchAsync = require('./../alias/catchAsync');
const AppError = require('./../alias/appError');
const ApiFeatures = require('./../alias/apiFeatures');

exports.deleteOne = Model=>
catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Not document found with that ID', 404));
  }
  res.status(204).json({
    status: 'Success',
    data: null,
  });
});


exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('Not document  found with that ID', 404));
    }
    res.status(200).json({
      status: 'Success',
      data: {
        data : doc,
      },
    });
  });

  exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
      // const newTour = new Tour({});
      // newTour.save()

      const doc = await Model.create(req.body);
      res.status(201).json({
        status: 'Suceess',
        data: {
          data: doc
        },
      });
    });

    exports.getOne = (Model,popOptions)=>
       catchAsync(async (req, res, next) => {
         // const id = req.params.id * 1 ;
         // const tour = tourss.find(el=>el.id === id);

         let query = Model.findById(req.params.id);
         if(popOptions) query = query.populate(popOptions)
         const doc = await query;
         // const tour = await Tour.findOne({ _id:req.params.id});

         if (!doc) {
           return next(new AppError('Not document  found with that ID', 404));
         }
        
         res.status(200).json({
           status: 'success',

           data: {
             data: doc
           }
         });
       });

      

        // exports.getAll = (Model) =>
        //   catchAsync(async (req, res, next) => {

        //     //  let filter = {};
        //     //  if (req.params.tourId) filter = { tour: req.params.tourId };
        //     const features = new ApiFeatures(Model.find(), req.query)
        //       .filter()
        //       .sort()
        //       .fieldLimiting()
        //       .pagination();
        //     const doc = await features.query;
        //     res.status(200).json({
        //       status: 'success',
        //       result: doc.length,
        //       data: {
        //         data: doc,
        //       },
        //     });
        //   });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //to allow nested route to get al  review on tour
    let Filter = {};
    if (req.params.tourId) Filter = { tour: req.params.tourId };

    const features = new ApiFeatures(Model.find(Filter), req.query)
      .filter()
      .sort()
      .fieldLimiting()
      .pagination();
    // const doc = await features.query.explain();
    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      reqTime: req.requestTime,
      result: doc.length,
      data: {
        tours: doc,
      },
    });
  });