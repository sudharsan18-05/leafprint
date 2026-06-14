import { useState } from 'react';
import { loadData, saveFootprintResult, checkAndUnlockBadges } from '../../utils/storage';
import { EMISSION_FACTORS, BADGES } from '../../data/constants';
import Results from './Results';
import './Calculator.css';

const STEPS = [
  {
    id: 'transport',
    label: 'Transport',
    icon: '🚗',
    title: 'How do you get around?',
    subtitle: 'Your travel habits have a big impact on your footprint.',
    fields: [
      {
        id: 'car_type',
        label: 'What type of car do you primarily drive?',
        type: 'radio',
        options: [
          { value: 'no_car', label: 'I don\'t own a car' },
          { value: 'small_petrol', label: 'Small petrol/gasoline car' },
          { value: 'medium_petrol', label: 'Medium petrol/gasoline car' },
          { value: 'large_petrol', label: 'Large petrol/gasoline car or SUV' },
          { value: 'hybrid', label: 'Hybrid car' },
          { value: 'electric', label: 'Electric vehicle (EV)' },
        ],
      },
      {
        id: 'weekly_km',
        label: 'How many kilometres do you drive per week?',
        type: 'radio',
        showIf: (ans) => ans.car_type && ans.car_type !== 'no_car',
        options: [
          { value: '0', label: 'Less than 50 km' },
          { value: '100', label: '50–150 km' },
          { value: '250', label: '150–350 km' },
          { value: '450', label: '350–600 km' },
          { value: '700', label: 'More than 600 km' },
        ],
      },
      {
        id: 'flights',
        label: 'How many return flights do you take per year?',
        type: 'radio',
        options: [
          { value: 'none', label: 'None' },
          { value: 'short_1', label: '1–2 short-haul (under 3hrs)' },
          { value: 'short_3', label: '3+ short-haul flights' },
          { value: 'long_1', label: '1–2 long-haul (over 3hrs)' },
          { value: 'long_3', label: '3+ long-haul flights' },
        ],
      },
    ],
  },
  {
    id: 'energy',
    label: 'Home Energy',
    icon: '⚡',
    title: 'How do you power your home?',
    subtitle: 'Energy use at home is often the second-largest footprint category.',
    fields: [
      {
        id: 'electricity_source',
        label: 'What powers your home electricity?',
        type: 'radio',
        options: [
          { value: 'electricity_renewable', label: 'Mostly renewable (solar, wind, hydro)' },
          { value: 'electricity_mixed', label: 'Mixed grid (some renewables)' },
          { value: 'electricity_gas', label: 'Mostly gas-generated' },
          { value: 'electricity_coal', label: 'Mostly coal-generated' },
        ],
      },
      {
        id: 'heating',
        label: 'How do you heat your home?',
        type: 'radio',
        options: [
          { value: 'heating_heat_pump', label: 'Heat pump or geothermal' },
          { value: 'heating_electric', label: 'Electric heating' },
          { value: 'heating_gas', label: 'Natural gas boiler' },
          { value: 'heating_oil', label: 'Oil/LPG boiler' },
          { value: 'heating_none', label: 'No heating needed / Other' },
        ],
      },
      {
        id: 'home_size',
        label: 'How big is your home? (rooms you regularly heat/cool)',
        type: 'radio',
        options: [
          { value: '0.5', label: 'Studio or 1 bedroom' },
          { value: '0.8', label: '2 bedrooms' },
          { value: '1.0', label: '3 bedrooms' },
          { value: '1.4', label: '4 bedrooms' },
          { value: '1.8', label: '5+ bedrooms' },
        ],
      },
    ],
  },
  {
    id: 'food',
    label: 'Food & Diet',
    icon: '🍽️',
    title: 'What do you eat?',
    subtitle: 'Food choices, especially meat consumption, significantly affect your footprint.',
    fields: [
      {
        id: 'diet_type',
        label: 'Which best describes your diet?',
        type: 'radio',
        options: [
          { value: 'vegan', label: '🌱 Vegan — no animal products' },
          { value: 'vegetarian', label: '🥛 Vegetarian — dairy & eggs, no meat' },
          { value: 'flexitarian', label: '🥗 Flexitarian — mostly plant-based, occasional meat' },
          { value: 'omnivore', label: '🍗 Omnivore — regular meat eater' },
          { value: 'heavy_meat', label: '🥩 High meat — meat at most meals' },
        ],
      },
      {
        id: 'food_waste',
        label: 'How much of your food goes to waste?',
        type: 'radio',
        options: [
          { value: '0.85', label: 'Almost none — I plan meals carefully' },
          { value: '0.9', label: 'Very little — occasional waste' },
          { value: '1.0', label: 'Average — some waste each week' },
          { value: '1.15', label: 'Quite a bit — I throw away a fair amount' },
          { value: '1.3', label: 'A lot — I waste a lot of food' },
        ],
      },
    ],
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    icon: '🛍️',
    title: 'What about your shopping & lifestyle?',
    subtitle: 'Consumer habits account for a significant portion of your footprint.',
    fields: [
      {
        id: 'shopping',
        label: 'How much do you spend on new clothing & goods monthly?',
        type: 'radio',
        options: [
          { value: 'shopping_none', label: 'Very little — mostly secondhand or minimal' },
          { value: 'shopping_low', label: 'Low — occasional new purchases' },
          { value: 'shopping_medium', label: 'Moderate — regular shopping' },
          { value: 'shopping_high', label: 'High — frequent new purchases' },
          { value: 'shopping_very_high', label: 'Very high — I shop a lot' },
        ],
      },
      {
        id: 'secondhand',
        label: 'Do you buy secondhand or repair items?',
        type: 'radio',
        options: [
          { value: '0.7', label: 'Always — I prefer secondhand' },
          { value: '0.85', label: 'Often — I buy secondhand when possible' },
          { value: '1.0', label: 'Sometimes — a mix of new and used' },
          { value: '1.15', label: 'Rarely — I usually buy new' },
          { value: '1.3', label: 'Never — I always buy new' },
        ],
      },
    ],
  },
];

