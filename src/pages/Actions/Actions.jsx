import { useState, useEffect } from 'react';
import { loadData, toggleAction, getLast30Days } from '../../utils/storage';
import { ACTIONS } from '../../data/constants';
import './Actions.css';

const CATEGORY_LABELS = {
  food: { label: 'Food', color: 'var(--color-food)', bg: 'var(--color-food-light)' },
  transport: { label: 'Transport', color: 'var(--color-transport)', bg: 'var(--color-transport-light)' },
  energy: { label: 'Energy', color: 'var(--color-energy)', bg: 'var(--color-energy-light)' },
  lifestyle: { label: 'Lifestyle', color: 'var(--color-lifestyle)', bg: 'var(--color-lifestyle-light)' },
};

function ActionCard({ action, isLogged, onToggle }) {
  const [animating, setAnimating] = useState(false);
  const catStyle = CATEGORY_LABELS[action.category] || {};

  const handleClick = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
    onToggle(action);
  };

  return (
    <button
      id={`action-${action.id}`}
      className={`action-card ${isLogged ? 'logged' : ''} ${animating ? 'bouncing' : ''}`}
      onClick={handleClick}
      type="button"
      aria-pressed={isLogged}
    >
      <div className="action-check">
        {isLogged ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : null}
      </div>
      <div className="action-icon">{action.icon}</div>
      <div className="action-content">
        <div className="action-name">{action.label}</div>
        <div className="action-badges-row">
          <div
            className="action-category-badge"
            style={{ color: catStyle.color, background: catStyle.bg }}
          >
            {catStyle.label}
          </div>
          {action.tags && action.tags.map((tag, i) => (
            <div key={i} className="action-tag-badge">
              {tag}
            </div>
          ))}
        </div>
      </div>
      <div className="action-saving">
        <span className="action-saving-value">-{action.co2Saved}</span>
        <span className="action-saving-unit">kg CO₂</span>
      </div>
    </button>
  );
}

export default function Actions() {
  const [data, setData] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  if (!data) return null;

  const today = new Date().toISOString().split('T')[0];
  const todayActions = data.dailyActions[today] || [];
  const loggedIds = new Set(todayActions.map(a => a.id));
  const todaySaved = todayActions.reduce((sum, a) => sum + a.co2Saved, 0);
  const calendar = getLast30Days(data);

  const handleToggle = (action) => {
    const updated = toggleAction(data, action);
    setData(updated);
    const isNowLogged = !loggedIds.has(action.id);
    if (isNowLogged) {
      showToast(`+${action.xp} XP · Saved ${action.co2Saved} kg CO₂ 🎉`);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="actions-page page">
      <div className="container">
        {/* Toast */}
        {toast && (
          <div className="toast" role="status" aria-live="polite">{toast}</div>
        )}

        {/* Header */}
        <div className="actions-header fade-up">
          <div>
            <h1>Daily Actions</h1>
            <p className="text-secondary">Log what you did today to track your CO₂ savings.</p>
          </div>
          <div className="today-counter">
            <div className="today-saved-value font-mono">{todaySaved.toFixed(1)}</div>
            <div className="today-saved-label">kg CO₂ saved today</div>
          </div>
        </div>

        {/* Streak Banner */}
        {data.achievements.currentStreak > 0 && (
          <div className="streak-banner card fade-up fade-up-delay-1">
            <span className="streak-fire streak-pulse">🔥</span>
            <div>
              <span className="font-semibold">{data.achievements.currentStreak}-day streak!</span>
              <span className="text-muted text-sm"> · Keep going!</span>
            </div>
            <div className="streak-total">
              <span className="text-sm text-muted">Total saved</span>
              <span className="font-mono font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>
                {data.achievements.totalCo2Saved.toFixed(1)} kg
              </span>
            </div>
          </div>
        )}

        {/* Actions Checklist */}
        <div className="actions-section fade-up fade-up-delay-2">
          <div className="actions-section-header">
            <h3>Today's Actions</h3>
            <span className="badge badge-green">{loggedIds.size} / {ACTIONS.length} completed</span>
          </div>

          <div className="actions-list">
            {ACTIONS.map((action, i) => (
              <ActionCard
                key={action.id}
                action={action}
                isLogged={loggedIds.has(action.id)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="calendar-section card card-body fade-up fade-up-delay-3">
          <div className="calendar-inner-grid">

            {/* LEFT: Grid + Legend */}
            <div className="calendar-left">
              <div className="calendar-top-row">
                <h3>Last 30 Days</h3>
                <span className="calendar-logged-count">
                  {calendar.filter(d => d.logged).length} / 30 days active
                </span>
              </div>
              <div className="calendar-grid">
                {calendar.map((day) => (
                  <div
                    key={day.date}
                    className={`calendar-day ${day.logged ? 'logged' : ''} ${day.date === today ? 'today' : ''}`}
                    title={`${day.date}: ${day.logged ? `${day.co2Saved.toFixed(1)} kg saved` : 'No actions logged'}`}
                  >
                    <span className="calendar-day-num">{day.day}</span>
                    {day.logged && (
                      <span className="calendar-day-dot" />
                    )}
                  </div>
                ))}
              </div>
              <div className="calendar-legend">
                <div className="legend-item">
                  <div className="legend-dot logged" />
                  <span className="text-xs text-muted">Actions logged</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" />
                  <span className="text-xs text-muted">No actions</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot today" />
                  <span className="text-xs text-muted">Today</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Animated Eco Visual */}
            {(() => {
              const loggedDays = calendar.filter(d => d.logged).length;
              const pct = loggedDays / 30;  // 0 – 1
              const stage = pct >= 0.7 ? 'lush' : pct >= 0.35 ? 'growing' : 'seedling';
              return (
                <div className={`eco-visual eco-visual-${stage}`}>
                  <div className="eco-sky">
                    <div className="eco-sun" />
                    {/* Floating particles */}
                    {stage !== 'seedling' && [
                      'p1','p2','p3','p4','p5','p6'
                    ].map(p => <div key={p} className={`eco-particle ${p}`} />)}
                  </div>

                  <div className="eco-scene">
                    {/* Grass ground */}
                    <div className="eco-ground" />

                    {/* Main tree trunk + leaves — grow by stage */}
                    <div className="eco-tree">
                      <div className="eco-trunk" />
                      <div className="eco-canopy eco-canopy-1" />
                      {stage !== 'seedling' && <div className="eco-canopy eco-canopy-2" />}
                      {stage === 'lush' && <div className="eco-canopy eco-canopy-3" />}
                      {/* Flowers on lush */}
                      {stage === 'lush' && (
                        <>
                          <div className="eco-flower f1">🌸</div>
                          <div className="eco-flower f2">🌼</div>
                          <div className="eco-flower f3">🍀</div>
                        </>
                      )}
                    </div>

                    {/* Side bushes */}
                    {stage !== 'seedling' && <div className="eco-bush eco-bush-left" />}
                    {stage === 'lush' && <div className="eco-bush eco-bush-right" />}
                  </div>

                  {/* Stats overlay */}
                  <div className="eco-stats">
                    <div className="eco-stat-big font-mono">{loggedDays}</div>
                    <div className="eco-stat-label">days logged</div>
                    <div className="eco-progress-track">
                      <div className="eco-progress-fill" style={{ width: `${Math.round(pct * 100)}%` }} />
                    </div>
                    <div className="eco-stage-badge">
                      {stage === 'lush' ? '🌳 Thriving' : stage === 'growing' ? '🌿 Growing' : '🌱 Seedling'}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
