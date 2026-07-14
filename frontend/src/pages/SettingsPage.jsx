import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, User, Bell, Shield, HelpCircle } from 'lucide-react';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  
  const [fullName, setFullName] = useState(user?.full_name || 'سارة القرني');
  const [email, setEmail] = useState(user?.email || 'sara@siraj.sa');
  const [currency, setCurrency] = useState(user?.currency || 'SAR');

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSpikes, setNotifSpikes] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // In local context, mock updating the user
    setUser(prev => prev ? { ...prev, full_name: fullName, email, currency } : null);
    alert("تم حفظ إعدادات الحساب بنجاح (محاكاة)");
  };

  return (
    <div style={styles.container}>
      <h2>إعدادات النظام والملف الشخصي</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>تخصيص تفضيلات حسابك، وتعديل إعدادات التنبيهات والعملة الافتراضية لعرض أصولك وميزانيتك.</p>

      <div style={styles.contentGrid}>
        {/* Profile Card */}
        <div className="card" style={{ flex: 2 }}>
          <div style={styles.sectionHeader}>
            <User size={18} color="var(--accent-color)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>بيانات الحساب الأساسية</h3>
          </div>
          <form onSubmit={handleSaveProfile} style={styles.form}>
            <div className="form-group">
              <label className="form-label">الاسم الكامل</label>
              <input 
                type="text" 
                required 
                className="form-control" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <input 
                type="email" 
                required 
                className="form-control" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">العملة الافتراضية</label>
              <select 
                className="form-control"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>حفظ التغييرات</button>
          </form>
        </div>

        {/* Configurations Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1.5 }}>
          {/* Notification toggles */}
          <div className="card">
            <div style={styles.sectionHeader}>
              <Bell size={18} color="var(--accent-color)" />
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>خيارات الإشعارات والتنبيه الذكي</h3>
            </div>
            <div style={styles.toggleList}>
              <div style={styles.toggleItem}>
                <div>
                  <span style={styles.toggleLabel}>تنبيهات البريد الإلكتروني</span>
                  <span style={styles.toggleDesc}>إرسال تقرير شهري حول صحتك المالية</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifEmail} 
                  onChange={(e) => setNotifEmail(e.target.checked)} 
                  style={styles.checkbox}
                />
              </div>

              <div style={styles.toggleItem}>
                <div>
                  <span style={styles.toggleLabel}>تنبيهات طفرة الصرف</span>
                  <span style={styles.toggleDesc}>تنبيه فوري عند تجاوز حدود الصرف المعتادة</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifSpikes} 
                  onChange={(e) => setNotifSpikes(e.target.checked)} 
                  style={styles.checkbox}
                />
              </div>

              <div style={styles.toggleItem}>
                <div>
                  <span style={styles.toggleLabel}>التقرير الأسبوعي الذكي</span>
                  <span style={styles.toggleDesc}>إرسال تنبيهات بأهم نقاط الضعف والميزانيات</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifWeekly} 
                  onChange={(e) => setNotifWeekly(e.target.checked)} 
                  style={styles.checkbox}
                />
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="card">
            <div style={styles.sectionHeader}>
              <Shield size={18} color="var(--accent-color)" />
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>الحماية والخصوصية</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
              معلوماتك مشفرة بالكامل على خوادمنا ولا يمكن للطرف الثالث الاطلاع عليها. يتم استخدام بياناتك المالية فقط بواسطة Gemini AI لتقديم الاستشارات الفورية لك.
            </p>
            <button className="btn btn-secondary" style={{ width: '100%' }}>تغيير كلمة المرور</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  contentGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  toggleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  toggleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--border-color)',
  },
  toggleLabel: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  toggleDesc: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginTop: '0.15rem',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: 'var(--accent-color)',
    cursor: 'pointer',
  },
};

export default SettingsPage;
