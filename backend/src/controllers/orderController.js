const Order = require('../models/order');
const Product = require('../models/product');
const Cart = require('../models/cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode) {
      return res.status(400).json({ success: false, message: 'Please provide full shipping address details' });
    }

    const orderItems = [];
    let totalAmount = 0;

    // Verify stock and construct items with pricing
    for (const item of items) {
      const product = await Product.findById(item.productId.toString());
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name || item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });

      // Update product stock level
      const updatedStock = product.stock - item.quantity;
      await Product.findByIdAndUpdate(product._id, { stock: updatedStock });
    }

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount: Math.round((totalAmount + Number.EPSILON) * 100) / 100, // Round to 2 decimal places
      shippingAddress,
      paymentStatus: 'Paid',
      orderStatus: 'Processing'
    });

    // Clear the cart
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    // Sort orders by date descending
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders
};
