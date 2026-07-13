import React, { useState } from 'react';
import { TrendingUp, Sparkles, X, Check } from 'lucide-react';

const portfolio = {
  total: 62900,
  profit: 3120,
  profitPercent: 5.2,
};

const opportunities = [
  { id: 1, name: 'صندوق نماء المتوازن', type: 'صندوق استثماري', risk: 'low', expectedReturn: '6-8%', min: 1000 },
  { id: 2, name: 'صكوك التمويل الإسلامي', type: 'صكوك', risk: 'low', expectedReturn: '5-6%', min: 5000 },
  { id: 3, name: 'صندوق الأسهم السعودية', type: 'صندوق استثماري', risk: 'medium', expectedReturn: '9-13%', min: 2000 },
  { id: 4, name: 'طرح أولي - شركة تقنية', type: 'IPO', risk: 'high', expectedReturn: '15-25%', min: 10000 },
];

const riskConfig = {
  low: { label: 'منخفضة', color: '#16a34a' },
  medium: { label: 'متوسطة', color: '#d97706' },
  high: { label: 'مرتفعة', color: '#dc2626' },
};

const recommendation = {
  title: 'صندوق نماء المتوازن',
  reason: 'بناءً على تحليل وضعك المالي ونسبة ادخارك الشهرية، هذا الصندوق يناسب أهدافك على المدى المتوسط بمخاطرة منخفضة ونمو مستقر.',
};

export default function InvestmentPage() {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!amount) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelected(null);
      setAmount('');
    }, 1500);
  };

  return (
    <div className="fin-page">
      <h1 className="page-title">الاستثمار</h1>

      {/* Portfolio Summary */}
      <div className="balance-card">
        <p className="balance-label">إجمالي محفظتك الاستثمارية</p>
        <p className="balance-value">
          {portfolio.total.toLocaleString()} <span className="balance-unit">ر.س</span>
        </p>
        <span className="balance-trend">
          <TrendingUp size={13} /> +{portfolio.profit.toLocaleString()} ر.س ({portfolio.profitPercent}%)
        </span>
      </div>

      {/* AI Recommendation */}
      <div className="tip-card">
        <div className="tip-header">
          <Sparkles size={16} />
          <span>توصية سراج الذكية</span>
        </div>
        <p className="tip-text">
          <strong>{recommendation.title}</strong> — {recommendation.reason}
        </p>
      </div>

      {/* Opportunities */}
      <div className="section-header">
            <h2 className="section-title">فرص استثمارية</h2>
            <span className="section-view-all">عرض الكل</span>
      </div>

      <div className="invest-list">
        {opportunities.map((op) => (
          <button key={op.id} className="invest-card" onClick={() => setSelected(op)}>
            <div className="invest-card-top">
              <span
                className="invest-risk-badge"
                style={{ color: riskConfig[op.risk].color, background: `${riskConfig[op.risk].color}1a` }}
              >
                مخاطرة {riskConfig[op.risk].label}
              </span>
              <span className="invest-type">{op.type}</span>
            </div>
            <p className="invest-name">{op.name}</p>
            <div className="invest-card-bottom">
              <span className="invest-return">عائد متوقع {op.expectedReturn}</span>
              <span className="invest-min">حد أدنى {op.min.toLocaleString()} ر.س</span>
            </div>
          </button>
        ))}
      </div>

      {/* Investment Request Modal (Drawer style) */}
      {selected && (
        <div className="drawer-overlay" onClick={() => setSelected(null)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-handle"></div>
              <h3 className="drawer-title">{selected.name}</h3>
            </div>

            {!submitted ? (
              <>
                <div className="input-group">
                  <label className="input-label">مبلغ الاستثمار (ر.س)</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder={`الحد الأدنى ${selected.min.toLocaleString()} ر.س`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="fin-form-actions">
                  <button className="btn btn-secondary" onClick={() => setSelected(null)}>
                    <X size={15} /> إلغاء
                  </button>
                  <button className="btn btn-primary fin-submit-btn" onClick={handleSubmit}>
                    <Check size={15} /> تأكيد الاستثمار
                  </button>
                </div>
              </>
            ) : (
              <div className="fin-success-card">
                <Check size={32} color="#16a34a" />
                <p>تم إرسال طلب الاستثمار بنجاح</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}