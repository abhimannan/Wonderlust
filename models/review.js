const mongoose = require("mongoose");
const { Schema } = mongoose;
let User = require("./user.js");

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: true,           // ensure comment is not missing
    trim: true                // removes whitespace
  },
  rating: {
    type: Number, 
    required: true,           // ensure rating is not missing
    min: [1, 'Minimum rating is 1'],
    max: [5, 'Maximum rating is 5']
  },
  createdAt: {
    type: Date,
    default: Date.now         // don't call Date.now() immediately
  },
  author : {
    type : Schema.Types.ObjectId,
    ref : "User",
  }
});

// model
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
