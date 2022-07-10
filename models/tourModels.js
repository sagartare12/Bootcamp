const mongoose = require('mongoose')
const validator = require('validator')
// const User = require('./userModels')


const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Name should not be above 40 characters'],
      minlength: [2, 'Name shoul not be below 2 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    // slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: ['easy', 'difficult', 'medium'],
        message: 'Difficulty is either : easy , medium , difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating average should not be less than 1'],
      max: [5, 'Rating average should not be greater then 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price { {VALUE} }should be less than price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    price: {
      type: Number,
      required: [true, 'A tour must have price'],
    },
    secrateTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
        //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
        {
      type: 
        {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day:Number
    
        }
      
    ],
    guides:[
      {
        type: mongoose.Schema.ObjectId,
        ref:'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


// tourSchema.index({price:1});
tourSchema.index({price:1 , ratingsAverage:  1});
tourSchema.index({slug : 1});


tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
});

//virtual poppulate
tourSchema.virtual('reviews',{
  ref:'Review',
  foreignField:'tour',
  localField:'_id'
})

//Documeny middleware runs before save() and create()  method

// tourSchema.pre('save', function(next){
//     this.slug = slugify(this.name , {lower: true} );
//     next();
// })

// tourSchema.pre('save', async function(next){
//   const guidesPromise = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromise);
//   next();
// })

// // tourSchema.post('save', function(doc,next){
// //     console.log('Will save document')
// // })

// //Query middleware

tourSchema.pre(/^find/, function(next){

    this.find({ secrateTour : { $ne : true}});

    this.start = Date.now();
    next();

});

tourSchema.pre(/^find/,function(next){
  this.populate({
    path:'guides',
    select:'-_v -passwordChangedAt'
  });
  next();
}
)

tourSchema.post(/^find/, function(docs,next){

//    let time = (Date.now()-this.start)*1;
let time = Date.now();
    console.log(`Query took ${time - this.start} milliseconds`);
    console.log(docs)
    next();
})

//Aggregation middleware

tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match : { secrateTour : { $ne : true}}})
    console.log(this.pipeline())
    next();
})
const Tour = mongoose.model('Tour',tourSchema);
module.exports=Tour