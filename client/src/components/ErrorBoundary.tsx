import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { error: Error | null };

/**
 * Catches render-time throws inside a feature view — a bad chart, an SVG
 * calculation, a malformed API shape — so the section shows a recoverable
 * message instead of a blank screen. `App` keys it on the route, so navigating
 * to another tab clears it; "Try again" re-renders the same one.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Render error:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="route-error" role="alert">
        <p>Something went wrong displaying this section.</p>
        <button
          type="button"
          className="secondary-action"
          onClick={() => this.setState({ error: null })}
        >
          Try again
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
