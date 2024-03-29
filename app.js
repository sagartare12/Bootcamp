const express = require('express');
const morgan = require('morgan')
const app = express();
const AppError = require('./alias/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require(`${__dirname}/routes/tourRouter`);
const userRouter = require(`${__dirname}/routes/userRouter`)
const hmiRouter = require(`${__dirname}/routes/hmiRouter`);

app.use(express.json());
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//middleware
app.use((req , res , next )=>{
    console.log('this is the middleware');
    next();
})

app.use((req , res , next ) =>{
    req.requestTime = new Date().toISOString();
   
    next();
})


//routes
app.use('/api/v1/tours' , tourRouter);
app.use('/api/v1/users' , userRouter);
app.use('/api/v1/hmi', hmiRouter);

app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:'Fail',
    //     message:`Cant't find ${req.originalUrl} on this server`
    // })

    // const error = new Error(`Cant't find ${req.originalUrl} on this server`);
    // error.status = 'Fail';
    // error.statusCode = 404;
    // next(error);
const message = `Cant't find ${req.originalUrl} on this server`;
    next (new AppError(message,400));
})

app.use(globalErrorHandler);

module.exports = app;