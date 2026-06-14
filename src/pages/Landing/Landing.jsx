import { Link } from 'react-router-dom';
import './Landing.css';

const PILLARS = [
  {
    icon: '🔍',
    title: 'Understand',
    description: 'Take our smart 4-step carbon calculator and discover exactly where your footprint comes from — transport, energy, food, and lifestyle.',
    color: 'blue',
  },
  {
    icon: '✅',
    title: 'Track',
    description: 'Log your daily eco-actions, build streaks, and watch your CO₂ savings add up in real time with a beautiful personal dashboard.',
    color: 'green',
  },
  {
    icon: '💡',
    title: 'Reduce',
    description: 'Get personalized insights tailored to your biggest impact areas, with practical tips sorted by effort and environmental impact.',
    color: 'amber',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Calculate your footprint',
    description: 'Answer a few simple questions about your lifestyle. Takes under 5 minutes.',
  },
  {
    number: '02',
    title: 'See your personal breakdown',
    description: 'Get a clear picture of where your emissions come from, compared to national and global averages.',
  },
  {
    number: '03',
    title: 'Take daily eco-actions',
    description: 'Log what you do each day and track how much CO₂ you are saving through real actions.',
  },
  {
    number: '04',
    title: 'Level up as you improve',
    description: 'Earn XP, unlock badges, and rise from Seedling to Earth Guardian as your footprint shrinks.',
  },
];

const STATS = [
  { value: '4.2t', label: 'Average UK carbon footprint' },
  { value: '2.0t', label: 'Paris Agreement target by 2050' },
  { value: '6.6t', label: 'Current global average footprint' },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-badge fade-up">
            <span className="hero-badge-dot" />
            Free · No account needed · Instant results
          </div>
          <h1 className="hero-title fade-up fade-up-delay-1">
            Know your impact.<br />
            <span className="hero-title-green">Change your future.</span>
          </h1>
          <p className="hero-subtitle fade-up fade-up-delay-2">
            Leafprint helps you understand, track, and reduce your personal carbon footprint
            through simple daily actions and personalized insights.
          </p>
          <div className="hero-actions fade-up fade-up-delay-3">
            <Link to="/calculator" className="btn btn-primary btn-lg" id="hero-cta-btn">
              Calculate your footprint
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/dashboard" className="btn btn-outline btn-lg" id="hero-dashboard-btn">
              View demo dashboard
            </Link>
          </div>
          <div className="hero-stats fade-up fade-up-delay-4">
            {STATS.map((s) => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-value font-mono">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative background */}
        <div className="hero-bg-circles" aria-hidden="true">
          <div className="hero-circle hero-circle-1" />
          <div className="hero-circle hero-circle-2" />
          <div className="hero-circle hero-circle-3" />
        </div>
      </section>

      {/* Pillars */}
      <section className="pillars">
        <div className="container">
          <div className="section-label caption fade-up">How it works</div>
          <h2 className="section-title fade-up fade-up-delay-1">
            Three steps to a lighter footprint
          </h2>
          <div className="pillars-grid">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.title}
                className={`pillar-card card card-reveal card-reveal-${i + 1}`}
              >
                <div className={`pillar-icon pillar-icon-${pillar.color}`}>
                  {pillar.icon}
                </div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-desc text-secondary">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-label caption fade-up">Your journey</div>
          <h2 className="section-title fade-up fade-up-delay-1">
            From awareness to action in 4 steps
          </h2>
          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div key={step.number} className={`step-item card-reveal card-reveal-${(i % 4) + 1}`}>
                <div className="step-number font-mono">{step.number}</div>
                <div className="step-connector" aria-hidden="true" />
                <h4 className="step-title">{step.title}</h4>
                <p className="step-desc text-secondary text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div className="cta-leaf" aria-hidden="true">🍃</div>
          <h2 className="cta-title fade-up">Ready to find out your footprint?</h2>
          <p className="cta-subtitle fade-up fade-up-delay-1 text-secondary">
            It takes less than 5 minutes. No sign-up required.
          </p>
          <Link to="/calculator" className="btn btn-primary btn-lg fade-up fade-up-delay-2" id="cta-banner-btn">
            Start your calculation
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-logo">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#059669"/>
              <path d="M8 24C8 24 10 14 20 10C24 8 26 8 26 8C26 8 26 10 24 14C20 20 10 22 8 24Z" fill="#D1FAE5"/>
              <path d="M8 24C12 20 16 16 20 10" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Leafprint</span>
          </div>
          <p className="footer-tagline text-muted text-sm">
            Know Your Impact. Change Your Future.
          </p>
          <p className="footer-data text-muted text-xs">
            Emission data sourced from EPA, EDGAR, and Our World in Data.
            Paris Agreement target: 2t CO₂e per person by 2050.
          </p>
        </div>
      </footer>
    </div>
  );
}
