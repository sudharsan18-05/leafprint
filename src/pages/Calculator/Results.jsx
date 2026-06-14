import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_CONFIG, EQUIVALENCES, COUNTRY_AVERAGES, PARIS_TARGET } from '../../data/constants';
import './Calculator.css';

function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.round(start * 10) / 10);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function getScoreLabel(total) {
  if (total <= 2) return { label: 'Paris Ready', color: '#059669', bg: '#D1FAE5' };
  if (total <= 5) return { label: 'Below Average', color: '#2563EB', bg: '#DBEAFE' };
  if (total <= 8) return { label: 'Average', color: '#D97706', bg: '#FEF3C7' };
  if (total <= 14) return { label: 'Above Average', color: '#DC2626', bg: '#FEE2E2' };
  return { label: 'Very High', color: '#9F1239', bg: '#FFE4E6' };
}

export default function Results({ result, onRetake }) {
  const animatedTotal = useCountUp(result.total, 1500);
  const scoreInfo = getScoreLabel(result.total);
  const globalAvg = COUNTRY_AVERAGES.global;

  const categories = Object.entries(result.breakdown).map(([key, value]) => ({
    ...CATEGORY_CONFIG[key],
    key,
    value,
    percentage: Math.round((value / result.total) * 100),
  }));

  // Ring progress: target = paris / total (max 100%)
  const ringPercent = Math.min((PARIS_TARGET / result.total) * 100, 100);
  const circumference = 2 * Math.PI * 54; // r=54
  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashOffset(circumference - (circumference * ringPercent) / 100);
    }, 300);
    return () => clearTimeout(timer);
  }, [ringPercent, circumference]);

  return (
    <div className="results-page page">
      <div className="container">
        <div className="results-header fade-up">
          <p className="caption" style={{ color: 'var(--color-primary)', marginBottom: 8 }}>Your results</p>
          <h1>Your Carbon Footprint</h1>
          <p className="text-secondary">Based on your answers, here is your estimated annual footprint.</p>
        </div>

        <div className="results-grid">
          {/* Score Card */}
          <div className="results-score-card card card-body fade-up fade-up-delay-1">
            <div className="score-ring-wrapper">
              <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true">
                <circle cx="70" cy="70" r="54" fill="none" stroke="#E5E7EB" strokeWidth="10"/>
                <circle
                  cx="70" cy="70" r="54"
                  fill="none"
                  stroke={scoreInfo.color}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 70 70)"
                  style={{ transition: 'stroke-dashoffset 1.2s ease-in-out' }}
                />
              </svg>
              <div className="score-ring-center">
                <span className="score-value font-mono">{animatedTotal}</span>
                <span className="score-unit">tonnes CO₂/yr</span>
              </div>
            </div>
            <div className="score-badge" style={{ background: scoreInfo.bg, color: scoreInfo.color }}>
              {scoreInfo.label}
            </div>
            <div className="score-comparisons">
              <div className="score-comparison">
                <span className="text-muted text-sm">Paris Target</span>
                <span className="font-semibold" style={{ color: '#059669' }}>{PARIS_TARGET}t</span>
              </div>
              <div className="score-comparison">
                <span className="text-muted text-sm">Global Average</span>
                <span className="font-semibold">{globalAvg}t</span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="results-breakdown card card-body fade-up fade-up-delay-2">
            <h3 className="mb-6">Where it comes from</h3>
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
                        transitionDelay: `${i * 120}ms`,
                      }}
                    />
                  </div>
                  <span className="text-muted text-xs">{cat.percentage}% of total</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equivalences */}
        <div className="results-equivalences fade-up fade-up-delay-3">
          <h3 className="mb-6">That's equivalent to...</h3>
          <div className="equiv-grid">
            {EQUIVALENCES.map((eq, i) => (
              <div key={eq.id} className={`equiv-card card card-body card-reveal card-reveal-${i + 1}`}>
                <div className="equiv-icon">{eq.icon}</div>
                <div className="equiv-value font-mono">{eq.formula(result.total)}</div>
                <div className="equiv-label text-sm font-semibold">{eq.unit}</div>
                <div className="equiv-desc text-xs text-muted">{eq.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="results-actions fade-up fade-up-delay-4">
          <Link to="/dashboard" className="btn btn-primary btn-lg" id="results-dashboard-btn">
            View my dashboard →
          </Link>
          <Link to="/insights" className="btn btn-secondary btn-lg" id="results-insights-btn">
            Get personalised tips
          </Link>
          <button className="btn btn-ghost" onClick={onRetake} id="results-retake-btn">
            Retake calculator
          </button>
        </div>
      </div>
    </div>
  );
}
