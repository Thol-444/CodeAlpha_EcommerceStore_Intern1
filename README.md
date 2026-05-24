# 🛒 Aetheria Store — Simple E-commerce Website

A full-stack e-commerce web application built as part of the **CodeAlpha Full Stack Development Internship**.

## 🌐 Live Demo

| | Link |
|---|---|
| **Frontend** | [https://code-alpha-ecommerce-store-intern1.vercel.app/](https://code-alpha-ecommerce-store-intern1.vercel.app/) |
| **Backend API** | [https://codealpha-ecommercestore-intern1.onrender.com/](https://codealpha-ecommercestore-intern1.onrender.com/) |

---

## 📌 Features

- 🛍️ Product listings with categories and search
- 📄 Product detail page with stock indicator
- 🛒 Shopping cart with quantity management
- 👤 User registration and login (JWT Authentication)
- 💳 Checkout with interactive 3D credit card
- 📦 Order placement and order history
- 🎟️ Promo code support (AETHERIA20 for 20% off)
- 📱 Fully responsive design

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Vanilla CSS (Glassmorphic Design)
- React Router DOM
- Context API (Auth + Cart)

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs (Password Hashing)

### Database
- MongoDB Atlas (Mongoose ODM)

### Deployment
- Frontend → Vercel
- Backend → Render

---

## 📁 Project Structure

```
ecommerce-website-internship/
│
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Mongoose Models
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   └── Order.js
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API routes
│   │   └── server.js       # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Navbar, ProductCard, etc.
    │   ├── context/        # AuthContext, CartContext
    │   ├── pages/          # Home, Cart, Auth, Checkout
    │   └── App.jsx
    └── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get product by ID |
| GET | /api/cart | Get user cart |
| POST | /api/cart | Add item to cart |
| PUT | /api/cart/:id | Update cart item |
| DELETE | /api/cart/:id | Remove cart item |
| POST | /api/orders | Place order |
| GET | /api/orders | Get user orders |

---

## ⚙️ Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Steps

```bash
# Clone the repository
git clone https://github.com/Thol-444/CodeAlpha_EcommerceStore_Intern1.git

# Go to project folder
cd CodeAlpha_EcommerceStore_Intern1

# Setup backend
cd backend
npm install

# Create .env file in backend folder
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
PORT=5000

# Run backend
npm start

# Setup frontend (new terminal)
cd frontend
npm install

# Create .env file in frontend folder
VITE_API_URL=http://localhost:5000/api

# Run frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Test the App

```
1. Open the live link
2. Register a new account
3. Browse products
4. Add items to cart
5. Use promo code: AETHERIA20
6. Checkout with test card:
   Card Number : 4111 2222 3333 4444
   Expiry      : 12/30
   CVV         : 123
7. View your order in "My Orders"
```

---

## 👩‍💻 Built By

**Nihaarika Tholu**
B.Tech CSE — Anurag University, Hyderabad
[LinkedIn](https://www.linkedin.com/in/nihaarika-tholu-b9186129b/) | [GitHub](https://github.com/Thol-444)

---

## 📜 Internship

This project was built as **Task 1** of the
**CodeAlpha Full Stack Development Internship**

---

⭐ If you found this helpful, give it a star on GitHub!
