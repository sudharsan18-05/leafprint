import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadData, saveData, toggleAction, saveFootprintResult,
  checkAndUnlockBadges, spendXp, getRecentActions, getMonthlyStats, getLast30Days,
} from '../utils/storage';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('Storage Utility', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('loadData', () => {
    it('should return default data structure when localStorage is empty', () => {
      const data = loadData();
      expect(data).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.user.xp).toBe(0);
      expect(data.footprintHistory).toEqual([]);
      expect(data.dailyActions).toEqual({});
      expect(data.achievements).toBeDefined();
      expect(data.achievements.currentStreak).toBe(0);
      expect(data.achievements.longestStreak).toBe(0);
      expect(data.achievements.totalCo2Saved).toBe(0);
      expect(data.achievements.badges).toEqual([]);
    });

    it('should return saved data when localStorage has data', () => {
      const mockData = {
        user: { xp: 100, country: 'uk' },
        footprintHistory: [{ total: 5.0, breakdown: {} }],
        dailyActions: {},
        achievements: {
          currentStreak: 3, longestStreak: 5,
          totalCo2Saved: 50, badges: ['first_step'],
        },
      };
      localStorageMock.setItem('leafprint_data', JSON.stringify(mockData));
      const data = loadData();
      expect(data.user.xp).toBe(100);
      expect(data.achievements.currentStreak).toBe(3);
    });

    it('should handle corrupted JSON gracefully', () => {
      localStorageMock.setItem('leafprint_data', 'not-valid-json');
      const data = loadData();
      expect(data).toBeDefined();
      expect(data.user).toBeDefined();
    });
  });

  describe('saveData', () => {
    it('should persist data to localStorage', () => {
      const data = loadData();
      data.user.xp = 200;
      saveData(data);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'leafprint_data',
        expect.stringContaining('"xp":200')
      );
    });
  });

  describe('toggleAction', () => {
    it('should add an action when not already logged today', () => {
      const data = loadData();
      const action = { id: 'bike_walk', co2Saved: 3.5, xp: 10 };
      const updated = toggleAction(data, action);
      const today = new Date().toISOString().split('T')[0];
      expect(updated.dailyActions[today]).toBeDefined();
      expect(updated.dailyActions[today].length).toBe(1);
      expect(updated.dailyActions[today][0].id).toBe('bike_walk');
      expect(updated.user.xp).toBe(10);
      expect(updated.achievements.totalCo2Saved).toBe(3.5);
    });

    it('should remove an action when already logged today', () => {
      const data = loadData();
      const action = { id: 'bike_walk', co2Saved: 3.5, xp: 10 };
      const first = toggleAction(data, action);
      const second = toggleAction(first, action);
      const today = new Date().toISOString().split('T')[0];
      expect(second.dailyActions[today].length).toBe(0);
    });
  });

  describe('saveFootprintResult', () => {
    it('should append a footprint result to history', () => {
      const data = loadData();
      const result = { total: 8.5, breakdown: { transport: 4, energy: 2, food: 1.5, lifestyle: 1 } };
      const updated = saveFootprintResult(data, result);
      expect(updated.footprintHistory.length).toBe(1);
      expect(updated.footprintHistory[0].total).toBe(8.5);
      expect(updated.footprintHistory[0].date).toBeDefined();
    });
  });

  describe('spendXp', () => {
    it('should deduct XP when user has enough', () => {
      const data = loadData();
      data.user.xp = 500;
      saveData(data);
      const updated = spendXp(data, 100, 'tree');
      expect(updated.user.xp).toBe(400);
      expect(updated.achievements.unlockedOffsets).toContain('tree');
    });

    it('should NOT deduct XP when user has insufficient balance', () => {
      const data = loadData();
      data.user.xp = 50;
      const updated = spendXp(data, 100, 'tree');
      expect(updated.user.xp).toBe(50);
    });
  });

  describe('getRecentActions', () => {
    it('should return empty array when no actions exist', () => {
      const data = loadData();
      const recent = getRecentActions(data, 5);
      expect(recent).toEqual([]);
    });
  });

  describe('getMonthlyStats', () => {
    it('should return zero stats for fresh data', () => {
      const data = loadData();
      const stats = getMonthlyStats(data);
      expect(stats.totalSaved).toBe('0.0');
      expect(stats.daysLogged).toBe(0);
    });
  });

  describe('getLast30Days', () => {
    it('should return an array of 30 day objects', () => {
      const data = loadData();
      const days = getLast30Days(data);
      expect(days.length).toBe(30);
      expect(days[0]).toHaveProperty('date');
      expect(days[0]).toHaveProperty('logged');
      expect(days[0]).toHaveProperty('day');
    });
  });
});
