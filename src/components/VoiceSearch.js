import React, { useState, useEffect } from 'react';
import { Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useTours } from '../context/TourContext';

const VoiceSearch = ({ onSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(true);
  const [processingSearch, setProcessingSearch] = useState(false);
  const { searchTours } = useTours();

  // Kiểm tra trình duyệt có hỗ trợ Web Speech API không
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
      setError('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng thử với Chrome hoặc Edge.');
    }
  }, []);

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setError(null);
    
    try {
      // Khởi tạo đối tượng nhận diện giọng nói
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Cấu hình
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        console.log('Bắt đầu lắng nghe...');
      };
      
      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        console.log('Kết quả nhận diện:', result);
        setTranscript(result);
        
        // Tự động tìm kiếm sau khi nhận diện
        handleSearch(result);
      };
      
      recognition.onerror = (event) => {
        console.error('Lỗi nhận diện giọng nói:', event.error);
        setError(`Lỗi nhận diện giọng nói: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        console.log('Kết thúc lắng nghe');
        setIsListening(false);
      };
      
      // Bắt đầu nhận diện
      recognition.start();
    } catch (err) {
      console.error('Lỗi khi khởi tạo nhận diện giọng nói:', err);
      setError('Không thể khởi tạo chức năng nhận diện giọng nói. Vui lòng thử lại.');
      setIsListening(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) return;
    
    setProcessingSearch(true);
    
    // Xử lý từ khóa tìm kiếm từ giọng nói
    setTimeout(() => {
      // Chuyển đổi các từ khóa phổ biến
      let processedQuery = query.toLowerCase();
      
      // Xử lý các từ khóa phổ biến trong tiếng Việt
      const keywordMap = {
        'tìm kiếm': '',
        'tìm': '',
        'kiếm': '',
        'cho tôi xem': '',
        'cho tôi': '',
        'tôi muốn đi': '',
        'tôi muốn': '',
        'muốn đi': '',
        'tour': '',
        'du lịch': '',
        'chuyến đi': ''
      };
      
      // Loại bỏ các từ khóa không cần thiết
      Object.keys(keywordMap).forEach(keyword => {
        processedQuery = processedQuery.replace(keyword, keywordMap[keyword]).trim();
      });
      
      console.log('Từ khóa tìm kiếm đã xử lý:', processedQuery);
      
      // Gọi hàm tìm kiếm
      searchTours(processedQuery);
      
      // Gọi callback nếu được cung cấp
      if (onSearch) {
        onSearch(processedQuery);
      }
      
      setProcessingSearch(false);
    }, 500);
  };

  if (!supported) {
    return (
      <Alert variant="warning">
        <Alert.Heading>Không hỗ trợ nhận diện giọng nói</Alert.Heading>
        <p>Trình duyệt của bạn không hỗ trợ chức năng nhận diện giọng nói. Vui lòng thử với Chrome hoặc Edge.</p>
      </Alert>
    );
  }

  return (
    <Card className="mb-3">
      <Card.Body className="d-flex align-items-center">
        <div className="me-3">
          <Button
            variant={isListening ? 'danger' : 'primary'}
            onClick={startListening}
            disabled={isListening || processingSearch}
            className="rounded-circle"
            style={{ width: '50px', height: '50px' }}
          >
            {isListening ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <i className="bi bi-mic-fill" style={{ fontSize: '1.2rem' }}></i>
            )}
          </Button>
        </div>
        
        <div className="flex-grow-1">
          {isListening ? (
            <div className="text-primary">
              <Spinner size="sm" animation="grow" className="me-2" />
              Đang lắng nghe... Hãy nói "tìm kiếm [địa điểm]"
            </div>
          ) : transcript ? (
            <div>
              <strong>Bạn vừa nói:</strong> {transcript}
              {processingSearch && <Spinner size="sm" animation="border" className="ms-2" />}
            </div>
          ) : (
            <div className="text-muted">
              Nhấn vào biểu tượng micro và nói để tìm kiếm tour
            </div>
          )}
          
          {error && <div className="text-danger mt-1">{error}</div>}
        </div>
      </Card.Body>
    </Card>
  );
};

export default VoiceSearch; 