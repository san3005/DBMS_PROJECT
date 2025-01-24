import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the User model
  },
  orderedList: [
    {
      Name: {
        type: String,
        required: true,
      },
      Img: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      Price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product', // Reference to the Product model
      },
    },
  ],
  // Reference to the Payment model
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
 
  
  
  isDelivered: {
    type: Boolean,
    default: false,
    required: true,
  },
  deliveredDate: {
    type: Date,
  },
  // Reference to the ShippingAddress model
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShippingAddress',
    required: true,
  },
},
{
  timestamps: true,
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
