import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo" aria-label="Leafprint home">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#059669"/>
            <path d="M8 24C8 24 10 14 20 10C24 8 26 8 26 8C26 8 26 10 24 14C20 20 10 22 8 24Z" fill="#D1FAE5"/>
            <path d="M8 24C12 20 16 16 20 10" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="navbar-brand">Leafprint</span>
        </Link>

        <nav className="navbar-nav" aria-label="Main navigation">
          <NavLink to="/calculator" id="nav-calculator" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Calculator
          </NavLink>
          <NavLink to="/dashboard" id="nav-dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Dashboard
          </NavLink>
          <NavLink to="/actions" id="nav-actions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Actions
          </NavLink>
          <NavLink to="/insights" id="nav-insights" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Insights
          </NavLink>
          <NavLink to="/achievements" id="nav-achievements" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Achievements
          </NavLink>
          <NavLink to="/community" id="nav-community" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Community
          </NavLink>
        </nav>

        <Link to="/calculator" className="btn btn-primary btn-sm navbar-cta" id="navbar-start-btn">
          Get Started
        </Link>
      </div>
    </header>
  );
}
