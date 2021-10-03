const express = require('express');
const userController = require(`${__dirname}/../controllers/userController`)
const authController = require(`${__dirname}/../controllers/authController`)


const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login);

router
    .route('/')
    .get( authController.protect,userController.getAllUsers)
    .post(userController.createUsers)

router 
    .route('/:id')
    .get(userController.getUser)

    module.exports = router;