function calculateFootprint(answers) {
  let transport = 0;
  let energy = 0;
  let food = 0;
  let lifestyle = 0;

  // Transport
  const carType = answers.car_type || 'no_car';
  const weeklyKm = parseFloat(answers.weekly_km || '0');
  const carFactor = EMISSION_FACTORS.transport[carType] || 0;
  transport += (carFactor * weeklyKm * 52) / 1000; // Convert kg to tonnes

  // Flights
  const flightsMap = {
    none: 0,
    short_1: (EMISSION_FACTORS.transport.flight_short * 1.5) / 1000,
    short_3: (EMISSION_FACTORS.transport.flight_short * 4) / 1000,
    long_1: (EMISSION_FACTORS.transport.flight_long * 1.5) / 1000,
    long_3: (EMISSION_FACTORS.transport.flight_long * 4) / 1000,
  };
  transport += flightsMap[answers.flights] || 0;

  // Energy
  const electricityFactor = EMISSION_FACTORS.energy[answers.electricity_source] || EMISSION_FACTORS.energy.electricity_mixed;
  // Assume ~3500 kWh/year for average home, scaled by size
  const homeSize = parseFloat(answers.home_size || '1.0');
  energy += (electricityFactor * 3500 * homeSize) / 1000;

  // Heating
  const heatingFactor = EMISSION_FACTORS.energy[answers.heating] || 1.2;
  energy += heatingFactor * homeSize;

  // Food
  const dietEmissions = EMISSION_FACTORS.food[answers.diet_type] || EMISSION_FACTORS.food.omnivore;
  const wasteMultiplier = parseFloat(answers.food_waste || '1.0');
  food = dietEmissions * wasteMultiplier;

  // Lifestyle
  const shoppingBase = EMISSION_FACTORS.lifestyle[answers.shopping] || EMISSION_FACTORS.lifestyle.shopping_medium;
  const secondhandMultiplier = parseFloat(answers.secondhand || '1.0');
  lifestyle = shoppingBase * secondhandMultiplier;

  const total = transport + energy + food + lifestyle;

  return {
    total: Math.round(total * 10) / 10,
    breakdown: {
      transport: Math.round(transport * 10) / 10,
      energy: Math.round(energy * 10) / 10,
      food: Math.round(food * 10) / 10,
      lifestyle: Math.round(lifestyle * 10) / 10,
    },
    answers,
  };
}

