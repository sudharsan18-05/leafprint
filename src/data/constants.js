// ============================================
// LEAFPRINT — Data Constants & Emission Factors
// ============================================

// --- Emission Factors ---
export const EMISSION_FACTORS = {
  transport: {
    no_car: 0,
    small_petrol: 0.12,    // kg CO2 per km
    medium_petrol: 0.17,
    large_petrol: 0.22,
    small_diesel: 0.11,
    medium_diesel: 0.15,
    hybrid: 0.09,
    electric: 0.05,
    flight_short: 255,     // kg CO2 per return trip
    flight_medium: 700,
    flight_long: 1800,
  },
  energy: {
    electricity_coal: 0.82,    // kg CO2 per kWh
    electricity_mixed: 0.45,
    electricity_gas: 0.35,
    electricity_renewable: 0.05,
    heating_gas: 2.0,          // tonnes CO2 per year per home size factor
    heating_electric: 1.2,
    heating_oil: 2.5,
    heating_heat_pump: 0.4,
    heating_none: 0,
  },
  food: {
    vegan: 1.5,           // tonnes CO2 per year
    vegetarian: 1.7,
    flexitarian: 2.2,
    omnivore: 3.3,
    heavy_meat: 3.8,
  },
  lifestyle: {
    shopping_none: 0,
    shopping_low: 0.3,
    shopping_medium: 0.7,
    shopping_high: 1.4,
    shopping_very_high: 2.2,
  },
};

// --- National Average Footprints (tonnes CO2e/year per person) ---
export const COUNTRY_AVERAGES = {
  usa: 17.6,
  canada: 15.1,
  australia: 14.8,
  germany: 8.5,
  uk: 5.5,
  france: 5.1,
  china: 8.7,
  india: 2.2,
  brazil: 2.9,
  global: 6.6,
};

export const PARIS_TARGET = 2.0; // tonnes CO2e/year

// --- Category Colors ---
export const CATEGORY_CONFIG = {
  transport: {
    label: 'Transport',
    color: '#2563EB',
    lightColor: '#DBEAFE',
    icon: '🚗',
  },
  energy: {
    label: 'Home Energy',
    color: '#D97706',
    lightColor: '#FEF3C7',
    icon: '⚡',
  },
  food: {
    label: 'Food & Diet',
    color: '#059669',
    lightColor: '#D1FAE5',
    icon: '🍽️',
  },
  lifestyle: {
    label: 'Lifestyle',
    color: '#7C3AED',
    lightColor: '#EDE9FE',
    icon: '🛍️',
  },
};

// --- Impact Equivalences ---
export const EQUIVALENCES = [
  {
    id: 'trees',
    label: 'Trees to offset',
    icon: '🌳',
    unit: 'trees/year',
    formula: (tonnes) => Math.round((tonnes * 1000) / 21),
    description: 'Trees needed to absorb your annual footprint',
  },
  {
    id: 'flights',
    label: 'Long-haul flights',
    icon: '✈️',
    unit: 'return trips',
    formula: (tonnes) => ((tonnes * 1000) / 1800).toFixed(1),
    description: 'Equivalent London–New York return flights',
  },
  {
    id: 'driving',
    label: 'Driving distance',
    icon: '🚗',
    unit: 'km of driving',
    formula: (tonnes) => Math.round((tonnes * 1000) / 0.21).toLocaleString(),
    description: 'Kilometres driven in an average car',
  },
  {
    id: 'phones',
    label: 'Phone charges',
    icon: '📱',
    unit: 'charges',
    formula: (tonnes) => Math.round((tonnes * 1000) / 0.008).toLocaleString(),
    description: 'Smartphone full charges',
  },
];

