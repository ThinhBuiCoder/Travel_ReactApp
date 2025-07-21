import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Row, Col } from 'react-bootstrap';

const WeatherWidget = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dữ liệu thời tiết giả lập cho các địa điểm phổ biến
  const mockWeatherData = {
    'đà lạt': {
      temp: 22,
      humidity: 70,
      description: 'Mát mẻ, có sương mù',
      icon: '🌥️',
      forecast: [
        { day: 'Hôm nay', temp: 22, icon: '🌥️' },
        { day: 'Ngày mai', temp: 23, icon: '☀️' },
        { day: 'Ngày kia', temp: 21, icon: '🌦️' }
      ]
    },
    'hạ long': {
      temp: 29,
      humidity: 75,
      description: 'Nắng nhẹ, có mây',
      icon: '⛅',
      forecast: [
        { day: 'Hôm nay', temp: 29, icon: '⛅' },
        { day: 'Ngày mai', temp: 30, icon: '☀️' },
        { day: 'Ngày kia', temp: 28, icon: '🌦️' }
      ]
    },
    'sapa': {
      temp: 18,
      humidity: 85,
      description: 'Mát mẻ, có sương mù',
      icon: '🌫️',
      forecast: [
        { day: 'Hôm nay', temp: 18, icon: '🌫️' },
        { day: 'Ngày mai', temp: 20, icon: '⛅' },
        { day: 'Ngày kia', temp: 19, icon: '🌥️' }
      ]
    },
    'phú quốc': {
      temp: 32,
      humidity: 70,
      description: 'Nắng, ít mây',
      icon: '☀️',
      forecast: [
        { day: 'Hôm nay', temp: 32, icon: '☀️' },
        { day: 'Ngày mai', temp: 31, icon: '⛅' },
        { day: 'Ngày kia', temp: 32, icon: '☀️' }
      ]
    },
    'hà nội': {
      temp: 30,
      humidity: 80,
      description: 'Nóng ẩm, có mây',
      icon: '⛅',
      forecast: [
        { day: 'Hôm nay', temp: 30, icon: '⛅' },
        { day: 'Ngày mai', temp: 32, icon: '☀️' },
        { day: 'Ngày kia', temp: 29, icon: '🌦️' }
      ]
    },
    'hồ chí minh': {
      temp: 33,
      humidity: 75,
      description: 'Nóng, có thể có mưa rào',
      icon: '🌦️',
      forecast: [
        { day: 'Hôm nay', temp: 33, icon: '🌦️' },
        { day: 'Ngày mai', temp: 32, icon: '⛈️' },
        { day: 'Ngày kia', temp: 31, icon: '⛅' }
      ]
    },
    'đà nẵng': {
      temp: 31,
      humidity: 70,
      description: 'Nắng, ít mây',
      icon: '☀️',
      forecast: [
        { day: 'Hôm nay', temp: 31, icon: '☀️' },
        { day: 'Ngày mai', temp: 30, icon: '⛅' },
        { day: 'Ngày kia', temp: 32, icon: '☀️' }
      ]
    },
    'huế': {
      temp: 30,
      humidity: 75,
      description: 'Nắng, có mây',
      icon: '⛅',
      forecast: [
        { day: 'Hôm nay', temp: 30, icon: '⛅' },
        { day: 'Ngày mai', temp: 29, icon: '🌦️' },
        { day: 'Ngày kia', temp: 31, icon: '☀️' }
      ]
    },
    'nha trang': {
      temp: 31,
      humidity: 65,
      description: 'Nắng đẹp, ít mây',
      icon: '☀️',
      forecast: [
        { day: 'Hôm nay', temp: 31, icon: '☀️' },
        { day: 'Ngày mai', temp: 32, icon: '☀️' },
        { day: 'Ngày kia', temp: 30, icon: '⛅' }
      ]
    },
    'default': {
      temp: 28,
      humidity: 70,
      description: 'Thời tiết ổn định',
      icon: '⛅',
      forecast: [
        { day: 'Hôm nay', temp: 28, icon: '⛅' },
        { day: 'Ngày mai', temp: 29, icon: '☀️' },
        { day: 'Ngày kia', temp: 28, icon: '⛅' }
      ]
    }
  };

  useEffect(() => {
    // Giả lập việc gọi API thời tiết
    setLoading(true);
    setTimeout(() => {
      try {
        if (!location) {
          setWeather(mockWeatherData.default);
        } else {
          // Tìm thời tiết cho địa điểm
          const locationKey = Object.keys(mockWeatherData).find(key => 
            location.toLowerCase().includes(key)
          );
          
          setWeather(locationKey ? mockWeatherData[locationKey] : mockWeatherData.default);
        }
        setLoading(false);
      } catch (err) {
        setError('Không thể tải dữ liệu thời tiết. Vui lòng thử lại sau.');
        setLoading(false);
      }
    }, 1000);
  }, [location]);

  if (loading) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 mb-0">Đang tải dữ liệu thời tiết...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className="mb-4">
        <Alert.Heading>⚠️ Không thể tải thời tiết</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header>
        <h5 className="mb-0">🌤️ Thời tiết tại {location || 'Việt Nam'}</h5>
      </Card.Header>
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <div style={{ fontSize: '3rem', marginRight: '1rem' }}>
            {weather.icon}
          </div>
          <div>
            <h2 className="mb-0">{weather.temp}°C</h2>
            <p className="mb-0">{weather.description}</p>
            <small>Độ ẩm: {weather.humidity}%</small>
          </div>
        </div>
        
        <hr />
        
        <h6>Dự báo 3 ngày tới:</h6>
        <Row>
          {weather.forecast.map((day, index) => (
            <Col key={index} className="text-center">
              <div className="p-2">
                <div>{day.day}</div>
                <div style={{ fontSize: '1.5rem' }}>{day.icon}</div>
                <div>{day.temp}°C</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default WeatherWidget; 