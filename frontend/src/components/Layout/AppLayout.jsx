import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertProvider } from '../../context/AlertContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppLayout = () => {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={styles.spinnerContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.spinnerText}>جاري تحميل سراج...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AlertProvider>
      <div className="app-container">
        {/* Mobile menu click backdrop */}
        {isSidebarOpen && (
          <div 
            className="sidebar-backdrop" 
            style={styles.backdrop} 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="main-content">
          <TopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="page-wrapper animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </AlertProvider>
  );
};

const styles = {
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-color)',
    gap: '1rem',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid var(--border-color)',
    borderTop: '4px solid var(--accent-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  spinnerText: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 95,
  },
};

// Add raw CSS keyframe for spinner to document head if not exists
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export default AppLayout;
