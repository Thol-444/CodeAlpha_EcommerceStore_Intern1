import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Search, Star, ShoppingBag, Eye } from 'lucide-react';

const Home = ({ onNavigate }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Clothing', 'Home & Living', 'Accessories', 'Books'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5000/api/products';
        const params = [];
        if (activeCategory && activeCategory !== 'All') {
          params.push(`category=${encodeURIComponent(activeCategory)}`);
        }
        if (search) {
          params.push(`search=${encodeURIComponent(search)}`);
        }
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [activeCategory, search]);

  const handleProductClick = (product) => {
    onNavigate('detail', product);
  };

  return (
    <div style={styles.page}>
      {/* Hero Banner Section */}
      <section style={styles.hero} className="glass-panel">
        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>Futuristic Elegance</h1>
          <p style={styles.heroSubtitle}>Discover carefully curated minimalist aesthetics and high-performance daily gear built for the modern individual.</p>
          <button className="btn btn-primary" onClick={() => setActiveCategory('All')}>Explore Collection</button>
        </div>
        <div style={styles.heroGraphic}>
          <div style={styles.glowOrb1}></div>
          <div style={styles.glowOrb2}></div>
        </div>
      </section>

      {/* Toolbar: Search and Filter */}
      <div style={styles.toolbar}>
        {/* Search bar */}
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
            className="input-field"
          />
        </div>

        {/* Category Pills */}
        <div style={styles.categoriesWrapper}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                ...styles.categoryPill,
                ...(activeCategory === cat ? styles.activeCategoryPill : {})
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Listings Grid */}
      {loading ? (
        <div style={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={styles.cardSkeleton}>
              <div className="skeleton" style={styles.skeImg}></div>
              <div className="skeleton" style={styles.skeTitle}></div>
              <div className="skeleton" style={styles.skeCategory}></div>
              <div style={styles.skeFooter}>
                <div className="skeleton" style={styles.skePrice}></div>
                <div className="skeleton" style={styles.skeBtn}></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div style={styles.emptyState} className="glass-panel">
          <h3>No products found</h3>
          <p>Try refining your search terms or choosing another category.</p>
          <button className="btn btn-secondary" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product._id} className="glass-card" style={styles.card}>
              {/* Product Image Area */}
              <div style={styles.imageArea}>
                <img src={product.image} alt={product.name} style={styles.productImage} />
                <div style={styles.hoverOverlay} className="hover-overlay-effect">
                  <button 
                    style={styles.quickViewBtn} 
                    onClick={() => handleProductClick(product)}
                    title="Quick Details"
                  >
                    <Eye size={18} />
                    View Details
                  </button>
                </div>
                <span style={styles.cardCategory}>{product.category}</span>
              </div>

              {/* Card Details */}
              <div style={styles.cardDetails} onClick={() => handleProductClick(product)}>
                <h4 style={styles.productName}>{product.name}</h4>
                <div style={styles.ratingRow}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span style={styles.ratingText}>{product.rating}</span>
                  <span style={styles.stockStatus}>
                    {product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                  </span>
                </div>
                <p style={styles.productDesc}>{product.description}</p>
              </div>

              {/* Card Footer actions */}
              <div style={styles.cardFooter}>
                <span style={styles.productPrice}>${product.price.toFixed(2)}</span>
                <button 
                  className="btn btn-primary" 
                  style={styles.addToCartIconBtn}
                  disabled={product.stock === 0}
                  onClick={() => addToCart(product)}
                  title="Add to Cart"
                >
                  <ShoppingBag size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: '2.5rem 0',
  },
  hero: {
    padding: '3.5rem',
    marginBottom: '3rem',
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    alignItems: 'center',
    gap: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  heroText: {
    zIndex: 2,
  },
  heroTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '3.2rem',
    lineHeight: 1.1,
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #fff 30%, var(--text-secondary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
    lineHeight: 1.6,
    maxWidth: '480px'
  },
  heroGraphic: {
    position: 'relative',
    height: '100%',
    width: '100%',
    minHeight: '200px',
  },
  glowOrb1: {
    position: 'absolute',
    width: '180px',
    height: '180px',
    background: 'var(--primary)',
    filter: 'blur(80px)',
    top: '10%',
    right: '20%',
    opacity: 0.5,
  },
  glowOrb2: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    background: 'var(--accent)',
    filter: 'blur(70px)',
    bottom: '10%',
    right: '10%',
    opacity: 0.4,
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2.5rem',
  },
  searchWrapper: {
    position: 'relative',
    maxWidth: '480px',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-secondary)',
    pointerEvents: 'none',
  },
  searchInput: {
    paddingLeft: '2.8rem',
  },
  categoriesWrapper: {
    display: 'flex',
    gap: '0.75rem',
    overflowX: 'auto',
    paddingBottom: '0.5rem',
    scrollbarWidth: 'none',
  },
  categoryPill: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-glass)',
    color: 'var(--text-secondary)',
    padding: '0.5rem 1.2rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'var(--transition-fast)',
  },
  activeCategoryPill: {
    background: 'var(--primary)',
    borderColor: 'var(--primary)',
    color: '#fff',
    boxShadow: '0 0 12px var(--primary-glow)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '440px',
  },
  imageArea: {
    position: 'relative',
    height: '220px',
    width: '100%',
    overflow: 'hidden',
    background: 'rgba(255, 255, 255, 0.02)',
    borderBottom: '1px solid var(--border-glass)',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'var(--transition-slow)',
  },
  hoverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(10, 14, 26, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'var(--transition-fast)',
    backdropFilter: 'blur(3px)',
  },
  quickViewBtn: {
    background: '#fff',
    border: 'none',
    color: 'var(--bg-primary)',
    padding: '0.6rem 1.2rem',
    borderRadius: '20px',
    fontWeight: 600,
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    transform: 'translateY(10px)',
    transition: 'var(--transition-normal)',
  },
  cardCategory: {
    position: 'absolute',
    top: '0.75rem',
    left: '0.75rem',
    background: 'rgba(10, 14, 26, 0.75)',
    border: '1px solid var(--border-glass)',
    color: 'var(--text-secondary)',
    padding: '3px 8px',
    borderRadius: '10px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  cardDetails: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    cursor: 'pointer',
  },
  productName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '1.15rem',
    marginBottom: '0.5rem',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '0.75rem',
  },
  ratingText: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#fff',
  },
  stockStatus: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginLeft: 'auto',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  productDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  cardFooter: {
    padding: '0 1.25rem 1.25rem 1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  productPrice: {
    fontSize: '1.3rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    color: '#fff',
  },
  addToCartIconBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    padding: '4rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  // Skeleton Styles
  cardSkeleton: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-glass)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
    height: '440px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  skeImg: {
    height: '200px',
    width: '100%',
  },
  skeTitle: {
    height: '24px',
    width: '70%',
  },
  skeCategory: {
    height: '16px',
    width: '40%',
  },
  skeFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  skePrice: {
    height: '28px',
    width: '30%',
  },
  skeBtn: {
    height: '40px',
    width: '40px',
    borderRadius: '50%',
  }
};

// CSS Injection for hover effects
const injectCardEffects = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    .glass-card:hover .hover-overlay-effect {
      opacity: 1 !important;
    }
    .glass-card:hover .hover-overlay-effect button {
      transform: translateY(0) !important;
    }
    .glass-card:hover img {
      transform: scale(1.06);
    }
    @media (max-width: 768px) {
      h1 {
        font-size: 2.2rem !important;
      }
      .glass-panel {
        grid-template-columns: 1fr !important;
        padding: 2rem !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') injectCardEffects();

export default Home;
