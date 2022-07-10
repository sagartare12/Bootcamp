const express = require('express');
const userController = require(`${__dirname}/../controllers/userController`)
const authController = require(`${__dirname}/../controllers/authController`)


const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);

//this middleware will come in stack after upper 4 router runs
// router.use(authController.protect);

router.get(
  '/me',
  authController.protect,userController.getMe,
  userController.getUser
);
router.patch('/updateMyPassword', authController.protect,authController.updatePassword)
router.patch('/updateMe',authController.protect,userController.updateMe)
router.delete('/deleteMe', authController.protect, userController.deleteMe);

//after this middleware all router are authorized
// router.use(authController.restrictTo('admin'));


router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUsers)

router 
    .route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUser)

    module.exports = router;