const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'});
const app = require(`${__dirname}/app`);


const DB = process.env.DATABASE.replace('<PASSWORD>',
process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successful'))



// const testTour = new Tour({
//     name:'The forest ',
//     // rating:5,
//     price:500
// });
// try {
//     testTour
//         .save()
//         .then(doc =>{
//             console.log(doc);
//         })
// } catch (error) {
//     console.log('ERROR:',error);
// };
// console.log(process.env);
const port = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log(`App runing on port: ${port}`);
})


//dblinkCompass : mongodb+srv://sagar:<password>@cluster0.kifla.mongodb.net/test
//dbconnectionString : mongo "mongodb+srv://cluster0.kifla.mongodb.net/myFirstDatabase" --username sagar
//jihkljjbjbvh