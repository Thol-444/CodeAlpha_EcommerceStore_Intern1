import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

const Auth = ({ onNavigate, redirectToCheckout, setRedirectToCheckout }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const validateEmail = (val) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }

    setLoading(true);

    if (isLogin) {
      // Login flow
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        if (redirectToCheckout) {
          setRedirectToCheckout(false);
          onNavigate('checkout');
        } else {
          onNavigate('home');
        }
      }
    } else {
      // Register flow
      if (!name) {
        showToast('Please enter your name.', 'warning');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        setLoading(false);
        return;
      }

      const res = await register(name, email, password);
      setLoading(false);
      if (res.success) {
        if (redirectToCheckout) {
          setRedirectToCheckout(false);
          onNavigate('checkout');
        } else {
          onNavigate('home');
        }
      }
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.authContainer} className="glass-panel">
        {/* Toggle Headers */}
        <div style={styles.toggleHeader}>
          <button 
            style={{ ...styles.toggleBtn, ...(isLogin ? styles.activeToggle : {}) }}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button 
            style={{ ...styles.toggleBtn, ...(!isLogin ? styles.activeToggle : {}) }}
            onClick={() => setIsLogin(false)}
          >
            Create Account
          </button>
        </div>

        {/* Dynamic Welcomes */}
        <div style={styles.welcomeText}>
          <h3 style={styles.title}>
            {isLogin ? 'Welcome to Aetheria' : 'Join the Collective'}
          </h3>
          <p style={styles.subtitle}>
            {isLogin 
              ? 'Access your personalized cart and exclusive member rewards.' 
              : 'Sign up to unlock secure shopping and priority shipping.'}
          </p>
        </div>

        {/* Auth Forms */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Name Field (Sign Up Only) */}
          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.fieldIcon} />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.authField}
                  className="input-field"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.fieldIcon} />
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.authField}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.fieldIcon} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.authField}
                className="input-field"
                required
              />
              <button 
                type="button" 
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.fieldIcon} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.authField}
                  className="input-field"
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {isLogin ? (
              <>
                <LogIn size={18} />
                {loading ? 'Authenticating...' : 'Sign In'}
              </>
            ) : (
              <>
                <UserPlus size={18} />
                {loading ? 'Registering...' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div style={styles.footerPrompt}>
          <span>
            {isLogin ? "Don't have an account yet?" : "Already have an account?"}
          </span>
          <button style={styles.switchLinkBtn} onClick={handleToggle}>
            {isLogin ? 'Sign up free' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '4rem 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 70px)',
  },
  authContainer: {
    maxWidth: '460px',
    width: '100%',
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  toggleHeader: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-glass)',
    borderRadius: '30px',
    padding: '4px',
  },
  toggleBtn: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '0.6rem 0',
    borderRadius: '25px',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    outline: 'none',
  },
  activeToggle: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#fff',
    border: '1px solid var(--border-glass)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  welcomeText: {
    textAlign: 'center',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.5rem',
    color: '#fff',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputWrapper: {
    position: 'relative',
  },
  fieldIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-secondary)',
    pointerEvents: 'none',
  },
  authField: {
    paddingLeft: '2.8rem',
    paddingRight: '2.8rem',
  },
  eyeBtn: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    outline: 'none',
  },
  submitBtn: {
    width: '100%',
    padding: '0.9rem',
    fontSize: '0.95rem',
    marginTop: '0.5rem',
  },
  footerPrompt: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  switchLinkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    outline: 'none',
  }
};

const injectAuthCss = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    .switchLinkBtn:hover {
      text-decoration: underline;
      color: var(--accent) !important;
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') injectAuthCss();

export default Auth;
