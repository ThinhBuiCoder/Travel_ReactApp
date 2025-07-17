import React from 'react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { useTours } from '../context/TourContext';

const TourStatistics = () => {
  const { allTours } = useTours();

  const stats = {
    totalTours: allTours.length,
    avgPrice: allTours.reduce((sum, tour) => sum + tour.price, 0) / allTours.length || 0,
    avgRating: allTours.reduce((sum, tour) => sum + (tour.rating || 0), 0) / allTours.length || 0,
    highRatedTours: allTours.filter(tour => tour.rating >= 4).length,
    locations: [...new Set(allTours.map(tour => tour.location))].length
  };

  const priceRanges = {
    budget: allTours.filter(tour => tour.price < 2000000).length,
    mid: allTours.filter(tour => tour.price >= 2000000 && tour.price < 5000000).length,
    luxury: allTours.filter(tour => tour.price >= 5000000).length
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">📊 Thống kê tour</h5>
      </Card.Header>
      <Card.Body>
        <Row className="text-center mb-4">
          <Col md={3}>
            <h3 className="text-primary">{stats.totalTours}</h3>
            <p className="mb-0">Total Tours</p>
          </Col>
          <Col md={3}>
            <h3 className="text-success">{Math.round(stats.avgPrice).toLocaleString('vi-VN')}</h3>
            <p className="mb-0">Giá TB (VNĐ)</p>
          </Col>
          <Col md={3}>
            <h3 className="text-warning">{stats.avgRating.toFixed(1)}</h3>
            <p className="mb-0">Đánh giá TB</p>
          </Col>
          <Col md={3}>
            <h3 className="text-info">{stats.locations}</h3>
            <p className="mb-0">Điểm đến</p>
          </Col>
        </Row>

        <div className="mb-3">
          <h6>Phân bố giá tour</h6>
          <div className="mb-2">
            <div className="d-flex justify-content-between">
              <span>Tiết kiệm (&lt;2M)</span>
              <span>{priceRanges.budget} tours</span>
            </div>
            <ProgressBar 
              variant="success" 
              now={(priceRanges.budget / stats.totalTours) * 100} 
              style={{ height: '8px' }}
            />
          </div>
          
          <div className="mb-2">
            <div className="d-flex justify-content-between">
              <span>Trung bình (2M-5M)</span>
              <span>{priceRanges.mid} tours</span>
            </div>
            <ProgressBar 
              variant="warning" 
              now={(priceRanges.mid / stats.totalTours) * 100} 
              style={{ height: '8px' }}
            />
          </div>
          
          <div className="mb-2">
            <div className="d-flex justify-content-between">
              <span>Cao cấp (&gt;5M)</span>
              <span>{priceRanges.luxury} tours</span>
            </div>
            <ProgressBar 
              variant="danger" 
              now={(priceRanges.luxury / stats.totalTours) * 100} 
              style={{ height: '8px' }}
            />
          </div>
        </div>

        <div className="text-center">
          <small className="text-muted">
            🏆 {stats.highRatedTours} tour có đánh giá 4⭐ trở lên
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TourStatistics;