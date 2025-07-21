import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { useUser } from '../context/UserContext';

const FaceLogin = ({ onSuccess }) => {
  const { loginWithFace } = useUser();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCapture = async () => {
    try {
      setError(null);
      setIsCapturing(true);
      setIsFaceDetected(false);
      
      // Yêu cầu quyền truy cập camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Giả lập phát hiện khuôn mặt sau 2 giây
        setTimeout(() => {
          setIsFaceDetected(true);
          startCountdown();
        }, 2000);
      }
    } catch (err) {
      console.error('Lỗi khi truy cập camera:', err);
      setError('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera của trình duyệt.');
      setIsCapturing(false);
    }
  };

  const stopCapture = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCapturing(false);
    setIsFaceDetected(false);
    setCountdown(null);
  };

  const startCountdown = () => {
    setCountdown(3);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          captureAndVerify();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const captureAndVerify = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    setIsProcessing(true);
    setProcessingStatus('Đang chụp ảnh khuôn mặt...');
    
    // Chụp hình từ video
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Lấy dữ liệu hình ảnh
    const imageData = canvas.toDataURL('image/png');
    
    // Hiển thị trạng thái xử lý
    setProcessingStatus('Đang phân tích đặc điểm khuôn mặt...');
    
    setTimeout(() => {
      setProcessingStatus('Đang so sánh với dữ liệu đã đăng ký...');
      
      // Gọi hàm đăng nhập bằng khuôn mặt
      loginWithFace(imageData).then(result => {
        if (result.success) {
          setProcessingStatus('Xác thực thành công!');
          if (onSuccess) {
            onSuccess(result.user);
          }
        } else {
          setError('Không thể xác thực khuôn mặt. Khuôn mặt không khớp với bất kỳ tài khoản nào đã đăng ký.');
        }
        
        stopCapture();
        setIsProcessing(false);
      }).catch(err => {
        console.error('Lỗi khi xác thực khuôn mặt:', err);
        setError('Có lỗi xảy ra khi xác thực khuôn mặt. Vui lòng thử lại.');
        stopCapture();
        setIsProcessing(false);
      });
    }, 1500);
  };

  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, []);

  return (
    <>
      <Card className="shadow-sm mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">👤 Đăng nhập bằng khuôn mặt</h5>
          <Button 
            variant="link" 
            className="p-0 text-decoration-none" 
            onClick={() => setShowInstructions(true)}
          >
            Hướng dẫn
          </Button>
        </Card.Header>
        <Card.Body className="text-center">
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          
          <div className="position-relative mb-3" style={{ maxWidth: '320px', margin: '0 auto' }}>
            {isCapturing && (
              <>
                <video 
                  ref={videoRef} 
                  style={{ 
                    width: '100%', 
                    borderRadius: '8px',
                    border: isFaceDetected ? '3px solid #28a745' : '3px solid #dc3545'
                  }} 
                  muted
                />
                
                {isFaceDetected && (
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}
                  >
                    {countdown && (
                      <div 
                        className="bg-white rounded-circle d-flex justify-content-center align-items-center"
                        style={{ width: '60px', height: '60px', fontSize: '2rem', fontWeight: 'bold' }}
                      >
                        {countdown}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            
            {!isCapturing && !isProcessing && (
              <div 
                className="bg-light d-flex justify-content-center align-items-center"
                style={{ height: '240px', borderRadius: '8px', border: '1px dashed #ccc' }}
              >
                <div className="text-center">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
                  <p className="text-muted">Nhấn nút bên dưới để bắt đầu</p>
                </div>
              </div>
            )}
            
            {isProcessing && (
              <div 
                className="bg-light d-flex justify-content-center align-items-center"
                style={{ height: '240px', borderRadius: '8px' }}
              >
                <div className="text-center">
                  <Spinner animation="border" variant="primary" className="mb-3" />
                  <p>{processingStatus}</p>
                </div>
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          <div className="d-grid gap-2">
            {!isCapturing && !isProcessing ? (
              <Button 
                variant="primary" 
                onClick={startCapture}
                disabled={isProcessing}
              >
                Bắt đầu quét khuôn mặt
              </Button>
            ) : (
              <Button 
                variant="secondary" 
                onClick={stopCapture}
                disabled={isProcessing}
              >
                Hủy
              </Button>
            )}
          </div>
        </Card.Body>
        <Card.Footer className="bg-white">
          <small className="text-muted">
            * Đảm bảo khuôn mặt của bạn được chiếu sáng đầy đủ và nhìn thẳng vào camera
          </small>
        </Card.Footer>
      </Card>
      
      {/* Modal hướng dẫn */}
      <Modal show={showInstructions} onHide={() => setShowInstructions(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hướng dẫn đăng nhập bằng khuôn mặt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Cách sử dụng:</h5>
          <ol>
            <li>Nhấn nút "Bắt đầu quét khuôn mặt"</li>
            <li>Cho phép trình duyệt truy cập camera</li>
            <li>Đảm bảo khuôn mặt của bạn nằm trong khung hình</li>
            <li>Giữ yên và nhìn thẳng vào camera</li>
            <li>Hệ thống sẽ tự động xác thực khuôn mặt của bạn</li>
          </ol>
          
          <h5>Lưu ý:</h5>
          <ul>
            <li>Đảm bảo khuôn mặt được chiếu sáng đầy đủ</li>
            <li>Không đeo kính râm hoặc mũ che khuất khuôn mặt</li>
            <li>Nếu không thể xác thực, hãy thử lại hoặc sử dụng phương thức đăng nhập khác</li>
            <li><strong>Chỉ khuôn mặt đã đăng ký mới có thể đăng nhập thành công</strong></li>
          </ul>
          
          <Alert variant="warning">
            <strong>Quan trọng:</strong> Hệ thống sẽ so sánh khuôn mặt của bạn với dữ liệu đã đăng ký. 
            Nếu khuôn mặt không khớp, bạn sẽ không thể đăng nhập.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowInstructions(false)}>
            Đã hiểu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FaceLogin; 