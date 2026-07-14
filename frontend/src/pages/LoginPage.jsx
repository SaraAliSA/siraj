import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, Wallet } from 'lucide-react';

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [currency, setCurrency] = useState('SAR');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, fullName, password, currency);
      }
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'فشلت العملية. يرجى التحقق من المدخلات.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>
            <Sparkles size={32} color="#ffffff" />
          </div>
          <h1 style={styles.title}>مرحباً بك في سراج</h1>
          <p style={styles.subtitle}>المستشار المالي الذكي لإدارة قراراتك المالية</p>
        </div>

        {errorMsg && (
          <div style={styles.errorAlert}>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">الاسم الكامل</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  required
                  placeholder="سارة القرني"
                  className="form-control"
                  style={styles.inputWithIcon}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">البريد الإلكتروني</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                required
                placeholder="sara@siraj.sa"
                className="form-control"
                style={styles.inputWithIcon}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="form-control"
                style={styles.inputWithIcon}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">العملة المفضلة</label>
              <div style={styles.inputWrapper}>
                <Wallet size={18} style={styles.inputIcon} />
                <select
                  className="form-control"
                  style={styles.inputWithIcon}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="SAR">ريال سعودي (SAR)</option>
                  <option value="USD">دولار أمريكي (USD)</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={styles.submitBtn}
          >
            {submitting ? 'جاري التحميل...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد')}
          </button>
        </form>

        <div style={styles.toggleSection}>
          <span>{isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}</span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
            }}
            style={styles.toggleBtn}
          >
            {isLogin ? 'سجل الآن' : 'سجل دخولك'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-color)',
    padding: '1.5rem',
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'var(--surface-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '2.5rem',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logoIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '15px',
    backgroundColor: 'var(--accent-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(193, 122, 58, 0.25)',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '0.25rem',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    right: '12px',
    color: 'var(--text-secondary)',
    pointerEvents: 'none',
  },
  inputWithIcon: {
    paddingRight: '40px',
  },
  errorAlert: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    color: 'var(--danger-color)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  submitBtn: {
    marginTop: '1rem',
    padding: '0.9rem',
    fontSize: '1rem',
    borderRadius: 'var(--radius-sm)',
  },
  toggleSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-color)',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: 0,
    textDecoration: 'underline',
  },
};

export default LoginPage;
