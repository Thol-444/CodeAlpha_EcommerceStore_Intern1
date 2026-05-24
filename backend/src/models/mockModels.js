const { getMockData, saveMockData } = require('../config/db');

// Helper to generate custom IDs similar to ObjectId
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

class MockModel {
  constructor(collection) {
    this.collection = collection;
  }

  async find(query = {}) {
    const data = getMockData(this.collection);
    return data.filter(item => {
      for (let key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const data = getMockData(this.collection);
    return data.find(item => {
      for (let key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    }) || null;
  }

  async findById(id) {
    const data = getMockData(this.collection);
    return data.find(item => item._id === id || item.id === id) || null;
  }

  async create(doc) {
    const data = getMockData(this.collection);
    const newDoc = {
      _id: generateId(),
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    data.push(newDoc);
    saveMockData(this.collection, data);
    return newDoc;
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const data = getMockData(this.collection);
    const index = data.findIndex(item => item._id === id);
    if (index === -1) return null;

    // Handle Mongoose $set operator or plain object update
    const updateFields = update.$set || update;
    data[index] = {
      ...data[index],
      ...updateFields,
      updatedAt: new Date()
    };
    saveMockData(this.collection, data);
    return data[index];
  }

  async findOneAndUpdate(query, update, options = { new: true }) {
    const data = getMockData(this.collection);
    const item = data.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (!item) return null;

    const index = data.indexOf(item);
    const updateFields = update.$set || update;
    data[index] = {
      ...data[index],
      ...updateFields,
      updatedAt: new Date()
    };
    saveMockData(this.collection, data);
    return data[index];
  }

  async findByIdAndDelete(id) {
    const data = getMockData(this.collection);
    const index = data.findIndex(item => item._id === id);
    if (index === -1) return null;
    const deleted = data.splice(index, 1)[0];
    saveMockData(this.collection, data);
    return deleted;
  }
}

module.exports = {
  MockUser: new MockModel('users'),
  MockProduct: new MockModel('products'),
  MockCart: new MockModel('carts'),
  MockOrder: new MockModel('orders')
};
