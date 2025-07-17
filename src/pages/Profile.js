

// src/pages/Profile.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import BookingHistory from '../components/BookingHistory';

const Profile = () => {
  const { user, isAuthenticated, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isAuthenticated) {
    return (
      <Container className="my-4">
        <Alert variant="warning">
          Bạn cần đăng nhập để xem thông tin cá nhân.
        </Alert>
      </Container>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header>
              <h3>👤 Thông tin cá nhân</h3>
            </Card.Header>
            <Card.Body>
              {showSuccess && (
                <Alert variant="success">
                  Thông tin đã được cập nhật thành công!
                </Alert>
              )}
              
              {!isEditing ? (
                <div>
                  <p><strong>Tên:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    Chỉnh sửa thông tin
                  </Button>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button type="submit" variant="success">
                      Lưu thay đổi
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      Hủy
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
          {/* Hiển thị lịch sử đặt tour */}
          <div className="mt-4">
            <BookingHistory />
          </div>
        </Col>
      </Row>
    </Container>
  );
};


export default Profile;