

const Review = require('./../models/reviewModels');
const catchAsync = require('./../alias/catchAsync')
const factory = require('./handleFactory');


//GET ALL REVIEWS
exports.getAllReviews = factory.getAll(Review);
// exports.getAllReviews = catchAsync(async(req, res , next)=>{
    
//     let filter= {};
//     if(req.params.tourId) filter={tour :req.params.tourId};
//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status : 'Succes',
//         results : reviews.length,
//         data : {
//             reviews
//         }
//     })

    
// })


//GET REVIEW
exports.getReview = factory.getOne(Review);
exports.createUserTourIds = (req , res, next)=>{
      if (!req.body.tour) req.body.tour = req.params.tourId;
      if (!req.body.user) req.body.user = req.user.id;
      next();
}

//create review
exports.createReview = factory.createOne(Review);
// exports.createReview = catchAsync(async(req , res , next)=>{

//     //allow nested route
//     if(!req.body.tour) req.body.tour = req.params.tourId
//     if(!req.body.user) req.body.user = req.user.id;


//     const newReview = await Review.create(req.body)

//     res.status(201).json({
//         status : 'Success',
//         data : {
//             review : newReview
//         }
//     })
// })



//Delete review
exports.deleteReview = factory.deleteOne(Review);

//update review 
exports.updateReview = factory.updateOne(Review);