// --- Daily Actions Library ---
export const ACTIONS = [
  // Health & Savings focused
  { id: 'plant_meal', label: 'Ate a plant-based meal', icon: '🥗', co2Saved: 2.5, category: 'food', xp: 10, tags: ['❤️ Health', '💰 Savings'] },
  { id: 'public_transit', label: 'Took public transit', icon: '🚌', co2Saved: 2.6, category: 'transport', xp: 10, tags: ['💰 Savings'] },
  { id: 'bike_walk', label: 'Biked or walked', icon: '🚲', co2Saved: 3.5, category: 'transport', xp: 10, tags: ['❤️ Health', '💰 Savings'] },
  { id: 'carpool', label: 'Carpooled today', icon: '🚗', co2Saved: 1.5, category: 'transport', xp: 10, tags: ['💰 Savings'] },
  { id: 'hang_dry', label: 'Hung clothes to dry', icon: '👕', co2Saved: 1.0, category: 'energy', xp: 10, tags: ['💰 Savings'] },
  { id: 'cold_laundry', label: 'Cold water laundry', icon: '💧', co2Saved: 0.6, category: 'energy', xp: 10, tags: ['💰 Savings'] },
  { id: 'zero_waste', label: 'Zero food waste today', icon: '♻️', co2Saved: 1.4, category: 'food', xp: 10, tags: ['💰 Savings'] },
  { id: 'reusable', label: 'Used reusable bag/bottle', icon: '🛍️', co2Saved: 0.3, category: 'lifestyle', xp: 10, tags: ['💰 Savings'] },
  { id: 'no_shopping', label: 'Skipped online shopping', icon: '📦', co2Saved: 0.5, category: 'lifestyle', xp: 10, tags: ['💰 Savings'] },
  { id: 'lights_off', label: 'Turned off lights/devices', icon: '💡', co2Saved: 0.3, category: 'energy', xp: 10, tags: ['💰 Savings'] },
  { id: 'compost', label: 'Composted organic waste', icon: '🍂', co2Saved: 0.8, category: 'food', xp: 10, tags: [] },
  // Advocacy & Education (Paper Recommendations)
  { id: 'advocacy_petition', label: 'Signed a climate petition', icon: '✍️', co2Saved: 0, category: 'lifestyle', xp: 20, tags: ['🌍 Advocacy'] },
  { id: 'family_education', label: 'Taught family about footprint', icon: '👨‍👩‍👧‍👦', co2Saved: 0, category: 'lifestyle', xp: 25, tags: ['📚 Education'] },
];

// --- Gamification Levels ---
export const LEVELS = [
  { level: 1, title: 'Seedling', icon: '🌱', minXp: 0, maxXp: 100 },
  { level: 2, title: 'Sprout', icon: '🌿', minXp: 100, maxXp: 300 },
  { level: 3, title: 'Sapling', icon: '🌳', minXp: 300, maxXp: 600 },
  { level: 4, title: 'Tree', icon: '🌲', minXp: 600, maxXp: 1000 },
  { level: 5, title: 'Forest', icon: '🌍', minXp: 1000, maxXp: 2000 },
  { level: 6, title: 'Earth Guardian', icon: '⭐', minXp: 2000, maxXp: 2000 },
];

export function getLevelInfo(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(xp) {
  const current = getLevelInfo(xp);
  const idx = LEVELS.indexOf(current);
  if (idx === LEVELS.length - 1) return 100;
  const next = LEVELS[idx + 1];
  return Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100);
}

