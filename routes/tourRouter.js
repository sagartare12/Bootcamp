const express = require('express')



const tourController = require(`${__dirname}/../controllers/tourController`)
const authController = require('./../controllers/authController')
const reviewRouter = require('./reviewRouter')

const router = express.Router();


router.use('/:tourId/reviews',reviewRouter)
// router
//     .param('id',tourController.checkId);

router.route('/tour-stats')
    .get(tourController.getTourStats)

router.route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan)

router
    .route('/top-tours')
    .get(tourController.aliasTopTours,tourController.tours)

router
  .route('/')
  .get(tourController.tours)
  .post(
      authController.protect,
      authController.restrictTo('admin','lead-guide'),
      tourController.createTour)





router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'co-lead'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'co-lead'),
    tourController.deleteTour
  );


// router
//     .route('/:tourId/reviews')
//     .post(authController.protect,
//         authController.restrictTo('user'),
//         reviewController.createReview)


    module.exports = router;