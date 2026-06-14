import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadData } from '../../utils/storage';
import { TIPS, CATEGORY_CONFIG } from '../../data/constants';
import WhatIfSimulator from '../../components/WhatIfSimulator';
import CarbonNudge from '../../components/CarbonNudge';
import './Insights.css';

const EFFORT_COLORS = {
  Easy: { color: '#059669', bg: '#D1FAE5' },
  Medium: { color: '#D97706', bg: '#FEF3C7' },
  Hard: { color: '#7C3AED', bg: '#EDE9FE' },
};

const IMPACT_COLORS = {
  Low: { color: '#6B7280' },
  Medium: { color: '#2563EB' },
  High: { color: '#D97706' },
  'Very High': { color: '#DC2626' },
};

function TipCard({ tip, index }) {
  const effortStyle = EFFORT_COLORS[tip.effort] || EFFORT_COLORS.Easy;
  const impactStyle = IMPACT_COLORS[tip.impact] || IMPACT_COLORS.Medium;

  return (
    <div className={`tip-card card card-body card-reveal card-reveal-${(index % 4) + 1}`}>
      <div className="tip-header">
        <div className="tip-badges">
          <span className="tip-badge" style={{ color: effortStyle.color, background: effortStyle.bg }}>
            {tip.effort}
          </span>
          <span className="tip-impact" style={{ color: impactStyle.color }}>
            {tip.impact} impact
          </span>
        </div>
        <div className="tip-saving">
          <span className="tip-saving-value font-mono">-{tip.saving}t</span>
          <span className="tip-saving-label">CO₂/yr</span>
        </div>
      </div>
      <h4 className="tip-title">{tip.title}</h4>
      <p className="tip-desc text-sm text-secondary">{tip.description}</p>
    </div>
  );
}

export default function Insights() {
  const [data, setData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    setData(loadData());
  }, []);

  if (!data) return null;

  const hasFootprint = data.footprintHistory.length > 0;
  const latest = hasFootprint ? data.footprintHistory[data.footprintHistory.length - 1] : null;

  // Find highest impact category
  let topCategory = 'transport';
  if (latest) {
    topCategory = Object.entries(latest.breakdown)
      .sort(([, a], [, b]) => b - a)[0][0];
  }

  // Get quick wins: easy + high impact sorted by savings
  const allTips = Object.entries(TIPS).flatMap(([cat, tips]) =>
    tips.map(t => ({ ...t, category: cat }))
  );

  const quickWins = allTips
    .filter(t => t.effort === 'Easy')
    .sort((a, b) => b.saving - a.saving)
    .slice(0, 3);

  const filteredTips = activeCategory === 'all'
    ? allTips
    : allTips.filter(t => t.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Tips', icon: '💡' },
    ...Object.entries(CATEGORY_CONFIG).map(([key, val]) => ({
      id: key, label: val.label, icon: val.icon,
    })),
  ];

  return (
    <div className="insights-page page">
      <div className="container">
        {/* Header */}
        <div className="insights-header fade-up">
          <div>
            <h1 className="insights-title">Personalized Insights</h1>
            <p className="text-secondary">Explore models, nudges, and tips tailored to your lifestyle.</p>
            {latest && (
              <p className="text-secondary mt-2" style={{ fontSize: '0.875rem' }}>
                Based on your footprint, your biggest opportunity is in <strong>{CATEGORY_CONFIG[topCategory]?.label || 'Transport'}</strong>.
              </p>
            )}
          </div>
          {!hasFootprint && (
            <Link to="/calculator" className="btn btn-primary" id="insights-calc-btn">
              Calculate first →
            </Link>
          )}
        </div>

        {/* What-If Simulator */}
        <WhatIfSimulator baseFootprint={latest?.total} />

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', margin: 'var(--space-4) 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Decision Nudge Tool</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
        </div>

        {/* Carbon Cost Nudge Tool */}
        <CarbonNudge />

        {/* Quick Wins */}
        <div className="quick-wins-section fade-up fade-up-delay-1">
          <div className="section-intro">
            <div className="section-intro-icon">⚡</div>
            <div>
              <h3>Your Top 3 Quick Wins</h3>
              <p className="text-sm text-secondary">Easy actions with the biggest impact — start here.</p>
            </div>
          </div>
          <div className="quick-wins-grid">
            {quickWins.map((tip, i) => (
              <div key={i} className={`quick-win-card card card-body card-reveal card-reveal-${i + 1}`}>
                <div className="quick-win-rank font-mono">0{i + 1}</div>
                <div className="quick-win-saving font-mono">{tip.saving}t/yr</div>
                <h4 className="quick-win-title">{tip.title}</h4>
                <p className="quick-win-desc text-sm text-secondary">{tip.description}</p>
                <div className="quick-win-badges">
                  <span className="tip-badge" style={{ color: EFFORT_COLORS[tip.effort]?.color, background: EFFORT_COLORS[tip.effort]?.bg }}>
                    {tip.effort}
                  </span>
                  <span className="tip-impact" style={{ color: IMPACT_COLORS[tip.impact]?.color }}>
                    {tip.impact} impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="category-tabs fade-up fade-up-delay-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              id={`tab-${cat.id}`}
              className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* All Tips Grid */}
        <div className="tips-grid">
          {filteredTips.map((tip, i) => (
            <TipCard key={`${tip.category}-${i}`} tip={tip} index={i} />
          ))}
        </div>

      </div>
    </div>
  );
}
