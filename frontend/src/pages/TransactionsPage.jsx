import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Plus, Trash2, Filter, Search, RotateCcw, Calendar, Tag, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TransactionsPage = () => {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Filters state
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('الغذاء والبقالة');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType) params.type = filterType;
      if (filterCategory) params.category = filterCategory;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await client.get('/transactions/', { params });
      setTxns(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterType, filterCategory, startDate, endDate]);

  const handleAddTxn = async (e) => {
    e.preventDefault();
    try {
      await client.post('/transactions/', {
        amount: parseFloat(amount),
        category,
        type,
        description,
        transaction_date: date
      });
      setShowAddForm(false);
      // Reset form
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      // Refetch
      fetchTransactions();
    } catch (err) {
      alert("فشل إضافة المعاملة: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteTxn = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه المعاملة؟")) return;
    try {
      await client.delete(`/transactions/${id}`);
      setTxns(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert("فشل حذف المعاملة: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleResetFilters = () => {
    setFilterType('');
    setFilterCategory('');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
  };

  // Client-side text search filter
  const filteredTxns = txns.filter(t => 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h2>إدارة المعاملات المالية</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} />
          <span>{showAddForm ? 'إغلاق النموذج' : 'إضافة معاملة جديدة'}</span>
        </button>
      </div>

      {/* Add Transaction Card */}
      {showAddForm && (
        <div className="card animate-fade-in" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>بيانات المعاملة الجديدة</h3>
          <form onSubmit={handleAddTxn} style={styles.addForm}>
            <div style={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">نوع المعاملة</label>
                <select className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="expense">مصروف (سحب)</option>
                  <option value="income">دخل (إيداع)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">المبلغ (ر.س)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  className="form-control" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">الفئة</label>
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">التاريخ</label>
                <input 
                  type="date" 
                  required 
                  className="form-control" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">الوصف / البيان</label>
              <input 
                type="text" 
                required 
                placeholder="تفاصيل المعاملة (مثال: بقالة هايبر بنده)" 
                className="form-control" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              حفظ المعاملة
            </button>
          </form>
        </div>
      )}

      {/* Filters Card */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={styles.filterTitle}>
          <Filter size={18} color="var(--accent-color)" />
          <h3 style={{ fontSize: '1rem', margin: 0 }}>تصفية المعاملات والبحث</h3>
        </div>

        <div style={styles.filterGrid}>
          {/* Search */}
          <div className="form-group">
            <label className="form-label">بحث نصي</label>
            <div style={styles.searchWrapper}>
              <Search size={16} style={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="البحث بالبيان أو الفئة..." 
                className="form-control" 
                style={{ paddingRight: '35px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Type */}
          <div className="form-group">
            <label className="form-label">النوع</label>
            <select className="form-control" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">الكل</option>
              <option value="expense">مصروفات</option>
              <option value="income">مداخيل</option>
            </select>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">الفئة</label>
            <select className="form-control" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">الكل</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label className="form-label">من تاريخ</label>
            <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          {/* End Date */}
          <div className="form-group">
            <label className="form-label">إلى تاريخ</label>
            <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <button 
          className="btn btn-secondary" 
          style={styles.resetBtn}
          onClick={handleResetFilters}
        >
          <RotateCcw size={16} />
          <span>إعادة تعيين الفلاتر</span>
        </button>
      </div>

      {/* Transactions Table */}
      <div className="table-container">
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>جاري تحميل قائمة المعاملات...</p>
          </div>
        ) : filteredTxns.length === 0 ? (
          <div style={styles.emptyState}>لا توجد معاملات تطابق فلاتر البحث الحالية.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>الوصف / البيان</th>
                <th>الفئة</th>
                <th>النوع</th>
                <th>المبلغ</th>
                <th style={{ width: '80px', textAlign: 'center' }}>العمليات</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((txn) => (
                <tr key={txn.id}>
                  <td style={{ fontWeight: '600' }}>{txn.transaction_date}</td>
                  <td>{txn.description}</td>
                  <td>
                    <span style={styles.categoryBadge}>
                      <Tag size={12} style={{ color: 'var(--accent-color)' }} />
                      <span>{txn.category}</span>
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${txn.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                      {txn.type === 'income' ? (
                        <>
                          <ArrowUpRight size={12} style={{ marginLeft: '4px' }} />
                          دخل
                        </>
                      ) : (
                        <>
                          <ArrowDownRight size={12} style={{ marginLeft: '4px' }} />
                          مصروف
                        </>
                      )}
                    </span>
                  </td>
                  <td style={{
                    fontWeight: '800',
                    fontSize: '1rem',
                    color: txn.type === 'income' ? 'var(--success-color)' : 'var(--text-primary)'
                  }}>
                    {txn.type === 'income' ? '+' : '-'}{txn.amount.toLocaleString()} ر.س
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      style={styles.deleteBtn} 
                      onClick={() => handleDeleteTxn(txn.id)}
                      title="حذف المعاملة"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    marginBottom: '1.5rem',
  },
  addForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  filterTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    right: '12px',
    color: 'var(--text-secondary)',
  },
  resetBtn: {
    marginTop: '0.5rem',
    alignSelf: 'flex-start',
    padding: '0.4rem 0.8rem',
    fontSize: '0.85rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 0',
    gap: '1rem',
  },
  spinner: {
    width: '30px',
    height: '30px',
    border: '3px solid var(--border-color)',
    borderTop: '3px solid var(--accent-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 0',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  categoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--danger-color)',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '4px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  deleteBtnHover: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
  },
};

export default TransactionsPage;
