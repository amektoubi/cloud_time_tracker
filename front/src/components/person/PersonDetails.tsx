import React, { useEffect } from 'react';
import { Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePersonStore } from '../../stores/usePersonStore';

const PersonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedPerson,
    isLoading,
    error,
    fetchPersonById,
    deletePerson,
    clearError,
  } = usePersonStore();

  useEffect(() => {
    if (id) {
      fetchPersonById(id);
    }
  }, [id, fetchPersonById]);

  const handleDelete = async () => {
    if (selectedPerson && window.confirm(`Are you sure you want to delete ${selectedPerson.name}?`)) {
      await deletePerson(selectedPerson.id);
      navigate('/persons');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (error) {
    return (
      <Alert variant="danger" dismissible onClose={clearError}>
        {error}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!selectedPerson) {
    return (
      <Alert variant="warning">
        Person not found.
      </Alert>
    );
  }

  return (
    <div className="container">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Person Details</h4>
          <Link to="/persons">
            <Button variant="outline-secondary">Back to List</Button>
          </Link>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-6">
              <dl className="row">
                <dt className="col-sm-4">ID:</dt>
                <dd className="col-sm-8">{selectedPerson.id}</dd>
                
                <dt className="col-sm-4">Name:</dt>
                <dd className="col-sm-8">{selectedPerson.name}</dd>
                
                <dt className="col-sm-4">Age:</dt>
                <dd className="col-sm-8">
                  <Badge bg="primary" className="fs-6">{selectedPerson.age}</Badge>
                </dd>
              </dl>
            </div>
            <div className="col-md-6">
              <dl className="row">
                <dt className="col-sm-6">Created At:</dt>
                <dd className="col-sm-6">{formatDate(selectedPerson.createdAt)}</dd>
                
                <dt className="col-sm-6">Updated At:</dt>
                <dd className="col-sm-6">{formatDate(selectedPerson.updatedAt)}</dd>
              </dl>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="d-flex gap-2">
              <Link to={`/persons/${selectedPerson.id}/edit`}>
                <Button variant="primary">
                  Edit Person
                </Button>
              </Link>
              <Button variant="danger" onClick={handleDelete}>
                Delete Person
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PersonDetails;
