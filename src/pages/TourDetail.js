import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Image } from 'react-bootstrap';
import { useTours } from '../context/TourContext';
import { useUser } from '../context/UserContext';
import PaymentModal from '../components/PaymentModal';
import WeatherWidget from '../components/WeatherWidget';
import TourRecommendations from '../components/TourRecommendations';
import TourMap from '../components/TourMap';
import TourReviews from '../components/TourReviews';
import TourItinerary from '../components/TourItinerary';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTourById } = useTours();
  const { isAuthenticated } = useUser();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        setLoading(true);
        const tourData = await getTourById(id);
        setTour(tourData);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải thông tin tour. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchTourDetail();
  }, [id, getTourById]);

  // Kiểm tra ngày khởi hành đã hết hạn chưa
  const isExpired = tour && new Date(tour.departureDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
  const isSoldOut = tour && tour.slots === 0;

  const handleBookTour = () => {
    if (isAuthenticated) {
      setShowPayment(true);
    } else {
      alert('Vui lòng đăng nhập để đặt tour!');
    }
  };

  const handleBookingSuccess = () => {
    // Cập nhật lại thông tin tour sau khi đặt thành công
    const fetchUpdatedTour = async () => {
      try {
        const updatedTour = await getTourById(id);
        setTour(updatedTour);
      } catch (err) {
        console.error('Không thể cập nhật thông tin tour:', err);
      }
    };
    
    fetchUpdatedTour();
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải thông tin tour...</p>
      </Container>
    );
  }

  if (error || !tour) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Đã xảy ra lỗi</Alert.Heading>
          <p>{error || 'Không tìm thấy thông tin tour'}</p>
          <Button variant="outline-primary" onClick={() => navigate('/tours')}>
            Quay lại danh sách tour
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="outline-secondary" 
        className="mb-3"
        onClick={() => navigate('/tours')}
      >
        ← Quay lại danh sách tour
      </Button>
      
      <Card className="shadow-sm mb-4">
        <Row className="g-0">
          <Col md={5}>
            <Image 
              src={tour.image} 
              alt={tour.name}
              className="w-100 h-100"
              style={{ objectFit: 'cover', maxHeight: '500px' }}
            />
          </Col>
          <Col md={7}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h1 className="mb-2">{tour.name}</h1>
                  <h5 className="text-muted mb-3">📍 {tour.location}</h5>
                </div>
                <Badge 
                  bg="warning" 
                  text="dark" 
                  className="p-2 fs-5"
                >
                  ⭐ {tour.rating?.toFixed(1) || 'Chưa có đánh giá'}
                </Badge>
              </div>

              <Row className="mb-4">
                <Col sm={6} className="mb-3">
                  <Card className="h-100 bg-light">
                    <Card.Body>
                      <h5>🗓️ Thời gian</h5>
                      <p className="mb-1">
                        <strong>Khởi hành:</strong> {new Date(tour.departureDate).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="mb-0">
                        <strong>Thời lượng:</strong> {tour.duration || '3'} ngày
                      </p>
                      {isExpired && (
                        <Badge bg="secondary" className="mt-2">Đã hết hạn</Badge>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} className="mb-3">
                  <Card className="h-100 bg-light">
                    <Card.Body>
                      <h5>💰 Giá và slot</h5>
                      <p className="mb-1">
                        <strong>Giá:</strong> <span className="text-primary fw-bold fs-4">{tour.price.toLocaleString('vi-VN')} VNĐ</span>
                      </p>
                      <p className="mb-0">
                        <strong>Slot còn lại:</strong> <span className={tour.slots === 0 ? 'text-danger fw-bold' : 'text-success fw-bold'}>{tour.slots}</span>
                      </p>
                      {isSoldOut && (
                        <Badge bg="danger" className="mt-2">Đã hết slot</Badge>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="mb-4">
                <h4>📝 Mô tả chi tiết</h4>
                <p>{tour.description}</p>
                <p>
                  {tour.detailedDescription || 'Tour du lịch này sẽ mang đến cho bạn những trải nghiệm tuyệt vời với các điểm tham quan nổi tiếng, ẩm thực đặc sắc và dịch vụ chất lượng cao. Hãy đặt ngay để có những kỷ niệm đáng nhớ!'}
                </p>
              </div>

              <div className="mb-4">
                <h4>✨ Điểm nổi bật</h4>
                <ul>
                  <li>Tham quan các địa điểm nổi tiếng tại {tour.location}</li>
                  <li>Trải nghiệm ẩm thực địa phương đặc sắc</li>
                  <li>Hướng dẫn viên chuyên nghiệp, nhiệt tình</li>
                  <li>Phương tiện di chuyển tiện nghi</li>
                  <li>Khách sạn tiêu chuẩn {tour.hotelStars || 4} sao</li>
                </ul>
              </div>

              <div className="d-grid">
                <Button 
                  variant={isSoldOut || isExpired ? 'secondary' : 'success'} 
                  size="lg"
                  onClick={handleBookTour}
                  disabled={isSoldOut || isExpired}
                >
                  {isExpired ? 'Đã hết hạn' : isSoldOut ? 'Đã hết slot' : '🎯 Đặt tour ngay'}
                </Button>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* Thêm widget thời tiết */}
      <Row className="mb-4">
        <Col md={6}>
          <WeatherWidget location={tour.location} />
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header>
              <h5 className="mb-0">📸 Hình ảnh địa điểm</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-center">Hình ảnh đẹp về {tour.location} sẽ được hiển thị ở đây.</p>
              <div className="text-center">
                <Button variant="outline-primary">
                  Xem thêm hình ảnh
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Thêm bản đồ */}
      <TourMap location={tour.location} />

      {/* Thêm lịch trình tour */}
      <TourItinerary location={tour.location} duration={tour.duration || 3} />

      {/* Thêm đánh giá */}
      <TourReviews tourId={tour.id} currentReviews={tour.reviews} />

      {/* Thêm đề xuất tour tương tự */}
      <TourRecommendations currentTourId={tour.id} location={tour.location} maxItems={3} />

      <PaymentModal 
        show={showPayment}
        onHide={() => setShowPayment(false)}
        tour={tour}
        onBookingSuccess={handleBookingSuccess}
      />
    </Container>
  );
};

export default TourDetail; 