const mongoose = require('mongoose');
const { getIsMock } = require('../config/db');
const { MockProduct } = require('./mockModels');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  stock: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MongoProduct = mongoose.model('Product', productSchema);

const Product = {
  find: (query) => getIsMock() ? MockProduct.find(query) : MongoProduct.find(query),
  findOne: (query) => getIsMock() ? MockProduct.findOne(query) : MongoProduct.findOne(query),
  findById: (id) => getIsMock() ? MockProduct.findById(id) : MongoProduct.findById(id),
  create: (doc) => getIsMock() ? MockProduct.create(doc) : MongoProduct.create(doc),
  findByIdAndUpdate: (id, update) => getIsMock() ? MockProduct.findByIdAndUpdate(id, update) : MongoProduct.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: (id) => getIsMock() ? MockProduct.findByIdAndDelete(id) : MongoProduct.findByIdAndDelete(id)
};

module.exports = Product;
