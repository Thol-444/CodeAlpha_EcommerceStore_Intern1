const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');
const { seedProductsIfEmpty } = require('./controllers/productController');

// Routers
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Welcome / Health Route
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Welcome to Aetheria E-commerce API Store',
    timestamp: new Date()
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Internal Error'
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect DB
  await connectDB();

  // Pre-seed mock items
  await seedProductsIfEmpty();

  // Listen
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
