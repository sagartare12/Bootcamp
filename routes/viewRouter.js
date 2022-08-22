const express = require('express')

const router = express.Router();
const viewController = require(`${__dirname}/../controllers/viewController`);
const authController = require(`${__dirname}/../controllers/authController`)

// router.use(authController.isLoggedIn)

router.get('/',authController.isLoggedIn , viewController.getOverview);

router.get('/tour/:slug',authController.isLoggedIn, viewController.getTour);

router.get('/login',authController.isLoggedIn, viewController.logIn);

router.get('/test',viewController.test);

router.get('/me',authController.protect,viewController.getAccount);

router.post('/submit-user-data',authController.protect,viewController.updateUserData,viewController.getAccount)
module.exports = router