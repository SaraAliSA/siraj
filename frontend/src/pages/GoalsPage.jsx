import React, { useState } from 'react';
import { X, Sparkles, Calendar, Plus } from 'lucide-react';

const templates = [
  { id: 'hajj', label: 'حج', emoji: '🕋', suggestedAmount: 15000 },
  { id: 'umrah', label: 'عمرة', emoji: '🌙', suggestedAmount: 6000 },
  { id: 'marriage', label: 'زواج', emoji: '💍', suggestedAmount: 50000 },
  { id: 'travel', label: 'سفر', emoji: '✈️', suggestedAmount: 10000 },
  { id: 'ramadan', label: 'رمضان', emoji: '🌙', suggestedAmount: 3000 },
  { id: 'eid', label: 'العيد', emoji: '🎉', suggestedAmount: 2000 },
  { id: 'school', label: 'مدارس', emoji: '🎒', suggestedAmount: 4000 },
];

const activeGoals = [
  { id: 1, name: 'عمرة رمضان', target: 6000, saved: 2400, emoji: '🌙' },
  { id: 2, name: 'مصاريف المدارس', target: 4000, saved: 3600, emoji: '🎒' },
];

const timeline = [
  { event: 'رمضان', date: '18 فبراير 2027' },
  { event: 'عيد الفطر', date: '20 مارس 2027' },
  { event: 'موسم الحج', date: '2 يونيو 2027' },
  { event: 'بداية العام الدراسي', date: '24 أغسطس 2026' },
];

export default function GoalsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customMode, setCustomMode] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [aiPlan, setAiPlan] = useState(null);

  const openTemplate = (t) => {
    setSelectedTemplate(t);
    setGoalName(t.label);
    setGoalAmount(t.suggestedAmount.toString());
    setAiPlan(null);
  };

  const generatePlan = () => {
    const amount = Number(goalAmount) || 0;
    const months = 6;
    setAiPlan({
      monthly: Math.round(amount / months),
      months,
      tip: `بناءً على وضعك المالي الحالي، ادخار ${Math.round(amount / months).toLocaleString()} ر.س شهريًا لمدة ${months} أشهر يحقق هدفك بدون ضغط على ميزانيتك.`,
    });
  };

  const closeModal = () => {
    setSelectedTemplate(null);
    setCustomMode(false);
    setGoalName('');
    setGoalAmount('');
    setAiPlan(null);
  };

  return (
    <div className="fin-page">
      <div className="section-header" style={{ marginTop: 0 }}>
        <button className="savings-add-btn" onClick={() => setCustomMode(true)}>
          <Plus size={16} /> هدف مخصص
        </button>
        <h1 className="page-title">الأهداف المالية</h1>
      </div>

      {activeGoals.length > 0 && (
        <div className="savings-plans-list">
          {activeGoals.map((g) => {
            const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
            return (
              <div key={g.id} className="savings-goal-card">
                <div className="savings-goal-header">
                  <span>{g.emoji} {g.name}</span>
                  <span className="savings-goal-percent">{pct}%</span>
                </div>
                <div className="savings-goal-bar">
                  <div className="savings-goal-fill" style={{ width: `${pct}%` }} />
                </div>
                <p className="savings-goal-detail">
                  {g.saved.toLocaleString()} من {g.target.toLocaleString()} ر.س
                </p>
              </div>
            );
          })}
        </div>
      )}

      <p className="section-title" style={{ marginTop: '0.25rem' }}>قوالب جاهزة</p>
      <div className="goals-templates-grid">
        {templates.map((t) => (
          <button key={t.id} className="goal-template-card" onClick={() => openTemplate(t)}>
            <span className="goal-template-emoji">{t.emoji}</span>
            <span className="goal-template-label">{t.label}</span>
          </button>
        ))}
      </div>

      <p className="section-title" style={{ marginTop: '0.25rem' }}>مناسبات قادمة</p>
      <div className="chart-card">
        <div className="goals-timeline">
          {timeline.map((item, i) => (
            <div key={i} className="goals-timeline-item">
              <div className="goals-timeline-dot" />
              <div className="goals-timeline-info">
                <span className="goals-timeline-event">{item.event}</span>
                <span className="goals-timeline-date">
                  <Calendar size={11} /> {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(selectedTemplate || customMode) && (
        <div className="drawer-overlay" onClick={closeModal}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-handle"></div>
              <h3 className="drawer-title">
                {selectedTemplate ? `${selectedTemplate.emoji} هدف ${selectedTemplate.label}` : 'هدف مخصص جديد'}
              </h3>
            </div>

            <div className="input-group">
              <label className="input-label">اسم الهدف</label>
              <input
                className="input-field"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="مثال: رحلة العائلة"
              />
            </div>
            <div className="input-group">
              <label className="input-label">المبلغ المستهدف (ر.س)</label>
              <input
                type="number"
                className="input-field"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="مثال: 10000"
              />
            </div>

            {!aiPlan ? (
              <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} onClick={generatePlan}>
                <Sparkles size={15} /> أنشئ لي خطة بالذكاء الاصطناعي
              </button>
            ) : (
              <div className="tip-card" style={{ marginBottom: '1rem' }}>
                <div className="tip-header">
                  <Sparkles size={15} />
                  <span>خطة سراج المقترحة</span>
                </div>
                <p className="tip-text">{aiPlan.tip}</p>
              </div>
            )}

            <div className="fin-form-actions">
              <button className="btn btn-secondary" onClick={closeModal}>
                <X size={15} /> إلغاء
              </button>
              <button className="btn btn-primary fin-submit-btn" onClick={closeModal}>
                إنشاء الهدف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}