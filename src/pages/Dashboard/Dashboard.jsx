import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';
import {
  loadData, getRecentActions, getMonthlyStats
} from '../../utils/storage';
import {
  CATEGORY_CONFIG, EQUIVALENCES, COUNTRY_AVERAGES,
  PARIS_TARGET, ACTIONS, BADGES, getLevelInfo, getLevelProgress
} from '../../data/constants';
import GridWidget from '../../components/GridWidget';
import DigitalTerrarium from '../../components/DigitalTerrarium';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.round(start * 10) / 10);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function ScoreRing({ total }) {
  const ringPercent = total ? Math.min((PARIS_TARGET / total) * 100, 100) : 0;
  const circumference = 2 * Math.PI * 54;
  const [dashOffset, setDashOffset] = useState(circumference);
  const animatedTotal = useCountUp(total || 0);

  useEffect(() => {
    const t = setTimeout(() => {
      setDashOffset(circumference - (circumference * ringPercent) / 100);
    }, 400);
    return () => clearTimeout(t);
  }, [ringPercent, circumference]);

  const color = total <= 2 ? '#059669' : total <= 6.6 ? '#2563EB' : total <= 12 ? '#D97706' : '#DC2626';

  return (
    <div className="dash-ring-wrapper">
      <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#F3F4F6" strokeWidth="12"/>
        <circle
          cx="70" cy="70" r="54"
          fill="none" stroke={color} strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1.2s ease-in-out' }}
        />
      </svg>
      <div className="dash-ring-center">
        <span className="dash-score-value font-mono">{animatedTotal}</span>
        <span className="dash-score-unit">t CO₂/yr</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  if (!data) return null;

  const hasFootprint = data.footprintHistory.length > 0;
  const latest = hasFootprint ? data.footprintHistory[data.footprintHistory.length - 1] : null;
  const recentActions = getRecentActions(data, 5);
  const monthlyStats = getMonthlyStats(data);
  const levelInfo = getLevelInfo(data.user.xp || 0);
  const levelProgress = getLevelProgress(data.user.xp || 0);

  const categories = latest
    ? Object.entries(latest.breakdown).map(([key, value]) => ({
        ...CATEGORY_CONFIG[key], key, value,
        percentage: Math.round((value / latest.total) * 100),
      }))
    : [];

  // Chart data
  const chartData = {
    labels: ['You', 'National Avg', 'Global Avg', 'Paris Target'],
    datasets: [{
      label: 'tonnes CO₂/year',
      data: [
        latest?.total || 0,
        COUNTRY_AVERAGES[data.user.country] || COUNTRY_AVERAGES.global,
        COUNTRY_AVERAGES.global,
        PARIS_TARGET,
      ],
      backgroundColor: ['#059669', '#2563EB', '#D97706', '#10B981'],
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} tonnes CO₂/year`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#F3F4F6' },
        ticks: { color: '#6B7280', font: { family: 'Inter', size: 12 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { family: 'Inter', size: 12 } },
      },
    },
  };

  const actionMap = Object.fromEntries(ACTIONS.map(a => [a.id, a]));

  if (!hasFootprint) {
    return (
      <div className="dash-page page">
        <div className="container">
          <div className="dash-empty fade-up">
            <div className="dash-empty-icon">🌱</div>
            <h2>Your dashboard is waiting</h2>
            <p className="text-secondary">Complete the carbon calculator to see your personalised dashboard.</p>
            <Link to="/calculator" className="btn btn-primary btn-lg mt-6" id="dash-empty-cta">
              Calculate my footprint →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-page page">
      <div className="container">
        {/* Header */}
        <div className="dash-header fade-up">
          <div>
            <h1 className="dash-title">Your Dashboard</h1>
            <p className="text-secondary">Track your footprint and celebrate every action you take.</p>
          </div>
          <div className="dash-level-pill">
            <span className="dash-level-icon">{levelInfo.icon}</span>
            <span className="dash-level-name font-semibold">{levelInfo.title}</span>
            <span className="text-muted text-sm">· {data.user.xp} XP</span>
          </div>
        </div>

        {/* Digital Terrarium — reacts to your choices */}
        <DigitalTerrarium />

        {/* Live Grid API Integration */}
        <GridWidget />

        {/* Top Stats Row */}
        <div className="dash-stats-row">
          <div className="dash-stat-card card card-body card-reveal card-reveal-1">
            <div className="dash-stat-label caption">Annual Footprint</div>
            <ScoreRing total={latest.total} />
            <div className="dash-stat-sub text-sm text-muted">
              {latest.total <= PARIS_TARGET
                ? '🎯 You\'re Paris-ready!'
                : `${(latest.total - PARIS_TARGET).toFixed(1)}t above Paris target`}
            </div>
          </div>

          <div className="dash-stat-card card card-body card-reveal card-reveal-2">
            <div className="dash-stat-label caption">Total CO₂ Saved</div>
            <div className="dash-big-number font-mono">{data.achievements.totalCo2Saved.toFixed(1)}</div>
            <div className="dash-big-unit">kg CO₂ saved</div>
            <div className="dash-stat-sub text-sm text-muted">through daily actions</div>
          </div>

          <div className="dash-stat-card card card-body card-reveal card-reveal-3">
            <div className="dash-stat-label caption">Current Streak</div>
            <div className="dash-streak-display">
              <span className={`dash-streak-icon ${data.achievements.currentStreak > 0 ? 'streak-pulse' : ''}`}>
                {data.achievements.currentStreak > 0 ? '🔥' : '💧'}
              </span>
              <span className="dash-big-number font-mono">{data.achievements.currentStreak}</span>
            </div>
            <div className="dash-big-unit">day streak</div>
            <div className="dash-stat-sub text-sm text-muted">Longest: {data.achievements.longestStreak} days</div>
          </div>

          <div className="dash-stat-card card card-body card-reveal card-reveal-4">
            <div className="dash-stat-label caption">This Month</div>
            <div className="dash-big-number font-mono">{monthlyStats.totalSaved}</div>
            <div className="dash-big-unit">kg CO₂ saved</div>
            <div className="dash-stat-sub text-sm text-muted">{monthlyStats.daysLogged} days logged</div>
          </div>
        </div>

        {/* Category Breakdown + Chart */}
        <div className="dash-mid-grid">
          <div className="card card-body fade-up">
            <h3 className="mb-6">Your Footprint Breakdown</h3>
            <div className="breakdown-list">
              {categories.sort((a, b) => b.value - a.value).map((cat, i) => (
                <div key={cat.key} className="breakdown-item">
                  <div className="breakdown-label">
                    <span>{cat.icon} {cat.label}</span>
                    <span className="font-mono font-semibold">{cat.value}t</span>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                        transitionDelay: `${i * 150}ms`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-body fade-up fade-up-delay-1">
            <h3 className="mb-6">How you compare</h3>
            <div className="chart-wrapper">
              <Bar data={chartData} options={chartOptions} />
            </div>
            <p className="text-xs text-muted mt-4" style={{ textAlign: 'center' }}>
              Paris Agreement target: 2t CO₂e per person/year
            </p>
          </div>
        </div>

        {/* Equivalences */}
        <div className="card card-body fade-up" style={{ marginBottom: 'var(--space-8)' }}>
          <h3 className="mb-6">Your footprint equals...</h3>
          <div className="dash-equiv-row">
            {EQUIVALENCES.map((eq, i) => (
              <div key={eq.id} className={`dash-equiv-card card card-body card-reveal card-reveal-${i + 1}`}>
                <div className="equiv-icon">{eq.icon}</div>
                <div className="equiv-value font-mono">{eq.formula(latest.total)}</div>
                <div className="equiv-label text-sm font-semibold">{eq.unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Actions */}
        <div className="dash-bottom-grid">
          <div className="card card-body fade-up">
            <div className="flex justify-between items-center mb-6">
              <h3>Recent Actions</h3>
              <Link to="/actions" className="btn btn-ghost btn-sm" id="dash-view-actions-btn">View all →</Link>
            </div>
            {recentActions.length === 0 ? (
              <div className="dash-empty-actions">
                <p className="text-muted text-sm">No actions logged yet.</p>
                <Link to="/actions" className="btn btn-secondary btn-sm mt-4" id="dash-log-action-btn">Log your first action</Link>
              </div>
            ) : (
              <div className="recent-actions-list">
                {recentActions.map((a, i) => {
                  const action = actionMap[a.id];
                  if (!action) return null;
                  return (
                    <div key={i} className="recent-action-item">
                      <span className="recent-action-icon">{action.icon}</span>
                      <div className="recent-action-info">
                        <span className="recent-action-name text-sm font-medium">{action.label}</span>
                        <span className="recent-action-date text-xs text-muted">{a.date}</span>
                      </div>
                      <span className="recent-action-saving badge badge-green">-{a.co2Saved} kg</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Progress Report */}
          <div className="card card-body fade-up fade-up-delay-1">
            <h3 className="mb-6">Level Progress</h3>
            <div className="level-display">
              <div className="level-icon-big">{levelInfo.icon}</div>
              <div className="level-info">
                <div className="font-bold">{levelInfo.title}</div>
                <div className="text-sm text-muted">Level {levelInfo.level} · {data.user.xp} XP</div>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs text-muted mb-2">
                <span>Level {levelInfo.level}</span>
                <span>Level {Math.min(levelInfo.level + 1, 6)}</span>
              </div>
              <div className="progress-bar-track" style={{ height: 10 }}>
                <div
                  className="progress-bar-fill xp-bar-shimmer"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted mt-2">{levelProgress}% to next level</p>
            </div>
            <div className="divider" />
            <div className="dash-badge-preview">
              <div className="text-sm font-semibold mb-3">Badges Earned</div>
              <div className="badge-icons-row">
                {data.achievements.badges.length === 0 ? (
                  <p className="text-xs text-muted">Complete the calculator to earn your first badge!</p>
                ) : (
                  data.achievements.badges.slice(0, 6).map((bid, i) => {
                    const badge = BADGES.find(b => b.id === bid);
                    return badge ? (
                      <span key={i} className="badge-icon-item badge-pop" title={badge.name}>{badge.icon}</span>
                    ) : null;
                  })
                )}
              </div>
              <Link to="/achievements" className="btn btn-ghost btn-sm mt-4" id="dash-view-badges-btn">
                View all achievements →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions CTA */}
        <div className="dash-cta-row fade-up">
          <Link to="/calculator" className="dash-cta-card card" id="dash-recalc-btn">
            <div className="dash-cta-icon">🧮</div>
            <div>
              <div className="font-semibold">Retake Calculator</div>
              <div className="text-sm text-muted">Track your improvement</div>
            </div>
          </Link>
          <Link to="/actions" className="dash-cta-card card" id="dash-log-today-btn">
            <div className="dash-cta-icon">✅</div>
            <div>
              <div className="font-semibold">Log Today's Actions</div>
              <div className="text-sm text-muted">Keep your streak going</div>
            </div>
          </Link>
          <Link to="/insights" className="dash-cta-card card" id="dash-get-tips-btn">
            <div className="dash-cta-icon">💡</div>
            <div>
              <div className="font-semibold">Get Personalised Tips</div>
              <div className="text-sm text-muted">Targeted for your footprint</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
