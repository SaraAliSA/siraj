import React, { useState } from 'react';
import { Plus, X, PartyPopper, Calendar } from 'lucide-react';

const initialPlans = [
  { id: 1, name: 'رحلة العمرة', target: 20000, saved: 13600, monthly: 1200, months: 6, nextDate: '1 أغسطس' },
  { id: 2, name: 'سيارة جديدة', target: 40000, saved: 12500, monthly: 2200, months: 18, nextDate: '5 أغسطس' },
  { id: 3, name: 'صندوق الطوارئ', target: 15000, saved: 15000, monthly: 500, months: 0, nextDate: null },
];

export default function SavingsPage() {
  const [plans, setPlans] = useState(initialPlans);
  const [showForm, setShowForm] = useState(false);
  const [celebrate, setCelebrate] = useState(null);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [months, setMonths] = useState('');

  const addPlan = () => {
    if (!name || !target) return;
    setPlans([
      ...plans,
      {
        id: Date.now(),
        name,
        target: Number(target),
        saved: 0,
        monthly: Math.round(Number(target) / (Number(months) || 12)),
        months: Number(months) || 12,
        nextDate: 'الشهر القادم',
      },
    ]);
    setName('');
    setTarget('');
    setMonths('');
    setShowForm(false);
  };

  return (
    <div className="fin-page">
      <div className="section-header" style={{ marginTop: 0 }}>
               <h1 className="page-title">الادخار</h1>
 <button className="savings-add-btn" onClick={() => setShowForm(true)}>
          <Plus size={16} /> حصالة جديدة
        </button>
      </div>

      <div className="savings-plans-list">
        {plans.map((plan) => {
          const pct = Math.min(100, Math.round((plan.saved / plan.target) * 100));
          const complete = pct >= 100;
          return (
            <div key={plan.id} className="savings-goal-card">
              <div className="savings-goal-header">
              <span>{plan.name}</span>
              <span className="savings-goal-percent">{pct}%</span>
              </div>
              <div className="savings-goal-bar">
                <div className="savings-goal-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="savings-goal-footer">
                <p className="savings-goal-detail">
                  {plan.saved.toLocaleString()} من {plan.target.toLocaleString()} ر.س
                </p>
                {complete ? (
                  <button className="savings-celebrate-btn" onClick={() => setCelebrate(plan.id)}>
                    <PartyPopper size={13} /> تم تحقيق الهدف!
                  </button>
                ) : (
                  <p className="savings-next-contribution">
                    <Calendar size={12} /> القسط القادم {plan.monthly.toLocaleString()} ر.س — {plan.nextDate}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Plan Drawer */}
      {showForm && (
        <div className="drawer-overlay" onClick={() => setShowForm(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-handle"></div>
              <h3 className="drawer-title">إنشاء حصالة جديدة</h3>
            </div>

            <div className="input-group">
              <label className="input-label">اسم الهدف</label>
              <input
                className="input-field"
                placeholder="مثال: رحلة السفر"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">المبلغ المستهدف (ر.س)</label>
              <input
                type="number"
                className="input-field"
                placeholder="مثال: 15000"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">المدة (بالأشهر)</label>
              <input
                type="number"
                className="input-field"
                placeholder="مثال: 12"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
              />
            </div>

            <div className="fin-form-actions">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
                <X size={15} /> إلغاء
              </button>
              <button className="btn btn-primary fin-submit-btn" onClick={addPlan}>
                إنشاء الحصالة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Overlay */}
      {celebrate && (
        <div className="celebrate-overlay" onClick={() => setCelebrate(null)}>
          <div className="celebrate-card">
            <div className="celebrate-icon">
              <PartyPopper size={40} />
            </div>
            <p className="celebrate-title">مبروك! 🎉</p>
            <p className="celebrate-text">
              حققت هدف "{plans.find((p) => p.id === celebrate)?.name}" بنجاح
            </p>
            <button className="btn btn-primary" onClick={() => setCelebrate(null)}>
              رائع!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}