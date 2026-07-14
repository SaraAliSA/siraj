import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { TrendingUp, ShieldAlert, Sparkles, Plus, Wallet, BadgeCheck } from 'lucide-react';

const InvestmentPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [amount, setAmount] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const oppRes = await client.get('/investment/opportunities');
      setOpportunities(oppRes.data);

      const invRes = await client.get('/investment/requests');
      setInvestments(invRes.data);

      try {
        const recRes = await client.get('/investment/recommendations');
        setRecommendations(recRes.data);
      } catch (e) {
        console.warn("Recommendations endpoint not fully working or empty", e);
      }
    } catch (err) {
      console.error("Failed to load investment data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitInvestment = async (e) => {
    e.preventDefault();
    if (!selectedOpp) return;
    try {
      await client.post('/investment/requests', {
        product_name: selectedOpp.name,
        product_type: selectedOpp.product_type,
        amount: parseFloat(amount),
        risk_level: selectedOpp.risk_level,
        expected_return: selectedOpp.expected_return
      });
      setShowForm(false);
      setAmount('');
      fetchData();
    } catch (err) {
      alert("فشل عملية الاستثمار: " + (err.response?.data?.detail || err.message));
    }
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'low':
        return <span className="badge badge-success">مخاطر منخفضة</span>;
      case 'medium':
        return <span className="badge badge-warning">مخاطر متوسطة</span>;
      case 'high':
        return <span className="badge badge-danger">مخاطر مرتفعة</span>;
      default:
        return <span className="badge badge-info">{level}</span>;
    }
  };

  const getProductTypeName = (type) => {
    switch (type) {
      case 'sukuk': return 'صكوك سيادية/شركات';
      case 'fund': return 'صناديق استثمارية';
      case 'ipo': return 'اكتتابات أولية';
      default: return type;
    }
  };

  return (
    <div style={styles.container}>
      <h2>الفرص الاستثمارية الذكية</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        استثمر مدخراتك في أصول متوافقة مع أحكام الشريعة الإسلامية. يقدم سراج توصيات استثمارية مخصصة بناءً على مستوى تقبلك للمخاطر وصحتك المالية.
      </p>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>جاري تحميل الفرص الاستثمارية وتوصيات سراج...</p>
        </div>
      ) : (
        <>
          {/* AI recommendations header if available */}
          {recommendations.length > 0 && (
            <div className="card" style={styles.aiRecommendationsCard}>
              <div style={styles.aiHeader}>
                <Sparkles size={24} color="var(--accent-color)" />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>توصيات استثمارية مخصصة من سراج</h3>
              </div>
                <div style={styles.recList}>
                  {recommendations.map((rec, idx) => (
                    <div key={idx} style={styles.recItem}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <BadgeCheck size={18} color="var(--success-color)" />
                          <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{rec.opportunity?.name}</h4>
                        </div>
                        <span className="badge badge-success">درجة الملائمة: {rec.recommendation_score}%</span>
                      </div>
                      <p style={styles.recRationale}>{rec.rationale}</p>
                      <div style={styles.recMetrics}>
                        <span>العائد المتوقع: <strong>{(rec.opportunity?.expected_return || 0).toFixed(2)}%</strong></span>
                        <span>النوع: <strong>{getProductTypeName(rec.opportunity?.product_type)}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          )}

          {/* Investment Application Form */}
          {showForm && selectedOpp && (
            <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>تأكيد طلب الاستثمار في {selectedOpp.name}</h3>
              <form onSubmit={handleSubmitInvestment} style={styles.form}>
                <div style={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">الفرصة المختارة</label>
                    <input type="text" disabled className="form-control" value={selectedOpp.name} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">مبلغ الاستثمار (ر.س)</label>
                    <input 
                      type="number" 
                      required 
                      placeholder="مثال: 5,000" 
                      className="form-control"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">العائد السنوي المتوقع</label>
                    <input type="text" disabled className="form-control" value={`${(selectedOpp.expected_return).toFixed(2)}%`} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary">تأكيد الاستثمار</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
                </div>
              </form>
            </div>
          )}

          {/* Active Opportunities Grid */}
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>الفرص الاستثمارية النشطة</h3>
          <div style={styles.grid}>
            {opportunities.map((opp) => (
              <div key={opp.id || opp.name} className="card" style={styles.oppCard}>
                <div style={styles.oppHeader}>
                  <TrendingUp size={22} color="var(--accent-color)" />
                  <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{opp.name}</h4>
                </div>
                <p style={styles.oppDesc}>{opp.description}</p>
                <div style={styles.oppDetails}>
                  <div>
                    <span style={styles.detailLabel}>العائد المتوقع</span>
                    <span style={styles.detailValue}>{(opp.expected_return).toFixed(2)}% سنوي</span>
                  </div>
                  <div>
                    <span style={styles.detailLabel}>مستوى المخاطر</span>
                    <span style={styles.detailValue}>{getRiskBadge(opp.risk_level)}</span>
                  </div>
                  <div>
                    <span style={styles.detailLabel}>نوع الأصل</span>
                    <span style={styles.detailValue}>{getProductTypeName(opp.product_type)}</span>
                  </div>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedOpp(opp);
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  استثمر الآن
                </button>
              </div>
            ))}
          </div>

          {/* Portfolio Summary / Active Requests */}
          <div className="card" style={{ marginTop: '2.5rem' }}>
            <div style={styles.portfolioHeader}>
              <Wallet size={20} color="var(--accent-color)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>محفظتي الاستثمارية الحالية</h3>
            </div>
            <div className="table-container" style={{ border: 'none' }}>
              {investments.length === 0 ? (
                <div style={styles.emptyState}>لا توجد استثمارات مسجلة حالياً. استثمر في الفرص المتاحة أعلاه لتنمية ثروتك.</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>رقم العملية</th>
                      <th>اسم الأصل</th>
                      <th>نوع الأصل</th>
                      <th>مبلغ الاستثمار</th>
                      <th>مستوى المخاطر</th>
                      <th>العائد المتوقع</th>
                      <th>تاريخ الاشتراك</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((inv) => (
                      <tr key={inv.id}>
                        <td style={{ fontSize: '0.85rem' }}>{inv.id.substring(0, 8)}...</td>
                        <td style={{ fontWeight: '700' }}>{inv.product_name}</td>
                        <td>{getProductTypeName(inv.product_type)}</td>
                        <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{inv.amount.toLocaleString()} ر.س</td>
                        <td>{getRiskBadge(inv.risk_level)}</td>
                        <td style={{ fontWeight: '700', color: 'var(--success-color)' }}>{(inv.expected_return).toFixed(2)}%</td>
                        <td>{new Date(inv.created_at).toLocaleDateString('ar-SA')}</td>
                        <td>
                          <span className="badge badge-success">نشط</span>
                        </td>
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
  aiRecommendationsCard: {
    marginBottom: '2rem',
    background: 'linear-gradient(135deg, var(--surface-color), rgba(var(--accent-rgb), 0.08))',
    borderColor: 'rgba(var(--accent-rgb), 0.25)',
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem',
    color: 'var(--text-primary)',
  },
  recList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  recItem: {
    padding: '1rem',
    backgroundColor: 'var(--surface-color)',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
  },
  recRationale: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    margin: '0.5rem 0',
  },
  recMetrics: {
    display: 'flex',
    gap: '1.5rem',
    fontSize: '0.8rem',
    color: 'var(--text-primary)',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '0.5rem',
    marginTop: '0.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  oppCard: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  oppHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  oppDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },
  oppDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    backgroundColor: 'rgba(var(--primary-rgb), 0.02)',
    padding: '1rem',
    borderRadius: '10px',
    marginBottom: '1.5rem',
  },
  detailLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    display: 'block',
  },
  detailValue: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    display: 'block',
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
  portfolioHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem 0',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
};

export default InvestmentPage;
