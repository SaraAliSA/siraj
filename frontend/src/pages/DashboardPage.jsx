import { Link } from 'react-router-dom';
import { Plus, FileText, CreditCard, ArrowLeftRight, Coins, TrendingUp, TrendingDown, Wallet, Percent, ChevronUp, ChevronDown, Eye, ChevronRight, Sparkles ,EyeOff} from 'lucide-react';import useAuth from '../hooks/useAuth';
import TopExpensesBar from '../components/Dashboard/TopExpensesBar.jsx';
import FinancialAnalysis from '../components/Dashboard/FinancialAnalysis.jsx';
import SirajTip from '../components/Dashboard/SirajTip.jsx';
import RecentTransactions from '../components/Dashboard/RecentTransactions.jsx';
import DashboardPreviewCards from '../components/Dashboard/DashboardPreviewCards.jsx';
import React, { useState } from 'react';

const quickActions = [
  { label: 'إضافة معاملة', icon: Plus },
  { label: 'التقارير', icon: FileText },
  { label: 'دفع فاتورة', icon: CreditCard },
  { label: 'تحويل', icon: ArrowLeftRight },
];


const stats = [
  { label: 'الدخل الشهري', value: '18,540', icon: Wallet, trend: '12%', up: true, history: [15200, 16000, 16500, 17200, 17800, 18540] },
  { label: 'المصروفات', value: '11,280', icon: TrendingDown, trend: '4%', up: false, history: [9800, 10200, 9500, 10800, 11500, 11280] },
  { label: 'المدخرات', value: '9,320', icon: Coins, trend: '6%', up: true, history: [7200, 7600, 8100, 8500, 8900, 9320] },
  { label: 'نسبة الادخار', value: '33', unit: '%', icon: Percent, trend: '2%', up: true, history: [28, 29, 30, 31, 32, 33] },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'صباح الخير';
  if (hour < 17) return 'مساء الخير';
  return 'مساء الخير';
};

function Sparkline({ data, color }) {
  const width = 60;
  const height = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.full_name || 'محمد العنزي';
  const [hideBalances, setHideBalances] = useState(false);

  return (
    <div className="dashboard-container">
      {/* Hero: Greeting + Balance */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-top">
                    <p className="balance-label">إجمالي الرصيد</p>
          <button className="dashboard-eye-btn" onClick={() => setHideBalances(!hideBalances)}>
            {hideBalances ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <p className="dashboard-greeting-text">{getGreeting()}، {displayName.split(' ')[0]} 👋</p>

            <p className="balance-value">
        {hideBalances ? '••••••' : '42,860'} <span className="balance-unit">ر.س</span>
      </p>

        <div className="dashboard-hero-bottom">
          <Link to="/transactions" className="dashboard-details-link">
            <ChevronRight size={14} /> التفاصيل
          </Link>
          <span className="balance-trend">
            8.4% هذا الشهر <ChevronUp size={13} />
          </span>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="promo-banner">
        <div className="promo-blob" />
        <div className="promo-text">
          <p className="promo-title">استثمر بسهولة</p>
          <p className="promo-subtitle">خيارات استثمار تناسب خططك المالية</p>
          <Link to="/investment" className="promo-btn">ابدأ الاستثمار ‹</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        {quickActions.map(({ label, icon: Icon }) => (
          <div key={label} className="quick-action-square">
            <div className="quick-action-square-icon">
              <Icon size={20} />
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Section header */}
      <div className="section-header">
        <h2 className="section-title">نظرة عامة</h2>
        <span className="section-view-all">عرض الكل</span>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon, trend, up, history, unit }) => (
  <div key={label} className="stat-card">
    <div className="stat-card-top">
      <div className="stat-icon">
        <Icon size={17} />
      </div>
      <Sparkline data={history} color={up ? '#16a34a' : '#dc2626'} />
    </div>
    <p className="stat-label">{label}</p>
      <p className="stat-value">
      {hideBalances ? '••••' : value} <span className="stat-unit">{unit || 'ر.س'}</span>
    </p>
    <span className={`stat-trend ${up ? 'up' : 'down'}`}>
      {trend} {up ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
    </span>
  </div>
))}
      </div>

      <SirajTip />
      <FinancialAnalysis score={72} />
      <TopExpensesBar />
      <DashboardPreviewCards />

      <RecentTransactions />
    {/* Floating Siraj AI Entry */}
<Link to="/siraj-ai" className="floating-siraj-btn">
  <span>اسأل سراج</span>
</Link>
</div>
  );
}
