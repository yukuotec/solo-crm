import React, { Component } from 'react';
import { logger } from '../logger';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    logger.error('ErrorBoundary caught an error', { error: error.message, stack: errorInfo?.componentStack });
  }

  reset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p className="error-message">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={this.reset}>
              Try Again
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigator.clipboard.writeText(`${this.state.error?.message}\n\n${this.state.errorInfo?.componentStack}`)}
            >
              Copy Error Details
            </button>
          </div>
          {this.state.errorInfo?.componentStack && (
            <details className="error-details">
              <summary>Error Details</summary>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
