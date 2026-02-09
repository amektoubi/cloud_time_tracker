import React, { useEffect } from 'react';
import { Card, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { fetchStatistics, clearError } from '../../stores/personSlice';

const PersonStatistics: React.FC = () => {
  const dispatch = useAppDispatch();
  const statistics = useAppSelector(state => state.person.statistics);
  const isLoading = useAppSelector(state => state.person.isLoading);
  const error = useAppSelector(state => state.person.error);

  useEffect(() => {
    dispatch(fetchStatistics());
  }, [dispatch]);

  if (error) {
    return (
      <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
        {error}
      </Alert>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Person Statistics</h2>
        <Link to="/persons">
          <Button variant="outline-secondary">Back to List</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : statistics ? (
        <Row>
          <Col md={3} sm={6} className="mb-3">
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-primary">Total Persons</Card.Title>
                <Card.Text className="display-4 fw-bold">
                  {statistics.totalCount}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-3">
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-success">Average Age</Card.Title>
                <Card.Text className="display-4 fw-bold">
                  {statistics.averageAge.toFixed(1)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-3">
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-info">Youngest Age</Card.Title>
                <Card.Text className="display-4 fw-bold">
                  {statistics.minAge}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-3">
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-warning">Oldest Age</Card.Title>
                <Card.Text className="display-4 fw-bold">
                  {statistics.maxAge}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Alert variant="info">
          No statistics available. Please ensure there are persons in the system.
        </Alert>
      )}

      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Quick Actions</Card.Title>
          <div className="d-flex gap-2 flex-wrap">
            <Link to="/persons/new">
              <Button variant="primary">Add New Person</Button>
            </Link>
            <Link to="/persons">
              <Button variant="secondary">View All Persons</Button>
            </Link>
            <Button variant="info" onClick={() => dispatch(fetchStatistics())}>
              Refresh Statistics
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PersonStatistics;
