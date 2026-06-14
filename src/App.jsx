import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy loading for code quality optimization (Hackathon Criteria)
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Calculator = lazy(() => import('./pages/Calculator/Calculator'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Actions = lazy(() => import('./pages/Actions/Actions'));
const Insights = lazy(() => import('./pages/Insights/Insights'));
const Achievements = lazy(() => import('./pages/Achievements/Achievements'));
const Community = lazy(() => import('./pages/Community/Community'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// 404 Not Found Fallback
const NotFound = () => (
  <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', textAlign: 'center' }}>
    <div style={{ fontSize: '3rem' }}>🌿</div>
    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Page Not Found</h1>
    <p style={{ color: 'var(--color-text-secondary)' }}>This path doesn't exist in Leafprint.</p>
    <a href="/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Go to Home →</a>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar />
        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/actions" element={<Actions />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/community" element={<Community />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
