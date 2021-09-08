const Tour = require('./../models/tourModels')
const ApiFeatures = require('./../alias/apiFeatures')
const catchAsync = require('./../alias/catchAsync')
const AppError = require('./../alias/appError')
// const fs = require('fs');

// const tourss = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

//middleware

// exports.checkId = (req , res , next , val)=>{
//     console.log(`The tour id is ${val}`)
//     if(req.params.id * 1 > tourss.length){
//         return res.status(401).json({
//             status: 'fail',
//             messsage : 'Invalid id'
//         })
//     }
//     next();
// }

exports.aliasTopTours = (req,res,next)=>{
    req.query.limit='4';
    req.query.sort='-ratingsAverage,price';
    req.query.fields='name,duration,difficulty,price,ratingsAverage,summary,description';
    next();
};

// class ApiFeatures{
//     constructor(query,queryString){
//         this.query=query;
//         this.queryString=queryString;
//     }
//     filter(){
//         const queryObj = {...this.queryString};
//     const excludeFields = ['page','sort','limit','fields'];
//     excludeFields.forEach(e=>delete queryObj[e]);

//     //1B advanced query
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=> `$${match}`);
// // console.log(JSON.parse(queryStr));
//     this.query=this.query.find(JSON.parse(queryStr));
//     return this;
//     }

//     //2 sorting
//     sort(){
//     if(this.queryString.sort){
//     const sortBy = this.queryString.sort.split(',').join(' ');

//     this.query = this.query.sort(sortBy);
//     }else{
//         this.query= this.query.sort('-createdAt');
//     }
//     return this;
//     }

//      //3 fields limiting
//      fieldLimiting(){
//     if(this.queryString.fields){
//         const fields = this.queryString.fields.split(',').join(' ');
//         this.query = this.query.select(fields);
//     }else{
//         this.query = this.query.select('-__v');
//     }
//     return this;
//     }

    
//     //pagnation
//     pagination(){
//     const page = this.queryString.page*1;
//     const limit = this.queryString.limit*1 || 100;
//     const skip = (page-1)*limit;
//      this.query = this.query.skip(skip).limit(limit);

//      return this;
//     }
// }

exports.tours = catchAsync(async(req, res,next)=>{

    console.log(req.requestTime);

    //1A BUILD QUERY
//     const queryObj = {...req.query};
//     const excludeFields = ['page','sort','limit','fields'];
//     excludeFields.forEach(e=>delete queryObj[e]);

//     //1B advanced query
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=> `$${match}`);
// // console.log(JSON.parse(queryStr));
//     let query = Tour.find(JSON.parse(queryStr));

//     //2 sorting
//     if(req.query.sort){
//     const sortBy = req.query.sort.split(',').join(' ');

//     query = query.sort(sortBy);
//     }else{
//         query= query.sort('-createdAt');
//     }

//     //3 fields limiting
//     if(req.query.fields){
//         const fields = req.query.fields.split(',').join(' ');
//         query = query.select(fields);
//     }else{
//         query = query.select('-__v');
//     }
//     //pagnation
//     const page = req.query.page*1;
//     const limit = req.query.limit*1 || 100;
//     const skip = (page-1)*limit;
//      query = query.skip(skip).limit(limit);

//      if(req.query.page){
//          const numTours = await Tour.countDocuments;
//          if(page >= numTours){
//              throw new Error("This page not exist");
//          }
//      }
    //execute query
    const features = new ApiFeatures(Tour.find(),req.query)
    .filter()
    .sort()
    .fieldLimiting()
    .pagination();
    const tourss = await features.query;
    res
    .status(200)
    .json({
        status: 'success',
        reqTime : req.requestTime,
        result : tourss.length,
        data: {
        tours : tourss
        }
    })

})

exports.tour = catchAsync(async (req, res,next)=>{

    // const id = req.params.id * 1 ;
    // const tour = tourss.find(el=>el.id === id);
    

    
    const tour = await Tour.findById(req.params.id)
    // const tour = await Tour.findOne({ _id:req.params.id});

    
    if (!tour) {
    return next(new AppError(`No tour found with that ID`));
  }
    res
    .status(200)
    .json({
        status: 'success',
        
        data: {
        tour
        }
    })

})

// exports.createTour =async (req, res)=>{
    
//     // const newTour = new Tour({});
//     // newTour.save()

//     try {
        
//         const newTour = await Tour.create(req.body);
//         res.status(201).json({
//             status: 'Suceess',
//             data: {
//                 tour : newTour
//             }
//         })
//     } catch (error) {
//         res.status(400).json({
//             status:'Fail',
//             message:error
//         })
//     }
// }


exports.createTour =catchAsync(async (req, res,next)=>{
    
    // const newTour = new Tour({});
    // newTour.save()

    
        
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'Suceess',
            data: {
                 newTour
            }
        })
    
})


    exports.updateTour = catchAsync(async(req,res,next)=>{
        

            const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
                new:true,
                runValidators:true
            })

            if(!tour){
            return next(new AppError('Not tour found with that ID',404));
            }
            res.status(200)
            .json({
                status:'Success',
                data:{
                    tour
                }
            })
        
    })

    exports.deleteTour=catchAsync(async(req,res)=>{
         

            const tour = await Tour.findByIdAndDelete(req.params.id);
            if(!tour){
            return next(new AppError('Not tour found with that ID',404));
            }
            res.status(204)
            .json({
                status:'Success',
                data: null
                
            })
        

    })
    // const newId = tourss[tourss.length-1].id + 1;
    // const newTour = Object.assign({id: newId }, req.body);
    
    // tourss.push(newTour);
    // // console.log(tourss);

    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
    // JSON.stringify(tourss),
    // () => {
    //     res.status(201).json({
    //         status: 'success',
    //         data : {
    //             tour :newTour
    //         }
    //     })
    // }
    
    // )  


    exports.getTourStats= catchAsync(async(req,res,next)=>{
        
            const stats = await Tour.aggregate([
                {
                    $match: { ratingsAverage : {$gte :4.5}}
                },
                {
                    $group: {
                        _id: '$difficulty',
                        numTours : {$sum :1},
                       numRatings: {$sum :'$ratingsQuantity'},
                        avgRatings: { $avg : '$ratingsAverage'},
                        avgPrice : { $avg : '$price'},
                        minPrice : {$min : '$price'},
                        maxPrice :{$max : '$price'}
                    }
                },
                {
                    $sort : {avgPrice :1}
                }
                
            ])

            res.status(201).json({
                status: 'success',
                result: stats.length,
                data :{
                    stats 
                }
            }
                )
      
    })

    exports.getMonthlyPlan= catchAsync(async(req,res,next)=>{
        
            const year = req.params.year*1;

            const plan =await Tour.aggregate([
               {
                    $unwind: '$startDates'
               },
               {
                   $match : {
                       startDates: {
                       $gte: new Date(`${year}-01-01`),
                       $lte: new Date(`${year}-12-31`)
                       }
                   }
               },
               {
                   $group : {
                       _id : { $month: '$startDates'},
                       numTourStarts: {$sum :1},
                       tourName: {$push: '$name'}
                   }
               },
               {
                   $addFields : {month : '$_id'}
               },
               {
                   $project : { _id :0}
               },
               {
                   $sort  : {
                       numTourStarts : -1
                   }
               },
               {
                   $limit : 12
               }
            ])
            res.status(201).json({
                status:'success',
                data:{
                    plan
                }
            })
        
    })