import { useState, useEffect } from 'react';
import { loadData, saveData, spendXp } from '../../utils/storage';
import { BADGES, CHALLENGES, LEVELS, getLevelInfo, getLevelProgress } from '../../data/constants';
import './Achievements.css';

export default function Achievements() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  if (!data) return null;

  const levelInfo = getLevelInfo(data.user.xp || 0);
  const levelProgress = getLevelProgress(data.user.xp || 0);
  const earnedBadges = new Set(data.achievements.badges || []);
  const activeChallenge = data.achievements.activeChallengeId;
  const completed = data.achievements.completedChallenges || [];

  const handleSelectChallenge = (challengeId) => {
    if (activeChallenge === challengeId) {
      // Deselect
      const updated = {
        ...data,
        achievements: { ...data.achievements, activeChallengeId: null },
      };
      saveData(updated);
      setData(updated);
    } else {
      const updated = {
        ...data,
        achievements: {
          ...data.achievements,
          activeChallengeId: challengeId,
          challengeStartDate: new Date().toISOString().split('T')[0],
        },
      };
      saveData(updated);
      setData(updated);
    }
  };

  const handleBuyOffset = (cost, item) => {
    if (data.user.xp >= cost) {
      const updated = spendXp(data, cost, item);
      setData(updated);
    }
  };

  const earnedCount = earnedBadges.size;
  const totalBadges = BADGES.length;

  const handleShare = () => {
    const text = `I just reached Level ${levelInfo.level} (${levelInfo.title}) on Leafprint and saved ${data.achievements.totalCo2Saved.toFixed(1)}kg of CO2! 🌱 Join me in reducing our carbon footprint.`;
    if (navigator.share) {
      navigator.share({ title: 'My Leafprint Impact', text }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Impact summary copied to clipboard! Share it on your socials.');
    }
  };

  return (
    <div className="achievements-page page">
      <div className="container">
        {/* Header */}
        <div className="achievements-header fade-up flex justify-between items-start">
          <div>
            <h1>Achievements</h1>
            <p className="text-secondary">Level up your impact and collect badges.</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleShare}>
            <span className="mr-2">📤</span> Share Impact
          </button>
        </div>

        {/* Level Card */}
        <div className="level-card card card-body fade-up fade-up-delay-1">
          <div className="level-card-left">
            <div className="level-icon-xl">{levelInfo.icon}</div>
            <div className="level-card-info">
              <div className="caption" style={{ color: 'var(--color-primary)' }}>Current Level</div>
              <h2 className="level-card-title">{levelInfo.title}</h2>
              <p className="text-muted text-sm">Level {levelInfo.level} · {data.user.xp} XP earned</p>
            </div>
          </div>
          <div className="level-card-right">
            <div className="level-progress-labels">
              {LEVELS.map(l => (
                <div
                  key={l.level}
                  className={`level-step ${l.level <= levelInfo.level ? 'reached' : ''} ${l.level === levelInfo.level ? 'current' : ''}`}
                >
                  <span className="level-step-icon">{l.icon}</span>
                  <span className="level-step-name text-xs">{l.title}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted mb-2">
                <span>Level {levelInfo.level}</span>
                <span>{levelProgress}% to next</span>
              </div>
              <div className="progress-bar-track" style={{ height: 12 }}>
                <div
                  className="progress-bar-fill xp-bar-shimmer"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="ach-stats-row">
          <div className="card card-body ach-stat-card card-reveal card-reveal-1">
            <div className="ach-stat-value font-mono">{earnedCount}</div>
            <div className="ach-stat-label">of {totalBadges} badges earned</div>
          </div>
          <div className="card card-body ach-stat-card card-reveal card-reveal-2">
            <div className="ach-stat-value font-mono">{data.achievements.currentStreak}</div>
            <div className="ach-stat-label">day current streak</div>
          </div>
          <div className="card card-body ach-stat-card card-reveal card-reveal-3">
            <div className="ach-stat-value font-mono">{data.achievements.totalCo2Saved.toFixed(1)}</div>
            <div className="ach-stat-label">kg CO₂ saved total</div>
          </div>
          <div className="card card-body ach-stat-card card-reveal card-reveal-4">
            <div className="ach-stat-value font-mono">{completed.length}</div>
            <div className="ach-stat-label">challenges completed</div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="badges-section fade-up">
          <div className="badges-header">
            <h3>Badges</h3>
            <span className="badge badge-green">{earnedCount} / {totalBadges}</span>
          </div>
          <div className="badges-grid">
            {BADGES.map((badge) => {
              const earned = earnedBadges.has(badge.id);
              return (
                <div
                  key={badge.id}
                  id={`badge-${badge.id}`}
                  className={`badge-card card card-body ${earned ? 'badge-earned' : 'badge-locked'}`}
                  title={badge.description}
                >
                  <div className={`badge-emoji ${earned ? 'badge-pop' : ''}`}>
                    {earned ? badge.icon : '🔒'}
                  </div>
                  <div className="badge-name font-semibold text-sm">{badge.name}</div>
                  <div className="badge-desc text-xs text-muted">{badge.description}</div>
                  {earned && (
                    <div className="badge-earned-label caption" style={{ color: 'var(--color-primary)' }}>
                      Earned ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Challenges */}
        <div className="challenges-section fade-up fade-up-delay-2">
          <div className="challenges-header">
            <div>
              <h3>Weekly Challenges</h3>
              <p className="text-secondary text-sm">Pick one challenge to focus on this week. Earn 50 XP on completion.</p>
            </div>
            {activeChallenge && (
              <div className="active-challenge-badge">
                🎯 Challenge active
              </div>
            )}
          </div>

          <div className="challenges-grid">
            {CHALLENGES.map((challenge) => {
              const isActive = activeChallenge === challenge.id;
              const isDone = completed.includes(challenge.id);

              return (
                <button
                  key={challenge.id}
                  id={`challenge-${challenge.id}`}
                  className={`challenge-card card ${isActive ? 'challenge-active' : ''} ${isDone ? 'challenge-done' : ''}`}
                  onClick={() => !isDone && handleSelectChallenge(challenge.id)}
                  disabled={isDone}
                  type="button"
                >
                  <div className="challenge-icon">{challenge.icon}</div>
                  <div className="challenge-content">
                    <div className="challenge-name font-semibold">{challenge.name}</div>
                    <div className="challenge-desc text-sm text-secondary">{challenge.description}</div>
                  </div>
                  <div className="challenge-meta">
                    {isDone ? (
                      <span className="challenge-done-badge">✓ Done</span>
                    ) : isActive ? (
                      <span className="challenge-active-badge">Active</span>
                    ) : (
                      <span className="challenge-xp">+{challenge.xpReward} XP</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Virtual Offsetting Store */}
        <div className="offset-section fade-up fade-up-delay-3">
          <div className="offset-header mb-6">
            <h3>Virtual Offsetting</h3>
            <p className="text-secondary text-sm">Spend your hard-earned XP to virtually fund climate projects.</p>
          </div>
          <div className="offset-grid">
            <div className="card card-body offset-card">
              <div className="offset-icon">🌳</div>
              <h4 className="mt-3 mb-1">Plant a Virtual Tree</h4>
              <p className="text-xs text-muted mb-4">Absorbs ~20kg CO₂ per year.</p>
              <button 
                className={`btn ${data.user.xp >= 100 ? 'btn-primary' : 'btn-disabled'}`}
                onClick={() => handleBuyOffset(100, 'tree')}
                disabled={data.user.xp < 100}
                style={{ width: '100%' }}
              >
                100 XP
              </button>
            </div>
            <div className="card card-body offset-card">
              <div className="offset-icon">☀️</div>
              <h4 className="mt-3 mb-1">Fund Solar Power</h4>
              <p className="text-xs text-muted mb-4">Replaces dirty grid energy.</p>
              <button 
                className={`btn ${data.user.xp >= 250 ? 'btn-primary' : 'btn-disabled'}`}
                onClick={() => handleBuyOffset(250, 'solar')}
                disabled={data.user.xp < 250}
                style={{ width: '100%' }}
              >
                250 XP
              </button>
            </div>
            <div className="card card-body offset-card">
              <div className="offset-icon">💨</div>
              <h4 className="mt-3 mb-1">Clean Cookstoves</h4>
              <p className="text-xs text-muted mb-4">Reduces black carbon emissions.</p>
              <button 
                className={`btn ${data.user.xp >= 500 ? 'btn-primary' : 'btn-disabled'}`}
                onClick={() => handleBuyOffset(500, 'cookstove')}
                disabled={data.user.xp < 500}
                style={{ width: '100%' }}
              >
                500 XP
              </button>
            </div>
          </div>
          
          {/* Show owned offsets */}
          {data.achievements.unlockedOffsets && data.achievements.unlockedOffsets.length > 0 && (
            <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200" style={{ background: '#ecfdf5', borderColor: '#A7F3D0', borderRadius: '12px' }}>
              <div className="text-sm font-semibold text-green-800 mb-2">Your Impact Portfolio:</div>
              <div className="flex gap-2 flex-wrap">
                {data.achievements.unlockedOffsets.map((item, i) => (
                  <span key={i} className="text-2xl" title={item}>
                    {item === 'tree' ? '🌳' : item === 'solar' ? '☀️' : '💨'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
