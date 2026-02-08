/**
 * @fileoverview Error boundary component for handling React errors
 * @module components/ErrorBoundary
 */

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button, Card, Container } from 'react-bootstrap';

interface IErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface IErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  public state: IErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<IErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack trace:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleGoHome = (): void => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container className="py-5">
          <Card className="shadow-sm">
            <Card.Header className="bg-danger text-white">
              <h4 className="mb-0">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Something went wrong
              </h4>
            </Card.Header>
            <Card.Body className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-bug display-1 text-danger"></i>
              </div>
              <Card.Title className="h5 mb-3">An unexpected error occurred</Card.Title>
              <Card.Text className="text-muted mb-4">
                We apologize for the inconvenience. Please try again or reload the page.
              </Card.Text>
              {import.meta.env.DEV && this.state.error && (
                <Card.Text className="text-start bg-light p-3 rounded mb-4">
                  <strong>Error:</strong> {this.state.error.message}
                  <br />
                  <strong>Stack:</strong>
                  <pre className="mt-2 mb-0" style={{ fontSize: '0.75rem' }}>
                    {this.state.error.stack}
                  </pre>
                </Card.Text>
              )}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Button variant="primary" onClick={this.handleReload}>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Reload Page
                </Button>
                <Button variant="outline-secondary" onClick={this.handleGoHome}>
                  <i className="bi bi-house me-2"></i>
                  Go to Home
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
