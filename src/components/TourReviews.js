import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert, Badge, ListGroup } from 'react-bootstrap';
import { useTours } from '../context/TourContext';
import { useUser } from '../context/UserContext';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const TourReviews = ({ tourId, currentReviews = [] }) => {
  const { addReview } = useTours();
  const { user, isAuthenticated } = useUser();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Nếu không có đánh giá, tạo mảng rỗng
  const reviews = currentReviews || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Vui lòng đăng nhập để đánh giá tour');
      return;
    }

    if (!comment.trim()) {
      setError('Vui lòng nhập nội dung đánh giá');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const newReview = {
        userId: user.id,
        userName: user.name,
        rating,
        comment,
        date: new Date().toISOString()
      };
      
      await addReview(tourId, newReview);
      setSuccess(true);
      setComment('');
      setRating(5);
      
      // Ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Không thể thêm đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Tính rating trung bình
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Tạo các ngôi sao cho rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    // Thêm sao đầy
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-warning" />);
    }
    
    // Thêm nửa sao nếu có
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning" />);
    }
    
    // Thêm sao rỗng
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-warning" />);
    }
    
    return stars;
  };

  // Tạo các ngôi sao cho form đánh giá
  const renderRatingSelector = () => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i}
          className="star-rating"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: '5px' }}
        >
          {i <= (hoverRating || rating) ? <FaStar className="text-warning" /> : <FaRegStar className="text-warning" />}
        </span>
      );
    }
    
    return stars;
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">💬 Đánh giá từ du khách</h5>
          <div>
            <span className="me-2">
              {renderStars(averageRating)}
            </span>
            <Badge bg="warning" text="dark" className="p-2">
              {averageRating} / 5
            </Badge>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {/* Form thêm đánh giá */}
        <div className="mb-4">
          <h6>Chia sẻ trải nghiệm của bạn</h6>
          
          {error && (
            <Alert variant="danger" className="py-2">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="py-2">
              Đã thêm đánh giá thành công!
            </Alert>
          )}
          
          {!isAuthenticated ? (
            <Alert variant="info" className="py-2">
              Vui lòng đăng nhập để đánh giá tour
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <Form.Label className="me-2 mb-0">Đánh giá:</Form.Label>
                  <div>
                    {renderRatingSelector()}
                  </div>
                  <span className="ms-2">({rating}/5)</span>
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Chia sẻ cảm nhận của bạn về tour này..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={submitting}
                />
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </Button>
            </Form>
          )}
        </div>
        
        <hr />
        
        {/* Danh sách đánh giá */}
        <h6 className="mb-3">
          {reviews.length > 0 ? `${reviews.length} đánh giá` : 'Chưa có đánh giá nào'}
        </h6>
        
        {reviews.length === 0 ? (
          <div className="text-center text-muted py-4">
            <p>Hãy là người đầu tiên đánh giá tour này!</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {reviews.map((review, index) => (
              <ListGroup.Item key={index} className="px-0">
                <div className="d-flex justify-content-between mb-1">
                  <div>
                    <strong>{review.userName}</strong>
                    <span className="text-muted ms-2">
                      {new Date(review.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div>
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="mb-0">{review.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default TourReviews; 