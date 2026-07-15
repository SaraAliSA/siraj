import React, { useState } from 'react';
import { Plus, X, PartyPopper, Calendar, Edit3 } from 'lucide-react';
import useSavings from '../hooks/useSavings';

export default function SavingsPage() {
  const { plans, addPlan, updateProgress, fetchPlanProgress, loading } = useSavings();
  const [showForm, setShowForm] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [newProgressVal, setNewProgressVal] = useState('');
  const [celebrate, setCelebrate] = useState(null);

  // Create Plan state
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [months, setMonths] = useState('');

  const handleAddPlan = async (e) => {
    e.preventDefault();
    if (!name || !target) return;
    const res = await addPlan(name, target, months);
    if (res.success) {
      setName('');
      setTarget('');
      setMonths('');
      setShowForm(false);
    } else {
      alert("فشل إنشاء الحصالة: " + res.error);
    }
  };

  const handleOpenProgress = async (plan) => {
    setSelectedPlan(plan);
    setNewProgressVal(plan.current_amount);
    setShowProgressModal(true);
    setSelectedProgress(null);

    const res = await fetchPlanProgress(plan.id);
    if (res.success) {
      setSelectedProgress(res.data);
    }
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    const res = await updateProgress(selectedPlan.id, newProgressVal);
    if (res.success) {
      const pct = Math.min(100, Math.round((Number(newProgressVal) / selectedPlan.target_amount) * 100));
      if (pct >= 100) {
        setCelebrate(selectedPlan.id);
      }
      setShowProgressModal(false);
      setSelectedPlan(null);
      setSelectedProgress(null);
    } else {
      alert("فشل تحديث المبلغ: " + res.error);
    }
  };

  return (
    <div className="fin-page">
      <div className="section-header" style={{ marginTop: 0 }}>
        <h1 className="page-title">الادخار</h1>
        <button className="savings-add-btn" onClick={() => setShowForm(true)}>
          <Plus size={16} /> حصالة جديدة
        </button>
      </div>

      {loading && plans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          جاري تحميل حصالاتك الادخارية...
        </div>
      ) : (
        <div className="savings-plans-list">
          {plans.map((plan) => {
            const saved = plan.current_amount || 0;
            const target = plan.target_amount || 1;
            const pct = Math.min(100, Math.round((saved / target) * 100));
            const complete = pct >= 100;
            return (
              <div 
                key={plan.id} 
                className="savings-goal-card" 
                onClick={() => handleOpenProgress(plan)}
                style={{ cursor: 'pointer' }}
              >
                <div className="savings-goal-header">
                  <span>{plan.goal_name}</span>
                  <span className="savings-goal-percent">{pct}%</span>
                </div>
                <div className="savings-goal-bar">
                  <div className="savings-goal-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="savings-goal-footer">
                  <p className="savings-goal-detail">
                    {saved.toLocaleString()} من {target.toLocaleString()} ر.س
                  </p>
                  {complete ? (
                    <button 
                      className="savings-celebrate-btn" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setCelebrate(plan.id); 
                      }}
                    >
                      <PartyPopper size={13} /> تم تحقيق الهدف!
                    </button>
                  ) : (
                    <p className="savings-next-contribution">
                      <Calendar size={12} /> القسط شهرياً {(plan.monthly_contribution || 0).toLocaleString()} ر.س — مستهدف في: {plan.target_date}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Plan Drawer */}
      {showForm && (
        <div className="drawer-overlay" onClick={() => setShowForm(false)}>
          <form className="drawer-content" onClick={(e) => e.stopPropagation()} onSubmit={handleAddPlan}>
            <div className="drawer-header">
              <div className="drawer-handle"></div>
              <h3 className="drawer-title">إنشاء حصالة جديدة</h3>
            </div>

            <div className="input-group">
              <label className="input-label">اسم الهدف</label>
              <input
                required
                className="input-field"
                placeholder="مثال: رحلة السفر"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">المبلغ المستهدف (ر.س)</label>
              <input
                required
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
                required
                type="number"
                className="input-field"
                placeholder="مثال: 12"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
              />
            </div>

            <div className="fin-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                <X size={15} /> إلغاء
              </button>
              <button type="submit" className="btn btn-primary fin-submit-btn">
                إنشاء الحصالة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Update Progress & Details Drawer */}
      {showProgressModal && selectedPlan && (
        <div className="drawer-overlay" onClick={() => { setShowProgressModal(false); setSelectedPlan(null); setSelectedProgress(null); }}>
          <form className="drawer-content" onClick={(e) => e.stopPropagation()} onSubmit={handleUpdateProgress}>
            <div className="drawer-header">
              <div className="drawer-handle"></div>
              <h3 className="drawer-title">تفاصيل وتحديث الحصالة</h3>
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{selectedPlan.goal_name}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>الهدف الإجمالي: {selectedPlan.target_amount.toLocaleString()} ر.س</span>
            </div>

            {selectedProgress && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', backgroundColor: 'rgba(var(--primary-rgb), 0.03)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>الشهور المتبقية</span>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{selectedProgress.months_remaining} شهر</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>الالتزام بالخطة</span>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: selectedProgress.on_track ? 'var(--success-color)' : 'var(--danger-color)' }}>
                    {selectedProgress.on_track ? 'مستمر بنجاح' : 'متأخر عن الخطة'}
                  </span>
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">المبلغ المدخر حالياً (ر.س)</label>
              <input
                required
                type="number"
                className="input-field"
                value={newProgressVal}
                onChange={(e) => setNewProgressVal(e.target.value)}
              />
            </div>

            <div className="fin-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => { setShowProgressModal(false); setSelectedPlan(null); setSelectedProgress(null); }}>
                <X size={15} /> إغلاق
              </button>
              <button type="submit" className="btn btn-primary fin-submit-btn">
                <Edit3 size={14} /> تحديث الرصيد
              </button>
            </div>
          </form>
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
              حققت هدف "{plans.find((p) => p.id === celebrate)?.goal_name}" بنجاح
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