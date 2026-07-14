import React from 'react';
import { Link } from 'react-router-dom';

const data = [
  { name: 'سكن', amount: 4200, max: 4200 },
  { name: 'طعام', amount: 2400, max: 4200 },
  { name: 'مواصلات', amount: 1350, max: 4200 },
  { name: 'ترفيه', amount: 900, max: 4200 },
  { name: 'فواتير', amount: 720, max: 4200 },
];

export default function TopExpensesBar() {
  return (
    <div className="chart-card">
    <div className="section-header"> 
    <h2 className="section-title">أعلى 5 مصروفات</h2>
  < Link to="/transactions" className="section-view-all">التفاصيل</Link>
</div>
      <div className="expense-bar-list">
        {data.map((item) => (
          <div key={item.name} className="expense-bar-row">
            <div className="expense-bar-info">
              <span className="expense-bar-value">{item.amount.toLocaleString()} ر.س</span>
              <span className="expense-bar-label">{item.name}</span>
            </div>
            <div className="expense-bar-track">
              <div
                className="expense-bar-fill"
                style={{ width: `${(item.amount / item.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}