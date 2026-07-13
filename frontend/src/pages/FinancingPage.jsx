import React, { useState } from 'react';
import { User, Car, Home, GraduationCap, Clock, CheckCircle2, XCircle, ChevronLeft } from 'lucide-react';

const products = [
  { id: 'personal', label: 'تمويل شخصي', icon: User, desc: 'حتى 200,000 ر.س بدون كفيل' },
  { id: 'auto', label: 'تمويل السيارات', icon: Car, desc: 'تمويل حتى 90% من قيمة السيارة' },
  { id: 'home', label: 'التمويل العقاري', icon: Home, desc: 'تمويل يصل إلى 25 سنة' },
];

const statusSteps = ['قيد المراجعة', 'تحت التقييم', 'موافقة نهائية'];

const mockRequests = [
  { id: 1, type: 'تمويل شخصي', amount: 45000, status: 1, date: 'قبل يومين' },
];

const mockHistory = [
  { id: 1, type: 'تمويل سيارة', amount: 90000, date: '2024', status: 'مكتمل' },
];

const tabs = ['تمويل جديد', 'متابعة الطلبات', 'سجل التمويل'];

export default function FinancingPage() {
  const [tab, setTab] = useState(tabs[0]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedProduct || !amount || !term) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedProduct(null);
      setAmount('');
      setTerm('');
      setTab('متابعة الطلبات');
    }, 1500);
  };

  return (
    <div className="fin-page">
      <h1 className="page-title">التمويل</h1>

      <div className="fin-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`fin-tab ${tab === t ? 'active' : ''}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'تمويل جديد' && !selectedProduct && (
        <div className="fin-products-grid">
          {products.map(({ id, label, icon: Icon, desc }) => (
            <button key={id} className="fin-product-card" onClick={() => setSelectedProduct(id)}>
              <div className="fin-product-icon">
                <Icon size={20} />
              </div>
              <p className="fin-product-label">{label}</p>
              <p className="fin-product-desc">{desc}</p>
            </button>
          ))}
        </div>
      )}

      {tab === 'تمويل جديد' && selectedProduct && !submitted && (
        <div className="fin-form-card">
          <p className="fin-form-title">
            {products.find((p) => p.id === selectedProduct)?.label}
          </p>
          <div className="input-group">
            <label className="input-label">المبلغ المطلوب (ر.س)</label>
            <input
              type="number"
              className="input-field"
              placeholder="مثال: 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">مدة السداد (شهر)</label>
            <input
              type="number"
              className="input-field"
              placeholder="مثال: 36"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
          <div className="fin-form-actions">
            <button className="btn btn-secondary" onClick={() => setSelectedProduct(null)}>
              رجوع
            </button>
            <button className="btn btn-primary fin-submit-btn" onClick={handleSubmit}>
              إرسال الطلب
            </button>
          </div>
        </div>
      )}

      {tab === 'تمويل جديد' && submitted && (
        <div className="fin-success-card">
          <CheckCircle2 size={36} color="#16a34a" />
          <p>تم إرسال طلبك بنجاح، راح تقدر تتابعه من "متابعة الطلبات"</p>
        </div>
      )}

      {tab === 'متابعة الطلبات' && (
        <div className="fin-requests-list">
          {mockRequests.map((r) => (
            <div key={r.id} className="fin-request-card">
              <div className="fin-request-header">
                <span className="fin-request-type">{r.type}</span>
                <span className="fin-request-amount">{r.amount.toLocaleString()} ر.س</span>
              </div>
              <div className="fin-status-track">
                {statusSteps.map((step, i) => (
                  <div key={step} className={`fin-status-step ${i <= r.status ? 'done' : ''}`}>
                    <div className="fin-status-dot" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <p className="fin-request-date">
                <Clock size={12} /> {r.date}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === 'سجل التمويل' && (
        <div className="fin-history-list">
          {mockHistory.map((h) => (
            <div key={h.id} className="fin-history-item">
              <div className="fin-history-icon">
                <CheckCircle2 size={16} color="#16a34a" />
              </div>
              <div className="fin-history-info">
                <p className="fin-history-type">{h.type}</p>
                <p className="fin-history-date">{h.date}</p>
              </div>
              <p className="fin-history-amount">{h.amount.toLocaleString()} ر.س</p>
              <ChevronLeft size={14} color="var(--text-secondary)" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}