// --- Badges ---
export const BADGES = [
  {
    id: 'first_step', icon: '🏅', name: 'First Step',
    description: 'Complete your first carbon calculation',
    condition: (data) => data.footprintHistory.length >= 1,
  },
  {
    id: 'on_fire', icon: '🔥', name: 'On Fire',
    description: '7-day action logging streak',
    condition: (data) => data.achievements.longestStreak >= 7,
  },
  {
    id: 'dedicated', icon: '🌟', name: 'Dedicated',
    description: '30-day action logging streak',
    condition: (data) => data.achievements.longestStreak >= 30,
  },
  {
    id: 'plant_pioneer', icon: '🥬', name: 'Plant Pioneer',
    description: 'Log 10 plant-based meals',
    condition: (data) => {
      const count = Object.values(data.dailyActions)
        .flat().filter(a => a.id === 'plant_meal').length;
      return count >= 10;
    },
  },
  {
    id: 'road_warrior', icon: '🚲', name: 'Road Warrior',
    description: 'Log 20 bike or walk trips',
    condition: (data) => {
      const count = Object.values(data.dailyActions)
        .flat().filter(a => a.id === 'bike_walk').length;
      return count >= 20;
    },
  },
  {
    id: 'zero_waste_hero', icon: '♻️', name: 'Zero Waste Hero',
    description: 'Log 15 zero-waste days',
    condition: (data) => {
      const count = Object.values(data.dailyActions)
        .flat().filter(a => a.id === 'zero_waste').length;
      return count >= 15;
    },
  },
  {
    id: 'carbon_cutter', icon: '📉', name: 'Carbon Cutter',
    description: 'Reduce footprint by 10% on recalculation',
    condition: (data) => {
      if (data.footprintHistory.length < 2) return false;
      const first = data.footprintHistory[0].total;
      const last = data.footprintHistory[data.footprintHistory.length - 1].total;
      return last <= first * 0.9;
    },
  },
  {
    id: 'below_average', icon: '🌍', name: 'Below Average',
    description: 'Get below global average (6.6t)',
    condition: (data) => {
      if (!data.footprintHistory.length) return false;
      const last = data.footprintHistory[data.footprintHistory.length - 1].total;
      return last < 6.6;
    },
  },
  {
    id: 'paris_ready', icon: '🎯', name: 'Paris Ready',
    description: 'Reach below 2 tonnes/year',
    condition: (data) => {
      if (!data.footprintHistory.length) return false;
      const last = data.footprintHistory[data.footprintHistory.length - 1].total;
      return last < 2;
    },
  },
  {
    id: 'century', icon: '💯', name: 'Century',
    description: 'Save 100 kg CO₂ through daily actions',
    condition: (data) => data.achievements.totalCo2Saved >= 100,
  },
  {
    id: 'half_ton', icon: '🏔️', name: 'Half Ton',
    description: 'Save 500 kg CO₂ through daily actions',
    condition: (data) => data.achievements.totalCo2Saved >= 500,
  },
  {
    id: 'tonne_saver', icon: '👑', name: 'Tonne Saver',
    description: 'Save 1,000 kg CO₂ through daily actions',
    condition: (data) => data.achievements.totalCo2Saved >= 1000,
  },
];

// --- Weekly Challenges ---
export const CHALLENGES = [
  {
    id: 'meat_free_week', icon: '🥬', name: 'Meat-Free Week',
    description: 'Go meat-free Monday to Friday',
    xpReward: 50,
    duration: 7,
  },
  {
    id: 'active_commute', icon: '🚲', name: 'Active Commuter',
    description: 'Walk or bike every day this week',
    xpReward: 50,
    duration: 7,
  },
  {
    id: 'zero_waste_challenge', icon: '♻️', name: 'Zero Waste Week',
    description: 'Zero food waste for 7 days',
    xpReward: 50,
    duration: 7,
  },
  {
    id: 'no_shopping', icon: '📦', name: 'No-Buy Challenge',
    description: 'No online shopping for 7 days',
    xpReward: 50,
    duration: 7,
  },
  {
    id: 'cold_week', icon: '💧', name: 'Cold Week',
    description: 'Cold water laundry all week',
    xpReward: 50,
    duration: 7,
  },
  {
    id: 'eco_educator', icon: '📚', name: 'Eco Educator',
    description: 'Complete 3 education/advocacy actions',
    xpReward: 100,
    duration: 7,
  },
];

