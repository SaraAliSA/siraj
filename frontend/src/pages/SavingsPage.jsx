import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { PiggyBank, Plus, CheckCircle2, Calendar, TrendingUp, HelpCircle, ArrowRight } from 'lucide-react';

const SavingsPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');

  // Update Progress state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [newCurrentAmount, setNewCurrentAmount] = useState('');

  // Detailed Estimation state
  const [selectedEstimation, setSelectedEstimation] = useState(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await client.get('/savings/plans');
      setPlans(res.data);
    } catch (err) {
      console.error("Failed to load savings plans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await client.post('/savings/plans', {
        goal_name: goalName,
        target_amount: parseFloat(targetAmount),
        current_amount: parseFloat(currentAmount || 0),
        target_date: targetDate,
        monthly_contribution: parseFloat(monthlyContribution || 0)
      });
      setShowCreateModal(false);
      // Reset form
      setGoalName('');
      setTargetAmount('');
      setCurrentAmount('');
      setTargetDate('');
      setMonthlyContribution('');
      fetchPlans();
    } catch (err) {
      alert("فشل إنشاء خطة الادخار: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    try {
      await client.put(`/savings/plans/${selectedPlan.id}`, {
        current_amount: parseFloat(newCurrentAmount),
        status: 'active'
      });
      setShowUpdateModal(false);
      setNewCurrentAmount('');
      setSelectedPlan(null);
      fetchPlans();
    } catch (err) {
      alert("فشل تحديث الخطة: " + (err.response?.data?.detail || err.message));
    }
  };

  const fetchEstimations = async (plan) => {
    try {
      const res = await client.get(`/savings/plans/${plan.id}/progress`);
      setSelectedEstimation({
        ...res.data,
        plan_name: plan.goal_name
      });
    } catch (err) {
      alert("فشل جلب تفاصيل التقدير: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2>الخطط والمستهدفات الادخارية</h2>
          <p style={{ color: 'var(--text-secondary)' }}>تتبع أهدافك الادخارية، وخصص دفعات شهرية لمساعدتك في تحقيقها بسهولة ويسر.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          <span>إنشاء خطة ادخار</span>
        </button>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>جاري تحميل الخطط الادخارية...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="card" style={styles.emptyCard}>
          <PiggyBank size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3>لا توجد خطط ادخارية حالية</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.5rem auto 1.5rem auto' }}>
            الادخار المنتظم هو الخطوة الأولى للأمان المالي. أنشئ خطتك الأولى الآن لتبدأ في الادخار بشكل منظم!
          </p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>ابدأ الادخار الآن</button>
        </div>
      ) : (
        <div style={styles.grid}>
          {plans.map((plan) => {
            const progressPct = Math.min(100, Math.max(0, (plan.current_amount / plan.target_amount) * 100));
            return (
              <div key={plan.id} className="card" style={styles.planCard}>
                <div style={styles.planHeader}>
                  <div style={styles.iconBox}>
                    <PiggyBank size={22} color="var(--accent-color)" />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{plan.goal_name}</h3>
                </div>

                {/* Progress bar */}
                <div style={styles.progressSection}>
                  <div style={styles.progressText}>
                    <span>التقدم المحرز</span>
                    <span style={{ fontWeight: '700', color: 'var(--accent-color)' }}>{progressPct.toFixed(1)}%</span>
                  </div>
                  <div style={styles.progressBarBg}>
                    <div style={{ ...styles.progressBarFill, width: `${progressPct}%` }}></div>
                  </div>
                  <div style={styles.progressAmounts}>
                    <span>{plan.current_amount.toLocaleString()} ر.س</span>
                    <span>المستهدف: {plan.target_amount.toLocaleString()} ر.س</span>
                  </div>
                </div>

                {/* Metadata */}
                <div style={styles.metadataList}>
                  <div style={styles.metadataItem}>
                    <Calendar size={14} color="var(--text-secondary)" />
                    <span>تاريخ المستهدف: {plan.target_date}</span>
                  </div>
                  <div style={styles.metadataItem}>
                    <TrendingUp size={14} color="var(--text-secondary)" />
                    <span>الادخار الشهري المخطط: {plan.monthly_contribution.toLocaleString()} ر.س</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={styles.planActions}>
                  <button 
                    className="btn btn-primary" 
                    style={styles.actionBtn}
                    onClick={() => {
                      setSelectedPlan(plan);
                      setNewCurrentAmount(plan.current_amount);
                      setShowUpdateModal(true);
                    }}
                  >
                    تحديث الرصيد
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={styles.actionBtn}
                    onClick={() => fetchEstimations(plan)}
                  >
                    التوقعات الذكية
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Estimation Details Panel */}
      {selectedEstimation && (
        <div className="card" style={styles.estimationCard}>
          <div style={styles.estHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={22} color="var(--success-color)" />
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>التقديرات والتنبؤات لخطة: {selectedEstimation.plan_name}</h3>
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => setSelectedEstimation(null)}>إغلاق</button>
          </div>
          <div style={styles.estContentGrid}>
            <div style={styles.estMetricBox}>
              <span style={styles.estLabel}>المبلغ المتبقي</span>
              <span style={styles.estValue}>{selectedEstimation.remaining_amount.toLocaleString()} ر.س</span>
            </div>
            <div style={styles.estMetricBox}>
              <span style={styles.estLabel}>الشهور المتبقية المقدرة</span>
              <span style={styles.estValue}>{selectedEstimation.months_to_target.toFixed(1)} شهر</span>
            </div>
            <div style={styles.estMetricBox}>
              <span style={styles.estLabel}>تاريخ الإنجاز المتوقع</span>
              <span style={styles.estValue}>{selectedEstimation.estimated_completion_date}</span>
            </div>
            <div style={styles.estMetricBox}>
              <span style={styles.estLabel}>حالة الإنجاز المالي</span>
              <span style={{
                ...styles.estValue,
                color: selectedEstimation.is_on_track ? 'var(--success-color)' : 'var(--warning-color)'
              }}>
                {selectedEstimation.is_on_track ? 'مستمر على المسار الصحيح' : 'بحاجة لزيادة المساهمة الشهرية'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard} className="animate-fade-in">
            <h3 style={{ marginBottom: '1.5rem' }}>إنشاء خطة ادخارية جديدة</h3>
            <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">اسم الخطة / الهدف المالي</label>
                <input 
                  type="text" 
                  required 
                  placeholder="مثال: رحلة العمرة، صندوق الطوارئ" 
                  className="form-control"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
              </div>

              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">المبلغ المستهدف (ر.س)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="20,000" 
                    className="form-control"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">المدخر الحالي (ر.س)</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    className="form-control"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">الادخار الشهري المخطط (ر.س)</label>
                  <input 
                    type="number" 
                    placeholder="1,500" 
                    className="form-control"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">تاريخ الانتهاء المستهدف</label>
                  <input 
                    type="date" 
                    required 
                    className="form-control"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="submit" className="btn btn-primary">حفظ الخطة</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Progress Modal */}
      {showUpdateModal && selectedPlan && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard} className="animate-fade-in">
            <h3 style={{ marginBottom: '1.5rem' }}>تحديث مدخرات خطة: {selectedPlan.goal_name}</h3>
            <form onSubmit={handleUpdateProgress} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">إجمالي المبلغ المدخر حالياً (ر.س)</label>
                <input 
                  type="number" 
                  required 
                  placeholder={selectedPlan.current_amount} 
                  className="form-control"
                  value={newCurrentAmount}
                  onChange={(e) => setNewCurrentAmount(e.target.value)}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="submit" className="btn btn-primary">تحديث</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowUpdateModal(false); setSelectedPlan(null); }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
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
  emptyCard: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  planCard: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  planHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(193, 122, 58, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  progressBarBg: {
    height: '10px',
    backgroundColor: 'var(--border-color)',
    borderRadius: '50px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'var(--accent-color)',
    borderRadius: '50px',
    transition: 'width 0.4s ease',
  },
  progressAmounts: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginTop: '0.2rem',
  },
  metadataList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '0.75rem',
  },
  metadataItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  planActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: 'auto',
  },
  actionBtn: {
    flex: 1,
    padding: '0.5rem',
    fontSize: '0.85rem',
  },
  estimationCard: {
    marginTop: '2rem',
    border: '1px solid var(--success-color)',
    backgroundColor: 'rgba(46, 125, 50, 0.02)',
  },
  estHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
  },
  estContentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  estMetricBox: {
    backgroundColor: 'var(--surface-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  estLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  estValue: {
    fontSize: '1rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
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
    maxWidth: '500px',
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
};

export default SavingsPage;
