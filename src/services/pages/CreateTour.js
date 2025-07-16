


// src/pages/CreateTour.js
import React, { useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import TourForm from '../components/TourForm';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const CreateTour = () => {
  const { isAuthenticated } = useUser();
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <Container className="my-4">
        <Alert variant="warning">
          Bạn cần đăng nhập để tạo tour mới.
        </Alert>
      </Container>
    );
  }

  const handleSuccess = () => {
    setShowSuccess(true);
    navigate('/tours');
  };

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h1>➕ Tạo tour du lịch mới</h1>
          {showSuccess && (
            <Alert variant="success">
              Tour đã được tạo thành công!
            </Alert>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <TourForm 
            show={true} 
            onHide={handleSuccess}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CreateTour;