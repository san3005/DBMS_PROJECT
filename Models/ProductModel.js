import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
  },
  Img: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
    trim: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Brand: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
    min: 0, // Minimum price value
  },
  Size: {
    type: String,
    trim: true, // Trim whitespace
  },
  Color: {
    type: String,
    trim: true, // Trim whitespace
  },
  CountInstock: {
    type: Number,
    required: true,
    default:10,
    min: 0, // Minimum count in stock value
  },
  sellerId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", ProductSchema);

export default Product