/**
 * @fileoverview Global Error Boundary component.
 * Catches unexpected runtime errors in the React tree and renders
 * a friendly fallback UI instead of a blank crash screen.
 */

import { Component } from 'react';

/**
 * ErrorBoundary wraps any part of the component tree and catches
 * JavaScript errors that occur during rendering, in lifecycle methods,
 * or in constructors of child components.
 *
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    /** @type {{ hasError: boolean, error: Error|null }} */
    this.state = { hasError: false, error: null };
  }

  /**
   * Updates state so the next render shows the fallback UI.
   * @param {Error} error - The error that was thrown.
   * @returns {{ hasError: boolean, error: Error }}
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Logs error details for debugging.
   * @param {Error} error - The error that was thrown.
   * @param {React.ErrorInfo} info - Component stack information.
   */
  componentDidCatch(error, info) {
    // In production, this could send to an error monitoring service
    console.error('[Leafprint] Uncaught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '2rem',
            textAlign: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '3rem' }}>🌿</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px' }}>
            Leafprint ran into an unexpected error. Your data is safe — please refresh the page to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
