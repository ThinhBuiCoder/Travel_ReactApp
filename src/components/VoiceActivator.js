import React, { useState, useEffect } from 'react';
import { Button, Modal, ListGroup } from 'react-bootstrap';

const VoiceActivator = () => {
  const [isListening, setIsListening] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    console.log('VoiceActivator mounted');
  }, []);

  const toggleListening = () => {
    // Gửi sự kiện tới VoiceCommandHandler để bật/tắt nhận diện giọng nói
    const event = new CustomEvent('toggle-voice-recognition', { 
      detail: { active: !isListening } 
    });
    window.dispatchEvent(event);
    
    setIsListening(!isListening);
    console.log('Trạng thái lắng nghe:', !isListening);
  };

  const commands = [
    { command: "trang chủ", description: "Chuyển đến trang chủ" },
    { command: "danh sách tour", description: "Xem danh sách tour du lịch" },
    { command: "trang cá nhân", description: "Đi đến trang hồ sơ cá nhân" },
    { command: "tìm kiếm [địa điểm]", description: "Tìm kiếm tour theo địa điểm" },
    { command: "đăng xuất", description: "Đăng xuất khỏi tài khoản" },
    { command: "trợ giúp", description: "Hiển thị danh sách lệnh giọng nói" }
  ];

  return (
    <div className="voice-activator-container">
      {/* Nút kích hoạt giọng nói */}
      <Button
        variant={isListening ? 'danger' : 'primary'}
        className={`voice-activator-btn rounded-circle ${isListening ? 'voice-listening' : ''}`}
        style={{ width: '60px', height: '60px' }}
        onClick={toggleListening}
        title={isListening ? 'Đang lắng nghe lệnh giọng nói...' : 'Kích hoạt trợ lý giọng nói'}
      >
        <i className={`bi ${isListening ? 'bi-mic-fill' : 'bi-mic'}`} style={{ fontSize: '1.5rem' }}></i>
      </Button>

      {/* Nút hiển thị trợ giúp */}
      <Button
        variant="outline-secondary"
        className="voice-activator-btn rounded-circle"
        style={{ width: '40px', height: '40px', bottom: '90px' }}
        onClick={() => setShowHelp(true)}
        title="Xem hướng dẫn lệnh giọng nói"
      >
        <i className="bi bi-question-lg"></i>
      </Button>

      {/* Modal hướng dẫn lệnh giọng nói */}
      <Modal show={showHelp} onHide={() => setShowHelp(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-mic-fill me-2"></i>
            Hướng dẫn lệnh giọng nói
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Nhấn vào nút micro ở góc phải bên dưới để kích hoạt trợ lý giọng nói. 
            Khi nút chuyển sang màu đỏ, trợ lý đang lắng nghe lệnh của bạn.
          </p>
          
          <h5>Các lệnh giọng nói:</h5>
          <ListGroup>
            {commands.map((item, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                <strong>"{item.command}"</strong>
                <span>{item.description}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
          
          <div className="mt-3 alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Lưu ý: Chức năng nhận diện giọng nói hoạt động tốt nhất trên trình duyệt Chrome hoặc Edge.
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VoiceActivator; 