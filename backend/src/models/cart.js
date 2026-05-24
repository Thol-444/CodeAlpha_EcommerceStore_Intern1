const mongoose = require('mongoose');
const { getIsMock } = require('../config/db');
const { MockCart } = require('./mockModels');

const cartSchema = new mongoose.Schema({
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
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const MongoCart = mongoose.model('Cart', cartSchema);

const Cart = {
  find: (query) => getIsMock() ? MockCart.find(query) : MongoCart.find(query),
  findOne: (query) => getIsMock() ? MockCart.findOne(query) : MongoCart.findOne(query),
  findById: (id) => getIsMock() ? MockCart.findById(id) : MongoCart.findById(id),
  create: (doc) => getIsMock() ? MockCart.create(doc) : MongoCart.create(doc),
  findOneAndUpdate: (query, update, options) => getIsMock() ? MockCart.findOneAndUpdate(query, update, options) : MongoCart.findOneAndUpdate(query, update, { new: true, ...options }),
  findByIdAndUpdate: (id, update) => getIsMock() ? MockCart.findByIdAndUpdate(id, update) : MongoCart.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: (id) => getIsMock() ? MockCart.findByIdAndDelete(id) : MongoCart.findByIdAndDelete(id)
};

module.exports = Cart;
