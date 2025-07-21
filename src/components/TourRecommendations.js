import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTours } from '../context/TourContext';

const TourRecommendations = ({ currentTourId, location, maxItems = 3 }) => {
  const { allTours } = useTours();
  
  // Lọc các tour tương tự dựa trên địa điểm và loại trừ tour hiện tại
  const similarTours = allTours
    .filter(tour => 
      tour.id !== currentTourId && 
      (tour.location.toLowerCase().includes(location.toLowerCase()) || 
       location.toLowerCase().includes(tour.location.toLowerCase()))
    )
    .slice(0, maxItems);

  // Nếu không đủ tour tương tự về địa điểm, thêm các tour khác có rating cao
  const remainingCount = maxItems - similarTours.length;
  if (remainingCount > 0) {
    const otherTours = allTours
      .filter(tour => 
        tour.id !== currentTourId && 
        !similarTours.some(t => t.id === tour.id)
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, remainingCount);
    
    similarTours.push(...otherTours);
  }

  if (similarTours.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header>
        <h5 className="mb-0">🔍 Tour tương tự bạn có thể thích</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          {similarTours.map(tour => (
            <Col md={4} key={tour.id} className="mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={tour.image} 
                  style={{ height: '120px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ fontSize: '1rem' }}>{tour.name}</Card.Title>
                  <div className="mb-2">
                    <strong>📍 {tour.location}</strong>
                  </div>
                  <div className="mb-2">
                    <strong>💰 {tour.price.toLocaleString('vi-VN')} VNĐ</strong>
                  </div>
                  <div className="mt-auto">
                    <Button 
                      as={Link} 
                      to={`/tour/${tour.id}`} 
                      variant="outline-primary" 
                      size="sm" 
                      className="w-100"
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default TourRecommendations; 