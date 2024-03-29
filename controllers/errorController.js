// const AppError = require('./../alias/appError')

// const  handleCastErrorDB = err =>{
//     // const message = `Invalid ${err.path}: ${err.value}.`;
//     return  next(new AppError(`Invalid ${err.path}: ${err.value}.` ,400));
// }
// const sendErrorDev=(err , res)=>{
    
//     res.status(err.statusCode).json({
//         status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack
     
//     })

// }


// const sendErrorProd =(error, res)=>{
//     // if(err.isOperational){
//     res.status(error.statusCode).json({
//         status : error.status,
//        message :error
//     })
// // }else{
    
// //     res.status(500).json({
// //         status : 'Error',
// //         message : 'Something went very wrong'
// //     })
// // }
// }


// module.exports=(err, req , res , next)=>{

//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error'; 
// console.log(err)

//      if (process.env.NODE_ENV === 'production') {
//     sendErrorDev(err, res);
//   } else
//  if (process.env.NODE_ENV === 'development') {
//     // let error = { ...err };
//     if(err.name === 'CastError'){
//           return  next(new AppError(`Invalid ${err.path}: ${err.value}.` ,404));
//     }
//  }
// res.status(err.statusCode).json({
//         status : err.status,
//        message :err.message
//     })
// // // res.status(err.statusCode).json({
// // //     error:err
// // // })
// // console.log(err);
// //     if (err.name === 'CastError')  {
// //         // error = handleCastErrorDB(error);
// //     }
// //     sendErrorProd(error, res);
// //   }
// //     }else if(process.env.NODE.env === 'production'){

// //         let error = {...err};
// //           if (error.name === 'CastError') error = handleCastErrorDB(error);
    
// //         // if(error.name === 'CastError') error = handleCastErrorDB(error)
// //         sendErrorProd(error , res);
// //     }
// // // let error = {...err};
// // if(err.name === 'CastError'){
// //     // const message = `Invalid ${err.path}: ${err.value}.`;
// //      return next(new AppError( `Invalidreddr ${err.path}: ${err.value}.` ,404));
// // console.log('hi')
// // }
// //     res.status(err.statusCode).json({
// //         status: err.status,
// //         message : err.message

// //     })
    
//  next()
// };


const AppError = require('./../alias/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

const handleDuplicateFieldDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field name ${value}.Please use another tour name`;

  return new AppError(message , 400);
}

const handleValidationErrorDB = err =>{
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join(' ,')}`;
   return new AppError(message,400)
}

const handleJWTError = () => new AppError('Invalid token ! Please login again',401);
const handleTokenExpiredError = () => new AppError('Your token has expired , Please log in again', 401);
// // y

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
      
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    
  // res.status(err.statusCode).json({
  //     status: 'error',
  //     message: error
  //   });

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if(error.code === 11000) error = handleDuplicateFieldDB(error);
    if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if(error.name === 'JsonWebTokenError') error = handleJWTError();
    if(error.name === 'TokenExpiredError') error = handleTokenExpiredError();
    // if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // if (error.name === 'ValidationError')
    //   error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
   
};