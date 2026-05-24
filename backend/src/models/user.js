const mongoose = require('mongoose');
const { getIsMock } = require('../config/db');
const { MockUser } = require('./mockModels');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MongoUser = mongoose.model('User', userSchema);

// Proxy interface that routes to either Mongoose or Mock database
const User = {
  find: (query) => getIsMock() ? MockUser.find(query) : MongoUser.find(query),
  findOne: (query) => getIsMock() ? MockUser.findOne(query) : MongoUser.findOne(query),
  findById: (id) => getIsMock() ? MockUser.findById(id) : MongoUser.findById(id),
  create: (doc) => getIsMock() ? MockUser.create(doc) : MongoUser.create(doc),
  findByIdAndUpdate: (id, update) => getIsMock() ? MockUser.findByIdAndUpdate(id, update) : MongoUser.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: (id) => getIsMock() ? MockUser.findByIdAndDelete(id) : MongoUser.findByIdAndDelete(id)
};

module.exports = User;
