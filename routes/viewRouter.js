const express = require('express')

const router = express.Router();
const viewController = require(`${__dirname}/../controllers/viewController`);
const authController = require(`${__dirname}/../controllers/authController`)

router.use(authController.isLoggedIn)

router.get('/', viewController.getOverview);

router.get('/tour/:slug',viewController.getTour);

router.get('/login',viewController.logIn);

router.get('/test',viewController.test);
module.exports = router