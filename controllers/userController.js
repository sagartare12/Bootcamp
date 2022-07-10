const User = require('./../models/userModels')
const catchAsync = require('./../alias/catchAsync')

const AppError = require('./../alias/appError')
const { KeyObject } = require('crypto')
const factory = require('./handleFactory');

const filterObj = (obj , ...allowedFields)=>{
    newObj = {};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

//GET ALL USERS 
exports.getAllUsers = factory.getAll(User)
// exports.getAllUsers = catchAsync(async(req,res,next)=>{
//     const users =await User.find();
//     //Send response
//     res.status(200).json({
//         status: 'Success',
//         result: users.length,
//         data: {
//             users
//         }
//     })
//     next();
// })


//GET CURRENT LOOGED IN USER
exports.getMe = (req , res , next)=>{
    req.params.id = req.user.id;
    next();
}


//GET USER
exports.getUser = factory.getOne(User);
// exports.getUser = catchAsync(async(req ,res,next)=>{
//   const jwtId = jwt.sign({ id })
//   console.log('new Id',jwtId);


  
    // const user = await User.findById(req.user.id);

    // if(!user){
    //     return next (new AppError('User not found',404))
    // }
    // res.status(200).json({
    //     status: 'Success',
    //     data : {
    //         user
    //     }
    // })
//     next();
// })

exports.createUsers = (req , res)=>{
      res.status(401).json({
        status: 'error',
        message: 'this route is not defined yet'
    })
}
// exports.getUser = (req , res)=>{
//       res.status(401).json({
//         status: 'error',
//         message: 'this route is not defined yet2'
//     })
// }

exports.updateMe = catchAsync(async(req,res,next)=>{
    // 1) Checked that user have not entered the password or confirmPassword
    if(req.body.password || req.body.confirmPassword){
        return next(new AppError('This route is not for update password , use updateMyPassword route',400))
    }
    // Filter out unwanted filds data that does not alloed to be updated
    const filterBody =filterObj(req.body, 'name', 'email');


    // 2) User data update
    const updatedUser = await User.findByIdAndUpdate(req.user.id,filterBody, {new: true , runValidators: true})
    res.status(200).json({
        status: 'Success',
        data:{
            user:updatedUser
        }
    })
})

exports.deleteMe = catchAsync(async(req ,res, next)=>{
    await User.findByIdAndUpdate(req.user.id, { active :false });

    res.status(401).json({
        status : 'Success',
        data : null
    })
})


//delete user

exports.deleteUser = factory.deleteOne(User);

//update user , do not update password
exports.updateUser = factory.updateOne(User)



