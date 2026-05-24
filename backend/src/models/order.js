const mongoose = require('mongoose');
const { getIsMock } = require('../config/db');
const { MockOrder } = require('./mockModels');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      image: {
        type: String
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentStatus: {
    type: String,
    default: 'Paid'
  },
  orderStatus: {
    type: String,
    default: 'Processing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MongoOrder = mongoose.model('Order', orderSchema);

const Order = {
  find: (query) => getIsMock() ? MockOrder.find(query) : MongoOrder.find(query),
  findOne: (query) => getIsMock() ? MockOrder.findOne(query) : MongoOrder.findOne(query),
  findById: (id) => getIsMock() ? MockOrder.findById(id) : MongoOrder.findById(id),
  create: (doc) => getIsMock() ? MockOrder.create(doc) : MongoOrder.create(doc),
  findByIdAndUpdate: (id, update) => getIsMock() ? MockOrder.findByIdAndUpdate(id, update) : MongoOrder.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: (id) => getIsMock() ? MockOrder.findByIdAndDelete(id) : MongoOrder.findByIdAndDelete(id)
};

module.exports = Order;
