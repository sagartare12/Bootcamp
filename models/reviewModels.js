// review , rating , timestamp , createdAt

const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema({
    review : {
        type: String,
        required : [true , 'Review can not be empty']
    },
    rating :{
        type : Number,
        min : 1,
        max :5
    },
    createdAt :{
        type  : Date,
        default : Date.now
    },
    tour: {
        type : mongoose.Schema.ObjectId,
        ref : 'Tour',
        required : [true , 'Review must belong to tour']
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        Required : [true, 'Review must belong to the user']
    },
   
},
   {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  })

  reviewSchema.pre(/^find/, function(next){

    // this.populate({
    //     path:'tour',
    //     select:'name'
    // }).populate({
    //     path:'user',
    //     select:'name photo'
    // })
        this.populate({
          path: 'user',
          select: 'name photo',
        });
      next()
  })


  reviewSchema.statics.calculateRatings= function(tourId){
      const stats = this.aggregate([
          {
              $match : { tour : tourId }
          },
          {
              $group: {
                  _id : '$tour',
                  nRatings : { $sum : 1},
                  avgRating :{ $avg : '$rating'}
              }
          }
      ])
      console.log(stats)
  }

  
  reviewSchema.post('save', function() {
      // this points to current review
      this.constructor.calculateRatings(this.tour)
  });
const Review = mongoose.model('Review', reviewSchema)

module.exports = Review;