const express = require('express');
const userController = require(`${__dirname}/../controllers/userController`)


const router = express.Router();


router
    .route('/')
    .get(userController.getUsers)
    .post(userController.createUsers)

router 
    .route('/:id')
    .get(userController.getUser)

    module.exports = router;