import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useTours } from '../context/TourContext';

const TourForm = ({ show, onHide, editTour = null }) => {
  const { addTour, updateTour } = useTours();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    price: '',
    departureDate: '',
    image: ''
  });

  useEffect(() => {
    if (editTour) {
      setFormData(editTour);
    } else {
      setFormData({
        name: '',
        location: '',
        description: '',
        price: '',
        departureDate: '',
        image: ''
      });
    }
  }, [editTour]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tourData = {
      ...formData,
      price: parseInt(formData.price),
      rating: editTour ? editTour.rating : 0,
      reviews: editTour ? editTour.reviews : []
    };

    if (editTour) {
      updateTour(tourData);
    } else {
      addTour(tourData);
    }

    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editTour ? 'Chỉnh sửa tour' : 'Tạo tour mới'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tên tour</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Địa điểm</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Giá (VNĐ)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ngày khởi hành</Form.Label>
            <Form.Control
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>URL hình ảnh</Form.Label>
            <Form.Control
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit">
              {editTour ? 'Cập nhật' : 'Tạo tour'}
            </Button>
            <Button variant="secondary" onClick={onHide}>
              Hủy
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TourForm;