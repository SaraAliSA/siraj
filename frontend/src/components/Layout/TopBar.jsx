import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { Bell, User, Calendar, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const { unreadCount } = useAlert();
  const navigate = useNavigate();

  // Get current date formatted in Arabic
  const getArabicDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('ar-SA', options);
  };

  return (
    <header style={styles.topbar}>
      <div style={styles.rightSection}>
        <button 
          className="menu-toggle-btn" 
          onClick={onToggleSidebar} 
          style={styles.menuBtn}
          title="القائمة"
        >
          <Menu size={24} />
        </button>
        <div style={styles.welcomeContainer}>
          <h1 style={styles.welcomeText}>
            أهلاً بك، {user?.full_name || 'سارة القرني'}
          </h1>
          <div style={styles.dateContainer}>
            <Calendar size={16} style={styles.calendarIcon} />
            <span style={styles.dateText}>{getArabicDate()}</span>
          </div>
        </div>
      </div>

      <div style={styles.leftSection}>
        <button 
          style={styles.iconBtn} 
          onClick={() => navigate('/alerts')}
          title="التنبيهات الذكية"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={styles.badge}>{unreadCount}</span>
          )}
        </button>

        <div style={styles.profile} onClick={() => navigate('/settings')}>
          <div style={styles.profileInfo}>
            <span style={styles.profileName}>{user?.full_name || 'سارة القرني'}</span>
            <span style={styles.profileRole}>مستخدم مميز</span>
          </div>
          <div style={styles.avatar}>
            {user?.full_name ? user.full_name.charAt(0) : 'س'}
          </div>
        </div>
      </div>
    </header>
  );
};

const styles = {
  topbar: {
    height: '80px',
    backgroundColor: 'var(--surface-color)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 90,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  welcomeContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  welcomeText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '0.2rem',
  },
  dateContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: 'var(--text-secondary)',
  },
  calendarIcon: {
    color: 'var(--accent-color)',
  },
  dateText: {
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  iconBtn: {
    position: 'relative',
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-color)',
    transition: 'all 0.2s ease',
  },
  badge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: 'var(--danger-color)',
    color: '#ffffff',
    fontSize: '0.7rem',
    fontWeight: '700',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--surface-color)',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    alignItems: 'flex-end',
  },
  profileName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  profileRole: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-color)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.1rem',
    boxShadow: '0 4px 8px rgba(193, 122, 58, 0.15)',
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    marginLeft: '1rem',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default TopBar;
