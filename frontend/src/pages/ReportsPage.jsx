import React, { useState } from 'react';
import { Download, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';

const periods = ['هذا الشهر', 'الشهر الماضي', 'آخر 3 أشهر'];

const dataByPeriod = {
  'هذا الشهر': {
    summary: { income: 18540, expenses: 11280 },
    categoryBreakdown: [
      { name: 'سكن', amount: 4200, percent: 35, color: '#e8734f' },
      { name: 'طعام', amount: 2400, percent: 20, color: '#f0997b' },
      { name: 'مواصلات', amount: 1350, percent: 15, color: '#6b7280' },
      { name: 'ترفيه', amount: 900, percent: 12, color: '#9ca3af' },
      { name: 'فواتير', amount: 720, percent: 10, color: '#4b5563' },
      { name: 'أخرى', amount: 480, percent: 8, color: '#374151' },
    ],
  },
  'الشهر الماضي': {
    summary: { income: 17200, expenses: 12650 },
    categoryBreakdown: [
      { name: 'سكن', amount: 4200, percent: 33, color: '#e8734f' },
      { name: 'طعام', amount: 2900, percent: 23, color: '#f0997b' },
      { name: 'مواصلات', amount: 1600, percent: 13, color: '#6b7280' },
      { name: 'ترفيه', amount: 1450, percent: 11, color: '#9ca3af' },
      { name: 'فواتير', amount: 1200, percent: 10, color: '#4b5563' },
      { name: 'أخرى', amount: 1300, percent: 10, color: '#374151' },
    ],
  },
  'آخر 3 أشهر': {
    summary: { income: 54600, expenses: 34870 },
    categoryBreakdown: [
      { name: 'سكن', amount: 12600, percent: 36, color: '#e8734f' },
      { name: 'طعام', amount: 7800, percent: 22, color: '#f0997b' },
      { name: 'مواصلات', amount: 4200, percent: 12, color: '#6b7280' },
      { name: 'ترفيه', amount: 3900, percent: 11, color: '#9ca3af' },
      { name: 'فواتير', amount: 3170, percent: 9, color: '#4b5563' },
      { name: 'أخرى', amount: 3200, percent: 9, color: '#374151' },
    ],
  },
};

export default function ReportsPage() {
  const [period, setPeriod] = useState(periods[0]);
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  const { summary, categoryBreakdown } = dataByPeriod[period];
  const netFlow = summary.income - summary.expenses;

  return (
    <div className="fin-page">
      <div className="section-header" style={{ marginTop: 0 }}>
              <h1 className="page-title">التقارير</h1>
  <button className="alerts-icon-btn" style={{ width: 'auto', padding: '0 12px', borderRadius: 20 }}>
          <Download size={15} />
        </button>
      </div>

      <div className="reports-period-selector">
        <button className="reports-period-btn" onClick={() => setShowPeriodMenu(!showPeriodMenu)}>
          <span>{period}</span>
          <ChevronDown size={15} />
        </button>
        {showPeriodMenu && (
          <div className="reports-period-menu">
            {periods.map((p) => (
              <button
                key={p}
                className={`reports-period-option ${p === period ? 'active' : ''}`}
                onClick={() => {
                  setPeriod(p);
                  setShowPeriodMenu(false);
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="reports-summary-row">
        <div className="reports-summary-card">
          <div className="reports-summary-icon income">
            <TrendingUp size={16} />
          </div>
          <p className="reports-summary-label">الدخل</p>
          <p className="reports-summary-value">{summary.income.toLocaleString()} ر.س</p>
        </div>
        <div className="reports-summary-card">
          <div className="reports-summary-icon expense">
            <TrendingDown size={16} />
          </div>
          <p className="reports-summary-label">المصروفات</p>
          <p className="reports-summary-value">{summary.expenses.toLocaleString()} ر.س</p>
        </div>
      </div>

      <div className="chart-card">
        <p className="chart-title">صافي التدفق النقدي</p>
        <div className="reports-flow-bar">
          <div
            className="reports-flow-fill income"
            style={{ width: `${(summary.income / (summary.income + summary.expenses)) * 100}%` }}
          />
        </div>
        <div className="reports-flow-labels">
          <span className="reports-flow-label income">
            دخل {Math.round((summary.income / (summary.income + summary.expenses)) * 100)}%
          </span>
          <span className="reports-flow-label expense">
            مصروفات {Math.round((summary.expenses / (summary.income + summary.expenses)) * 100)}%
          </span>
        </div>
        <p className="reports-net-value">
          صافي الادخار: <strong>{netFlow.toLocaleString()} ر.س</strong>
        </p>
      </div>

      <div className="chart-card">
        <p className="chart-title">تفصيل المصروفات حسب الفئة</p>
        <div className="reports-category-list">
          {categoryBreakdown.map((c) => (
            <div key={c.name} className="reports-category-row">
              <div className="reports-category-info">
                <span className="reports-category-dot" style={{ backgroundColor: c.color }} />
                <span className="reports-category-name">{c.name}</span>
              </div>
              <span className="reports-category-amount">{c.amount.toLocaleString()} ر.س</span>
              <span className="reports-category-percent">{c.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: '100%' }}>
        <Download size={15} /> تصدير التقرير (PDF)
      </button>
    </div>
  );
}