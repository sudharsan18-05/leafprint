import { useState, useEffect } from 'react';
import './WhatIfSimulator.css';

export default function WhatIfSimulator({ baseFootprint }) {
  const [vegetarianDays, setVegetarianDays] = useState(0);
  const [wfhDays, setWfhDays] = useState(0);
  const [flightsSkipped, setFlightsSkipped] = useState(0);
  
  // Calculate simulated savings
  // Rough estimates for demo:
  // 1 veg day/week = ~150kg/yr
  // 1 wfh day/week = ~120kg/yr (commuting reduction)
  // 1 short flight skipped = ~200kg/yr
  
  const savings = (vegetarianDays * 150) + (wfhDays * 120) + (flightsSkipped * 200);
  const savingsTonnes = savings / 1000;
  
  const currentTotal = baseFootprint || 6.6; // Global average if no data
  const newTotal = Math.max(0, currentTotal - savingsTonnes);
  const reductionPercent = currentTotal > 0 ? (savingsTonnes / currentTotal) * 100 : 0;

  return (
    <div className="what-if-widget card card-body fade-up">
      <div className="what-if-header">
        <div className="what-if-icon">🔄</div>
        <div>
          <h3>"What-If" Impact Simulator</h3>
          <p className="text-sm text-secondary">See how small lifestyle changes add up.</p>
        </div>
      </div>

      <div className="what-if-grid">
        {/* Controls */}
        <div className="what-if-controls">
          <div className="slider-group">
            <div className="slider-label">
              <span>🥗 Vegetarian days per week</span>
              <span className="font-mono font-semibold">{vegetarianDays}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="7" 
              value={vegetarianDays} 
              onChange={(e) => setVegetarianDays(Number(e.target.value))}
              className="what-if-slider"
            />
          </div>

          <div className="slider-group">
            <div className="slider-label">
              <span>🏠 Work-from-home days per week</span>
              <span className="font-mono font-semibold">{wfhDays}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="5" 
              value={wfhDays} 
              onChange={(e) => setWfhDays(Number(e.target.value))}
              className="what-if-slider"
            />
          </div>

          <div className="slider-group">
            <div className="slider-label">
              <span>✈️ Flights skipped this year</span>
              <span className="font-mono font-semibold">{flightsSkipped}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="5" 
              value={flightsSkipped} 
              onChange={(e) => setFlightsSkipped(Number(e.target.value))}
              className="what-if-slider"
            />
          </div>
        </div>

        {/* Chart Output */}
        <div className="what-if-output">
          <div className="what-if-result-card">
            <div className="text-sm text-muted mb-1">Your projected footprint:</div>
            <div className="what-if-big-number font-mono">{newTotal.toFixed(1)}t</div>
            <div className="text-sm" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              -{savingsTonnes.toFixed(2)}t CO₂/yr ({reductionPercent.toFixed(1)}% drop)
            </div>
          </div>
          
          <div className="what-if-visual-bar">
            <div className="what-if-bar-base">
              <div 
                className="what-if-bar-fill" 
                style={{ width: `${(newTotal / currentTotal) * 100}%` }}
              ></div>
              {savingsTonnes > 0 && (
                <div 
                  className="what-if-bar-saved" 
                  style={{ width: `${(savingsTonnes / currentTotal) * 100}%` }}
                ></div>
              )}
            </div>
            <div className="flex justify-between text-xs text-muted mt-2">
              <span>0</span>
              <span>{currentTotal.toFixed(1)}t (Current)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
