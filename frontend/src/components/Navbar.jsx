import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Package, Menu, X } from 'lucide-react';

const Navbar = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = getItemCount();

  const handleNavClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav style={styles.nav} className="glass-panel">
      <div className="container" style={styles.navContainer}>
        {/* Logo */}
        <div style={styles.logo} onClick={() => handleNavClick('home')}>
          <span>AETHERIA</span>
          <div style={styles.logoDot}></div>
        </div>

        {/* Desktop Menu */}
        <div style={styles.menuDesktop}>
          <span 
            style={{ ...styles.menuLink, ...(currentPage === 'home' ? styles.activeLink : {}) }}
            onClick={() => handleNavClick('home')}
          >
            Shop
          </span>
          {user && (
            <span 
              style={{ ...styles.menuLink, ...(currentPage === 'orders' ? styles.activeLink : {}) }}
              onClick={() => handleNavClick('orders')}
            >
              My Orders
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div style={styles.actionsDesktop}>
          {/* Cart Button */}
          <button 
            style={styles.actionBtn} 
            onClick={() => handleNavClick('cart')}
            title="Shopping Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={styles.badge} className="badge-pop">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Section */}
          {user ? (
            <div style={styles.userSection}>
              <div style={styles.profileBadge} title={`Profile: ${user.name}`}>
                <User size={16} />
                <span style={styles.userName}>{user.name.split(' ')[0]}</span>
              </div>
              <button 
                style={{ ...styles.actionBtn, ...styles.logoutBtn }} 
                onClick={logout}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-secondary" 
              style={styles.loginBtn}
              onClick={() => handleNavClick('auth')}
            >
              <User size={16} />
              Login
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          style={styles.mobileToggle} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer} className="glass-panel">
          <span 
            style={{ ...styles.mobileLink, ...(currentPage === 'home' ? styles.mobileActiveLink : {}) }}
            onClick={() => handleNavClick('home')}
          >
            Shop
          </span>
          {user && (
            <span 
              style={{ ...styles.mobileLink, ...(currentPage === 'orders' ? styles.mobileActiveLink : {}) }}
              onClick={() => handleNavClick('orders')}
            >
              My Orders
            </span>
          )}
          <div style={styles.mobileDivider}></div>
          <span 
            style={{ ...styles.mobileLink, ...(currentPage === 'cart' ? styles.mobileActiveLink : {}) }}
            onClick={() => handleNavClick('cart')}
            className="flex-between"
          >
            <span>Cart</span>
            <span style={styles.mobileBadge}>{cartCount}</span>
          </span>
          {user ? (
            <>
              <div style={{ ...styles.mobileLink, cursor: 'default', color: 'var(--text-secondary)' }}>
                Logged in as: {user.name}
              </div>
              <span style={{ ...styles.mobileLink, color: '#ff6b6b' }} onClick={() => { logout(); setMobileMenuOpen(false); }}>
                Logout
              </span>
            </>
          ) : (
            <span 
              style={{ ...styles.mobileLink, color: 'var(--primary)' }}
              onClick={() => handleNavClick('auth')}
            >
              Login / Register
            </span>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '0',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    background: 'rgba(10, 14, 26, 0.75)',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1.5rem',
    letterSpacing: '2px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#fff',
    userSelect: 'none'
  },
  logoDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 10px var(--accent-glow)',
  },
  menuDesktop: {
    display: 'flex',
    gap: '2.5rem',
  },
  menuLink: {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    position: 'relative',
    padding: '0.25rem 0'
  },
  activeLink: {
    color: '#fff',
    fontWeight: 600,
  },
  actionsDesktop: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  actionBtn: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-glass)',
    color: '#fff',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    position: 'relative',
    outline: 'none'
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    minWidth: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
    border: '1.5px solid var(--bg-primary)',
    boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  profileBadge: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-glass)',
    padding: '0.5rem 0.9rem',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#fff',
  },
  userName: {
    fontWeight: 500,
  },
  logoutBtn: {
    color: 'var(--text-secondary)',
  },
  loginBtn: {
    padding: '0.5rem 1.2rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  mobileToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
  },
  mobileDrawer: {
    position: 'absolute',
    top: '75px',
    left: '5%',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    gap: '1rem',
  },
  mobileLink: {
    fontSize: '1.05rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '0.5rem 0',
  },
  mobileActiveLink: {
    color: '#fff',
    fontWeight: 600,
  },
  mobileDivider: {
    height: '1px',
    background: 'var(--border-glass)',
    margin: '0.5rem 0',
  },
  mobileBadge: {
    background: 'var(--primary)',
    color: '#fff',
    fontSize: '0.75rem',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: 'bold',
  }
};

// CSS injection for responsive classes
const injectStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 768px) {
      .menu-desktop, .actions-desktop {
        display: none !important;
      }
      .mobile-toggle {
        display: block !important;
      }
    }
    .flex-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') injectStyles();

export default Navbar;
