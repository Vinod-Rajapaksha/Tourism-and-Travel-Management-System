import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
          padding: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            color: 'white',
            maxWidth: '500px'
          }}>
            <h2 style={{
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem'
            }}>
              🚨 Something went wrong!
            </h2>
            <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              🔄 Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
