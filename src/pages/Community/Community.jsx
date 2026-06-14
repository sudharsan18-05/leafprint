import { useState, useEffect } from 'react';
import { loadData } from '../../utils/storage';
import './Community.css';

// Mock data to simulate social proof for the hackathon demo
const GLOBAL_STATS = {
  totalUsers: 14205,
  co2SavedToday: 8450,
  treesPlanted: 1240,
};

const LEADERBOARD_DATA = [
  { rank: 1, name: 'EcoWarrior99', level: 6, score: 14500, avatar: '🌍' },
  { rank: 2, name: 'GreenThumb', level: 6, score: 13200, avatar: '🌱' },
  { rank: 3, name: 'SolarPunk', level: 5, score: 11050, avatar: '☀️' },
  { rank: 4, name: 'OceanSaver', level: 5, score: 9800, avatar: '🌊' },
  { rank: 5, name: 'WindRider', level: 4, score: 8400, avatar: '💨' },
];

export default function Community() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  if (!data) return null;

  return (
    <div className="community-page page">
      <div className="container">
        <div className="text-center fade-up mb-10">
          <h1 className="mb-2">Community Impact</h1>
          <p className="text-secondary">You are part of a global movement. See what we've achieved together.</p>
        </div>

        {/* Global Impact Numbers */}
        <div className="community-stats-grid fade-up fade-up-delay-1">
          <div className="card card-body text-center">
            <div className="text-4xl mb-2">🌍</div>
            <div className="font-mono text-3xl font-bold text-primary">{GLOBAL_STATS.totalUsers.toLocaleString()}</div>
            <div className="text-sm font-semibold uppercase tracking-wider text-muted mt-1">Active Users</div>
          </div>
          <div className="card card-body text-center">
            <div className="text-4xl mb-2">📉</div>
            <div className="font-mono text-3xl font-bold text-primary">{GLOBAL_STATS.co2SavedToday.toLocaleString()}</div>
            <div className="text-sm font-semibold uppercase tracking-wider text-muted mt-1">kg CO₂ Saved Today</div>
          </div>
          <div className="card card-body text-center">
            <div className="text-4xl mb-2">🌳</div>
            <div className="font-mono text-3xl font-bold text-primary">{GLOBAL_STATS.treesPlanted.toLocaleString()}</div>
            <div className="text-sm font-semibold uppercase tracking-wider text-muted mt-1">Virtual Trees Planted</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="card fade-up fade-up-delay-2" style={{ marginTop: 'var(--space-8)' }}>
          <div style={{ padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>🏆 Top Changemakers</h3>
          </div>
          <div className="leaderboard-list">
            {LEADERBOARD_DATA.map((user) => (
              <div key={user.rank} className="leaderboard-item">
                <div className="rank-badge">{user.rank}</div>
                <div className="user-avatar">{user.avatar}</div>
                <div className="flex-1">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-muted">Level {user.level}</div>
                </div>
                <div className="font-mono font-semibold text-primary">{user.score} XP</div>
              </div>
            ))}
            
            {/* Current User injection */}
            <div className="leaderboard-item current-user-item mt-4 border border-primary bg-primary-light">
              <div className="rank-badge" style={{ background: 'var(--color-primary)', color: 'white' }}>--</div>
              <div className="user-avatar">👤</div>
              <div className="flex-1">
                <div className="font-semibold">You</div>
                <div className="text-xs text-muted">Level {Math.floor(data.user.xp / 100) + 1}</div>
              </div>
              <div className="font-mono font-semibold text-primary">{data.user.xp} XP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
