import { useState } from 'react';
import './CarbonNudge.css';

const CARBON_DATABASE = {
  food: [
    { name: 'Beef burger', co2: 6.6, icon: '🍔', alt: 'Veggie burger', altCo2: 1.1, altIcon: '🥬' },
    { name: 'Chicken meal', co2: 3.4, icon: '🍗', alt: 'Tofu stir-fry', altCo2: 0.7, altIcon: '🥘' },
    { name: 'Cheese pizza', co2: 2.5, icon: '🍕', alt: 'Margherita (vegan)', altCo2: 0.9, altIcon: '🌿' },
    { name: 'Lamb chops', co2: 8.2, icon: '🥩', alt: 'Lentil curry', altCo2: 0.6, altIcon: '🍛' },
    { name: 'Salmon fillet', co2: 3.6, icon: '🐟', alt: 'Bean burrito', altCo2: 0.8, altIcon: '🌯' },
    { name: 'Dairy milk (1L)', co2: 3.2, icon: '🥛', alt: 'Oat milk (1L)', altCo2: 0.9, altIcon: '🌾' },
    { name: 'Eggs (dozen)', co2: 3.5, icon: '🥚', alt: 'Chickpea scramble', altCo2: 0.5, altIcon: '🫘' },
  ],
  transport: [
    { name: 'Drive 10km (petrol)', co2: 2.1, icon: '🚗', alt: 'Bus 10km', altCo2: 0.5, altIcon: '🚌' },
    { name: 'Drive 10km (diesel)', co2: 1.8, icon: '🚙', alt: 'Cycle 10km', altCo2: 0.0, altIcon: '🚲' },
    { name: 'Domestic flight', co2: 255, icon: '✈️', alt: 'Train (same route)', altCo2: 14, altIcon: '🚆' },
    { name: 'Uber/taxi 5km', co2: 1.5, icon: '🚕', alt: 'Walk 5km', altCo2: 0.0, altIcon: '🚶' },
  ],
  home: [
    { name: 'Tumble dryer load', co2: 2.4, icon: '👕', alt: 'Line dry', altCo2: 0.0, altIcon: '☀️' },
    { name: 'Hot bath', co2: 1.7, icon: '🛁', alt: '5-min shower', altCo2: 0.4, altIcon: '🚿' },
    { name: 'Leave lights on 8hr', co2: 0.6, icon: '💡', alt: 'LED + turn off', altCo2: 0.05, altIcon: '🔋' },
  ],
};

const CATEGORIES = Object.keys(CARBON_DATABASE);
const CAT_LABELS = { food: '🍽️ Food', transport: '🚗 Transport', home: '🏠 Home' };

export default function CarbonNudge() {
  const [activeCat, setActiveCat] = useState('food');
  const [selectedItem, setSelectedItem] = useState(null);

  const items = CARBON_DATABASE[activeCat];

  const handleSelect = (item) => {
    setSelectedItem(selectedItem?.name === item.name ? null : item);
  };

  return (
    <div className="nudge-widget card card-body fade-up">
      <div className="nudge-header">
        <div className="nudge-icon-wrap">🔔</div>
        <div>
          <h3>Carbon Cost at a Glance</h3>
          <p className="text-sm text-secondary">Tap any item to see its greener alternative and how much CO₂ you'd save.</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="nudge-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`nudge-tab ${activeCat === cat ? 'active' : ''}`}
            onClick={() => { setActiveCat(cat); setSelectedItem(null); }}
          >
            {CAT_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="nudge-items-grid">
        {items.map((item) => {
          const isActive = selectedItem?.name === item.name;
          return (
            <button
              key={item.name}
              className={`nudge-item ${isActive ? 'active' : ''}`}
              onClick={() => handleSelect(item)}
            >
              <span className="nudge-item-icon">{item.icon}</span>
              <span className="nudge-item-name">{item.name}</span>
              <span className="nudge-item-co2 font-mono">{item.co2} kg</span>
            </button>
          );
        })}
      </div>

      {/* Comparison Panel */}
      {selectedItem && (
        <div className="nudge-comparison fade-up">
          <div className="nudge-vs-grid">
            {/* Original */}
            <div className="nudge-vs-card nudge-vs-bad">
              <div className="nudge-vs-icon">{selectedItem.icon}</div>
              <div className="nudge-vs-name">{selectedItem.name}</div>
              <div className="nudge-vs-co2 font-mono">{selectedItem.co2} kg CO₂</div>
              <div className="nudge-bar-track">
                <div className="nudge-bar-fill bad" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="nudge-vs-arrow">→</div>

            {/* Alternative */}
            <div className="nudge-vs-card nudge-vs-good">
              <div className="nudge-vs-icon">{selectedItem.altIcon}</div>
              <div className="nudge-vs-name">{selectedItem.alt}</div>
              <div className="nudge-vs-co2 font-mono">{selectedItem.altCo2} kg CO₂</div>
              <div className="nudge-bar-track">
                <div
                  className="nudge-bar-fill good"
                  style={{ width: `${(selectedItem.altCo2 / selectedItem.co2) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="nudge-savings-banner">
            <span className="nudge-savings-icon">📉</span>
            <span>
              Switching saves <strong className="font-mono">{(selectedItem.co2 - selectedItem.altCo2).toFixed(1)} kg CO₂</strong>
              {' '}— that's a <strong className="text-primary font-mono">
                {Math.round(((selectedItem.co2 - selectedItem.altCo2) / selectedItem.co2) * 100)}% reduction
              </strong>!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
