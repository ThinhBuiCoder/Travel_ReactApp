import React, { useState } from 'react';
import { Card, Button, Badge, Modal } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { useTours } from '../context/TourContext';
import PaymentModal from './PaymentModal';

const TourCard = ({ tour, onEdit, showActions = true }) => {
  const { isAuthenticated } = useUser();
  const { deleteTour } = useTours();
  const [showPayment, setShowPayment] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      deleteTour(tour.id);
    }
  };

  const handleBookTour = () => {
    if (isAuthenticated) {
      setShowPayment(true);
    } else {
      alert('Vui lòng đăng nhập để đặt tour!');
    }
  };

  return (
    <>
      <Card className="h-100 shadow-sm tour-card">
        <Card.Img 
          variant="top" 
          src={tour.image} 
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title>{tour.name}</Card.Title>
          <Card.Text>
            <strong>📍 {tour.location}</strong><br />
            {tour.description}
          </Card.Text>
          <Card.Text>
            <strong>🗓️ Khởi hành:</strong> {new Date(tour.departureDate).toLocaleDateString('vi-VN')}
          </Card.Text>
          <Card.Text>
            <strong>💰 Giá:</strong> <span className="text-primary fw-bold">{tour.price.toLocaleString('vi-VN')} VNĐ</span>
          </Card.Text>
          <div className="mb-2">
            <Badge bg="warning" text="dark">
              ⭐ {tour.rating?.toFixed(1) || 'Chưa có đánh giá'}
            </Badge>
          </div>
          <div className="mt-auto">
            <div className="d-grid gap-2">
              <Button variant="success" onClick={handleBookTour}>
                🎯 Đặt tour ngay
              </Button>
              {showActions && isAuthenticated && (
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => onEdit(tour)}>
                    ✏️ Sửa
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={handleDelete}>
                    🗑️ Xóa
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <PaymentModal 
        show={showPayment}
        onHide={() => setShowPayment(false)}
        tour={tour}
      />
    </>
  );
};

export default TourCard;