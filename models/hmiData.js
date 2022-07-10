const mongoose = require('mongoose')
const hmiSchema = new mongoose.Schema({
  data1: {
    type: Number,
    required: [true, 'A tour must have name'],
    unique: true,
    trim: true,
    maxlength: [40, 'Name should not be above 40 characters'],
    minlength: [2, 'Name shoul not be below 2 characters'],
    // validate: [validator.isAlpha, 'Tour name must only contain characters']
  },
});
const Hmi = mongoose.model('hmiData', hmiSchema);
module.exports = Hmi;