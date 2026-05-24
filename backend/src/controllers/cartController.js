const Cart = require('../models/cart');
const Product = require('../models/product');

// Helper to manually populate cart items with product details
const populateCartItems = async (cart) => {
  if (!cart) return null;
  const itemsPopulated = [];
  for (const item of cart.items) {
    const product = await Product.findById(item.productId.toString());
    if (product) {
      itemsPopulated.push({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image,
          rating: product.rating,
          stock: product.stock
        },
        quantity: item.quantity,
        _id: item._id || item.productId
      });
    }
  }
  return {
    _id: cart._id,
    userId: cart.userId,
    items: itemsPopulated,
    updatedAt: cart.updatedAt
  };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    const populated = await populateCartItems(cart);
    res.status(200).json({ success: true, cart: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity) || 1;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      cart.items[itemIndex].quantity += qty;
    } else {
      // Product does not exist, push new item
      cart.items.push({ productId, quantity: qty });
    }

    cart.updatedAt = new Date();
    await Cart.findByIdAndUpdate(cart._id, { items: cart.items });

    const updatedCart = await Cart.findOne({ userId: req.user._id });
    const populated = await populateCartItems(updatedCart);

    res.status(200).json({ success: true, cart: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity);

    if (qty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    cart.items[itemIndex].quantity = qty;
    cart.updatedAt = new Date();
    await Cart.findByIdAndUpdate(cart._id, { items: cart.items });

    const updatedCart = await Cart.findOne({ userId: req.user._id });
    const populated = await populateCartItems(updatedCart);

    res.status(200).json({ success: true, cart: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    cart.updatedAt = new Date();
    await Cart.findByIdAndUpdate(cart._id, { items: cart.items });

    const updatedCart = await Cart.findOne({ userId: req.user._id });
    const populated = await populateCartItems(updatedCart);

    res.status(200).json({ success: true, cart: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Sync guest cart with user cart on login
// @route   POST /api/cart/sync
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { items } = req.body; // Array of { productId, quantity }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array is required' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    // Merge logic: if item exists in guest, overwrite/combine quantity
    for (const guestItem of items) {
      const existingIndex = cart.items.findIndex(
        item => item.productId.toString() === guestItem.productId.toString()
      );
      if (existingIndex > -1) {
        cart.items[existingIndex].quantity = Math.max(cart.items[existingIndex].quantity, guestItem.quantity);
      } else {
        cart.items.push({
          productId: guestItem.productId,
          quantity: guestItem.quantity
        });
      }
    }

    cart.updatedAt = new Date();
    await Cart.findByIdAndUpdate(cart._id, { items: cart.items });

    const updatedCart = await Cart.findOne({ userId: req.user._id });
    const populated = await populateCartItems(updatedCart);

    res.status(200).json({ success: true, cart: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  syncCart
};
