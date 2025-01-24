import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  // Define the fields for the Payment model
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['Credit', 'Debit'], // Specify allowed payment methods
  },
  CardNumber: {
    type: String,
    required: [true, 'Card  number is required'],

   
  },
  CVC: {
    type: String,
    validate: {
      validator: function (value) {
        // Custom validation logic for CVC
        // For example, check if it's a valid CVC format
        return /^\d{3,4}$/.test(value);
      },
      message: 'Invalid CVC format',
    },
  },
  ExpirationDate: {
    type: String,
    validate: {
      validator: function (value) {
        // Custom validation logic for ExpirationDate
        // For example, check if it's a valid date in "MM/YY" format
        return /^\d{2}\/\d{2}$/.test(value);
      },
      message: 'Invalid ExpirationDate format (Use MM/YY format)',
    },
  },
  tax: {
    type: Number,
    required: [true, 'Tax is required'],
  },
  shippingPrice: {
    type: Number,
    required: [true, 'Shipping price is required'],
  },
  paidDate: {
    type: Date,
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['Pending', 'Processed', 'Failed'], // Define possible payment statuses
  },
},
{
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

  
// Create the Payment model
const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
