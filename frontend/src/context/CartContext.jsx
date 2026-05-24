import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const API_URL = 'http://localhost:5000/api';

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // Load guest cart from LocalStorage on mount
  useEffect(() => {
    if (!user) {
      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart) {
        setCart(JSON.parse(guestCart));
      } else {
        setCart({ items: [] });
      }
    }
  }, [user]);

  // Fetch or Sync cart when user logs in
  useEffect(() => {
    const syncAndFetchCart = async () => {
      if (!user || !token) return;

      setLoading(true);
      try {
        const guestCartStr = localStorage.getItem('guest_cart');
        const guestCart = guestCartStr ? JSON.parse(guestCartStr) : { items: [] };

        if (guestCart.items && guestCart.items.length > 0) {
          // Sync guest cart with backend
          console.log('Syncing guest cart items with DB...');
          const syncItems = guestCart.items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
          }));

          const res = await fetch(`${API_URL}/cart/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items: syncItems })
          });
          const data = await res.json();
          if (data.success) {
            setCart(data.cart);
            localStorage.removeItem('guest_cart');
            showToast('Guest cart merged with your profile!', 'success');
          }
        } else {
          // Normal fetch
          const res = await fetch(`${API_URL}/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setCart(data.cart);
          }
        }
      } catch (error) {
        console.error('Failed to sync cart:', error);
      } finally {
        setLoading(false);
      }
    };

    syncAndFetchCart();
  }, [user, token]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        const res = await fetch(`${API_URL}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId: product._id, quantity })
        });
        const data = await res.json();
        if (data.success) {
          setCart(data.cart);
          showToast(`Added ${product.name} to Cart`, 'success');
        } else {
          showToast(data.message || 'Could not add to cart', 'error');
        }
      } catch (error) {
        showToast('Server connection error', 'error');
      }
    } else {
      // Guest mode - LocalStorage
      const newCart = { ...cart };
      const itemIndex = newCart.items.findIndex(item => item.product._id === product._id);

      if (itemIndex > -1) {
        newCart.items[itemIndex].quantity += quantity;
      } else {
        newCart.items.push({ product, quantity });
      }

      setCart(newCart);
      localStorage.setItem('guest_cart', JSON.stringify(newCart));
      showToast(`Added ${product.name} to Cart (Guest)`, 'success');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    if (user) {
      try {
        const res = await fetch(`${API_URL}/cart`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId, quantity })
        });
        const data = await res.json();
        if (data.success) {
          setCart(data.cart);
        }
      } catch (error) {
        showToast('Could not update quantity', 'error');
      }
    } else {
      // Guest mode
      const newCart = { ...cart };
      const itemIndex = newCart.items.findIndex(item => item.product._id === productId);
      if (itemIndex > -1) {
        newCart.items[itemIndex].quantity = quantity;
        setCart(newCart);
        localStorage.setItem('guest_cart', JSON.stringify(newCart));
      }
    }
  };

  const removeFromCart = async (productId, productName = 'Item') => {
    if (user) {
      try {
        const res = await fetch(`${API_URL}/cart/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setCart(data.cart);
          showToast(`Removed ${productName} from Cart`, 'info');
        }
      } catch (error) {
        showToast('Could not remove item', 'error');
      }
    } else {
      // Guest mode
      const newCart = { ...cart };
      newCart.items = newCart.items.filter(item => item.product._id !== productId);
      setCart(newCart);
      localStorage.setItem('guest_cart', JSON.stringify(newCart));
      showToast(`Removed ${productName} from Cart`, 'info');
    }
  };

  const clearCart = () => {
    setCart({ items: [] });
    if (!user) {
      localStorage.removeItem('guest_cart');
    }
  };

  // Calculations
  const getSubtotal = () => {
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  const getShipping = () => {
    const sub = getSubtotal();
    return sub > 100 || sub === 0 ? 0 : 9.99; // Free shipping above $100
  };

  const getTax = () => {
    return getSubtotal() * 0.08; // 8% sales tax
  };

  const getTotal = () => {
    return getSubtotal() + getShipping() + getTax();
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getSubtotal,
      getItemCount,
      getShipping,
      getTax,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
