const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'});
const app = require(`${__dirname}/app`);



process.on('uncaughtException',err=>{
    console.log(err.name,err.message);
    process.exit(1);
}) 


const database = `mongodb+srv://sagar:<PASSWORD>@cluster0.kifla.mongodb.net/natours?retryWrites=true&w=majority`;
const DB = database.replace('<PASSWORD>',
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

const server = app.listen(port, ()=>{
    console.log(`App runing on port: ${port}`);
})

process.on('unhandledRejection',err=>{
    console.log(err.name , err.message);
    console.log('Unhandle rejection , server getting down....!')
    server.close(()=>{
        process.exit(1);
    })
});




//dblinkCompass : mongodb+srv://sagar:<password>@cluster0.kifla.mongodb.net/test
//dbconnectionString : mongo "mongodb+srv://cluster0.kifla.mongodb.net/myFirstDatabase" --username sagar
//jihkljjbjbvh