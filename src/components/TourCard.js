import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { useTours } from '../context/TourContext';
import PaymentModal from './PaymentModal';
import ProtectedRoute from './ProtectedRoute';
import { useNavigate } from 'react-router-dom';

const TourCard = ({ tour, onEdit, showActions = true, onBookingSuccess }) => {
  const { isAuthenticated, isAdmin } = useUser();
  const { deleteTour } = useTours();
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra ngày khởi hành đã hết hạn chưa
  const isExpired = new Date(tour.departureDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
  const isSoldOut = tour.slots === 0;

  // Lắng nghe sự kiện mở modal đặt tour từ VoiceCommandHandler
  useEffect(() => {
    const handleOpenBookingModal = (event) => {
      if (event.detail && event.detail.tourId === tour.id) {
        if (!isExpired && !isSoldOut && isAuthenticated) {
          setShowPayment(true);
        } else if (isExpired) {
          alert('Tour này đã hết hạn!');
        } else if (isSoldOut) {
          alert('Tour này đã hết slot!');
        } else if (!isAuthenticated) {
          alert('Vui lòng đăng nhập để đặt tour!');
        }
      }
    };

    window.addEventListener('open-booking-modal', handleOpenBookingModal);

    return () => {
      window.removeEventListener('open-booking-modal', handleOpenBookingModal);
    };
  }, [tour.id, isExpired, isSoldOut, isAuthenticated]);

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

  const handleViewDetail = () => {
    navigate(`/tour/${tour.id}`);
  };

  return (
    <>
      <Card className={`h-100 shadow-sm tour-card${isExpired ? ' bg-light text-muted' : ''}`} onClick={handleViewDetail} style={{ cursor: 'pointer' }}>
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
            {isExpired && (
              <span className="ms-2 badge bg-secondary">Đã hết hạn</span>
            )}
          </Card.Text>
          <Card.Text>
            <strong>💰 Giá:</strong> <span className="text-primary fw-bold">{tour.price.toLocaleString('vi-VN')} VNĐ</span>
          </Card.Text>
          <Card.Text>
            <strong>🎟️ Slot còn lại:</strong> <span className={tour.slots === 0 ? 'text-danger fw-bold' : 'text-success fw-bold'}>{tour.slots}</span>
          </Card.Text>
          <div className="mb-2">
            <Badge bg="warning" text="dark">
              ⭐ {tour.rating?.toFixed(1) || 'Chưa có đánh giá'}
            </Badge>
          </div>
          <div className="mt-auto">
            <div className="d-grid gap-2">
              {/* User có thể đặt tour */}
              <Button 
                variant={isSoldOut || isExpired ? 'secondary' : 'success'} 
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn sự kiện click lan ra Card
                  handleBookTour();
                }}
                disabled={isSoldOut || isExpired}
              >
                {isExpired ? 'Đã hết hạn' : isSoldOut ? 'Đã hết slot' : '🎯 Đặt tour ngay'}
              </Button>

              <Button 
                variant="outline-primary" 
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn sự kiện click lan ra Card
                  handleViewDetail();
                }}
              >
                🔍 Xem chi tiết
              </Button>
              
              {/* Chỉ Admin mới thấy nút quản lý */}
              {showActions && isAdmin && (
                <ProtectedRoute adminOnly>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click lan ra Card
                        onEdit(tour);
                      }}
                    >
                      ✏️ Sửa
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click lan ra Card
                        handleDelete();
                      }}
                    >
                      🗑️ Xóa
                    </Button>
                  </div>
                </ProtectedRoute>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <PaymentModal 
        show={showPayment}
        onHide={() => setShowPayment(false)}
        tour={tour}
        onBookingSuccess={onBookingSuccess}
      />
    </>
  );
};

export default TourCard;