import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  MessageSquare,
  BadgeCent,
  TrendingUp,
  PiggyBank,
  Target,
  Bell,
  Settings,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { unreadCount } = useAlert();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
    { path: '/transactions', label: 'المعاملات المالية', icon: ArrowLeftRight },
    { path: '/chat', label: 'مساعد سراج الذكي', icon: MessageSquare, highlight: true },
    { path: '/financing', label: 'المنتجات التمويلية', icon: BadgeCent },
    { path: '/investment', label: 'الفرص الاستثمارية', icon: TrendingUp },
    { path: '/savings', label: 'الخطط الادخارية', icon: PiggyBank },
    { path: '/goals', label: 'الأهداف الموسمية', icon: Target },
    { path: '/alerts', label: 'التنبيهات الذكية', icon: Bell, badge: true },
    { path: '/settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <aside className={isOpen ? 'open' : ''} style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, cursor: 'pointer' }} 
          onClick={() => { navigate('/'); onClose(); }}
        >
          <div style={styles.logoIcon}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <h2 style={styles.logoText}>سراج</h2>
        </div>
        <button 
          className="sidebar-close-btn" 
          onClick={onClose} 
          style={styles.closeBtn}
          title="إغلاق"
        >
          <X size={20} />
        </button>
      </div>

      <nav style={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.activeNavLink : {}),
                ...(item.highlight ? styles.highlightLink : {})
              })}
            >
              <Icon size={20} style={styles.icon} />
              <span style={styles.label}>{item.label}</span>
              {item.badge && unreadCount > 0 && (
                <span style={styles.badge}>{unreadCount}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <button onClick={toggleTheme} style={styles.themeToggleBtn} title="تغيير المظهر">
          {theme === 'light' ? (
            <>
              <Moon size={18} />
              <span>الوضع الداكن</span>
            </>
          ) : (
            <>
              <Sun size={18} />
              <span>الوضع المضيء</span>
            </>
          )
          }
        </button>
        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={18} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    height: '100vh',
    position: 'fixed',
    top: 0,
    right: 0,
    backgroundColor: 'var(--primary-color)',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    borderLeft: '1px solid var(--border-color)',
    zIndex: 100,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 0.5rem',
    marginBottom: '2rem',
    cursor: 'pointer',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'var(--accent-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(193, 122, 58, 0.3)',
  },
  logoText: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '1px',
    marginBottom: 0,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.85rem 1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
  },
  activeNavLink: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    borderRight: '4px solid var(--accent-color)',
  },
  highlightLink: {
    border: '1px dashed var(--accent-color)',
    backgroundColor: 'rgba(193, 122, 58, 0.1)',
    color: 'var(--accent-color)',
  },
  icon: {
    flexShrink: 0,
  },
  label: {
    flex: 1,
  },
  badge: {
    backgroundColor: 'var(--danger-color)',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '0.15rem 0.5rem',
    borderRadius: '9999px',
  },
  footer: {
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  themeToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.8)',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    textAlign: 'right',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'transparent',
    color: '#f85149',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    textAlign: 'right',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Sidebar;
