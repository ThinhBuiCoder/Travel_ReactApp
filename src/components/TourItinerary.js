import React, { useState } from 'react';
import { Card, ListGroup, Accordion, Badge } from 'react-bootstrap';

const TourItinerary = ({ location, duration = 3 }) => {
  // Dữ liệu lịch trình giả lập cho các địa điểm phổ biến
  const mockItineraries = {
    'đà lạt': [
      {
        day: 1,
        title: 'Khám phá trung tâm Đà Lạt',
        activities: [
          { time: '07:00', description: 'Ăn sáng tại khách sạn' },
          { time: '08:30', description: 'Tham quan Quảng trường Lâm Viên và Hồ Xuân Hương' },
          { time: '10:30', description: 'Ghé thăm Nhà thờ Con Gà' },
          { time: '12:00', description: 'Ăn trưa với đặc sản địa phương' },
          { time: '14:00', description: 'Tham quan Dinh Bảo Đại' },
          { time: '16:00', description: 'Thưởng thức cà phê tại Cà phê Túi Mơ To' },
          { time: '18:00', description: 'Ăn tối tại chợ đêm Đà Lạt' },
        ]
      },
      {
        day: 2,
        title: 'Khám phá vùng ngoại ô',
        activities: [
          { time: '07:00', description: 'Ăn sáng tại khách sạn' },
          { time: '08:30', description: 'Tham quan Thung lũng Tình Yêu' },
          { time: '10:30', description: 'Khám phá Làng hoa Vạn Thành' },
          { time: '12:00', description: 'Ăn trưa tại nhà hàng địa phương' },
          { time: '14:00', description: 'Tham quan Thiền viện Trúc Lâm' },
          { time: '16:00', description: 'Tham quan Hồ Tuyền Lâm' },
          { time: '18:00', description: 'Ăn tối tại nhà hàng đặc sản' },
        ]
      },
      {
        day: 3,
        title: 'Khám phá điểm đến nổi tiếng',
        activities: [
          { time: '07:00', description: 'Ăn sáng tại khách sạn' },
          { time: '08:30', description: 'Tham quan Thác Datanla' },
          { time: '11:00', description: 'Tham quan Vườn hoa thành phố' },
          { time: '12:30', description: 'Ăn trưa tại nhà hàng địa phương' },
          { time: '14:00', description: 'Tham quan Ga Đà Lạt cổ kính' },
          { time: '16:00', description: 'Mua sắm đặc sản và quà lưu niệm' },
          { time: '18:00', description: 'Ăn tối và kết thúc chuyến tham quan' },
        ]
      }
    ],
    'hạ long': [
      {
        day: 1,
        title: 'Khám phá Vịnh Hạ Long',
        activities: [
          { time: '07:00', description: 'Ăn sáng tại khách sạn' },
          { time: '08:30', description: 'Lên tàu du lịch tại cảng' },
          { time: '10:30', description: 'Tham quan hang Sửng Sốt' },
          { time: '12:00', description: 'Ăn trưa trên tàu với hải sản tươi ngon' },
          { time: '14:00', description: 'Chèo thuyền kayak khám phá vịnh' },
          { time: '16:00', description: 'Tham quan làng chài Cửa Vạn' },
          { time: '18:00', description: 'Ăn tối trên tàu và nghỉ đêm' },
        ]
      },
      {
        day: 2,
        title: 'Tham quan đảo Titop',
        activities: [
          { time: '06:00', description: 'Ngắm bình minh trên vịnh' },
          { time: '07:00', description: 'Ăn sáng trên tàu' },
          { time: '08:30', description: 'Lên đảo Titop và tắm biển' },
          { time: '10:30', description: 'Leo núi ngắm toàn cảnh vịnh Hạ Long' },
          { time: '12:00', description: 'Ăn trưa trên tàu' },
          { time: '14:00', description: 'Tham quan hang Luồn' },
          { time: '16:00', description: 'Quay về cảng' },
          { time: '18:00', description: 'Ăn tối tại nhà hàng địa phương' },
        ]
      },
      {
        day: 3,
        title: 'Khám phá thành phố Hạ Long',
        activities: [
          { time: '07:00', description: 'Ăn sáng tại khách sạn' },
          { time: '08:30', description: 'Tham quan công viên Sun World Hạ Long' },
          { time: '11:00', description: 'Trải nghiệm cáp treo Nữ Hoàng' },
          { time: '12:30', description: 'Ăn trưa tại nhà hàng địa phương' },
          { time: '14:00', description: 'Tham quan bảo tàng Quảng Ninh' },
          { time: '16:00', description: 'Mua sắm đặc sản và quà lưu niệm' },
          { time: '18:00', description: 'Ăn tối và kết thúc chuyến tham quan' },
        ]
      }
    ],
    'default': [
      {
        day: 1,
        title: 'Ngày khám phá',
        activities: [
          { time: '07:00', description: 'Ăn sáng tại khách sạn' },
          { time: '08:30', description: 'Tham quan các địa điểm nổi tiếng' },
          { time: '12:00', description: 'Ăn trưa với đặc sản địa phương' },
          { time: '14:00', description: 'Tiếp tục tham quan' },
          { time: '18:00', description: 'Ăn tối và nghỉ ngơi' },
        ]
      },
      {
        day: 2,
        title: 'Ngày trải nghiệm',
        activities: [
          { time: '07:00', description: 'Ăn sáng tại khách sạn' },
          { time: '08:30', description: 'Trải nghiệm văn hóa địa phương' },
          { time: '12:00', description: 'Ăn trưa tại nhà hàng địa phương' },
          { time: '14:00', description: 'Tham gia các hoạt động giải trí' },
          { time: '18:00', description: 'Ăn tối với đặc sản địa phương' },
        ]
      },
      {
        day: 3,
        title: 'Ngày mua sắm và chia tay',
        activities: [
          { time: '07:00', description: 'Ăn sáng tại khách sạn' },
          { time: '09:00', description: 'Tham quan các khu chợ địa phương' },
          { time: '12:00', description: 'Ăn trưa tại nhà hàng' },
          { time: '14:00', description: 'Mua sắm đặc sản và quà lưu niệm' },
          { time: '17:00', description: 'Ăn tối và kết thúc chuyến tham quan' },
        ]
      }
    ]
  };

  // Lấy lịch trình phù hợp với địa điểm
  const getItinerary = () => {
    if (!location) return mockItineraries.default;
    
    const locationLower = location.toLowerCase();
    
    // Tìm địa điểm khớp với từ khóa
    const matchedLocation = Object.keys(mockItineraries).find(key => 
      locationLower.includes(key)
    );
    
    return matchedLocation ? mockItineraries[matchedLocation] : mockItineraries.default;
  };

  // Điều chỉnh số ngày theo duration
  const adjustItinerary = (itinerary, days) => {
    if (itinerary.length === days) return itinerary;
    
    if (itinerary.length > days) {
      // Cắt bớt ngày nếu nhiều hơn
      return itinerary.slice(0, days);
    } else {
      // Thêm ngày nếu ít hơn
      const result = [...itinerary];
      const lastDay = itinerary[itinerary.length - 1];
      
      for (let i = itinerary.length + 1; i <= days; i++) {
        result.push({
          day: i,
          title: `Ngày ${i}`,
          activities: [
            { time: '07:00', description: 'Ăn sáng tại khách sạn' },
            { time: '09:00', description: 'Tham quan địa điểm du lịch' },
            { time: '12:00', description: 'Ăn trưa tại nhà hàng địa phương' },
            { time: '14:00', description: 'Tiếp tục tham quan' },
            { time: '18:00', description: 'Ăn tối và nghỉ ngơi' },
          ]
        });
      }
      
      return result;
    }
  };

  const itinerary = adjustItinerary(getItinerary(), duration);
  const [activeKey, setActiveKey] = useState('0');

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header>
        <h5 className="mb-0">📅 Lịch trình chi tiết ({duration} ngày)</h5>
      </Card.Header>
      <Card.Body className="p-0">
        <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
          {itinerary.map((day, index) => (
            <Accordion.Item key={index} eventKey={index.toString()}>
              <Accordion.Header>
                <div className="d-flex align-items-center w-100">
                  <Badge bg="primary" className="me-2">Ngày {day.day}</Badge>
                  <span className="fw-bold">{day.title}</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="p-0">
                <ListGroup variant="flush">
                  {day.activities.map((activity, actIndex) => (
                    <ListGroup.Item key={actIndex} className="d-flex">
                      <div className="text-primary fw-bold" style={{ width: '80px' }}>
                        {activity.time}
                      </div>
                      <div>{activity.description}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Card.Body>
      <Card.Footer className="bg-white">
        <small className="text-muted">
          * Lịch trình có thể thay đổi tùy theo điều kiện thời tiết và tình hình thực tế
        </small>
      </Card.Footer>
    </Card>
  );
};

export default TourItinerary; 