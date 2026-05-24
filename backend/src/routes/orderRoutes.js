const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all order routes

router.post('/', createOrder);
router.get('/', getUserOrders);

module.exports = router;
