import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Grid2x2 } from 'lucide-react';
import { House, ArrowLeftRight, Sparkles, HandCoins, TrendingUp, Coins, Target, Bell, FileText, Settings } from 'lucide-react';
const BottomNav = () => {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  const primaryItems = [
    { to: '/', label: 'الرئيسية', icon: House },
    { to: '/transactions', label: 'المعاملات', icon: ArrowLeftRight },
    { to: '/siraj-ai', label: 'سراج AI', icon: Sparkles, isAI: true },
    { to: '/financing', label: 'التمويل', icon: HandCoins },
  ];

 const overflowItems = [
  { to: '/investment', label: 'الاستثمار', icon: TrendingUp },
  { to: '/savings', label: 'الادخار', icon: Coins },
  { to: '/goals', label: 'الأهداف', icon: Target },
  { to: '/alerts', label: 'التنبيهات', icon: Bell },
  { to: '/reports', label: 'التقارير', icon: FileText },
  { to: '/settings', label: 'الإعدادات', icon: Settings },
];

  const handleOverflowClick = (path) => {
    setShowMore(false);
    navigate(path);
  };

  return (
    <>
      <nav className="bottom-nav">
        {primaryItems.filter((i) => !i.isAI).slice(0, 2).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="bottom-nav-icon"><item.icon size={20} /></span>
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}

        {primaryItems.filter((i) => i.isAI).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `bottom-nav-item bottom-nav-ai ${isActive ? 'active' : ''}`}
          >
            <div className="ai-btn-glow"></div>
            <span className="bottom-nav-icon ai-icon"><item.icon size={20} /></span>
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}

        {primaryItems.filter((i) => !i.isAI).slice(2).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="bottom-nav-icon"><item.icon size={20} /></span>
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}

              <button
              className={`bottom-nav-item ${showMore ? 'active' : ''}`}
              onClick={() => setShowMore(!showMore)}
            >
              <span className="bottom-nav-icon">
                <Grid2x2 size={20} />
              </span>
              <span className="bottom-nav-label">المزيد</span>
            </button>
      </nav>

      {showMore && (
        <div className="drawer-overlay" onClick={() => setShowMore(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-handle"></div>
              <h3 className="drawer-title">المزيد من الخدمات</h3>
            </div>
            <div className="drawer-grid">
              {overflowItems.map((item) => (
                <button key={item.to} className="drawer-item" onClick={() => handleOverflowClick(item.to)}>
<span className="drawer-icon"><item.icon size={22} /></span>
                  <span className="drawer-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav;