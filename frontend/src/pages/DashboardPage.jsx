import React, { useState, useEffect } from 'react';
import client from '../api/client';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Percent,
  Sparkles,
  ArrowRight,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

const COLORS = ['#1a1f4e', '#c17a3a', '#2e7d32', '#d32f2f', '#ed6c02', '#0288d1', '#7b1fa2', '#455a64'];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ total_income: 0, total_expense: 0, total_savings: 0, savings_rate: 0 });
  const [breakdown, setBreakdown] = useState([]);
  const [health, setHealth] = useState({ score: 75, grade: 'جيد جداً', status: 'normal' });
  const [dailyTip, setDailyTip] = useState('');
  const [recentTxns, setRecentTxns] = useState([]);
  const [error, setError] = useState('');

  // Add Transaction states
  const [showAddModal, setShowAddModal] = useState(false);
  const [txnAmount, setTxnAmount] = useState('');
  const [txnCategory, setTxnCategory] = useState('الغذاء والبقالة');
  const [txnType, setTxnType] = useState('expense');
  const [txnDesc, setTxnDesc] = useState('');
  const [txnDate, setTxnDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch overview metrics
      const ovRes = await client.get('/dashboard/overview');
      setOverview(ovRes.data);

      // 2. Fetch category breakdown
      const brRes = await client.get('/dashboard/category-breakdown');
      setBreakdown(brRes.data);

      // 3. Fetch health score
      const hlRes = await client.get('/dashboard/health-score');
      setHealth(hlRes.data);

      // 4. Fetch daily tip
      const tipRes = await client.get('/dashboard/daily-tip');
      setDailyTip(tipRes.data?.tip || tipRes.data || 'استمر في مراقبة ميزانيتك لتحقيق الاستقلال المالي!');

      // 5. Fetch transactions
      const txRes = await client.get('/transactions/');
      // Take top 5
      setRecentTxns(txRes.data.slice(0, 5));
    } catch (err) {
      console.error("Dashboard load failed", err);
      setError('حدث خطأ أثناء تحميل بيانات لوحة التحكم. تأكد من تشغيل الخادم الخلفي.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await client.post('/transactions/', {
        amount: parseFloat(txnAmount),
        category: txnCategory,
        type: txnType,
        description: txnDesc,
        transaction_date: txnDate
      });
      setShowAddModal(false);
      // Reset form
      setTxnAmount('');
      setTxnDesc('');
      // Reload dashboard data
      fetchData();
    } catch (err) {
      alert("فشل إضافة المعاملة: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '1rem', fontWeight: '600' }}>جاري تحميل البيانات المالية...</p>
      </div>
    );
  }

  const kpis = [
    { label: 'المداخيل الشهرية', value: `${(overview.total_income || 0).toLocaleString()} ر.س`, icon: TrendingUp, color: 'var(--success-color)', bg: 'rgba(46, 125, 50, 0.08)' },
    { label: 'المصاريف الشهرية', value: `${(overview.total_expense || 0).toLocaleString()} ر.س`, icon: TrendingDown, color: 'var(--danger-color)', bg: 'rgba(211, 47, 47, 0.08)' },
    { label: 'المدخرات الشهرية', value: `${(overview.total_savings || 0).toLocaleString()} ر.س`, icon: PiggyBank, color: 'var(--accent-color)', bg: 'rgba(193, 122, 58, 0.08)' },
    { label: 'معدل الادخار', value: `${(overview.savings_rate || 0).toFixed(1)}%`, icon: Percent, color: 'var(--info-color)', bg: 'rgba(2, 136, 209, 0.08)' },
  ];

  return (
    <div style={styles.pageContainer}>
      {error && (
        <div style={styles.errorAlert}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="metrics-grid">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <div style={{ ...styles.kpiIconWrapper, backgroundColor: kpi.bg, color: kpi.color }}>
                <Icon size={24} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={styles.kpiLabel}>{kpi.label}</span>
                <span style={styles.kpiValue}>{kpi.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Tip Card & Health Score */}
      <div style={styles.twoColumnGrid}>
        {/* Daily Tip */}
        <div className="card" style={styles.tipCard}>
          <div style={styles.tipHeader}>
            <Sparkles size={22} color="var(--accent-color)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>توصية سراج اليومية</h3>
          </div>
          <p style={styles.tipBody}>{dailyTip}</p>
          <button className="btn btn-secondary" style={styles.askSirajBtn} onClick={() => navigate('/chat')}>
            <span>استشر سراج بمزيد من التفاصيل</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Health Score Gauge */}
        <div className="card" style={styles.healthCard}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>مؤشر الصحة المالية</h3>
          <div style={styles.gaugeContainer}>
            <div style={{
              ...styles.gaugeValueCircle,
              borderColor: health.score >= 80 ? 'var(--success-color)' : health.score >= 50 ? 'var(--warning-color)' : 'var(--danger-color)'
            }}>
              <span style={styles.gaugeScore}>{health.score}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>من 100</span>
            </div>
            <div style={styles.gaugeInfo}>
              <h4 style={{
                color: health.score >= 80 ? 'var(--success-color)' : health.score >= 50 ? 'var(--warning-color)' : 'var(--danger-color)',
                fontSize: '1.4rem'
              }}>
                {health.grade}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {health.score >= 80 ? 'وضعك المالي ممتاز وملتزم بالخطط.' : health.score >= 50 ? 'لديك بعض المصاريف الزائدة، حاول ترشيد استهلاكك.' : 'تحتاج إلى خطة فورية لإعادة ترتيب الميزانية وسداد الالتزامات.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Charts */}
      <div style={styles.twoColumnGrid}>
        {/* Expenses Donut */}
        <div className="card" style={{ height: '350px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>توزيع المصاريف حسب الفئات</h3>
          {breakdown.length === 0 ? (
            <div style={styles.emptyState}>لا توجد بيانات كافية لرسم المخطط</div>
          ) : (
            <div style={{ flex: 1, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val) => `${val.toLocaleString()} ر.س`} />
                  <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Expenses Bar Chart */}
        <div className="card" style={{ height: '350px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>المصاريف الأعلى قيمة (ر.س)</h3>
          {breakdown.length === 0 ? (
            <div style={styles.emptyState}>لا توجد بيانات كافية لرسم المخطط</div>
          ) : (
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdown.slice(0, 5)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <RechartsTooltip formatter={(val) => `${val.toLocaleString()} ر.س`} />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Row 4: Recent Transactions Table */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div style={styles.tableHeader}>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>آخر المعاملات المالية</h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/transactions')}>إدارة المعاملات</button>
            <button className="btn btn-primary" style={styles.quickAddBtn} onClick={() => setShowAddModal(true)}>
              <Plus size={16} />
              <span>إضافة معاملة</span>
            </button>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          {recentTxns.length === 0 ? (
            <div style={styles.emptyState}>لا توجد معاملات مسجلة حتى الآن.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>البيان</th>
                  <th>الفئة</th>
                  <th>النوع</th>
                  <th>المبلغ</th>
                </tr>
              </thead>
              <tbody>
                {recentTxns.map((txn) => (
                  <tr key={txn.id}>
                    <td>{txn.transaction_date}</td>
                    <td>{txn.description}</td>
                    <td>{txn.category}</td>
                    <td>
                      <span className={`badge ${txn.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                        {txn.type === 'income' ? 'دخل' : 'مصروف'}
                      </span>
                    </td>
                    <td style={{
                      fontWeight: '700',
                      color: txn.type === 'income' ? 'var(--success-color)' : 'var(--text-primary)'
                    }}>
                      {txn.type === 'income' ? '+' : '-'}{txn.amount.toLocaleString()} ر.س
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Add Modal */}
      {showAddModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard} className="animate-fade-in">
            <h3 style={{ marginBottom: '1.5rem' }}>إضافة معاملة جديدة سريعة</h3>
            <form onSubmit={handleAddTransaction}>
              <div className="form-group">
                <label className="form-label">المبلغ (ر.س)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="form-control"
                  value={txnAmount}
                  onChange={(e) => setTxnAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">نوع المعاملة</label>
                <select
                  className="form-control"
                  value={txnType}
                  onChange={(e) => setTxnType(e.target.value)}
                >
                  <option value="expense">مصروف</option>
                  <option value="income">دخل</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">الفئة</label>
                <select
                  className="form-control"
                  value={txnCategory}
                  onChange={(e) => setTxnCategory(e.target.value)}
                >
                  <option value="الغذاء والبقالة">الغذاء والبقالة</option>
                  <option value="السكن والإيجار">السكن والإيجار</option>
                  <option value="الفواتير والخدمات">الفواتير والخدمات</option>
                  <option value="النقل والمواصلات">النقل والمواصلات</option>
                  <option value="الترفيه والمطاعم">الترفيه والمطاعم</option>
                  <option value="التسوق والمستلزمات">التسوق والمستلزمات</option>
                  <option value="الصحة والتعليم">الصحة والتعليم</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">الوصف / البيان</label>
                <input
                  type="text"
                  required
                  placeholder="شراء عشاء مثلاً"
                  className="form-control"
                  value={txnDesc}
                  onChange={(e) => setTxnDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">التاريخ</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={txnDate}
                  onChange={(e) => setTxnDate(e.target.value)}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="submit" className="btn btn-primary">إضافة</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    width: '100%',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid var(--border-color)',
    borderTop: '4px solid var(--accent-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorAlert: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    color: 'var(--danger-color)',
    padding: '1rem',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontWeight: '600',
  },
  kpiIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  kpiValue: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginTop: '0.15rem',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
  },
  tipCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, var(--surface-color), rgba(var(--accent-rgb), 0.05))',
  },
  tipHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  tipBody: {
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    lineHeight: '1.7',
    marginBottom: '1.5rem',
    fontWeight: '500',
  },
  askSirajBtn: {
    alignSelf: 'flex-start',
    gap: '0.5rem',
    fontSize: '0.85rem',
    padding: '0.5rem 1rem',
  },
  healthCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
  },
  gaugeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    flex: 1,
  },
  gaugeValueCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '8px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(var(--primary-rgb), 0.02)',
  },
  gaugeScore: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    lineHeight: '1',
  },
  gaugeInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    padding: '2rem 0',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  quickAddBtn: {
    backgroundColor: 'var(--primary-color)',
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modalCard: {
    backgroundColor: 'var(--surface-color)',
    borderRadius: 'var(--radius-md)',
    width: '100%',
    maxWidth: '450px',
    padding: '2rem',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--border-color)',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
};

export default DashboardPage;
