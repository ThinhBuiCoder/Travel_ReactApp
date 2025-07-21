import React, { useState, useEffect, useCallback } from 'react';
import { Modal, ListGroup, Alert } from 'react-bootstrap';

const SimpleVoiceButton = () => {
  const [isListening, setIsListening] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [micPermission, setMicPermission] = useState('unknown'); // 'unknown', 'granted', 'denied'

  // Đảm bảo component đã được render
  useEffect(() => {
    setMounted(true);
    console.log('SimpleVoiceButton mounted');
    
    // Kiểm tra quyền truy cập microphone
    checkMicrophonePermission();
    
    // Lắng nghe sự kiện thay đổi trạng thái từ VoiceCommandHandler
    const handleStatusChange = (event) => {
      if (event.detail && typeof event.detail.isListening === 'boolean') {
        setIsListening(event.detail.isListening);
      }
    };
    
    window.addEventListener('voice-recognition-status', handleStatusChange);
    
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
        
        result.onchange = () => {
          setMicPermission(result.state);
        };
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
      return false;
    }
  }, []);

  const toggleListening = useCallback(async () => {
    // Nếu chưa có quyền truy cập microphone, yêu cầu quyền
    if (micPermission !== 'granted') {
      const granted = await requestMicrophonePermission();
      if (!granted) {
        alert('Vui lòng cấp quyền truy cập microphone để sử dụng tính năng nhận diện giọng nói');
        return;
      }
    }
    
    const newState = !isListening;
    setIsListening(newState);
    
    // Gửi sự kiện để VoiceCommandHandler có thể lắng nghe
    const event = new CustomEvent('toggle-voice-recognition', { 
      detail: { active: newState } 
    });
    window.dispatchEvent(event);
    
    console.log('Trạng thái lắng nghe:', newState);
  }, [isListening, micPermission, requestMicrophonePermission]);

  const commands = [
    { command: "trang chủ", description: "Chuyển đến trang chủ" },
    { command: "danh sách tour", description: "Xem danh sách tour du lịch" },
    { command: "trang cá nhân", description: "Đi đến trang hồ sơ cá nhân" },
    { command: "tìm kiếm [địa điểm]", description: "Tìm kiếm tour theo địa điểm" },
    { command: "đặt tour", description: "Mở form đặt tour hiện tại" },
    { command: "đặt tour [số]", description: "Đặt tour theo số thứ tự trong danh sách" },
    { command: "đăng xuất", description: "Đăng xuất khỏi tài khoản" },
    { command: "trợ giúp", description: "Hiển thị danh sách lệnh giọng nói" }
  ];

  if (!mounted) return null;

  return (
    <div id="voice-buttons-container">
      {/* Nút trợ lý giọng nói */}
      <button
        className={`voice-button ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: isListening ? '#dc3545' : '#0d6efd',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '24px',
          animation: isListening ? 'pulse 1.5s infinite' : 'none'
        }}
        aria-label="Trợ lý giọng nói"
        title={isListening ? 'Đang lắng nghe... Nhấn để dừng' : 'Nhấn để kích hoạt trợ lý giọng nói'}
      >
        <i className={`bi ${isListening ? 'bi-mic-fill' : 'bi-mic'}`}></i>
      </button>

      {/* Nút trợ giúp */}
      <button
        className="help-button"
        onClick={() => setShowHelp(true)}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          zIndex: 9999,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '18px'
        }}
        aria-label="Trợ giúp lệnh giọng nói"
        title="Xem hướng dẫn lệnh giọng nói"
      >
        <i className="bi bi-question-lg"></i>
      </button>

      {/* Modal hướng dẫn lệnh giọng nói */}
      <Modal show={showHelp} onHide={() => setShowHelp(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-mic-fill me-2"></i>
            Hướng dẫn lệnh giọng nói
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {micPermission === 'denied' && (
            <Alert variant="danger" className="mb-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>Không có quyền truy cập microphone!</strong>
              <p className="mb-0 mt-1">Vui lòng cấp quyền truy cập microphone trong cài đặt trình duyệt để sử dụng tính năng nhận diện giọng nói.</p>
            </Alert>
          )}
          
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
            <strong>Mẹo sử dụng:</strong>
            <ul className="mb-0 mt-1">
              <li>Nói rõ ràng và không quá nhanh</li>
              <li>Giảm tiếng ồn xung quanh</li>
              <li>Đảm bảo microphone hoạt động tốt</li>
              <li>Chức năng hoạt động tốt nhất trên Chrome hoặc Edge</li>
            </ul>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SimpleVoiceButton; 