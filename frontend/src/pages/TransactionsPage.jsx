import React, { useState } from 'react';
import { Plus, X, Search, Utensils, Zap, Car, ShoppingBag, ArrowDownLeft, Home, Trash2 } from 'lucide-react';

const categoryIcons = {
  طعام: Utensils,
  فواتير: Zap,
  مواصلات: Car,
  تسوق: ShoppingBag,
  دخل: ArrowDownLeft,
  سكن: Home,
};

const initialTransactions = [
  { id: 1, name: 'مطعم البيك', category: 'طعام', amount: -85, date: '2026-07-12' },
  { id: 2, name: 'فاتورة الكهرباء', category: 'فواتير', amount: -420, date: '2026-07-11' },
  { id: 3, name: 'راتب شهري', category: 'دخل', amount: 8200, date: '2026-07-09' },
  { id: 4, name: 'محطة وقود', category: 'مواصلات', amount: -150, date: '2026-07-08' },
  { id: 5, name: 'إيجار الشقة', category: 'سكن', amount: -4200, date: '2026-07-01' },
  { id: 6, name: 'تسوق أونلاين', category: 'تسوق', amount: -310, date: '2026-07-05' },
];

const filters = ['الكل', 'دخل', 'مصروفات'];

function groupByDate(list) {
  const groups = {};
  list.forEach((t) => {
    const label = new Date(t.date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' });
    if (!groups[label]) groups[label] = [];
    groups[label].push(t);
  });
  return groups;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [filter, setFilter] = useState('الكل');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('طعام');

  const filtered = transactions
    .filter((t) => {
      if (filter === 'دخل') return t.amount > 0;
      if (filter === 'مصروفات') return t.amount < 0;
      return true;
    })
    .filter((t) => t.name.includes(search));

  const grouped = groupByDate(filtered);

  const addTransaction = () => {
    if (!name || !amount) return;
    setTransactions([
      {
        id: Date.now(),
        name,
        category,
        amount: category === 'دخل' ? Number(amount) : -Number(amount),
        date: new Date().toISOString(),
      },
      ...transactions,
    ]);
    setName('');
    setAmount('');
    setShowForm(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };
  return (
    <div className="fin-page">
      <div className="section-header" style={{ marginTop: 0 }}>
        <h1 className="page-title">المعاملات</h1>
        <button className="savings-add-btn" onClick={() => setShowForm(true)}>
          <Plus size={16} /> إضافة معاملة
        </button>
      </div>

      <div className="txn-search-box">
        <Search size={16} color="var(--text-secondary)" />
        <input
          className="txn-search-input"
          placeholder="ابحث عن معاملة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="fin-tabs">
        {filters.map((f) => (
          <button
            key={f}
            className={`fin-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <p className="txn-date-header">{date}</p>
          <div className="chart-card">
            <div className="transaction-list">
              {items.map((t) => {
                const Icon = categoryIcons[t.category] || ShoppingBag;
                return (
                  <div key={t.id} className="transaction-item">
                    <div className="transaction-icon">
                      <Icon size={16} />
                    </div>
                    <div className="transaction-info">
                      <p className="transaction-name">{t.name}</p>
                      <p className="transaction-date">{t.category}</p>
                    </div>
                    <p className={`transaction-amount ${t.amount > 0 ? 'positive' : ''}`}>
                      {t.amount > 0 ? '+' : ''}
                      {t.amount.toLocaleString()} ر.س
                    </p>
                    <button className="transaction-delete-btn" onClick={() => deleteTransaction(t.id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {showForm && (
        <div className="drawer-overlay" onClick={() => setShowForm(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-handle"></div>
              <h3 className="drawer-title">إضافة معاملة جديدة</h3>
            </div>

            <div className="input-group">
              <label className="input-label">اسم المعاملة</label>
              <input
                className="input-field"
                placeholder="مثال: مطعم، فاتورة..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">المبلغ (ر.س)</label>
              <input
                type="number"
                className="input-field"
                placeholder="مثال: 150"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">الفئة</label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.keys(categoryIcons).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="fin-form-actions">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
                <X size={15} /> إلغاء
              </button>
              <button className="btn btn-primary fin-submit-btn" onClick={addTransaction}>
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}