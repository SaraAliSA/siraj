import React from 'react';
import { ShoppingBag, Zap, Car, Utensils, ArrowDownLeft } from 'lucide-react';

const transactions = [
  { name: 'مطعم البيك', amount: -85, date: 'اليوم', icon: Utensils },
  { name: 'فاتورة الكهرباء', amount: -420, date: 'أمس', icon: Zap },
  { name: 'راتب شهري', amount: 8200, date: 'قبل 3 أيام', icon: ArrowDownLeft },
  { name: 'محطة وقود', amount: -150, date: 'قبل 4 أيام', icon: Car },
  { name: 'تسوق أونلاين', amount: -310, date: 'الأسبوع الماضي', icon: ShoppingBag },
];

export default function RecentTransactions() {
  return (
    <div className="chart-card">
  <div className="section-header" style={{ marginTop: 0, marginBottom: 10 }}>
    <h2 className="chart-title" style={{ marginBottom: 0 }}>آخر المعاملات</h2>
    <span className="section-view-all">عرض الكل</span>
  </div>

  <div className="transaction-list">
        {transactions.map((t, i) => (
          <div key={i} className="transaction-item">
            <div className="transaction-icon">
              <t.icon size={16} />
            </div>
            <div className="transaction-info">
              <p className="transaction-name">{t.name}</p>
              <p className="transaction-date">{t.date}</p>
            </div>
            <p className={`transaction-amount ${t.amount > 0 ? 'positive' : ''}`}>
              {t.amount > 0 ? '+' : ''}
              {t.amount.toLocaleString()} ر.س
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}