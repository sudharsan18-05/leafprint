// ============================================
// LEAFPRINT — LocalStorage Utility
// ============================================

import { safeJsonParse, validateNumber, isValidDateKey } from './sanitize';

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

/**
 * Loads persisted Leafprint data from localStorage, merging with
 * DEFAULT_STATE to ensure all fields are always present.
 * @returns {object} The full application data object.
 */
export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    const parsed = safeJsonParse(raw, null);
    if (!parsed || typeof parsed !== 'object') return JSON.parse(JSON.stringify(DEFAULT_STATE));
    // Merge with defaults to handle new fields added in updates
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

/**
 * Persists the full data object to localStorage.
 * @param {object} data - The application state to save.
 */
export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('[Leafprint] Failed to save data:', e);
  }
}

/**
 * Clears all Leafprint data from localStorage. Irreversible.
 */
export function clearData() {
  localStorage.removeItem(STORAGE_KEY);
}

// --- Footprint helpers ---
/**
 * Appends a new footprint calculation result to the user's history
 * and awards 25 XP for completing the calculator.
 * @param {object} data - Current application state.
 * @param {object} result - The footprint result (must include `total`).
 * @returns {object} Updated application state.
 */
export function saveFootprintResult(data, result) {
  const updated = { ...data };
  updated.footprintHistory = [
    ...data.footprintHistory,
    { ...result, date: new Date().toISOString().split('T')[0] },
  ];
  updated.user = { ...data.user, onboardingComplete: true };
  // Award XP for completing a calculation
  updated.user.xp = validateNumber((data.user.xp || 0) + 25, 0, 999999, 25);
  saveData(updated);
  return updated;
}

// --- Action helpers ---
/**
 * Returns today's date as an ISO string key (YYYY-MM-DD).
 * @returns {string} Today's date key.
 */
export function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns all actions logged today.
 * @param {object} data - Application state.
 * @returns {Array} List of today's logged actions.
 */
export function getTodayActions(data) {
  return data.dailyActions[getTodayKey()] || [];
}

/**
 * Checks whether a specific action has been logged today.
 * @param {object} data - Application state.
 * @param {string} actionId - The action ID to check.
 * @returns {boolean} True if the action is already logged today.
 */
export function isActionLoggedToday(data, actionId) {
  return getTodayActions(data).some(a => a.id === actionId);
}

/**
 * Toggles a daily action on or off for today.
 * Updates XP, streak, and total CO2 saved accordingly.
 * @param {object} data - Current application state.
 * @param {{ id: string, co2Saved: number, xp: number }} action - The action to toggle.
 * @returns {object} Updated application state.
 */
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

  const newTotalCo2 = validateNumber((data.achievements.totalCo2Saved || 0) + co2Delta, 0, 999999);
  const newXp = validateNumber((data.user.xp || 0) + xpDelta, 0, 999999);

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
/**
 * Checks which badges the user has newly unlocked based on current data.
 * @param {object} data - Current application state.
 * @param {Array<{id: string, condition: function}>} badges - Badge definitions.
 * @returns {{ data: object, newBadges: string[] }} Updated state and list of newly unlocked badge IDs.
 */
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
/**
 * Deducts XP from the user to purchase a carbon offset item.
 * Returns state unchanged if the user has insufficient XP.
 * @param {object} data - Current application state.
 * @param {number} cost - XP cost of the offset.
 * @param {string} offsetItem - Identifier of the offset being purchased.
 * @returns {object} Updated application state.
 */
export function spendXp(data, cost, offsetItem) {
  if (data.user.xp < cost) return data;

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
/**
 * Computes aggregated stats for the current calendar month.
 * @param {object} data - Application state.
 * @returns {{ totalSaved: string, daysLogged: number, topActionId: string|undefined }}
 */
export function getMonthlyStats(data) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  let totalSaved = 0;
  let daysLogged = 0;
  const actionCounts = {};

  Object.entries(data.dailyActions).forEach(([dateStr, actions]) => {
    if (!isValidDateKey(dateStr)) return; // Skip malformed keys
    const date = new Date(dateStr);
    if (date >= monthStart && date <= now) {
      if (actions.length > 0) daysLogged++;
      actions.forEach(a => {
        totalSaved += a.co2Saved;
        actionCounts[a.id] = (actionCounts[a.id] || 0) + 1;
      });
    }
  });

  const topActionId = Object.entries(actionCounts).sort(([, a], [, b]) => b - a)[0]?.[0];

  return { totalSaved: totalSaved.toFixed(1), daysLogged, topActionId };
}

/**
 * Returns the N most recently logged actions across all days.
 * @param {object} data - Application state.
 * @param {number} [limit=5] - Maximum number of actions to return.
 * @returns {Array<{ id: string, co2Saved: number, date: string }>}
 */
export function getRecentActions(data, limit = 5) {
  const all = [];
  const sorted = Object.entries(data.dailyActions)
    .filter(([dateStr]) => isValidDateKey(dateStr))
    .sort(([a], [b]) => b.localeCompare(a));

  for (const [date, actions] of sorted) {
    for (const a of actions) {
      all.push({ ...a, date });
      if (all.length >= limit) return all;
    }
  }
  return all;
}

/**
 * Builds an ordered array of the last 30 days with logging status.
 * @param {object} data - Application state.
 * @returns {Array<{ date: string, day: number, logged: boolean, co2Saved: number }>}
 */
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
