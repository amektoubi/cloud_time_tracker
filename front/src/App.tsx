import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Skeleton from './components/Skeleton';

// Lazy load route components for code splitting
const PersonList = lazy(() => import('./components/person/PersonList'));
const PersonForm = lazy(() => import('./components/person/PersonForm'));
const PersonDetails = lazy(() => import('./components/person/PersonDetails'));
const PersonStatistics = lazy(() => import('./components/person/PersonStatistics'));

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="text-center py-5">
    <Skeleton variant="text" width="200px" className="d-block mx-auto mb-3" />
    <Skeleton variant="text" width="150px" className="d-block mx-auto" animation="wave" />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="App" data-testid="app-container">
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
          <Container fluid="md">
            <Navbar.Brand as={Link} to="/" className="fw-bold">
              <i className="bi bi-clock-history me-2"></i>
              Cloud Time Tracker
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/persons" className="fw-medium">
                  <i className="bi bi-people me-1"></i>
                  Persons
                </Nav.Link>
                <Nav.Link as={Link} to="/statistics" className="fw-medium">
                  <i className="bi bi-bar-chart me-1"></i>
                  Statistics
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container fluid="md" className="flex-grow-1 pb-4">
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/persons" replace />} />
                <Route path="/persons" element={<PersonList />} />
                <Route path="/persons/new" element={<PersonForm />} />
                <Route path="/persons/:id" element={<PersonDetails />} />
                <Route path="/persons/:id/edit" element={<PersonForm />} />
                <Route path="/statistics" element={<PersonStatistics />} />
                <Route path="*" element={<Navigate to="/persons" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Container>
      </div>
    </Router>
  );
};

export default App;
