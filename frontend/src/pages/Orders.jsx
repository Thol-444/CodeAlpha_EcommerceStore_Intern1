import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Package, Calendar, Clock, MapPin, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';

const Orders = ({ onNavigate }) => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        showToast('Failed to fetch order history.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  const toggleExpand = (id) => {
    if (expandedOrderId === id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return styles.statusDelivered;
      case 'Shipped': return styles.statusShipped;
      default: return styles.statusProcessing;
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <h2 style={styles.pageTitle}>Your Order History</h2>
        <div style={styles.ordersList}>
          {[1, 2].map((i) => (
            <div key={i} style={styles.skeCard} className="glass-panel">
              <div className="skeleton" style={styles.skeHeader}></div>
              <div className="skeleton" style={styles.skeBody}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyCard} className="glass-panel">
          <div style={styles.emptyIconWrapper}>
            <Package size={48} className="text-secondary" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <h2 style={styles.emptyTitle}>No Orders Yet</h2>
          <p style={styles.emptySubtitle}>You haven't placed any purchases yet. Your luxurious orders will show up here.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('home')}>
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>Your Order History</h2>

      <div style={styles.ordersList}>
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order._id;
          const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          return (
            <div key={order._id} style={styles.orderCard} className="glass-panel">
              {/* Order Card Summary header */}
              <div style={styles.cardHeader} onClick={() => toggleExpand(order._id)}>
                <div style={styles.headerInfoGroup}>
                  <div style={styles.headerTitleRow}>
                    <Package size={18} style={{ color: 'var(--primary)' }} />
                    <span style={styles.orderId}>
                      ORDER #{order._id.substring(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <div style={styles.headerMetaRow}>
                    <div style={styles.metaItem}>
                      <Calendar size={14} />
                      <span>{orderDate}</span>
                    </div>
                    <div style={styles.metaItem}>
                      <Clock size={14} />
                      <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div style={styles.headerPriceGroup}>
                  <span style={styles.orderTotal}>${order.totalAmount.toFixed(2)}</span>
                  <span style={{ ...styles.statusPill, ...getStatusColor(order.orderStatus) }}>
                    {order.orderStatus}
                  </span>
                </div>

                <button style={styles.expandBtn}>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {/* Collapsible Details Body */}
              {isExpanded && (
                <div style={styles.cardBody}>
                  <div style={styles.bodySplit}>
                    
                    {/* Item list */}
                    <div style={styles.itemsBlock}>
                      <h4 style={styles.blockTitle}>Purchased Items</h4>
                      <div style={styles.miniItemsGrid}>
                        {order.items.map((item) => (
                          <div key={item.productId} style={styles.itemRow}>
                            <img src={item.image} alt={item.name} style={styles.itemImg} />
                            <div style={styles.itemMeta}>
                              <span style={styles.itemName}>{item.name}</span>
                              <span style={styles.itemUnit}>
                                ${item.price.toFixed(2)} × {item.quantity}
                              </span>
                            </div>
                            <span style={styles.itemSubtotal}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline & Delivery */}
                    <div style={styles.deliveryBlock}>
                      <h4 style={styles.blockTitle}>Delivery Details</h4>
                      <div style={styles.addressCard} className="glass-panel">
                        <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <div style={styles.addressText}>
                          <strong>{order.shippingAddress.name}</strong>
                          <span>{order.shippingAddress.street}</span>
                          <span>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </span>
                          <span>{order.shippingAddress.country}</span>
                        </div>
                      </div>

                      {/* Ship Timeline */}
                      <div style={styles.timeline}>
                        <div style={styles.timelineItem}>
                          <div style={{ ...styles.timelineDot, ...styles.timelineDotActive }}></div>
                          <div style={styles.timelineContent}>
                            <span style={styles.timelineTitle}>Order Placed</span>
                            <span style={styles.timelineDesc}>Order generated and paid successfully.</span>
                          </div>
                        </div>
                        <div style={styles.timelineItem}>
                          <div style={{ 
                            ...styles.timelineDot, 
                            ...(order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? styles.timelineDotActive : {}) 
                          }}></div>
                          <div style={styles.timelineContent}>
                            <span style={styles.timelineTitle}>Processing</span>
                            <span style={styles.timelineDesc}>Items processed and packaged at Aetheria HQ.</span>
                          </div>
                        </div>
                        <div style={styles.timelineItem}>
                          <div style={{ 
                            ...styles.timelineDot, 
                            ...(order.orderStatus === 'Delivered' ? styles.timelineDotActive : {}) 
                          }}></div>
                          <div style={styles.timelineContent}>
                            <span style={styles.timelineTitle}>In Transit / Delivered</span>
                            <span style={styles.timelineDesc}>Handed to carrier for high-priority local dispatch.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        })}
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
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  orderCard: {
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'var(--transition-fast)',
  },
  headerInfoGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  headerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  orderId: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.5px',
  },
  headerMetaRow: {
    display: 'flex',
    gap: '1.25rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  headerPriceGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.5rem',
    marginLeft: 'auto',
    marginRight: '1.5rem',
  },
  orderTotal: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.25rem',
    color: '#fff',
  },
  statusPill: {
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: '12px',
  },
  statusProcessing: {
    background: 'rgba(245, 158, 11, 0.12)',
    color: 'var(--warning)',
    border: '1px solid rgba(245, 158, 11, 0.25)',
  },
  statusShipped: {
    background: 'rgba(59, 130, 246, 0.12)',
    color: '#60a5fa',
    border: '1px solid rgba(59, 130, 246, 0.25)',
  },
  statusDelivered: {
    background: 'rgba(16, 185, 129, 0.12)',
    color: 'var(--success)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
  },
  expandBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  cardBody: {
    borderTop: '1px solid var(--border-glass)',
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.01)',
  },
  bodySplit: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '3rem',
  },
  itemsBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  blockTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '1rem',
    color: '#fff',
    marginBottom: '1.25rem',
  },
  miniItemsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  itemImg: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid var(--border-glass)',
  },
  itemMeta: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  itemName: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#fff',
  },
  itemUnit: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  itemSubtotal: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#fff',
  },
  deliveryBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  addressCard: {
    padding: '1rem',
    display: 'flex',
    gap: '0.75rem',
    borderRadius: '8px',
  },
  addressText: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    position: 'relative',
    paddingLeft: '1rem',
    borderLeft: '2px solid rgba(255,255,255,0.05)',
    marginLeft: '6px',
  },
  timelineItem: {
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: '-22px',
    top: '3px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
  },
  timelineDotActive: {
    background: 'var(--primary)',
    boxShadow: '0 0 8px var(--primary-glow)',
  },
  timelineContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  timelineTitle: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#fff',
  },
  timelineDesc: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
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
  },
  // Skeleton
  skeCard: {
    padding: '2rem',
    height: '100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  skeHeader: {
    height: '24px',
    width: '35%',
  },
  skeBody: {
    height: '16px',
    width: '75%',
  }
};

const injectOrdersCss = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    .cardHeader:hover {
      background: rgba(255, 255, 255, 0.02);
    }
    @media (max-width: 820px) {
      .bodySplit {
        grid-template-columns: 1fr !important;
        gap: 2rem !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') injectOrdersCss();

export default Orders;
