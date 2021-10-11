const nodemailer = require('nodemailer')
const catchAsync = require('./catchAsync');


const sendEmail = async (options) =>{
    // 1) Create transporter
    const transporter = nodemailer.createTransport({
        host :  process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth : {
            user : process.env.EMAIL_USERNAME,
            pass : process.env.EMAIL_PASSWORD
        }

    })
//     var transporter = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "a4a8e96e9e657e",
//     pass: "56919c8d761cdb"
//   }
// });
    // 2) Define the email oprtions 
    const mailOptions = {
        from : 'Sandy Thoms <sandy@gmail.com>',
        to : options.email,
        subject : options.subject,
        text: options.message
    }
    //3) Sent actual email
    await transporter.sendMail(mailOptions);

}

module.exports = sendEmail;