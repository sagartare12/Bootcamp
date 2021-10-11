const crypto = require('crypto');
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
    role:{
        type:String,
        enum:['user','admin','co-lead'],
        default:'user'
        
    },
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
    },
    passwordChangedAt : {
        type :Date,
        required : true
    },
    passwordResetToken : String,
    passwordResetExpires: Date
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

userSchema.methods.changedPasswordAfter = function(JWTTImestamp){
    
    if(this.passwordChangedAt){
        const changeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000,10);
        console.log(changeTimestamp,JWTTImestamp)
        return JWTTImestamp < changeTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken= function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    console.log({resetToken},this.passwordResetToken)
    this.passwordResetExpires =  Date.now()+ 10*60/1000;

    return resetToken;
}
const User = mongoose.model('User',userSchema)

module.exports = User;