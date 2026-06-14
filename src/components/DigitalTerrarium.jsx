import { useState, useEffect } from 'react';
import { loadData } from '../utils/storage';
import './DigitalTerrarium.css';

export default function DigitalTerrarium() {
  const [health, setHealth] = useState(0.5);

  useEffect(() => {
    const data = loadData();
    const hasFootprint = data.footprintHistory.length > 0;
    if (!hasFootprint) {
      setHealth(0.5);
      return;
    }

    const latest = data.footprintHistory[data.footprintHistory.length - 1];
    const total = latest.total;
    // Map: 0t = 1.0 health, 15t+ = 0.0 health
    const h = Math.max(0, Math.min(1, 1 - total / 15));

    // Boost health based on daily actions logged
    const today = new Date().toISOString().split('T')[0];
    const todayActions = data.dailyActions[today] || [];
    const actionBonus = Math.min(todayActions.length * 0.03, 0.15);

    setHealth(Math.min(1, h + actionBonus));
  }, []);

  // Determine state classes based on health
  const isHealthy = health > 0.65;
  const isStressed = health < 0.35;

  let stateClass = 'terrarium-neutral';
  let statusText = '🌤️ Recovering Ecosystem';
  if (isHealthy) {
    stateClass = 'terrarium-healthy';
    statusText = '🌿 Thriving Ecosystem';
  } else if (isStressed) {
    stateClass = 'terrarium-stressed';
    statusText = '🏭 Stressed Ecosystem';
  }

  return (
    <div className={`terrarium-container fade-up ${stateClass}`}>
      <div className="terrarium-glass">
        {/* Sky/Atmosphere Layer */}
        <div className="terrarium-sky">
          <div className="terrarium-sun"></div>
          <div className="terrarium-smog"></div>
          
          {/* Animated Clouds */}
          <svg className="cloud cloud-1" viewBox="0 0 100 50">
            <path d="M 20 40 Q 10 40 10 30 Q 10 20 25 20 Q 30 10 45 10 Q 60 10 65 20 Q 80 20 80 30 Q 80 40 70 40 Z" fill="currentColor"/>
          </svg>
          <svg className="cloud cloud-2" viewBox="0 0 100 50">
            <path d="M 20 40 Q 10 40 10 30 Q 10 20 25 20 Q 30 10 45 10 Q 60 10 65 20 Q 80 20 80 30 Q 80 40 70 40 Z" fill="currentColor"/>
          </svg>
        </div>

        {/* Ground Layer */}
        <div className="terrarium-ground">
          {/* Factory (Only shows when stressed) */}
          <div className="terrarium-factory">
            <div className="chimney"></div>
            <div className="chimney chimney-small"></div>
            <div className="building"></div>
          </div>

          {/* Trees */}
          <div className="terrarium-tree tree-left">
            <div className="trunk"></div>
            <div className="leaves leaves-1"></div>
            <div className="leaves leaves-2"></div>
            <div className="leaves leaves-3"></div>
          </div>
          
          <div className="terrarium-tree tree-center">
            <div className="trunk"></div>
            <div className="leaves leaves-1"></div>
            <div className="leaves leaves-2"></div>
            <div className="leaves leaves-3"></div>
          </div>

          <div className="terrarium-tree tree-right">
            <div className="trunk"></div>
            <div className="leaves leaves-1"></div>
            <div className="leaves leaves-2"></div>
          </div>

          {/* Floating Particles (Leaves or Ash) */}
          <div className="particles">
            <div className="particle p1"></div>
            <div className="particle p2"></div>
            <div className="particle p3"></div>
            <div className="particle p4"></div>
            <div className="particle p5"></div>
          </div>
        </div>
      </div>

      <div className="terrarium-footer">
        <div className="terrarium-status-badge">
          {statusText}
        </div>
        <div className="terrarium-health-bar-wrap">
          <div
            className="terrarium-health-bar"
            style={{ width: `${Math.round(health * 100)}%` }}
          />
        </div>
        <span className="terrarium-health-pct">{Math.round(health * 100)}%</span>
        <p className="terrarium-caption">
          This living world reacts to your carbon footprint. Log actions to heal it.
        </p>
      </div>
    </div>
  );
}
