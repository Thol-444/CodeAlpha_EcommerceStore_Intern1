import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const ProductDetail = ({ product, onNavigate }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  if (!product) {
    return (
      <div style={styles.errorState} className="glass-panel">
        <h3>Product not found</h3>
        <button className="btn btn-primary" onClick={() => onNavigate('home')}>
          <ArrowLeft size={16} /> Back to Shop
        </button>
      </div>
    );
  }

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    setAdding(true);
    setTimeout(() => {
      addToCart(product, quantity);
      setAdding(false);
    }, 400); // Small aesthetic delay
  };

  return (
    <div style={styles.page}>
      {/* Back button */}
      <button style={styles.backBtn} onClick={() => onNavigate('home')}>
        <ArrowLeft size={18} />
        Back to Shop
      </button>

      {/* Grid Layout */}
      <div style={styles.detailGrid}>
        {/* Left Column: Premium Image Display */}
        <div style={styles.imagePanel} className="glass-panel">
          <img src={product.image} alt={product.name} style={styles.mainImage} />
          <div style={styles.imageGlow}></div>
        </div>

        {/* Right Column: Information Details */}
        <div style={styles.infoPanel}>
          <span style={styles.categoryLabel}>{product.category}</span>
          <h2 style={styles.productName}>{product.name}</h2>

          {/* Ratings */}
          <div style={styles.ratingRow}>
            <div style={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  size={16} 
                  fill={s <= Math.floor(product.rating) ? '#f59e0b' : 'none'} 
                  color="#f59e0b" 
                />
              ))}
            </div>
            <span style={styles.ratingValue}>{product.rating}</span>
            <span style={styles.reviewsCount}>•  142 verified buyer reviews</span>
          </div>

          {/* Pricing */}
          <div style={styles.priceRow}>
            <span style={styles.price}>${product.price.toFixed(2)}</span>
            {product.stock > 0 ? (
              <span style={{ ...styles.stockPill, ...styles.inStock }}>
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span style={{ ...styles.stockPill, ...styles.outOfStock }}>
                Out of Stock
              </span>
            )}
          </div>

          <div style={styles.divider}></div>

          {/* Description */}
          <div style={styles.descSection}>
            <h4 style={styles.sectionTitle}>Overview</h4>
            <p style={styles.description}>{product.description}</p>
          </div>

          <div style={styles.divider}></div>

          {/* Purchasing controls */}
          {product.stock > 0 && (
            <div style={styles.purchaseControls}>
              <div style={styles.quantityStepper}>
                <span style={styles.stepperLabel}>Quantity</span>
                <div style={styles.stepperActions}>
                  <button 
                    style={styles.stepBtn} 
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span style={styles.stepValue}>{quantity}</span>
                  <button 
                    style={styles.stepBtn} 
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                style={styles.addBtn}
                onClick={handleAddToCart}
                disabled={adding}
              >
                <ShoppingBag size={20} />
                {adding ? 'Securing Item...' : 'Add to Shopping Cart'}
              </button>
            </div>
          )}

          {/* Trust Assurances */}
          <div style={styles.assurancesGrid}>
            <div style={styles.assuranceItem} className="glass-panel">
              <Truck size={20} className="text-indigo" style={{ color: 'var(--primary)' }} />
              <div>
                <h5 style={styles.assuranceTitle}>Free Shipping</h5>
                <p style={styles.assuranceDesc}>Complimentary fast transit on orders above $100</p>
              </div>
            </div>
            <div style={styles.assuranceItem} className="glass-panel">
              <RefreshCw size={18} className="text-indigo" style={{ color: 'var(--primary)' }} />
              <div>
                <h5 style={styles.assuranceTitle}>30-Day Returns</h5>
                <p style={styles.assuranceDesc}>Hassle-free dynamic refunds or exchanges</p>
              </div>
            </div>
            <div style={styles.assuranceItem} className="glass-panel">
              <ShieldCheck size={20} className="text-indigo" style={{ color: 'var(--primary)' }} />
              <div>
                <h5 style={styles.assuranceTitle}>Secure Checkout</h5>
                <p style={styles.assuranceDesc}>Encrypted PCI-compliant SSL payment gate</p>
              </div>
            </div>
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
  backBtn: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-glass)',
    color: 'var(--text-secondary)',
    padding: '0.6rem 1.2rem',
    borderRadius: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    marginBottom: '2.5rem',
    fontWeight: 500,
    transition: 'var(--transition-fast)',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: '3.5rem',
    alignItems: 'start',
  },
  imagePanel: {
    position: 'relative',
    padding: '2rem',
    height: '480px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mainImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    zIndex: 2,
  },
  imageGlow: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    background: 'var(--primary-glow)',
    filter: 'blur(70px)',
    zIndex: 1,
  },
  infoPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  categoryLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '0.5rem',
  },
  productName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '2.4rem',
    lineHeight: 1.2,
    color: '#fff',
    marginBottom: '0.75rem',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  ratingValue: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#fff',
  },
  reviewsCount: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  price: {
    fontSize: '2.2rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    color: '#fff',
  },
  stockPill: {
    fontSize: '0.8rem',
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: '20px',
  },
  inStock: {
    background: 'rgba(16, 185, 129, 0.15)',
    color: 'var(--success)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
  },
  outOfStock: {
    background: 'rgba(239, 68, 68, 0.15)',
    color: 'var(--error)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  divider: {
    height: '1px',
    background: 'var(--border-glass)',
    margin: '1.5rem 0',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '1rem',
    marginBottom: '0.75rem',
    color: '#fff',
  },
  description: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
  },
  purchaseControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  quantityStepper: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  stepperLabel: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  stepperActions: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-glass)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  stepBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.2rem',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    outline: 'none',
  },
  stepValue: {
    padding: '0 1rem',
    fontWeight: 600,
    fontSize: '1rem',
    minWidth: '40px',
    textAlign: 'center',
  },
  addBtn: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.05rem',
  },
  assurancesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  assuranceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    borderRadius: '12px',
  },
  assuranceTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '2px',
  },
  assuranceDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  errorState: {
    padding: '4rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  }
};

// Injection for details styles
const injectDetailEffects = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    .stepBtn:hover:not(:disabled) {
      background: rgba(255,255,255,0.05);
    }
    .backBtn:hover {
      border-color: rgba(99, 102, 241, 0.5);
      color: #fff;
    }
    @media (max-width: 820px) {
      .detailGrid {
        grid-template-columns: 1fr !important;
        gap: 2rem !important;
      }
      .imagePanel {
        height: 320px !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') injectDetailEffects();

export default ProductDetail;
