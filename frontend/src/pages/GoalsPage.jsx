import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Target, Sparkles, Plus, Calendar, Coins, ArrowRight, Brain, AlertCircle, Compass } from 'lucide-react';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Goal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [goalType, setGoalType] = useState('umrah');
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  // AI Plan Viewer state
  const [activePlan, setActivePlan] = useState(null);
  const [generatingPlanId, setGeneratingPlanId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const gRes = await client.get('/goals/');
      setGoals(gRes.data);

      const tRes = await client.get('/goals/templates');
      setTemplates(tRes.data);
    } catch (err) {
      console.error("Failed to load goals data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      await client.post('/goals/', {
        goal_type: goalType,
        title: title,
        target_amount: parseFloat(targetAmount),
        saved_amount: parseFloat(savedAmount || 0),
        target_date: targetDate
      });
      setShowCreateModal(false);
      setTitle('');
      setTargetAmount('');
      setSavedAmount('');
      setTargetDate('');
      fetchData();
    } catch (err) {
      alert("فشل إنشاء الهدف: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleGenerateAIPlan = async (goalId) => {
    setGeneratingPlanId(goalId);
    try {
      const res = await client.post(`/goals/${goalId}/plan`);
      // Update the local list
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, plan_details: res.data.plan_details } : g));
      setActivePlan(res.data.plan_details);
    } catch (err) {
      alert("فشل توليد الخطة الذكية: " + (err.response?.data?.detail || err.message));
    } finally {
      setGeneratingPlanId(null);
    }
  };

  const getGoalTypeLabel = (type) => {
    switch (type) {
      case 'hajj': return 'حج';
      case 'umrah': return 'عمرة';
      case 'marriage': return 'زواج';
      case 'travel': return 'سفر سياحي';
      case 'ramadan': return 'تحضيرات رمضان';
      case 'eid': return 'تحضيرات العيد';
      case 'school': return 'العودة للمدارس';
      default: return 'هدف مخصص';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2>التخطيط للأهداف الموسمية والشخصية</h2>
          <p style={{ color: 'var(--text-secondary)' }}>خطط لمناسباتك الكبرى بشكل مسبق. أنشئ هدفاً واستخدم الذكاء الاصطناعي لتوزيع ادخاراتك بكفاءة.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          <span>إضافة هدف جديد</span>
        </button>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>جاري تحميل الأهداف والخطط الذكية...</p>
        </div>
      ) : (
        <>
          {/* Templates Grid */}
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>قوالب جاهزة لأهدافك الموسمية</h3>
          <div style={styles.templatesContainer}>
            {templates.map((tpl) => (
              <button 
                key={tpl.goal_type} 
                style={styles.templateBtn}
                onClick={() => {
                  setGoalType(tpl.goal_type);
                  setTitle(tpl.title || '');
                  setTargetAmount(tpl.default_target_amount || 0);
                  // set default date to 6 months from now
                  const futureDate = new Date();
                  futureDate.setMonth(futureDate.getMonth() + 6);
                  setTargetDate(futureDate.toISOString().split('T')[0]);
                  setShowCreateModal(true);
                }}
              >
                <Compass size={18} style={{ color: 'var(--accent-color)' }} />
                <div style={{ textAlign: 'right' }}>
                  <span style={styles.tplTitle}>{tpl.title}</span>
                  <span style={styles.tplSub}>مقترح: {(tpl.default_target_amount || 0).toLocaleString()} ر.س</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Goals list */}
          <h3 style={{ fontSize: '1.15rem', marginTop: '2.5rem', marginBottom: '1rem' }}>الأهداف المخطط لها حالياً</h3>
          {goals.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <Target size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3>لا توجد أهداف نشطة حالياً</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.5rem auto 1.5rem auto' }}>
                قم باختيار أحد القوالب الموسمية أعلاه أو اضغط "إضافة هدف جديد" للبدء بالتخطيط الذكي لمستقبلك.
              </p>
            </div>
          ) : (
            <div style={styles.goalsGrid}>
              {goals.map((goal) => {
                const progressPct = Math.min(100, Math.max(0, (goal.saved_amount / goal.target_amount) * 100));
                return (
                  <div key={goal.id} className="card" style={styles.goalCard}>
                    <div style={styles.goalHeader}>
                      <div style={styles.goalTypeIcon}>
                        <Target size={20} color="var(--accent-color)" />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{goal.title}</h4>
                        <span style={styles.goalTypeBadge}>{getGoalTypeLabel(goal.goal_type)}</span>
                      </div>
                    </div>

                    <div style={styles.progressSection}>
                      <div style={styles.progressBarBg}>
                        <div style={{ ...styles.progressBarFill, width: `${progressPct}%` }}></div>
                      </div>
                      <div style={styles.progressText}>
                        <span>مجموع المدخر: {goal.saved_amount.toLocaleString()} ر.س</span>
                        <span>المستهدف: {goal.target_amount.toLocaleString()} ر.س</span>
                      </div>
                    </div>

                    <div style={styles.metaRow}>
                      <div style={styles.metaItem}>
                        <Calendar size={14} />
                        <span>المهلة: {goal.target_date}</span>
                      </div>
                      <div style={styles.metaItem}>
                        <Coins size={14} />
                        <span>نسبة الإنجاز: {progressPct.toFixed(0)}%</span>
                      </div>
                    </div>

                    {/* AI Plan action or display */}
                    <div style={styles.aiSection}>
                      {goal.plan_details ? (
                        <div style={styles.planDetailsWrapper}>
                          <div style={styles.planDetailsHeader}>
                            <Sparkles size={14} color="var(--accent-color)" />
                            <span>خطة سراج الذكية مجهزة</span>
                          </div>
                          <button 
                            className="btn btn-secondary" 
                            style={styles.viewPlanBtn}
                            onClick={() => setActivePlan(goal.plan_details)}
                          >
                            عرض خطوات الخطة
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="btn btn-primary"
                          style={styles.generatePlanBtn}
                          disabled={generatingPlanId === goal.id}
                          onClick={() => handleGenerateAIPlan(goal.id)}
                        >
                          <Brain size={16} />
                          <span>{generatingPlanId === goal.id ? 'جاري بناء الخطة...' : 'توليد خطة مالية بالذكاء الاصطناعي'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Plan Modal Viewer */}
          {activePlan && (
            <div style={styles.modalBackdrop} onClick={() => setActivePlan(null)}>
              <div style={styles.planModalCard} className="animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div style={styles.planModalHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Brain size={24} color="var(--accent-color)" />
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>خطة سراج المالية المقترحة</h3>
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }} onClick={() => setActivePlan(null)}>إغلاق</button>
                </div>

                <div style={styles.planModalBody}>
                  <div style={styles.planBox}>
                    <h4 style={{ color: 'var(--accent-color)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>الادخار المطلوب شهرياً</h4>
                    <p style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                      {(activePlan.monthly_required || 0).toLocaleString()} ر.س / شهرياً
                    </p>
                  </div>

                  {activePlan.budget_shifts && activePlan.budget_shifts.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>تعديلات المقترحة في الميزانية:</h4>
                      <ul style={styles.planList}>
                        {activePlan.budget_shifts.map((shift, idx) => (
                          <li key={idx} style={styles.planListItem}>
                            <AlertCircle size={14} color="var(--accent-color)" style={{ marginTop: '3px' }} />
                            <span>{shift}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activePlan.tips && activePlan.tips.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>إرشادات مخصصة:</h4>
                      <ul style={styles.planList}>
                        {activePlan.tips.map((tip, idx) => (
                          <li key={idx} style={styles.planListItem}>
                            <Sparkles size={14} color="var(--success-color)" style={{ marginTop: '3px' }} />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Create Goal Modal */}
          {showCreateModal && (
            <div style={styles.modalBackdrop}>
              <div style={styles.modalCard} className="animate-fade-in">
                <h3 style={{ marginBottom: '1.5rem' }}>إضافة هدف مالي جديد</h3>
                <form onSubmit={handleCreateGoal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">نوع الهدف</label>
                    <select 
                      className="form-control" 
                      value={goalType} 
                      onChange={(e) => setGoalType(e.target.value)}
                    >
                      <option value="hajj">حج</option>
                      <option value="umrah">عمرة</option>
                      <option value="marriage">زواج</option>
                      <option value="travel">سفر سياحي</option>
                      <option value="ramadan">تحضيرات رمضان</option>
                      <option value="eid">تحضيرات العيد</option>
                      <option value="school">العودة للمدارس</option>
                      <option value="custom">هدف مخصص آخر</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">عنوان الهدف</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="رحلة الحج القادمة مثلاً" 
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">المبلغ المستهدف (ر.س)</label>
                      <input 
                        type="number" 
                        required 
                        placeholder="15,000" 
                        className="form-control"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">المبلغ المتوفر حالياً (ر.س)</label>
                      <input 
                        type="number" 
                        placeholder="0" 
                        className="form-control"
                        value={savedAmount}
                        onChange={(e) => setSavedAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">تاريخ الاستحقاق المستهدف</label>
                    <input 
                      type="date" 
                      required 
                      className="form-control"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                    />
                  </div>

                  <div style={styles.modalActions}>
                    <button type="submit" className="btn btn-primary">حفظ الهدف</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>إلغاء</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
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
    marginBottom: '2rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5rem 0',
    gap: '1rem',
  },
  spinner: {
    width: '35px',
    height: '35px',
    border: '3px solid var(--border-color)',
    borderTop: '3px solid var(--accent-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  templatesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  templateBtn: {
    padding: '1rem',
    backgroundColor: 'var(--surface-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.2s ease',
  },
  tplTitle: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  tplSub: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginTop: '0.15rem',
  },
  goalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  goalCard: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  goalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  goalTypeIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(193, 122, 58, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTypeBadge: {
    fontSize: '0.75rem',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-secondary)',
    padding: '0.1rem 0.5rem',
    borderRadius: '4px',
    fontWeight: '600',
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  progressBarBg: {
    height: '8px',
    backgroundColor: 'var(--border-color)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'var(--accent-color)',
    borderRadius: '10px',
    transition: 'width 0.4s ease',
  },
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '0.75rem',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  aiSection: {
    marginTop: 'auto',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '1rem',
  },
  generatePlanBtn: {
    width: '100%',
    padding: '0.6rem',
    fontSize: '0.85rem',
    backgroundColor: 'var(--primary-color)',
    gap: '0.5rem',
  },
  planDetailsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(var(--accent-rgb), 0.04)',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    border: '1px solid rgba(var(--accent-rgb), 0.1)',
  },
  planDetailsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  viewPlanBtn: {
    padding: '0.35rem 0.60rem',
    fontSize: '0.8rem',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modalCard: {
    backgroundColor: 'var(--surface-color)',
    borderRadius: 'var(--radius-md)',
    width: '100%',
    maxWidth: '450px',
    padding: '2rem',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--border-color)',
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '0.75rem',
    marginTop: '1.25rem',
  },
  planModalCard: {
    backgroundColor: 'var(--surface-color)',
    borderRadius: 'var(--radius-md)',
    width: '100%',
    maxWidth: '550px',
    padding: '2rem',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--border-color)',
  },
  planModalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
  },
  planModalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  planBox: {
    backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
    border: '1px solid rgba(var(--accent-rgb), 0.1)',
    borderRadius: '10px',
    padding: '1rem',
    textAlign: 'center',
  },
  planList: {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  planListItem: {
    display: 'flex',
    gap: '0.5rem',
    fontSize: '0.85rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
};

export default GoalsPage;
