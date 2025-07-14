// src/pages/Tours.js
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import TourCard from '../components/TourCard';
import TourForm from '../components/TourForm';
import { useTours } from '../context/TourContext';
import { useUser } from '../context/UserContext';

const Tours = () => {
  const { tours, searchTours } = useTours();
  const { isAuthenticated } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [editTour, setEditTour] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    searchTours(searchTerm);
  };

  const handleEdit = (tour) => {
    setEditTour(tour);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTour(null);
  };

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h1>🎯 Danh sách tour du lịch</h1>
        </Col>
      </Row>

      {/* Search */}
      <Row className="mb-4">
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Tìm kiếm tour theo tên hoặc địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="primary">
                Tìm kiếm
              </Button>
            </div>
          </Form>
        </Col>
        <Col md={6} className="text-end">
          {isAuthenticated && (
            <Button variant="success" onClick={() => setShowForm(true)}>
              + Thêm tour mới
            </Button>
          )}
        </Col>
      </Row>

      {/* Tours Grid */}
      <Row>
        {tours.map(tour => (
          <Col md={6} lg={4} key={tour.id} className="mb-4">
            <TourCard tour={tour} onEdit={handleEdit} />
          </Col>
        ))}
      </Row>

      {tours.length === 0 && (
        <div className="text-center py-5">
          <h3>Không tìm thấy tour nào</h3>
          <p>Hãy thử tìm kiếm với từ khóa khác</p>
        </div>
      )}

      {/* Tour Form Modal */}
      <TourForm 
        show={showForm} 
        onHide={handleCloseForm} 
        editTour={editTour}
      />
    </Container>
  );
};

export default Tours;