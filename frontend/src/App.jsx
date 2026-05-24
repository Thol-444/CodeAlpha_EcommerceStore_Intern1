import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

// Inner component that has access to contexts
const MainApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeProduct, setActiveProduct] = useState(null);
  const [routeParams, setRouteParams] = useState(null);
  const [redirectToCheckout, setRedirectToCheckout] = useState(false);

  const handleNavigation = (page, params = null) => {
    setCurrentPage(page);
    setRouteParams(params);
    if (page === 'detail' && params) {
      setActiveProduct(params);
    }
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigation} />;
      case 'detail':
        return <ProductDetail product={activeProduct} onNavigate={handleNavigation} />;
      case 'cart':
        return (
          <Cart 
            onNavigate={handleNavigation} 
            setRedirectToCheckout={setRedirectToCheckout} 
          />
        );
      case 'auth':
        return (
          <Auth 
            onNavigate={handleNavigation} 
            redirectToCheckout={redirectToCheckout}
            setRedirectToCheckout={setRedirectToCheckout}
          />
        );
      case 'checkout':
        return <Checkout onNavigate={handleNavigation} routeParams={routeParams} />;
      case 'orders':
        return <Orders onNavigate={handleNavigation} />;
      default:
        return <Home onNavigate={handleNavigation} />;
    }
  };

  return (
    <div style={styles.appContainer}>
      <Navbar onNavigate={handleNavigation} currentPage={currentPage} />
      
      <main className="container" style={styles.mainContent}>
        {renderPage()}
      </main>

      <footer style={styles.footer} className="glass-panel">
        <div className="container" style={styles.footerContainer}>
          <div style={styles.footerBrand}>
            <h3>AETHERIA</h3>
            <p>Elevating daily hardware, garments, and writing tools with premium aesthetic rigor.</p>
          </div>
          <div style={styles.footerLinks}>
            <span>Privacy</span>
            <span>Terms of Service</span>
            <span>Support Gate</span>
          </div>
          <span style={styles.copyright}>
            © {new Date().getFullYear()} Aetheria Collective. Designed with absolute care.
          </span>
        </div>
      </footer>
    </div>
  );
};

// Global App wrapper with providers
function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  mainContent: {
    flexGrow: 1,
    paddingBottom: '4rem',
  },
  footer: {
    marginTop: 'auto',
    borderRadius: 0,
    borderBottom: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    padding: '3rem 0',
    background: 'rgba(10, 14, 26, 0.9)',
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    textAlign: 'center',
  },
  footerBrand: {
    maxWidth: '480px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    h3: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '1.25rem',
      letterSpacing: '1px',
    },
    p: {
      fontSize: '0.8rem',
      color: 'var(--text-secondary)',
      lineHeight: 1.5,
    }
  },
  footerLinks: {
    display: 'flex',
    gap: '2rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    span: {
      transition: 'var(--transition-fast)',
    }
  },
  copyright: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '0.5rem',
  }
};

export default App;
