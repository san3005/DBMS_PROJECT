import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ShippingAddressSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const ShippingAddress = mongoose.model('ShippingAddress', ShippingAddressSchema);
export default ShippingAddress;
