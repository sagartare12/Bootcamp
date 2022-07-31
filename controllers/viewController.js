const Tour = require('./../models/tourModels');
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
  res.cookie('name', 'express')
  res.status(200).render('t',{
    title:'test'
  })
})