// --- Insights / Tips ---
export const TIPS = {
  transport: [
    {
      title: 'Switch to public transit',
      description: 'Taking public transit instead of driving saves an average of 2.6 kg CO₂ per trip.',
      saving: 0.95,
      effort: 'Easy',
      impact: 'High',
    },
    {
      title: 'Walk or bike for short trips',
      description: 'For trips under 5 km, walking or cycling eliminates emissions entirely and improves your health.',
      saving: 0.5,
      effort: 'Easy',
      impact: 'Medium',
    },
    {
      title: 'Reduce one flight per year',
      description: 'One less long-haul return flight saves up to 1.8 tonnes of CO₂ — the single biggest individual action.',
      saving: 1.8,
      effort: 'Easy',
      impact: 'Very High',
    },
    {
      title: 'Switch to an electric vehicle',
      description: 'Moving from a petrol car to an EV reduces transport emissions by up to 70%, saving ~2 tonnes/year.',
      saving: 2.0,
      effort: 'Hard',
      impact: 'Very High',
    },
  ],
  energy: [
    {
      title: 'Switch to a renewable energy tariff',
      description: 'Switching your electricity provider to 100% renewable energy can save up to 2.5 tonnes/year.',
      saving: 2.5,
      effort: 'Easy',
      impact: 'Very High',
    },
    {
      title: 'Lower your thermostat by 1°C',
      description: 'Each 1°C reduction in heating saves roughly 10% on heating bills and ~0.3 tonnes of CO₂.',
      saving: 0.3,
      effort: 'Easy',
      impact: 'Medium',
    },
    {
      title: 'Install a heat pump',
      description: 'Heat pumps are 3× more efficient than gas boilers, saving up to 0.9 tonnes of CO₂/year.',
      saving: 0.9,
      effort: 'Hard',
      impact: 'High',
    },
    {
      title: 'Improve home insulation',
      description: 'Proper loft and wall insulation reduces heating demand by 30–40%, saving 0.5–1 tonne/year.',
      saving: 0.75,
      effort: 'Medium',
      impact: 'High',
    },
  ],
  food: [
    {
      title: 'Try plant-based meals 3 days/week',
      description: 'Replacing meat with plant-based alternatives three days a week saves around 0.5 tonnes/year.',
      saving: 0.5,
      effort: 'Easy',
      impact: 'High',
    },
    {
      title: 'Reduce food waste by half',
      description: 'About one-third of all food is wasted. Cutting waste in half saves approximately 0.4 tonnes/year.',
      saving: 0.4,
      effort: 'Easy',
      impact: 'Medium',
    },
    {
      title: 'Go fully plant-based',
      description: 'A vegan diet has the lowest carbon footprint — up to 1.5 tonnes/year less than an omnivore diet.',
      saving: 1.5,
      effort: 'Hard',
      impact: 'Very High',
    },
    {
      title: 'Buy local and seasonal produce',
      description: 'Locally grown seasonal food has significantly lower transport and storage emissions.',
      saving: 0.2,
      effort: 'Easy',
      impact: 'Low',
    },
  ],
  lifestyle: [
    {
      title: 'Buy secondhand clothing',
      description: 'Buying secondhand instead of new clothing saves approximately 0.2 tonnes of CO₂/year.',
      saving: 0.2,
      effort: 'Easy',
      impact: 'Medium',
    },
    {
      title: 'Reduce fast fashion purchases',
      description: 'Cutting clothing purchases in half and keeping clothes longer significantly reduces lifecycle emissions.',
      saving: 0.3,
      effort: 'Easy',
      impact: 'Medium',
    },
    {
      title: 'Repair instead of replace electronics',
      description: 'Manufacturing a new smartphone takes ~70 kg CO₂. Extending device life by 2 years halves this impact.',
      saving: 0.25,
      effort: 'Medium',
      impact: 'Medium',
    },
    {
      title: 'Choose experiences over things',
      description: 'Spending on experiences (concerts, dining, travel) typically has a lower carbon footprint than buying goods.',
      saving: 0.3,
      effort: 'Easy',
      impact: 'Medium',
    },
  ],
};
