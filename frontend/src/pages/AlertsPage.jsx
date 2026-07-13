import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Calendar, Trophy, Plus, X, Settings2 } from 'lucide-react';
import useAlerts from '../hooks/useAlerts';

const iconMap = {
  budget: AlertTriangle,
  spike: TrendingUp,
  bill: Calendar,
  goal: Trophy,
};

export default function AlertsPage() {
  const { alerts, alertTypes, markAsRead, unreadCount } = useAlerts();
  const [showCreate, setShowCreate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [enabledTypes, setEnabledTypes] = useState({ budget: true, spike: true, bill: true, goal: true });
  const [alertType, setAlertType] = useState('bill');
  const [threshold, setThreshold] = useState('');

  return (
    <div className="fin-page">
      <div className="section-header" style={{ marginTop: 0 }}>
        
        <h1 className="page-title">
          التنبيهات {unreadCount > 0 && <span className="alerts-unread-badge">{unreadCount}</span>}
        </h1>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="alerts-icon-btn" onClick={() => setShowSettings(true)}>
            <Settings2 size={16} />
          </button>
          <button className="savings-add-btn" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> تنبيه جديد
          </button>
        </div>
      </div>

      <div className="alerts-feed">
        {alerts.map((a) => {
          const config = alertTypes[a.type];
          const Icon = iconMap[a.type];
          return (
            <button
              key={a.id}
              className={`alert-item ${a.unread ? 'unread' : ''}`}
              onClick={() => markAsRead(a.id)}
            >
              <div className="alert-icon" style={{ color: config.color, background: `${config.color}1a` }}>
                <Icon size={17} />
              </div>
              <div className="alert-content">
                <div className="alert-title-row">
                  <span className="alert-title">{a.title}</span>
                  {a.unread && <span className="alert-dot" />}
                </div>
                <p className="alert-desc">{a.desc}</p>
                <span className="alert-time">{a.time}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Create Custom Alert Drawer */}
      {showCreate && (
        <div className="drawer-overlay" onClick={() => setShowCreate(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-handle"></div>
              <h3 className="drawer-title">إنشاء تنبيه مخصص</h3>
            </div>

            <div className="input-group">
              <label className="input-label">نوع التنبيه</label>
              <select className="input-field" value={alertType} onChange={(e) => setAlertType(e.target.value)}>
                {Object.entries(alertTypes).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">الحد المسموح (ر.س)</label>
              <input
                type="number"
                className="input-field"
                placeholder="مثال: 1000"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
              />
            </div>

            <div className="fin-form-actions">
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>
                <X size={15} /> إلغاء
              </button>
              <button className="btn btn-primary fin-submit-btn" onClick={() => setShowCreate(false)}>
                إنشاء التنبيه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Settings Drawer */}
      {showSettings && (
        <div className="drawer-overlay" onClick={() => setShowSettings(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-handle"></div>
              <h3 className="drawer-title">إعدادات التنبيهات</h3>
            </div>

            <div className="settings-group" style={{ marginBottom: '1rem' }}>
              {Object.entries(alertTypes).map(([key, val]) => {
                const TypeIcon = iconMap[key];
                return (
                  <div key={key} className="settings-row">
                    <div className="settings-row-info">
                      <div className="settings-row-icon" style={{ color: val.color }}>
                        <TypeIcon size={16} />
                      </div>
                      <span>{val.label}</span>
                    </div>
                    <button
                      className={`settings-toggle ${enabledTypes[key] ? 'on' : ''}`}
                      onClick={() => setEnabledTypes({ ...enabledTypes, [key]: !enabledTypes[key] })}
                    >
                      <span className="settings-toggle-dot" />
                    </button>
                  </div>
                );
              })}
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowSettings(false)}>
              حفظ الإعدادات
            </button>
          </div>
        </div>
      )}
    </div>
  );
}