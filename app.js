const path = require('path');
const express = require('express');
const morgan = require('morgan')
const app = express();
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser');
var cors = require('cors');




const AppError = require('./alias/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require(`${__dirname}/routes/tourRouter`);
const userRouter = require(`${__dirname}/routes/userRouter`)
const hmiRouter = require(`${__dirname}/routes/hmiRouter`);
const reviewRouter = require(`${__dirname}/routes/reviewRouter`);
const viewRouter = require(`${__dirname}/routes/viewRouter`);






app.set('view engine' , 'pug');
app.set('views',path.join(__dirname,'views'));
// global middleware
//serving static files

app.use(express.static(path.join(__dirname,'/public')))
// set security http header only
app.use(helmet()) 



//body parser reading data from body into req.body
app.use(express.json({ limit : '10kb'}));
app.use(cookieParser());


//logging environment
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


app.use((req , res , next )=>{
    console.log('this is the middleware');
    next();
})


// request limit for same api
const limiter = rateLimit({
    max: 100,
    windowMs : 60 * 60 * 1000,
    message : 'Too many request for the same IP , Please try again later in hour'
})
app.use('/api',limiter)



//Data sanitization against noSql query injection
app.use(mongoSanitize());

//Data sanitzation against xss
app.use(xss())

//Preventing parameter pollution
app.use(
  hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'difficulty','price'],
  })
);



app.use((req , res , next ) =>{
    req.requestTime = new Date().toISOString();
   
    next();
})


// content security policy 
app.use((req, res, next) =>{ 
    res.setHeader( 'Content-Security-Policy', "script-src 'self' https://cdnjs.cloudflare.com" ); 
    next(); 
  })

  app.use(cors());

//routes

app.use('/', viewRouter);
app.use('/api/v1/tours' , tourRouter);
app.use('/api/v1/users' , userRouter);
app.use('/api/v1/hmi', hmiRouter);
app.use('/api/v1/reviews', reviewRouter);

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