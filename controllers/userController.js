const User = require('./../models/userModels')
const catchAsync = require('./../alias/catchAsync')
const AppError = require('./../alias/appError')


exports.getAllUsers = catchAsync(async(req,res,next)=>{
    const users =await User.find();
    //Send response
    res.status(200).json({
        status: 'Success',
        result: users.length,
        data: {
            users
        }
    })
    next();
})
exports.getUser = catchAsync(async(req ,res,next)=>{

    const user = await User.findById(req.params.id)

    if(!user){
        return next (new AppError('User not found',404))
    }
    res.status(200).json({
        status: 'Success',
        data : {
            user
        }
    })
    next();
})

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