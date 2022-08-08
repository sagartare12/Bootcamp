const { promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModels');
const catchAsync = require('./../alias/catchAsync');
const AppError = require('./../alias/appError');
const sendEmail = require('./../alias/email');


const signToken = id => {
  console.log('sign token',id);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = ( user , statusCode , res)=>{
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
 
    httpOnly: false
  };

  if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token,cookieOptions);
  //remove the password from output when create user
  user.password = undefined;

  res.status(statusCode).json({
    status : 'success',
    token,
    data : {
      user
    }
  })
}



exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role:req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  });
createSendToken(newUser , 200, res)
  // const token=signToken(newUser._id);
  // res.status(200).json({
  //     status: 'Success',
  //     token,
  //     newUser
  // })
 

});


exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  
createSendToken(user,200,res);
  
  // 3) If everything ok, send token to client
//   const token = signToken(user._id);
// console.log(token)
//   res.status(200).json({
//       status: 'Success',Y
//       token
//   })
})
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }else if(req.cookies){
    token = req.cookies.jwt;
  }
  console.log(token)
  // 2) Check if user not log in
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );

}
const decode = await promisify(jwt.verify)(token , process.env.JWT_SECRET)
console.log(decode);

    // 3) Check that the user still exist

   const freshUser =  await User.findById(decode.id);
   if(!freshUser){
       return next (
           new AppError('The user belonging to this id is no longer exist!',401)
       )
   }

   // 4) If user change the password
 if(freshUser.changedPasswordAfter(decode.iat)){
   return next(
     new AppError('User recently changed password ! Please log in again',401)
   )
 }

 //GRANT ACCESS TO LOGGED IN USER
 req.user = freshUser;
  next();
})




// Only for rendered pages, no errors!
exports.isLoggedIn = catchAsync(async (req, res, next) => {
 
 

  // 2) Check if user not log in
  if (req.cookies.jwt) {
    try{
        const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
        // 3) Check that the user still exist
        const currentUser =  await User.findById(decode.id);
        if(!currentUser){
          return next ()
        }
        
        // 4) If user change the password
        if(currentUser.changedPasswordAfter(decode.iat)){
        return next();
        }
    // there is logged in user
        res.locals.user = currentUser;
        return next();
      }catch(err){
        return next();
      }}
      next();
  }
)




exports.restrictTo=(...roles)=>{
  //roles[user,admin,co-lead] 
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next (new AppError('You do not have permission to perform this action',403))
    }
    next()
  }
}

exports.forgotPassword=async(req,res,next)=>{
   
  //1) Get user  based on posted email id
  let user = await User.findOne({email: req.body.email});

 console.log(user)
  if(!user){
    return next(new AppError('There is no user with this email',404))
  }
  //2) Generate random reset token
   const resetToken = user.createPasswordResetToken();
  await user.save({validateBeforeSave : false});
  //3) Send it to the user's email

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your passwors ! Submit a patch request with your new password and password confirm to : ${resetUrl}.\ If you didnt forgot your password then please igore this email`;

  try {
    
    await sendEmail({
      email : user.email,
      subject : 'Your password reset token ( Valid for 10min)',
      message
    })
 
    res.status(200).json({
      status: 'Success',
      message: 'Token sent to your email'
    })
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave : false});

    return next(new AppError('There was an error sending the mail.Try  again later !',500));
  }
  
  next()
}

exports.resetPassword=catchAsync(async(req,res,next)=>{

  //1) Get user based on the token
  const hashedToken = crypto
  .createHash('sha256')
  .update(req.params.token)
  .digest('hex');

  const user = await User.findOne(
    {
      passwordResetToken : hashedToken,
      passwordResetExpires : { $gt : Date.now()}
    }
  )

  //2) If token has not expired , there is user set new password

  if(!user){
    return next( new AppError('Token is not valid, or has expired'))
  }

  user.password = req.body.password;
   user.PasswordConfirm= req.body.passwordConfirm;
   user.passwordResetToken=undefined;
user.passwordResetExpires= undefined;
await user.save();

createSendToken(user,200,res);
  // next()
})


exports.updatePassword = catchAsync(async (req ,res, next)=>{
 // 1) Get user from collection
 const user = await  User.findById(req.user.id).select('+password');

 //2) Check if current user password is correct
 if( !(await user.correctPassword(req.body.passwordCurrent, user.password))){
   return next(new AppError('Your current password is wrong !', 401));

 }

 //3) Update password
 user.password = req.body.password;
 user.passwordConfirm= req.body.passwordConfirm;
await user.save();
 //4)log user in send jwt
 createSendToken(user,200,res);
})