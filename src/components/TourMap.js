import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';

const TourMap = ({ location, width = '100%', height = '400px' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapUrl, setMapUrl] = useState('');

  // Danh sách tọa độ các địa điểm du lịch nổi tiếng ở Việt Nam
  const locationCoordinates = {
    'đà lạt': '11.9404,108.4583',
    'hạ long': '20.9101,107.1839',
    'sapa': '22.3364,103.8438',
    'phú quốc': '10.2299,103.9587',
    'hà nội': '21.0285,105.8542',
    'hồ chí minh': '10.8231,106.6297',
    'đà nẵng': '16.0544,108.2022',
    'huế': '16.4637,107.5909',
    'nha trang': '12.2388,109.1968',
    'hội an': '15.8801,108.3380',
    'mũi né': '10.9380,108.3830',
    'cần thơ': '10.0452,105.7469',
    'ninh bình': '20.2144,105.9250',
    'quy nhơn': '13.7829,109.2196',
    'côn đảo': '8.6833,106.6333',
    'mộc châu': '20.8299,104.7291',
    'hà giang': '22.8237,104.9784',
    'buôn ma thuột': '12.6661,108.0504',
    'vũng tàu': '10.3460,107.0843',
    'cát bà': '20.7968,107.0480',
    'đồng hới': '17.4661,106.6218',
    'lý sơn': '15.3803,109.1178',
    'điện biên phủ': '21.3856,103.0169',
    'hà tiên': '10.3831,104.4890',
    'tam đảo': '21.4616,105.6470',
    'bắc hà': '22.5390,104.2901'
  };

  useEffect(() => {
    const getMapUrl = () => {
      try {
        setLoading(true);
        
        // Tìm tọa độ dựa trên tên địa điểm
        let coordinates = '14.0583,108.2772'; // Tọa độ mặc định (trung tâm Việt Nam)
        let zoom = 6; // Mức zoom mặc định
        
        if (location) {
          const locationLower = location.toLowerCase();
          
          // Tìm địa điểm khớp với từ khóa
          const matchedLocation = Object.keys(locationCoordinates).find(key => 
            locationLower.includes(key)
          );
          
          if (matchedLocation) {
            coordinates = locationCoordinates[matchedLocation];
            zoom = 12; // Zoom gần hơn cho địa điểm cụ thể
          }
        }
        
        // Tạo URL Google Maps với tọa độ
        const googleMapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15000!2d${coordinates.split(',')[1]}!3d${coordinates.split(',')[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDU0JzM2LjAiTiAxMDfCsDExJzAyLjAiRQ!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s&z=${zoom}`;
        
        setMapUrl(googleMapsUrl);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tạo bản đồ:', err);
        setError('Không thể tải bản đồ. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    
    getMapUrl();
  }, [location]);

  if (loading) {
    return (
      <Card className="shadow-sm mb-4">
        <Card.Header>
          <h5 className="mb-0">🗺️ Bản đồ địa điểm</h5>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 mb-0">Đang tải bản đồ...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className="mb-4">
        <Alert.Heading>⚠️ Không thể tải bản đồ</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">🗺️ Bản đồ địa điểm</h5>
        <a 
          href={`https://www.google.com/maps/search/${encodeURIComponent(location)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline-primary"
        >
          Mở Google Maps
        </a>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="ratio ratio-16x9">
          <iframe
            title={`Bản đồ ${location}`}
            src={mapUrl}
            width={width}
            height={height}
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </Card.Body>
      <Card.Footer className="bg-white">
        <small className="text-muted">
          <strong>Địa điểm:</strong> {location}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default TourMap; 