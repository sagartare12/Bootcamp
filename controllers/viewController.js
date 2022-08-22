const Tour = require('./../models/tourModels');
const User = require('./../models/userModels');
const catchAsync = require('./../alias/catchAsync')





exports.getOverview = catchAsync(async(req, res , next) => {

  //1) Get data from collection
  const tours = await  Tour.find();
  //2)build template template
  //3)Render this template
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
}
);

exports.getTour =catchAsync(async(req, res , next) => {
  // 1) get the data for requested route
  const tour = await Tour.findOne({slug:req.params.slug}).populate({
    path: 'reviews',
    fields : 'review rating user'
  })
  // build the template 

  // 3) REnder the data 
  res.status(200).render('tour', {
    title: 'the forest hicker',
    tour
  });
})



exports.logIn = catchAsync(async(req, res , next) => {

  res.status(200).render('login', {
    title: 'Log in form',
    
  });
}
);

exports.test = catchAsync(async(req,res,next)=>{
  const temp='as234'
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
 
    httpOnly: true
  };
  res.cookie('name sagar', temp,cookieOptions)
  res.status(200).render('t',{
    title:'test'
  })
})

exports.getAccount = (req,res)=>{
  res.status(200).render('account', {
    title:'Your account'
  })
}

exports.updateUserData= catchAsync(async(req,res,next)=>{
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,{
      name:req.body.name,
      email:req.body.email
    },
    {
      now:true,
      runValidator:true
    }
  )
const d =await User.findById(updateUser.id)

  res.status(200).render('account', {
    title:'Your account',
    user:d
  })
}

)