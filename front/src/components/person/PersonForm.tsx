import React, { useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { usePersonStore } from '../../stores/usePersonStore';
import type { IPersonFormData } from '../../types/person';

const PersonForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== undefined;

  const {
    selectedPerson,
    isLoading,
    error,
    fetchPersonById,
    createPerson,
    updatePerson,
    clearError,
  } = usePersonStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<IPersonFormData>({
    defaultValues: {
      name: '',
      age: 0,
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchPersonById(parseInt(id));
    }
  }, [isEditMode, id, fetchPersonById]);

  useEffect(() => {
    if (selectedPerson && isEditMode) {
      setValue('name', selectedPerson.name);
      setValue('age', selectedPerson.age);
    }
  }, [selectedPerson, isEditMode, setValue]);

  const onSubmit = async (data: IPersonFormData) => {
    try {
      if (isEditMode && id) {
        await updatePerson(parseInt(id), {
          name: data.name,
          age: data.age,
        });
      } else {
        await createPerson({
          name: data.name,
          age: data.age,
        });
      }
      navigate('/persons');
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/persons');
  };

  if (error) {
    return (
      <Alert variant="danger" dismissible onClose={clearError}>
        {error}
      </Alert>
    );
  }

  if (isEditMode && isLoading && !selectedPerson) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-person-plus me-2"></i>
                {isEditMode ? 'Edit Person' : 'Create New Person'}
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-person me-1"></i>
                    Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter person's name"
                    className="fs-5"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                      maxLength: {
                        value: 100,
                        message: 'Name must be less than 100 characters',
                      },
                    })}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid" className="fs-6">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-calendar3 me-1"></i>
                    Age *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="150"
                    placeholder="Enter person's age"
                    className="fs-5"
                    {...register('age', {
                      required: 'Age is required',
                      min: {
                        value: 0,
                        message: 'Age must be non-negative',
                      },
                      max: {
                        value: 150,
                        message: 'Age must be less than or equal to 150',
                      },
                    })}
                    isInvalid={!!errors.age}
                  />
                  <Form.Control.Feedback type="invalid" className="fs-6">
                    {errors.age?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex flex-column flex-md-row gap-3 mt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-fill py-2 fs-5"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        {isEditMode ? 'Update Person' : 'Create Person'}
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="flex-fill py-2 fs-5"
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonForm;
