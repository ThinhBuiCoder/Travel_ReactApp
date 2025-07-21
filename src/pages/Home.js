

// src/pages/Home.js
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TourCard from '../components/TourCard';
import ChatAI from '../components/ChatAI';
import ChatRealtime from '../components/ChatRealtime';
import { useTours } from '../context/TourContext';

const Home = () => {
  const { tours, clearFilters } = useTours();
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState('unknown');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    clearFilters();
    // eslint-disable-next-line
  }, []);

  // Lắng nghe sự kiện thay đổi trạng thái từ VoiceCommandHandler
  useEffect(() => {
    const handleStatusChange = (event) => {
      if (event.detail && typeof event.detail.isListening === 'boolean') {
        setIsListening(event.detail.isListening);
      }
    };
    
    window.addEventListener('voice-recognition-status', handleStatusChange);
    
    // Kiểm tra quyền truy cập microphone
    checkMicrophonePermission();
    
    return () => {
      window.removeEventListener('voice-recognition-status', handleStatusChange);
    };
  }, []);

  // Kiểm tra quyền truy cập microphone
  const checkMicrophonePermission = useCallback(async () => {
    try {
      if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: 'microphone' });
        setMicPermission(result.state);
      } else {
        // Fallback cho trình duyệt không hỗ trợ Permissions API
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            setMicPermission('granted');
          })
          .catch(() => {
            setMicPermission('denied');
          });
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra quyền truy cập microphone:', error);
    }
  }, []);

  // Yêu cầu quyền truy cập microphone
  const requestMicrophonePermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission('granted');
      return true;
    } catch (error) {
      console.error('Không thể truy cập microphone:', error);
      setMicPermission('denied');
      setAlertMessage('Vui lòng cấp quyền truy cập microphone để sử dụng tính năng nhận diện giọng nói');
      setShowAlert(true);
      return false;
    }
  }, []);

  // Lấy 6 tour có rating cao nhất
  const featuredTours = [...tours]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  const toggleListening = useCallback(async () => {
    // Nếu chưa có quyền truy cập microphone, yêu cầu quyền
    if (micPermission !== 'granted') {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }
    
    const newState = !isListening;
    setIsListening(newState);
    
    // Gửi sự kiện để VoiceCommandHandler có thể lắng nghe
    const event = new CustomEvent('toggle-voice-recognition', { 
      detail: { active: newState } 
    });
    window.dispatchEvent(event);
  }, [isListening, micPermission, requestMicrophonePermission]);

  return (
    <Container className="my-4">
      {showAlert && (
        <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {alertMessage}
        </Alert>
      )}
      
      {/* Hero Section */}
      <div className="text-center bg-primary text-white p-5 rounded mb-4">
        <h1>🌍 Chào mừng đến với VietCulture</h1>
        <p className="lead">Khám phá những điểm đến tuyệt vời cùng chúng tôi</p>
        <Button as={Link} to="/tours" variant="light" size="lg" className="me-2">
          Xem tất cả tour
        </Button>
        <Button 
          variant={isListening ? 'danger' : 'outline-light'} 
          size="lg"
          onClick={toggleListening}
          className="d-inline-flex align-items-center"
          disabled={micPermission === 'denied'}
        >
          <i className={`bi ${isListening ? 'bi-mic-fill' : 'bi-mic'} me-2`}></i>
          {isListening ? 'Đang lắng nghe...' : 'Dùng giọng nói'}
        </Button>
      </div>

      {/* Thông tin về lệnh giọng nói */}
      <div className="bg-light p-3 rounded mb-4">
        <h5 className="mb-3"><i className="bi bi-mic me-2"></i>Trợ lý giọng nói - Đặt tour dễ dàng</h5>
        <p className="mb-2">Bạn có thể sử dụng các lệnh giọng nói sau để đặt tour:</p>
        <ul className="mb-0">
          <li><strong>"đặt tour"</strong> - Mở form đặt tour khi đang ở trang chi tiết tour</li>
          <li><strong>"đặt tour 1"</strong> - Đặt tour số 1 trong danh sách tour</li>
          <li><strong>"book tour"</strong> - Tương tự lệnh đặt tour</li>
        </ul>
      </div>

      {/* Featured Tours */}
      <Row>
        <Col md={8}>
          <h2 className="mb-4">🔥 Tour nổi bật</h2>
          <Row>
            {featuredTours.map((tour, index) => (
              <Col md={6} lg={4} key={tour.id} className="mb-4">
                <div className="position-relative">
                  <span className="position-absolute top-0 start-0 bg-primary text-white px-2 py-1 rounded-end">
                    Tour #{index + 1}
                  </span>
                  <TourCard tour={tour} showActions={false} />
                </div>
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
