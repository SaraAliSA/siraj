import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { useAlert } from '../context/AlertContext';
import { Bell, Check, Trash, Plus, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

const AlertsPage = () => {
  const { alerts, markAsRead, fetchAlerts } = useAlert();
  const [loading, setLoading] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [alertType, setAlertType] = useState('spending_spike');
  const [category, setCategory] = useState('التسوق والمستلزمات');
  const [threshold, setThreshold] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      await client.post('/alerts/', {
        alert_type: alertType,
        category: category,
        threshold_amount: parseFloat(threshold),
        message: message
      });
      setShowForm(false);
      setThreshold('');
      setMessage('');
      fetchAlerts();
    } catch (err) {
      alert("فشل إنشاء التنبيه: " + (err.response?.data?.detail || err.message));
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'budget_breach':
        return <ShieldAlert size={20} color="var(--danger-color)" />;
      case 'spending_spike':
        return <ShieldAlert size={20} color="var(--warning-color)" />;
      case 'goal_milestone':
        return <Sparkles size={20} color="var(--success-color)" />;
      default:
        return <Bell size={20} color="var(--info-color)" />;
    }
  };

  const getAlertTypeName = (type) => {
    switch (type) {
      case 'budget_breach': return 'تجاوز الميزانية الكلي';
      case 'spending_spike': return 'ارتفاع مفاجئ بالمصاريف';
      case 'goal_milestone': return 'إنجاز هدف ادخاري';
      default: return 'تنبيه ذكي مخصص';
    }
  };

  const categories = [
    'الغذاء والبقالة',
    'السكن والإيجار',
    'الفواتير والخدمات',
    'النقل والمواصلات',
    'الترفيه والمطاعم',
    'التسوق والمستلزمات',
    'الصحة والتعليم',
    'أخرى'
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2>التنبيهات الذكية والمراقبة</h2>
          <p style={{ color: 'var(--text-secondary)' }}>يقوم سراج بمراقبة حسابك باستمرار وإخطارك بأي انحراف عن الميزانية أو تخطيك للأهداف.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
          <span>{showForm ? 'إغلاق النموذج' : 'إضافة تنبيه مخصص'}</span>
        </button>
      </div>

      {showForm && (
        <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>إعداد حد للتنبيه المالي</h3>
          <form onSubmit={handleCreateAlert} style={styles.form}>
            <div style={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">نوع التنبيه</label>
                <select className="form-control" value={alertType} onChange={(e) => setAlertType(e.target.value)}>
                  <option value="spending_spike">ارتفاع مفاجئ بالمصاريف في فئة</option>
                  <option value="budget_breach">تجاوز ميزانية فئة معينة</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">الفئة المستهدفة</label>
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">الحد المالي للتنبيه (ر.س)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="مثال: 1500" 
                  className="form-control"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">رسالة التنبيه المخصصة</label>
              <input 
                type="text" 
                required 
                placeholder="مثال: لقد اقتربت من استهلاك الحد المسموح للتسوق!" 
                className="form-control"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary">حفظ التنبيه</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* Alerts Feed */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>صندوق التنبيهات المكتشفة</h3>
        {alerts.length === 0 ? (
          <div style={styles.emptyState}>
            <Bell size={32} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
            <p>لا توجد تنبيهات نشطة حالياً. وضعك المالي ممتاز ومستقر!</p>
          </div>
        ) : (
          <div style={styles.feed}>
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                style={{
                  ...styles.alertItem,
                  opacity: alert.is_read ? 0.6 : 1,
                  backgroundColor: alert.is_read ? 'var(--surface-color)' : 'rgba(var(--accent-rgb), 0.03)'
                }}
              >
                <div style={styles.alertRight}>
                  <div style={styles.iconBox}>
                    {getAlertIcon(alert.alert_type)}
                  </div>
                  <div>
                    <div style={styles.alertMeta}>
                      <span style={styles.alertType}>{getAlertTypeName(alert.alert_type)}</span>
                      <span style={styles.alertDate}>{new Date(alert.created_at).toLocaleString('ar-SA')}</span>
                    </div>
                    <p style={styles.alertMsg}>{alert.message}</p>
                    {alert.threshold_amount > 0 && (
                      <span style={styles.alertThreshold}>الحد المضبوط: {alert.threshold_amount.toLocaleString()} ر.س</span>
                    )}
                  </div>
                </div>

                {!alert.is_read && (
                  <button 
                    style={styles.markReadBtn} 
                    onClick={() => markAsRead(alert.id)}
                    title="تعليم كمقروء"
                  >
                    <Check size={16} />
                    <span>تعليم كمقروء</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  feed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  alertItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  },
  alertRight: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  alertMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.25rem',
  },
  alertType: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  alertDate: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  alertMsg: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  alertThreshold: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  markReadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'var(--surface-color)',
    color: 'var(--success-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '0.4rem 0.8rem',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default AlertsPage;
