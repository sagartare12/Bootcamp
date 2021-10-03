const express = require('express')



const tourController = require(`${__dirname}/../controllers/tourController`)
const authController = require('./../controllers/authController')
const router = express.Router();

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
    .get(authController.protect, tourController.tours)
    .post(tourController.createTour)

router
    .route('/:id')
    .get(tourController.tour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

    module.exports = router;