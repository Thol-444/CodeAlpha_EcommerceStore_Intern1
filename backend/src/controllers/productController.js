const Product = require('../models/product');

const dummyProducts = [
  {
    name: "Aura Wireless Headphones",
    description: "Experience absolute sonic clarity. Featuring active hybrid noise cancellation, 40-hour high-fidelity battery life, ultra-plush memory foam earcups, and signature custom-tuned 40mm dynamic drivers.",
    price: 199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    stock: 12
  },
  {
    name: "Horizon Smartwatch",
    description: "Elegant health companion with a gorgeous 1.4-inch AMOLED display, dynamic blood-oxygen tracking, built-in dual GPS, premium titanium bezel, and a water-resistant fluoroelastomer strap.",
    price: 149.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    rating: 4.6,
    stock: 8
  },
  {
    name: "Vapor Mechanical Keyboard",
    description: "A typist's dream. 75% layout with CNC anodized aluminum case, hot-swappable tactile linear switches, PBT double-shot keycaps, and customizable RGB ambient backlighting.",
    price: 129.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    stock: 5
  },
  {
    name: "Minimalist Leather Wallet",
    description: "Artisanal bifold wallet crafted from full-grain vegetable-tanned leather. RFID-blocking core, 6 snug card slots, and an ultra-thin profile that fits perfectly in any pocket.",
    price: 45.00,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1627124765135-5667c7d19c84?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    stock: 20
  },
  {
    name: "Aether Organic Tee",
    description: "Premium midweight daily t-shirt crafted from 100% certified organic cotton. Features a relaxed modern fit, reinforced double-needle stitching, and a gorgeous slate-gray wash.",
    price: 29.50,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    rating: 4.5,
    stock: 35
  },
  {
    name: "Lumina Desk Lamp",
    description: "Intelligent sculptural desk lighting. Features warm-to-cool LED temperature slider, infinite dimming, and an integrated 15W Qi wireless charging pad in its sleek terrazzo base.",
    price: 89.00,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    rating: 4.4,
    stock: 15
  },
  {
    name: "Zenith Stoneware Mug",
    description: "Start your morning elegantly. Heavyweight ceramic mug finished in a gorgeous volcanic black and blue reactive glaze, making every piece hand-crafted and completely unique.",
    price: 18.99,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    stock: 30
  },
  {
    name: "Chronicles of Time Book",
    description: "An elegant hardcover design book tracing the rich aesthetic history of modern micro-watchmaking. Includes 250+ full-page high-resolution color photographs and design blueprints.",
    price: 39.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    stock: 10
  }
];

// Helper to seed products if empty
const seedProductsIfEmpty = async () => {
  try {
    const count = await Product.find({});
    if (count.length === 0) {
      console.log('🌱 Database products are empty. Seeding dummy products...');
      for (const p of dummyProducts) {
        await Product.create(p);
      }
      console.log('✅ Seeding complete.');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    await seedProductsIfEmpty(); // Auto seed on first fetch if empty
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    let products = await Product.find(query);

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  seedProductsIfEmpty
};
