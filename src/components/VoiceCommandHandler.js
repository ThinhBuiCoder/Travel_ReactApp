import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useTours } from '../context/TourContext';

const VoiceCommandHandler = () => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('info');
  const recognitionRef = useRef(null);
  const [selectedTourId, setSelectedTourId] = useState(null);
  
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useUser();
  const { searchTours, tours } = useTours();

  // Thông báo trạng thái lắng nghe cho các component khác
  const broadcastStatus = useCallback((status) => {
    const event = new CustomEvent('voice-recognition-status', {
      detail: { isListening: status }
    });
    window.dispatchEvent(event);
  }, []);

  // Cập nhật trạng thái lắng nghe và thông báo cho các component khác
  const updateListeningState = useCallback((status) => {
    setIsListening(status);
    broadcastStatus(status);
  }, [broadcastStatus]);

  // Khởi tạo đối tượng nhận diện giọng nói
  useEffect(() => {
    console.log('Đang khởi tạo nhận diện giọng nói...');
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Trình duyệt không hỗ trợ Web Speech API');
      setSupported(false);
      showNotification('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói', 'danger');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      // Cấu hình
      recognitionInstance.lang = 'vi-VN';
      recognitionInstance.continuous = false; // Thay đổi thành false để tránh lỗi
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 3; // Tăng số lượng kết quả thay thế
      
      recognitionInstance.onstart = () => {
        console.log('Bắt đầu lắng nghe giọng nói');
        updateListeningState(true);
      };
      
      recognitionInstance.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase();
        console.log('Đã nhận diện giọng nói:', result);
        console.log('Độ chính xác:', event.results[0][0].confidence * 100 + '%');
        
        // Xử lý lệnh giọng nói
        handleVoiceCommand(result);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Lỗi nhận diện giọng nói:', event.error);
        if (event.error === 'no-speech') {
          showNotification('Không nghe thấy giọng nói, vui lòng thử lại', 'warning');
        } else if (event.error === 'audio-capture') {
          showNotification('Không thể truy cập microphone, vui lòng kiểm tra quyền truy cập', 'danger');
        } else if (event.error === 'not-allowed') {
          showNotification('Không có quyền truy cập microphone', 'danger');
        } else {
          showNotification(`Lỗi nhận diện giọng nói: ${event.error}`, 'danger');
        }
        updateListeningState(false);
      };
      
      recognitionInstance.onend = () => {
        console.log('Kết thúc lắng nghe giọng nói');
        updateListeningState(false);
      };
      
      recognitionRef.current = recognitionInstance;
      
      // Lắng nghe sự kiện từ VoiceActivator
      const handleToggleVoiceRecognition = (event) => {
        const { active } = event.detail;
        if (active) {
          startListening();
        } else {
          stopListening();
        }
      };
      
      window.addEventListener('toggle-voice-recognition', handleToggleVoiceRecognition);
      
      // Dừng lắng nghe khi component unmount
      return () => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (err) {
            console.error('Lỗi khi dừng nhận diện giọng nói:', err);
          }
        }
        window.removeEventListener('toggle-voice-recognition', handleToggleVoiceRecognition);
      };
    } catch (error) {
      console.error('Lỗi khởi tạo nhận diện giọng nói:', error);
      setSupported(false);
      showNotification('Không thể khởi tạo nhận diện giọng nói', 'danger');
    }
  }, [updateListeningState]);

  // Bắt đầu lắng nghe
  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort(); // Dừng phiên trước đó nếu có
        setTimeout(() => {
          recognitionRef.current.start();
          showNotification('Đang lắng nghe lệnh giọng nói...', 'info');
        }, 100);
      } catch (err) {
        console.error('Lỗi khi bắt đầu nhận diện giọng nói:', err);
        showNotification('Không thể kích hoạt nhận diện giọng nói', 'danger');
        updateListeningState(false);
      }
    } else {
      console.error('Đối tượng nhận diện giọng nói chưa được khởi tạo');
      showNotification('Không thể kích hoạt nhận diện giọng nói', 'danger');
    }
  }, [updateListeningState]);

  // Dừng lắng nghe
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        showNotification('Đã tắt nhận diện giọng nói', 'secondary');
      } catch (err) {
        console.error('Lỗi khi dừng nhận diện giọng nói:', err);
      }
    }
    updateListeningState(false);
  }, [updateListeningState]);

  // Mở modal đặt tour
  const openBookingModal = useCallback((tourId) => {
    const event = new CustomEvent('open-booking-modal', {
      detail: { tourId }
    });
    window.dispatchEvent(event);
  }, []);

  // Xử lý lệnh giọng nói
  const handleVoiceCommand = useCallback((command) => {
    console.log('Đang xử lý lệnh:', command);
    
    // Lệnh điều hướng
    if (command.includes('trang chủ') || command.includes('về trang chủ')) {
      navigate('/');
      showNotification('Đang chuyển đến trang chủ', 'info');
    }
    else if (command.includes('danh sách tour') || command.includes('xem tour') || command.includes('trang tour')) {
      navigate('/tours');
      showNotification('Đang chuyển đến trang danh sách tour', 'info');
    }
    else if (command.includes('trang cá nhân') || command.includes('hồ sơ') || command.includes('tài khoản')) {
      navigate('/profile');
      showNotification('Đang chuyển đến trang cá nhân', 'info');
    }
    // Lệnh tìm kiếm
    else if (command.includes('tìm kiếm') || command.includes('tìm tour')) {
      const searchTerm = command.replace(/tìm kiếm|tìm tour|tìm/g, '').trim();
      if (searchTerm) {
        searchTours(searchTerm);
        navigate('/tours');
        showNotification(`Đang tìm kiếm: ${searchTerm}`, 'info');
      } else {
        showNotification('Vui lòng nói rõ địa điểm cần tìm', 'warning');
      }
    }
    // Lệnh đặt tour
    else if (command.includes('đặt tour') || command.includes('book tour')) {
      if (!isAuthenticated) {
        showNotification('Vui lòng đăng nhập để đặt tour', 'warning');
        return;
      }

      // Kiểm tra xem có đang ở trang chi tiết tour không
      const pathParts = window.location.pathname.split('/');
      if (pathParts[1] === 'tour' && pathParts[2]) {
        // Đang ở trang chi tiết tour
        const tourId = pathParts[2];
        openBookingModal(tourId);
        showNotification('Đang mở form đặt tour...', 'info');
      } 
      // Kiểm tra xem có đang ở trang danh sách tour không
      else if (window.location.pathname === '/tours') {
        // Nếu đang ở trang danh sách tour, hỏi người dùng muốn đặt tour nào
        showNotification('Vui lòng chọn tour cụ thể để đặt', 'info');
      } 
      else {
        // Chuyển đến trang danh sách tour
        navigate('/tours');
        showNotification('Đã chuyển đến trang danh sách tour. Vui lòng chọn tour để đặt', 'info');
      }
    }
    // Lệnh đặt tour cụ thể (theo số)
    else if (command.match(/đặt tour (\d+)|book tour (\d+)/)) {
      if (!isAuthenticated) {
        showNotification('Vui lòng đăng nhập để đặt tour', 'warning');
        return;
      }

      // Lấy số tour từ lệnh
      const match = command.match(/đặt tour (\d+)|book tour (\d+)/);
      const tourNumber = parseInt(match[1] || match[2]);
      
      if (tourNumber && tourNumber > 0 && tourNumber <= tours.length) {
        const tour = tours[tourNumber - 1];
        if (tour) {
          // Chuyển đến trang chi tiết tour
          navigate(`/tour/${tour.id}`);
          // Đặt timeout để đảm bảo trang đã được tải
          setTimeout(() => {
            openBookingModal(tour.id);
            showNotification(`Đang mở form đặt tour: ${tour.name}`, 'info');
          }, 1000);
        }
      } else {
        showNotification(`Không tìm thấy tour số ${tourNumber}`, 'warning');
      }
    }
    // Lệnh đăng nhập/đăng xuất
    else if (command.includes('đăng xuất')) {
      if (isAuthenticated) {
        logout();
        showNotification('Đã đăng xuất thành công', 'success');
      } else {
        showNotification('Bạn chưa đăng nhập', 'warning');
      }
    }
    // Lệnh trợ giúp
    else if (command.includes('trợ giúp') || command.includes('giúp đỡ') || command.includes('hướng dẫn')) {
      showNotification('Các lệnh giọng nói: "trang chủ", "danh sách tour", "đặt tour", "tìm kiếm [địa điểm]", "đăng xuất"', 'info', 5000);
    }
    else {
      showNotification(`Không nhận diện được lệnh: "${command}"`, 'warning');
    }
  }, [navigate, searchTours, isAuthenticated, logout, tours, openBookingModal]);

  // Hiển thị thông báo
  const showNotification = useCallback((message, variant = 'info', duration = 3000) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    
    // Tự động ẩn thông báo sau thời gian nhất định
    setTimeout(() => {
      setShowToast(false);
    }, duration);
  }, []);

  if (!supported) {
    return (
      <ToastContainer position="bottom-end" className="p-3">
        <Toast 
          show={true} 
          bg="danger"
        >
          <Toast.Header>
            <i className="bi bi-mic-mute me-2"></i>
            <strong className="me-auto">Trợ lý giọng nói</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng sử dụng Chrome hoặc Edge.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    );
  }

  return (
    <ToastContainer position="bottom-end" className="p-3">
      <Toast 
        show={showToast} 
        onClose={() => setShowToast(false)}
        bg={toastVariant}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <i className={`bi ${isListening ? 'bi-mic-fill' : 'bi-mic'} me-2`}></i>
          <strong className="me-auto">Trợ lý giọng nói</strong>
        </Toast.Header>
        <Toast.Body className={toastVariant === 'dark' || toastVariant === 'danger' ? 'text-white' : ''}>
          {toastMessage}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default VoiceCommandHandler; 