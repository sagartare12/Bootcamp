const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')




const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true ,'Please tell us your name']
    },
    email:  {
        type: String,
        required: [true,'Please enter your email'],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail, 'Please provide valid email ID']
    },
    photo : String,
    password: {
        type: String ,
        required: [true,'Please provide password'],
        minlength:8,
        select:false
    },
    passwordConfirm: {
        type: String,
        required:[true,'Please confirm password'],
        validate : {
            //This only works on CREATE or SAVE !!
            validator : function(el){
                return el === this.password;
            },
            message: 'Password are not same!'
        }
    }

})


userSchema.pre('save',async function(next){
    //this is only work when password actually modified
    if(!this.isModified('password')) return next();

    //hash the passwords with the cost of 12
    this.password =await bcrypt.hash(this.password,12);
    
    //delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function(candidatePasword, userPassword){
    return await bcrypt.compare(candidatePasword , userPassword)
}
const User = mongoose.model('User',userSchema)

module.exports = User;