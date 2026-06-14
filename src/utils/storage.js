// ============================================
// LEAFPRINT — LocalStorage Utility
// ============================================

const STORAGE_KEY = 'leafprint_data';

const DEFAULT_STATE = {
  user: {
    name: '',
    country: 'global',
    createdAt: new Date().toISOString().split('T')[0],
    xp: 0,
    onboardingComplete: false,
  },
  footprintHistory: [],
  dailyActions: {},
  achievements: {
    badges: [],
    currentStreak: 0,
    longestStreak: 0,
    totalCo2Saved: 0,
    activeChallengeId: null,
    completedChallenges: [],
    challengeStartDate: null,
  },
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle new fields
    return {
      ...DEFAULT_STATE,
      ...parsed,
      user: { ...DEFAULT_STATE.user, ...(parsed.user || {}) },
      achievements: { ...DEFAULT_STATE.achievements, ...(parsed.achievements || {}) },
    };
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

export function clearData() {
  localStorage.removeItem(STORAGE_KEY);
}

// --- Footprint helpers ---
export function saveFootprintResult(data, result) {
  const updated = { ...data };
  updated.footprintHistory = [
    ...data.footprintHistory,
    { ...result, date: new Date().toISOString().split('T')[0] },
  ];
  updated.user = { ...data.user, onboardingComplete: true };
  // Add XP for calculation
  updated.user.xp = (data.user.xp || 0) + 25;
  saveData(updated);
  return updated;
}

// --- Action helpers ---
export function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

export function getTodayActions(data) {
  return data.dailyActions[getTodayKey()] || [];
}

export function isActionLoggedToday(data, actionId) {
  return getTodayActions(data).some(a => a.id === actionId);
}

export function toggleAction(data, action) {
  const today = getTodayKey();
  const todayActions = data.dailyActions[today] || [];
  const alreadyLogged = todayActions.some(a => a.id === action.id);

  let updatedTodayActions;
  let co2Delta = 0;
  let xpDelta = 0;

  if (alreadyLogged) {
    updatedTodayActions = todayActions.filter(a => a.id !== action.id);
    co2Delta = -action.co2Saved;
    xpDelta = -action.xp;
  } else {
    updatedTodayActions = [...todayActions, { id: action.id, co2Saved: action.co2Saved }];
    co2Delta = action.co2Saved;
    xpDelta = action.xp;
  }

  const updatedDailyActions = {
    ...data.dailyActions,
    [today]: updatedTodayActions,
  };

  const newTotalCo2 = Math.max(0, (data.achievements.totalCo2Saved || 0) + co2Delta);
  const newXp = Math.max(0, (data.user.xp || 0) + xpDelta);

  // Calculate streak
  const streak = calculateStreak(updatedDailyActions);

  const updated = {
    ...data,
    dailyActions: updatedDailyActions,
    user: { ...data.user, xp: newXp },
    achievements: {
      ...data.achievements,
      totalCo2Saved: newTotalCo2,
      currentStreak: streak.current,
      longestStreak: Math.max(data.achievements.longestStreak || 0, streak.current),
    },
  };

  saveData(updated);
  return updated;
}

function calculateStreak(dailyActions) {
  const today = new Date();
  let current = 0;

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (dailyActions[key] && dailyActions[key].length > 0) {
      current++;
    } else {
      break;
    }
  }
  return { current };
}

// --- Badge helpers ---
export function checkAndUnlockBadges(data, badges) {
  const currentBadges = data.achievements.badges || [];
  const newBadges = badges
    .filter(b => !currentBadges.includes(b.id) && b.condition(data))
    .map(b => b.id);

  if (newBadges.length === 0) return { data, newBadges: [] };

  const updated = {
    ...data,
    achievements: {
      ...data.achievements,
      badges: [...currentBadges, ...newBadges],
    },
  };
  saveData(updated);
  return { data: updated, newBadges };
}

// --- Offsetting helpers ---
export function spendXp(data, cost, offsetItem) {
  if (data.user.xp < cost) return data; // Not enough XP
  
  const currentOffsets = data.achievements.unlockedOffsets || [];
  const updated = {
    ...data,
    user: { ...data.user, xp: data.user.xp - cost },
    achievements: {
      ...data.achievements,
      unlockedOffsets: [...currentOffsets, offsetItem],
    },
  };
  saveData(updated);
  return updated;
}

// --- Stats helpers ---
export function getMonthlyStats(data) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  let totalSaved = 0;
  let daysLogged = 0;
  let actionCounts = {};

  Object.entries(data.dailyActions).forEach(([dateStr, actions]) => {
    const date = new Date(dateStr);
    if (date >= monthStart && date <= now) {
      if (actions.length > 0) daysLogged++;
      actions.forEach(a => {
        totalSaved += a.co2Saved;
        actionCounts[a.id] = (actionCounts[a.id] || 0) + 1;
      });
    }
  });

  const topActionId = Object.entries(actionCounts).sort(([,a],[,b]) => b - a)[0]?.[0];

  return { totalSaved: totalSaved.toFixed(1), daysLogged, topActionId };
}

export function getRecentActions(data, limit = 5) {
  const all = [];
  const sorted = Object.entries(data.dailyActions)
    .sort(([a], [b]) => b.localeCompare(a));

  for (const [date, actions] of sorted) {
    for (const a of actions) {
      all.push({ ...a, date });
      if (all.length >= limit) return all;
    }
  }
  return all;
}

export function getLast30Days(data) {
  const result = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const actions = data.dailyActions[key] || [];
    result.push({
      date: key,
      day: d.getDate(),
      logged: actions.length > 0,
      co2Saved: actions.reduce((sum, a) => sum + a.co2Saved, 0),
    });
  }
  return result;
}
