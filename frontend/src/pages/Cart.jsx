import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Percent } from 'lucide-react';

const Cart = ({ onNavigate, setRedirectToCheckout }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    getSubtotal, 
    getShipping, 
    getTax, 
    getTotal 
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  
  // Apply the 20% discount if code matches
  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'AETHERIA20') {
      const discAmt = subtotal * 0.2;
      setDiscount(discAmt);
      setPromoApplied(true);
      showToast('Promo code AETHERIA20 applied! 20% Discount saved!', 'success');
    } else {
      showToast('Invalid promo code. Try AETHERIA20', 'error');
    }
  };

  const finalTotal = subtotal + shipping + tax - discount;

  const handleCheckoutRedirect = () => {
    if (user) {
      onNavigate('checkout', { discount });
    } else {
      showToast('Please create an account or sign in to complete your checkout.', 'info');
      setRedirectToCheckout(true);
      onNavigate('auth');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyCard} className="glass-panel">
          <div style={styles.emptyIconWrapper}>
            <ShoppingBag size={48} className="text-secondary" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <h2 style={styles.emptyTitle}>Your Cart is Empty</h2>
          <p style={styles.emptySubtitle}>It looks like you haven't added any luxury essentials to your bag yet.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('home')}>
            <ArrowLeft size={16} />
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  // Calculate free shipping progress bar
  const shippingProgress = Math.min((subtotal / 100) * 100, 100);

  return (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>Your Shopping Cart</h2>

      {/* Free Shipping Progress Indicator */}
      {subtotal < 100 ? (
        <div style={styles.shippingBarContainer} className="glass-panel">
          <span style={styles.shippingBarText}>
            You are <strong>${(100 - subtotal).toFixed(2)}</strong> away from <strong>Free Standard Shipping</strong>!
          </span>
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${shippingProgress}%` }}></div>
          </div>
        </div>
      ) : (
        <div style={{ ...styles.shippingBarContainer, ...styles.shippingBarSuccess }} className="glass-panel">
          <span style={styles.shippingBarTextSuccess}>
            🎉 You have qualified for <strong>Free Standard Shipping</strong>!
          </span>
        </div>
      )}

      {/* Main split grid */}
      <div style={styles.cartGrid}>
        {/* Left Column: Cart List */}
        <div style={styles.itemsColumn}>
          {cart.items.map((item) => (
            <div key={item.product._id} style={styles.cartItem} className="glass-panel">
              {/* Product Thumbnail */}
              <div style={styles.imgWrapper}>
                <img src={item.product.image} alt={item.product.name} style={styles.itemImg} />
              </div>

              {/* Title & details */}
              <div style={styles.itemMeta}>
                <h4 style={styles.itemName}>{item.product.name}</h4>
                <span style={styles.itemCategory}>{item.product.category}</span>
                <span style={styles.itemUnitprice}>${item.product.price.toFixed(2)} each</span>
              </div>

              {/* Stepper controls */}
              <div style={styles.itemStepper}>
                <button 
                  style={styles.stepperBtn}
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span style={styles.stepperQty}>{item.quantity}</span>
                <button 
                  style={styles.stepperBtn}
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                >
                  +
                </button>
              </div>

              {/* Pricing breakdown */}
              <div style={styles.itemTotalCol}>
                <span style={styles.itemTotalPrice}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                <button 
                  style={styles.deleteBtn}
                  onClick={() => removeFromCart(item.product._id, item.product.name)}
                  title="Remove from Cart"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Bottom navigation link */}
          <button 
            style={styles.continueShopping} 
            onClick={() => onNavigate('home')}
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </button>
        </div>

        {/* Right Column: Order Summary Panel */}
        <div style={styles.summaryColumn}>
          <div style={styles.summaryCard} className="glass-panel">
            <h3 style={styles.summaryTitle}>Order Summary</h3>

            {/* Calculations items */}
            <div style={styles.summaryRow}>
              <span>Subtotal ({cart.items.length} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Standard Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Estimated Sales Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            {/* Promo Code section */}
            <div style={styles.promoSection}>
              <div style={styles.promoInputWrapper}>
                <Percent size={14} style={styles.promoIcon} />
                <input 
                  type="text" 
                  placeholder="Promo Code (AETHERIA20)" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={styles.promoInput}
                  disabled={promoApplied}
                  className="input-field"
                />
              </div>
              <button 
                className="btn btn-secondary" 
                style={styles.promoBtn}
                onClick={applyPromo}
                disabled={promoApplied || !promoCode}
              >
                {promoApplied ? 'Applied' : 'Apply'}
              </button>
            </div>

            {/* Discount row if applied */}
            {promoApplied && (
              <div style={{ ...styles.summaryRow, ...styles.discountRow }}>
                <span>Discount (AETHERIA20)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div style={styles.summaryDivider}></div>

            {/* Final Total */}
            <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
              <span>Total Price</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>

            {/* Action buttons */}
            <button 
              className="btn btn-primary" 
              style={styles.checkoutBtn}
              onClick={handleCheckoutRedirect}
            >
              Secure Checkout
              <ArrowRight size={18} />
            </button>

            {/* Trust disclaimer */}
            <p style={styles.secureDisclaimer}>
              🔐 256-bit SSL encrypted connection guaranteed. Prices include applicable regional sales taxes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '2.5rem 0',
  },
  pageTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '2rem',
    color: '#fff',
    marginBottom: '1.5rem',
  },
  shippingBarContainer: {
    padding: '1.25rem',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: 'rgba(99, 102, 241, 0.05)',
  },
  shippingBarSuccess: {
    background: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  shippingBarText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  shippingBarTextSuccess: {
    fontSize: '0.9rem',
    color: '#fff',
  },
  progressBarBg: {
    height: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
    borderRadius: '3px',
    transition: 'width 0.4s ease-out',
  },
  cartGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '2.5rem',
    alignItems: 'start',
  },
  itemsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  cartItem: {
    padding: '1.25rem',
    display: 'grid',
    gridTemplateColumns: '80px 1.5fr 1fr 1fr',
    alignItems: 'center',
    gap: '1.5rem',
  },
  imgWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid var(--border-glass)',
    background: 'rgba(255,255,255,0.02)',
  },
  itemImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  itemMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  itemName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '1.05rem',
    color: '#fff',
  },
  itemCategory: {
    fontSize: '0.75rem',
    color: 'var(--accent)',
    textTransform: 'uppercase',
  },
  itemUnitprice: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  itemStepper: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-glass)',
    borderRadius: '6px',
    alignSelf: 'center',
    justifySelf: 'center',
  },
  stepperBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQty: {
    fontSize: '0.9rem',
    fontWeight: 600,
    minWidth: '28px',
    textAlign: 'center',
  },
  itemTotalCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.75rem',
  },
  itemTotalPrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '1.15rem',
    color: '#fff',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  continueShopping: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 500,
    marginTop: '1rem',
    alignSelf: 'flex-start',
    fontSize: '0.9rem',
  },
  summaryColumn: {
    position: 'sticky',
    top: '90px',
  },
  summaryCard: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  summaryTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.3rem',
    color: '#fff',
    marginBottom: '0.5rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  summaryDivider: {
    height: '1px',
    background: 'var(--border-glass)',
  },
  promoSection: {
    display: 'flex',
    gap: '0.5rem',
    margin: '0.25rem 0',
  },
  promoInputWrapper: {
    position: 'relative',
    flexGrow: 1,
  },
  promoIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-secondary)',
  },
  promoInput: {
    padding: '0.6rem 0.6rem 0.6rem 2.2rem',
    fontSize: '0.85rem',
  },
  promoBtn: {
    padding: '0 1rem',
    fontSize: '0.8rem',
  },
  discountRow: {
    color: 'var(--success)',
    fontWeight: 500,
  },
  totalRow: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#fff',
    fontFamily: 'var(--font-display)',
  },
  checkoutBtn: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  secureDisclaimer: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  emptyCard: {
    padding: '5rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    maxWidth: '580px',
    margin: '2rem auto',
  },
  emptyIconWrapper: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-glass)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.6rem',
    color: '#fff',
  },
  emptySubtitle: {
    color: 'var(--text-secondary)',
    maxWidth: '380px',
    lineHeight: 1.5,
  }
};

// Injection for cart CSS
const injectCartCss = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    .deleteBtn:hover {
      color: #ff6b6b !important;
    }
    .stepperBtn:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    .continueShopping:hover {
      color: #fff;
    }
    @media (max-width: 900px) {
      .cartGrid {
        grid-template-columns: 1fr !important;
        gap: 2rem !important;
      }
      .cartItem {
        grid-template-columns: 80px 1.5fr 1fr !important;
        gap: 1rem !important;
      }
      .itemTotalCol {
        grid-column: span 3;
        flex-direction: row !important;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid var(--border-glass);
        padding-top: 0.75rem;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') injectCartCss();

export default Cart;
