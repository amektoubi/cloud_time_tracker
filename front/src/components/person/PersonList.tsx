import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Form, InputGroup, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import {
  fetchPersons,
  searchPersons,
  getPersonsByMinimumAge,
  setSearchTerm,
  setFilterMinAge,
  deletePerson,
  clearError,
} from '../../stores/personSlice';
import { formatDate } from '../../utils/date';
import type { IPersonResponse } from '../../types/person';

const PersonList: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const persons = useAppSelector(state => state.person.persons);
  const isLoading = useAppSelector(state => state.person.isLoading);
  const error = useAppSelector(state => state.person.error);
  const searchTerm = useAppSelector(state => state.person.searchTerm);
  const filterMinAge = useAppSelector(state => state.person.filterMinAge);

  // Modal state for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<{id: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchPersons());
  }, [dispatch]);

  const filteredPersons = useMemo(() => {
    let filtered = persons;

    if (searchTerm) {
      filtered = filtered.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterMinAge !== null) {
      filtered = filtered.filter(person => person.age >= filterMinAge);
    }

    return filtered;
  }, [persons, searchTerm, filterMinAge]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchPersons(searchTerm.trim()));
    } else {
      dispatch(fetchPersons());
    }
  };

  const handleAgeFilter = (age: number | null) => {
    dispatch(setFilterMinAge(age));
    if (age !== null) {
      dispatch(getPersonsByMinimumAge(age));
    } else {
      dispatch(fetchPersons());
    }
  };

  const handleDelete = (id: string, name: string) => {
    setPersonToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (personToDelete) {
      setIsDeleting(true);
      try {
        await dispatch(deletePerson(personToDelete.id)).unwrap();
        setShowDeleteModal(false);
        setPersonToDelete(null);
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPersonToDelete(null);
    setIsDeleting(false);
  };

  if (error) {
    return (
      <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
        {error}
      </Alert>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="mb-0">Persons</h2>
        <Link to="/persons/new">
          <Button variant="primary" className="w-100 w-md-auto">
            <i className="bi bi-plus-circle me-2"></i>
            Add New Person
          </Button>
        </Link>
      </div>

      <div className="row mb-4">
        <div className="col-12 col-lg-6 mb-3">
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              />
              <Button type="submit" variant="outline-secondary">
                Search
              </Button>
            </InputGroup>
          </Form>
        </div>
        <div className="col-12 col-lg-6">
          <Form>
            <div className="d-flex flex-column flex-md-row gap-2">
              <InputGroup className="flex-grow-1">
                <InputGroup.Text className="text-nowrap">
                  <i className="bi bi-calendar3 me-1"></i>
                  Min Age:
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  min="0"
                  max="150"
                  placeholder="Age filter"
                  value={filterMinAge ?? ''}
                  onChange={(e) => handleAgeFilter(e.target.value ? parseInt(e.target.value) : null)}
                />
              </InputGroup>
              <Button
                variant="outline-secondary"
                onClick={() => handleAgeFilter(null)}
                disabled={filterMinAge === null}
                className="flex-shrink-0"
                style={{ minWidth: '80px' }}
              >
                <i className="bi bi-x-circle me-1"></i>
                Clear
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div className="mt-2">Loading persons...</div>
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover responsive className="align-middle">
            <thead className="table-dark">
              <tr>
                <th className="text-nowrap">ID</th>
                <th className="text-nowrap">Name</th>
                <th className="text-nowrap">Age</th>
                <th className="d-none d-md-table-cell text-nowrap">Created At</th>
                <th className="d-none d-lg-table-cell text-nowrap">Updated At</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersons.map((person: IPersonResponse) => (
                <tr key={person.id}>
                  <td className="text-nowrap fw-bold text-primary">{person.id}</td>
                  <td>
                    <Link
                      to={`/persons/${person.id}`}
                      className="text-decoration-none fw-medium text-dark"
                    >
                      {person.name}
                    </Link>
                  </td>
                  <td>
                    <Badge bg="secondary" className="fw-bold">
                      <i className="bi bi-person me-1"></i>
                      {person.age}
                    </Badge>
                  </td>
                  <td className="d-none d-md-table-cell text-nowrap">
                    <small className="text-muted">{formatDate(person.createdAt)}</small>
                  </td>
                  <td className="d-none d-lg-table-cell text-nowrap">
                    <small className="text-muted">{formatDate(person.updatedAt)}</small>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm d-flex d-md-inline-flex gap-1">
                      <Link to={`/persons/${person.id}/edit`} className="flex-fill flex-md-auto">
                        <Button variant="outline-primary" size="sm" className="w-100">
                          <i className="bi bi-pencil me-1 d-md-none"></i>
                          <span className="d-none d-md-inline">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(person.id, person.name)}
                        className="flex-fill flex-md-auto"
                      >
                        <i className="bi bi-trash me-1 d-md-none"></i>
                        <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {!isLoading && filteredPersons.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="bi bi-inbox display-1 text-muted"></i>
          </div>
          <h4 className="text-muted">No persons found</h4>
          <p className="text-muted">
            {searchTerm || filterMinAge !== null
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first person."
            }
          </p>
        </div>
      )}

      <div className="mt-4 d-flex justify-content-center">
        <Link to="/statistics">
          <Button variant="info" className="px-4">
            <i className="bi bi-bar-chart me-2"></i>
            View Statistics
          </Button>
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={cancelDelete}
        centered
        backdrop="static"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title id="delete-modal-title" className="text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4" id="delete-modal-description">
          <div className="text-center">
            <div className="mb-3">
              <i className="bi bi-person-x text-danger" style={{ fontSize: '3rem' }}></i>
            </div>
            <h5 className="mb-3">
              Are you sure you want to delete this person?
            </h5>
            {personToDelete && (
              <div className="bg-light rounded p-3 mb-3">
                <strong>Name:</strong> {personToDelete.name}
              </div>
            )}
            <p className="text-muted mb-0">
              This action cannot be undone. The person's data will be permanently removed.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3">
          <Button
            variant="outline-secondary"
            onClick={cancelDelete}
            disabled={isDeleting}
            className="px-4"
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={isDeleting}
            className="px-4"
          >
            {isDeleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Deleting...
              </>
            ) : (
              <>
                <i className="bi bi-trash me-2"></i>
                Delete Person
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PersonList;