export default function Calculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState('right');
  const [result, setResult] = useState(null);

  const step = STEPS[currentStep];
  const totalSteps = STEPS.length;
  const progress = ((currentStep) / totalSteps) * 100;

  const visibleFields = step.fields.filter(f =>
    !f.showIf || f.showIf(answers)
  );

  const isStepComplete = () => {
    return visibleFields.every(f => answers[f.id] !== undefined);
  };

  const handleSelect = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection('right');
      setCurrentStep(s => s + 1);
    } else {
      // Calculate and show results
      const calcResult = calculateFootprint(answers);
      let data = loadData();
      data = saveFootprintResult(data, calcResult);
      // Check badges
      checkAndUnlockBadges(data, BADGES);
      setResult(calcResult);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection('left');
      setCurrentStep(s => s - 1);
    }
  };

  const handleSkip = () => {
    // Generate an average estimate baseline
    const estimateAnswers = {
      car_type: 'medium_petrol',
      weekly_km: '150',
      flights: 'none',
      electricity_source: 'electricity_mixed',
      heating: 'heating_gas',
      home_size: '1.0',
      diet_type: 'omnivore',
      food_waste: '1.0',
      shopping: 'shopping_medium',
      secondhand: '1.0'
    };
    const calcResult = calculateFootprint(estimateAnswers);
    let data = loadData();
    data = saveFootprintResult(data, calcResult);
    checkAndUnlockBadges(data, BADGES);
    setResult(calcResult);
  };

  if (result) {
    return (
      <Results
        result={result}
        onRetake={() => { setResult(null); setCurrentStep(0); setAnswers({}); }}
      />
    );
  }

  return (
    <div className="calc-page page">
      <div className="container">
        {/* Header */}
        <div className="calc-header fade-up">
          <h1 className="calc-main-title">Carbon Calculator</h1>
          <p className="text-secondary">Answer 4 quick sections to discover your personal footprint.</p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator fade-up fade-up-delay-1">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`step-tab ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}
              aria-current={i === currentStep ? 'step' : undefined}
            >
              <div className="step-tab-icon">{i < currentStep ? '✓' : s.icon}</div>
              <span className="step-tab-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="calc-progress-track fade-up fade-up-delay-1">
          <div
            className="calc-progress-fill"
            style={{ width: `${progress + (100 / totalSteps) * (isStepComplete() ? 1 : 0.5)}%` }}
          />
        </div>

        {/* Step Card */}
        <div
          className={`calc-card card card-body ${direction === 'right' ? 'slide-in-right' : 'slide-in-left'}`}
          key={currentStep}
        >
          <div className="calc-step-header">
            <div className="calc-step-icon">{step.icon}</div>
            <div>
              <p className="caption" style={{ color: 'var(--color-primary)', marginBottom: 4 }}>
                Step {currentStep + 1} of {totalSteps}
              </p>
              <h2 className="calc-step-title">{step.title}</h2>
              <p className="text-secondary text-sm">{step.subtitle}</p>
            </div>
          </div>

          <div className="calc-fields">
            {visibleFields.map((field) => (
              <div key={field.id} className="calc-field">
                <label className="calc-field-label">{field.label}</label>
                <div className="calc-options">
                  {field.options.map((opt) => (
                    <button
                      key={opt.value}
                      id={`option-${field.id}-${opt.value}`}
                      className={`calc-option ${answers[field.id] === opt.value ? 'selected' : ''}`}
                      onClick={() => handleSelect(field.id, opt.value)}
                      type="button"
                    >
                      <span className="calc-option-radio">
                        {answers[field.id] === opt.value && (
                          <span className="calc-option-dot" />
                        )}
                      </span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="calc-nav" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <button
              className="btn btn-ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              id="calc-back-btn"
            >
              ← Back
            </button>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginLeft: 'auto' }}>
              <button
                className="btn btn-secondary"
                onClick={handleSkip}
                id="calc-skip-btn"
              >
                Skip & Estimate
              </button>
              <button
                className={`btn btn-primary ${!isStepComplete() ? 'btn-disabled' : ''}`}
                onClick={handleNext}
                disabled={!isStepComplete()}
                id={currentStep === totalSteps - 1 ? 'calc-submit-btn' : 'calc-next-btn'}
              >
                {currentStep === totalSteps - 1 ? 'Calculate my footprint →' : 'Next step →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
