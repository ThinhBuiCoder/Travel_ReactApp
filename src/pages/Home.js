

// src/pages/Home.js
import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TourCard from '../components/TourCard';
import ChatAI from '../components/ChatAI';
import ChatRealtime from '../components/ChatRealtime';
import { useTours } from '../context/TourContext';

const Home = () => {
  const { tours } = useTours();
  const featuredTours = tours.slice(0, 3);

  return (
    <Container className="my-4">
      {/* Hero Section */}
      <div className="text-center bg-primary text-white p-5 rounded mb-4">
        <h1>🌍 Chào mừng đến với VietCulture</h1>
        <p className="lead">Khám phá những điểm đến tuyệt vời cùng chúng tôi</p>
        <Button as={Link} to="/tours" variant="light" size="lg">
          Xem tất cả tour
        </Button>
      </div>

      {/* Featured Tours */}
      <Row>
        <Col md={8}>
          <h2 className="mb-4">🔥 Tour nổi bật</h2>
          <Row>
            {featuredTours.map(tour => (
              <Col md={6} lg={4} key={tour.id} className="mb-4">
                <TourCard tour={tour} showActions={false} />
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={4}>
          <ChatAI />
          <ChatRealtime />
        </Col>
      </Row>

      {/* Features */}
      <Row className="mt-5">
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3>🎯</h3>
              <h5>Tour chất lượng</h5>
              <p>Các tour du lịch được tuyển chọn kỹ lưỡng</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3>💰</h3>
              <h5>Giá cả hợp lý</h5>
              <p>Cam kết giá tốt nhất thị trường</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3>🤖</h3>
              <h5>Tư vấn AI</h5>
              <p>Trợ lý thông minh hỗ trợ 24/7</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
