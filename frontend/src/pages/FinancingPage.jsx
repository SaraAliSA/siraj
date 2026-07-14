import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { BadgeCent, CheckCircle, Clock, XCircle, ChevronRight, HelpCircle } from 'lucide-react';

const FinancingPage = () => {
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState('personal');
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('24');
  const [notes, setNotes] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const prodRes = await client.get('/financing/products');
      setProducts(prodRes.data);

      const reqRes = await client.get('/financing/requests');
      setRequests(reqRes.data);
    } catch (err) {
      console.error("Failed to load financing data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      await client.post('/financing/requests', {
        product_type: selectedProductType,
        amount: parseFloat(amount),
        term_months: parseInt(term),
        notes: notes
      });
      setShowForm(false);
      setAmount('');
      setNotes('');
      // Reload requests
      fetchData();
    } catch (err) {
      alert("فشل تقديم الطلب: " + (err.response?.data?.detail || err.message));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="badge badge-success" style={styles.badgeAlign}>
            <CheckCircle size={14} style={{ marginLeft: '4px' }} />
            مقبول
          </span>
        );
      case 'rejected':
        return (
          <span className="badge badge-danger" style={styles.badgeAlign}>
            <XCircle size={14} style={{ marginLeft: '4px' }} />
            مرفوض
          </span>
        );
      default:
        return (
          <span className="badge badge-warning" style={styles.badgeAlign}>
            <Clock size={14} style={{ marginLeft: '4px' }} />
            قيد الدراسة
          </span>
        );
    }
  };

  const getProductTypeName = (type) => {
    switch (type) {
      case 'personal': return 'تمويل شخصي مرن';
      case 'auto': return 'تمويل السيارات الميسر';
      case 'home': return 'تمويل عقاري (سكني)';
      default: return type;
    }
  };

  return (
    <div style={styles.container}>
      <h2>المنتجات والحلول التمويلية</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        استعرض المنتجات التمويلية المتوافقة مع أحكام الشريعة الإسلامية وقدم طلبك مباشرة للحصول على دراسة فورية لملاءتك المالية.
      </p>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>جاري تحميل الحلول التمويلية...</p>
        </div>
      ) : (
        <>
          {/* Form Modal/Section */}
          {showForm && (
            <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>تقديم طلب تمويل جديد</h3>
              <form onSubmit={handleSubmitRequest} style={styles.form}>
                <div style={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">نوع التمويل</label>
                    <select 
                      className="form-control" 
                      value={selectedProductType} 
                      onChange={(e) => setSelectedProductType(e.target.value)}
                    >
                      <option value="personal">تمويل شخصي</option>
                      <option value="auto">تمويل سيارات</option>
                      <option value="home">تمويل عقاري / سكني</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">المبلغ المطلوب (ر.س)</label>
                    <input 
                      type="number" 
                      required 
                      placeholder="مثال: 50,000" 
                      className="form-control"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">فترة السداد (بالشهور)</label>
                    <select 
                      className="form-control" 
                      value={term} 
                      onChange={(e) => setTerm(e.target.value)}
                    >
                      <option value="12">12 شهر (سنة)</option>
                      <option value="24">24 شهر (سنتين)</option>
                      <option value="36">36 شهر (3 سنوات)</option>
                      <option value="48">48 شهر (4 سنوات)</option>
                      <option value="60">60 شهر (5 سنوات)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ملاحظات إضافية / الغرض من التمويل</label>
                  <textarea 
                    rows="3" 
                    placeholder="مثال: ترميم منزل أو شراء سلع إنتاجية" 
                    className="form-control"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary">تقديم الطلب</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
                </div>
              </form>
            </div>
          )}

          {/* Products Grid */}
          <div style={styles.grid}>
            {products.map((prod) => (
              <div key={prod.id || prod.product_type} className="card" style={styles.productCard}>
                <div style={styles.prodHeader}>
                  <div style={styles.iconBox}>
                    <BadgeCent size={24} color="var(--accent-color)" />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{prod.name}</h3>
                </div>
                <p style={styles.prodDesc}>{prod.description}</p>
                <div style={styles.prodMetrics}>
                  <div>
                    <span style={styles.metricLabel}>معدل النسبة السنوي (APR)</span>
                    <span style={styles.metricValue}>{(prod.apr * 100).toFixed(2)}%</span>
                  </div>
                  <div>
                    <span style={styles.metricLabel}>الحد الأقصى</span>
                    <span style={styles.metricValue}>{prod.max_amount.toLocaleString()} ر.س</span>
                  </div>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ marginTop: 'auto' }}
                  onClick={() => {
                    setSelectedProductType(prod.product_type);
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  تقديم طلب تمويل
                </button>
              </div>
            ))}
          </div>

          {/* History Requests */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>سجل طلبات التمويل المقدمة</h3>
            <div className="table-container" style={{ border: 'none' }}>
              {requests.length === 0 ? (
                <div style={styles.emptyState}>لا توجد طلبات تمويل سابقة.</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>رقم الطلب</th>
                      <th>نوع التمويل</th>
                      <th>المبلغ المطلوب</th>
                      <th>فترة السداد</th>
                      <th>ملاحظات</th>
                      <th>تاريخ التقديم</th>
                      <th>حالة الطلب</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id}>
                        <td style={{ fontWeight: '600', fontSize: '0.85rem' }}>{req.id.substring(0, 8)}...</td>
                        <td style={{ fontWeight: '700' }}>{getProductTypeName(req.product_type)}</td>
                        <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{req.amount.toLocaleString()} ر.س</td>
                        <td>{req.term_months} شهر</td>
                        <td>{req.notes || '-'}</td>
                        <td>{new Date(req.created_at).toLocaleDateString('ar-SA')}</td>
                        <td>{getStatusBadge(req.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5rem 0',
    gap: '1rem',
  },
  spinner: {
    width: '35px',
    height: '35px',
    border: '3px solid var(--border-color)',
    borderTop: '3px solid var(--accent-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  productCard: {
    padding: '1.5rem',
    height: '100%',
  },
  prodHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'rgba(193, 122, 58, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prodDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },
  prodMetrics: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(var(--primary-rgb), 0.02)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  metricLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  metricValue: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginTop: '0.15rem',
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
  badgeAlign: {
    gap: '4px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem 0',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
};

export default FinancingPage;
