// models/Reviewmodel.js
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required:true
  }
}, {
  timestamps: true
});


const Review = mongoose.model('Review', ReviewSchema);
export default Review;