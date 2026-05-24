import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CreditCard, Truck, Calendar, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Checkout = ({ onNavigate, routeParams }) => {
  const { cart, getSubtotal, getShipping, getTax, clearCart } = useCart();
  const { token } = useAuth();
  const { showToast } = useToast();

  const discount = routeParams?.discount || 0;
  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = subtotal + shipping + tax - discount;

  // Billing address state
  const [addressName, setAddressName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');

  // Credit Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardFocusedField, setCardFocusedField] = useState('front'); // 'front' or 'back'

  // Payment processing overlay state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0); // 0: gateway, 1: auth, 2: success
  const [newOrderId, setNewOrderId] = useState('');

  const formatCardNumber = (val) => {
    const raw = val.replace(/\D/g, '');
    const groups = raw.match(/.{1,4}/g);
    return groups ? groups.slice(0, 4).join(' ') : raw;
  };

  const formatExpiry = (val) => {
    const raw = val.replace(/\D/g, '');
    if (raw.length >= 2) {
      return `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    return raw;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!addressName || !street || !city || !zipCode) {
      showToast('Please fill out all shipping details.', 'warning');
      return;
    }

    if (cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3) {
      showToast('Please fill out valid credit card details.', 'warning');
      return;
    }

    // Trigger overlay simulation
    setIsProcessing(true);
    setProcessingStep(0); // "Connecting to gateway..."

    // Step 1 -> Step 2 transition
    setTimeout(() => {
      setProcessingStep(1); // "Authorizing transaction..."
    }, 1200);

    // Step 2 -> Server API call and success transition
    setTimeout(async () => {
      try {
        const orderPayload = {
          items: cart.items.map(item => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image
          })),
          shippingAddress: {
            name: addressName,
            street,
            city,
            state,
            zipCode,
            country
          }
        };

        const res = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderPayload)
        });

        const data = await res.json();
        if (data.success) {
          setNewOrderId(data.order._id);
          setProcessingStep(2); // "Success!"
          clearCart();
        } else {
          setIsProcessing(false);
          showToast(data.message || 'Server error placing order.', 'error');
        }
      } catch (error) {
        setIsProcessing(false);
        showToast('Server connection failed.', 'error');
      }
    }, 2800);
  };

  const handleFinishCheckout = () => {
    setIsProcessing(false);
    onNavigate('orders');
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>Secure Checkout</h2>

      <div style={styles.checkoutGrid}>
        {/* Left Column: Forms */}
        <div style={styles.formsColumn}>
          <form onSubmit={handlePlaceOrder} style={styles.formContainer}>
            
            {/* 1. Shipping Address Section */}
            <div style={styles.sectionCard} className="glass-panel">
              <h3 style={styles.sectionHeading}>
                <Truck size={20} style={{ color: 'var(--primary)' }} />
                Shipping Information
              </h3>
              
              <div className="input-group">
                <label className="input-label">Recipient Full Name</label>
                <input 
                  type="text" 
                  placeholder="Johnathan Doe" 
                  value={addressName}
                  onChange={(e) => setAddressName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Street Address</label>
                <input 
                  type="text" 
                  placeholder="742 Evergreen Terrace" 
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div style={styles.rowFields}>
                <div className="input-group" style={{ flex: 1.5 }}>
                  <label className="input-label">City</label>
                  <input 
                    type="text" 
                    placeholder="Springfield" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">State / Prov</label>
                  <input 
                    type="text" 
                    placeholder="IL" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Zip / Postal</label>
                  <input 
                    type="text" 
                    placeholder="62704" 
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Billing & Credit Card Section */}
            <div style={styles.sectionCard} className="glass-panel">
              <h3 style={styles.sectionHeading}>
                <CreditCard size={20} style={{ color: 'var(--primary)' }} />
                Credit Card Payment
              </h3>

              {/* CREDIT CARD VISUAL COMPONENT */}
              <div className="card-wrapper">
                <div className={`credit-card-mock ${cardFocusedField === 'back' ? 'flipped' : ''}`}>
                  {/* FRONT SIDE OF MOCK CARD */}
                  <div className="card-front">
                    <div style={styles.cardFrontHeader}>
                      <ShieldCheck size={28} color="#fff" />
                      <span style={styles.cardTypeTitle}>AETHERIA GOLD</span>
                    </div>
                    
                    <span style={styles.visualCardNumber}>
                      {cardNumber || '•••• •••• •••• ••••'}
                    </span>
                    
                    <div style={styles.cardFrontFooter}>
                      <div style={styles.cardVisualMeta}>
                        <span style={styles.cardVisualLabel}>CARD HOLDER</span>
                        <span style={styles.cardVisualVal}>
                          {cardHolder.toUpperCase() || 'YOUR NAME'}
                        </span>
                      </div>
                      <div style={styles.cardVisualMeta}>
                        <span style={styles.cardVisualLabel}>EXPIRES</span>
                        <span style={styles.cardVisualVal}>
                          {cardExpiry || 'MM/YY'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE OF MOCK CARD */}
                  <div className="card-back">
                    <div className="card-magnetic-strip"></div>
                    <div className="card-signature-area">
                      <span>{cardCvv || '•••'}</span>
                    </div>
                    <div style={styles.cardBackFooter}>
                      <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>
                        AUTHORIZED SIGNATURE. NOT TRANSFERABLE.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD FORM INPUTS */}
              <div className="input-group">
                <label className="input-label">Card Number</label>
                <input 
                  type="text" 
                  placeholder="4111 2222 3333 4444" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  onFocus={() => setCardFocusedField('front')}
                  maxLength="19"
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="JOHNATHAN D DOE" 
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  onFocus={() => setCardFocusedField('front')}
                  className="input-field"
                  required
                />
              </div>

              <div style={styles.rowFields}>
                <div className="input-group" style={{ flex: 1.2 }}>
                  <label className="input-label">Expiration Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    onFocus={() => setCardFocusedField('front')}
                    maxLength="5"
                    className="input-field"
                    required
                  />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">CVV / Code</label>
                  <input 
                    type="password" 
                    placeholder="123" 
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    onFocus={() => setCardFocusedField('back')}
                    onBlur={() => setCardFocusedField('front')}
                    maxLength="3"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Hidden Submit action */}
            <button type="submit" style={{ display: 'none' }} id="hiddenCheckoutSubmit"></button>
          </form>
        </div>

        {/* Right Column: Checkout Pricing Summary */}
        <div style={styles.summaryColumn}>
          <div style={styles.summaryCard} className="glass-panel">
            <h3 style={styles.summaryTitle}>Secure Checkout Summary</h3>

            {cart.items.map((item) => (
              <div key={item.product._id} style={styles.miniItemRow}>
                <img src={item.product.image} alt={item.product.name} style={styles.miniItemImg} />
                <div style={styles.miniItemMeta}>
                  <span style={styles.miniItemName}>{item.product.name}</span>
                  <span style={styles.miniItemQty}>Qty: {item.quantity}</span>
                </div>
                <span style={styles.miniItemPrice}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div style={styles.summaryDivider}></div>

            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Sales Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div style={{ ...styles.summaryRow, ...styles.discountText }}>
                <span>Coupon Applied</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div style={styles.summaryDivider}></div>

            <div style={{ ...styles.summaryRow, ...styles.totalText }}>
              <span>Amount Due</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button 
              className="btn btn-primary" 
              style={styles.checkoutBtn}
              onClick={() => document.getElementById('hiddenCheckoutSubmit').click()}
            >
              <Lock size={16} />
              Authorize & Pay ${total.toFixed(2)}
            </button>

            <div style={styles.assuranceSection}>
              <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
              <span>PCI-DSS Compliant 256-bit Secure Gateway</span>
            </div>
          </div>
        </div>
      </div>

      {/* FULL SCREEN GATEWAY PROCESSING OVERLAY */}
      {isProcessing && (
        <div style={styles.overlayBg}>
          <div style={styles.overlayCard} className="glass-panel">
            {processingStep === 0 && (
              <>
                <div className="spinner"></div>
                <h4 style={styles.overlayTextTitle}>Reaching Secure Gateway...</h4>
                <p style={styles.overlayTextDesc}>Connecting with bank transaction portal.</p>
              </>
            )}

            {processingStep === 1 && (
              <>
                <div className="spinner spinner-accent"></div>
                <h4 style={styles.overlayTextTitle}>Authorizing Funds...</h4>
                <p style={styles.overlayTextDesc}>Please do not refresh or close this tab.</p>
              </>
            )}

            {processingStep === 2 && (
              <div style={styles.successAnimationWrapper}>
                <CheckCircle2 size={64} style={{ color: 'var(--success)' }} />
                <h4 style={styles.overlayTextTitle}>Transaction Approved!</h4>
                <p style={styles.overlayTextDesc}>Your order has been logged successfully.</p>
                <div style={styles.orderBadge}>
                  Order ID: {newOrderId.substring(0, 8).toUpperCase()}...
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ marginTop: '1.5rem', width: '100%' }}
                  onClick={handleFinishCheckout}
                >
                  View My Orders
                </button>
              </div>
            )}
          </div>
        </div>
      )}
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
  checkoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1.25fr 0.75fr',
    gap: '2.5rem',
    alignItems: 'start',
  },
  formsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  sectionCard: {
    padding: '2rem',
  },
  sectionHeading: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.25rem',
    color: '#fff',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  rowFields: {
    display: 'flex',
    gap: '1rem',
  },
  cardFrontHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTypeTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '1px',
    opacity: 0.8,
  },
  visualCardNumber: {
    fontFamily: 'monospace',
    fontSize: '1.45rem',
    letterSpacing: '2.5px',
    color: '#fff',
    alignSelf: 'center',
    margin: '1.5rem 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
  cardFrontFooter: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cardVisualMeta: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardVisualLabel: {
    fontSize: '0.55rem',
    opacity: 0.6,
    letterSpacing: '1px',
  },
  cardVisualVal: {
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '180px',
  },
  cardBackFooter: {
    marginTop: 'auto',
    textAlign: 'center',
    padding: '0 1.5rem',
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
  miniItemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  miniItemImg: {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1px solid var(--border-glass)',
  },
  miniItemMeta: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
  },
  miniItemName: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  miniItemQty: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  miniItemPrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#fff',
  },
  summaryDivider: {
    height: '1px',
    background: 'var(--border-glass)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  discountText: {
    color: 'var(--success)',
    fontWeight: 500,
  },
  totalText: {
    fontSize: '1.25rem',
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
  assuranceSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  // Overlay Processing Styles
  overlayBg: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(5, 7, 12, 0.85)',
    backdropFilter: 'blur(15px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  overlayCard: {
    maxWidth: '400px',
    width: '90%',
    padding: '3rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  overlayTextTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.25rem',
    color: '#fff',
    marginTop: '0.5rem',
  },
  overlayTextDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  successAnimationWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
  },
  orderBadge: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-glass)',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontFamily: 'monospace',
    marginTop: '0.5rem',
  }
};

const injectCheckoutCss = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(99, 102, 241, 0.1);
      border-radius: 50%;
      border-top-color: var(--primary);
      animation: spin 1s linear infinite;
      box-shadow: 0 0 15px var(--primary-glow);
    }
    .spinner-accent {
      border-top-color: var(--accent);
      box-shadow: 0 0 15px var(--accent-glow);
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 900px) {
      .checkoutGrid {
        grid-template-columns: 1fr !important;
        gap: 2rem !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') injectCheckoutCss();

export default Checkout;
