import { describe, it, expect } from 'vitest';
import {
  EMISSION_FACTORS, COUNTRY_AVERAGES, PARIS_TARGET,
  CATEGORY_CONFIG, EQUIVALENCES, ACTIONS, LEVELS, BADGES,
  CHALLENGES, TIPS, getLevelInfo, getLevelProgress,
} from '../data/constants';

describe('Constants — Emission Factors', () => {
  it('should have all 4 categories', () => {
    expect(EMISSION_FACTORS.transport).toBeDefined();
    expect(EMISSION_FACTORS.energy).toBeDefined();
    expect(EMISSION_FACTORS.food).toBeDefined();
    expect(EMISSION_FACTORS.lifestyle).toBeDefined();
  });

  it('should have positive emission values', () => {
    Object.values(EMISSION_FACTORS.transport).forEach((val) => {
      expect(val).toBeGreaterThanOrEqual(0);
    });
  });

  it('electric car should emit less than petrol', () => {
    expect(EMISSION_FACTORS.transport.electric).toBeLessThan(
      EMISSION_FACTORS.transport.medium_petrol
    );
  });

  it('vegan diet should have lower footprint than omnivore', () => {
    expect(EMISSION_FACTORS.food.vegan).toBeLessThan(EMISSION_FACTORS.food.omnivore);
  });
});

describe('Constants — Country Averages', () => {
  it('should include global average', () => {
    expect(COUNTRY_AVERAGES.global).toBe(6.6);
  });

  it('Paris target should be 2.0 tonnes', () => {
    expect(PARIS_TARGET).toBe(2.0);
  });

  it('all averages should be positive numbers', () => {
    Object.values(COUNTRY_AVERAGES).forEach((val) => {
      expect(val).toBeGreaterThan(0);
    });
  });
});

describe('Constants — Category Config', () => {
  it('should have config for all 4 categories', () => {
    ['transport', 'energy', 'food', 'lifestyle'].forEach((cat) => {
      expect(CATEGORY_CONFIG[cat]).toBeDefined();
      expect(CATEGORY_CONFIG[cat].label).toBeTruthy();
      expect(CATEGORY_CONFIG[cat].color).toBeTruthy();
      expect(CATEGORY_CONFIG[cat].icon).toBeTruthy();
    });
  });
});

describe('Constants — Actions', () => {
  it('should have at least 10 actions', () => {
    expect(ACTIONS.length).toBeGreaterThanOrEqual(10);
  });

  it('each action should have required fields', () => {
    ACTIONS.forEach((action) => {
      expect(action.id).toBeTruthy();
      expect(action.label).toBeTruthy();
      expect(action.icon).toBeTruthy();
      expect(typeof action.co2Saved).toBe('number');
      expect(action.category).toBeTruthy();
      expect(typeof action.xp).toBe('number');
    });
  });

  it('should have unique action IDs', () => {
    const ids = ACTIONS.map((a) => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('advocacy actions should award higher XP', () => {
    const advocacy = ACTIONS.find((a) => a.id === 'advocacy_petition');
    const regular = ACTIONS.find((a) => a.id === 'lights_off');
    expect(advocacy.xp).toBeGreaterThan(regular.xp);
  });
});

describe('Constants — Levels', () => {
  it('should have 6 levels', () => {
    expect(LEVELS.length).toBe(6);
  });

  it('levels should be in ascending XP order', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].minXp).toBeGreaterThan(LEVELS[i - 1].minXp);
    }
  });
});

describe('getLevelInfo', () => {
  it('should return Seedling for 0 XP', () => {
    expect(getLevelInfo(0).title).toBe('Seedling');
  });

  it('should return Sprout for 150 XP', () => {
    expect(getLevelInfo(150).title).toBe('Sprout');
  });

  it('should return Earth Guardian for 2000+ XP', () => {
    expect(getLevelInfo(5000).title).toBe('Earth Guardian');
  });
});

describe('getLevelProgress', () => {
  it('should return 0% at level start', () => {
    expect(getLevelProgress(0)).toBe(0);
  });

  it('should return 50% at midpoint', () => {
    expect(getLevelProgress(50)).toBe(50);
  });

  it('should return 100% at max level', () => {
    expect(getLevelProgress(2000)).toBe(100);
  });
});

describe('Constants — Equivalences', () => {
  it('should have formula functions', () => {
    EQUIVALENCES.forEach((eq) => {
      expect(typeof eq.formula).toBe('function');
    });
  });

  it('trees formula should return positive number for positive input', () => {
    const trees = EQUIVALENCES.find((e) => e.id === 'trees');
    expect(trees.formula(5)).toBeGreaterThan(0);
  });

  it('zero footprint should return zero trees', () => {
    const trees = EQUIVALENCES.find((e) => e.id === 'trees');
    expect(trees.formula(0)).toBe(0);
  });
});

describe('Constants — Badges', () => {
  it('should have at least 10 badges', () => {
    expect(BADGES.length).toBeGreaterThanOrEqual(10);
  });

  it('each badge should have a condition function', () => {
    BADGES.forEach((badge) => {
      expect(typeof badge.condition).toBe('function');
    });
  });

  it('should have unique badge IDs', () => {
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('Constants — Challenges', () => {
  it('should have at least 5 challenges', () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
  });

  it('each challenge should award XP', () => {
    CHALLENGES.forEach((c) => {
      expect(c.xpReward).toBeGreaterThan(0);
    });
  });
});

describe('Constants — Tips', () => {
  it('should have tips for all 4 categories', () => {
    ['transport', 'energy', 'food', 'lifestyle'].forEach((cat) => {
      expect(TIPS[cat]).toBeDefined();
      expect(TIPS[cat].length).toBeGreaterThan(0);
    });
  });

  it('each tip should have required fields', () => {
    Object.values(TIPS).flat().forEach((tip) => {
      expect(tip.title).toBeTruthy();
      expect(tip.description).toBeTruthy();
      expect(typeof tip.saving).toBe('number');
      expect(tip.effort).toBeTruthy();
      expect(tip.impact).toBeTruthy();
    });
  });
});
