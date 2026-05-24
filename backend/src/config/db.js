const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMock = false;

// Mock database storage paths
const DATA_DIR = path.join(__dirname, '../../data');
const getMockFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const initMockDb = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const collections = ['users', 'products', 'carts', 'orders'];
  collections.forEach(col => {
    const file = getMockFilePath(col);
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify([], null, 2));
    }
  });
  console.log('⚡ Mock Database initialized successfully at:', DATA_DIR);
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aetheria-store';
  try {
    // Try to connect to MongoDB with a short timeout so we don't block boot too long
    mongoose.set('strictQuery', false);
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500 // 2.5 seconds timeout
    });
    console.log('✅ MongoDB connected successfully.');
    isMock = false;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.log('⚠️ Falling back to Local Mock Database (JSON file-based)...');
    initMockDb();
    isMock = true;
  }
};

const getMockData = (collection) => {
  try {
    const file = getMockFilePath(collection);
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

const saveMockData = (collection, data) => {
  try {
    const file = getMockFilePath(collection);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(`Error saving mock data for ${collection}:`, e);
  }
};

module.exports = {
  connectDB,
  getIsMock: () => isMock,
  getMockData,
  saveMockData
};
