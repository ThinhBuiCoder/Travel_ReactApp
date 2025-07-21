import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Form, Row, Col } from 'react-bootstrap';

const FaceRegister = ({ onSuccess, onFaceCapture }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [faceRegistered, setFaceRegistered] = useState(false);
  
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
          captureFace();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const captureFace = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    setIsProcessing(true);
    
    // Chụp hình từ video
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Lấy dữ liệu hình ảnh
    const imageData = canvas.toDataURL('image/png');
    setFaceImage(imageData);
    
    // Giả lập xử lý nhận diện khuôn mặt
    setTimeout(() => {
      // Giả lập thành công
      setFaceRegistered(true);
      stopCapture();
      setIsProcessing(false);
      
      // Gửi dữ liệu khuôn mặt lên cho component cha
      if (onFaceCapture) {
        onFaceCapture(imageData);
      }
      
    }, 2000);
  };

  const handleRetake = () => {
    setFaceImage(null);
    setFaceRegistered(false);
    startCapture();
  };

  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, []);

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header>
        <h5 className="mb-0">👤 Đăng ký khuôn mặt</h5>
      </Card.Header>
      <Card.Body className="text-center">
        <Alert variant="warning" className="mb-3">
          <Alert.Heading>⚠️ Quan trọng</Alert.Heading>
          <p className="mb-0">
            Khuôn mặt bạn đăng ký sẽ được sử dụng để xác thực khi đăng nhập. 
            <strong> Chỉ khuôn mặt này</strong> mới có thể đăng nhập vào tài khoản của bạn.
            Đảm bảo khuôn mặt được chiếu sáng đầy đủ và nhìn thẳng vào camera.
          </p>
        </Alert>
        
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
          
          {!isCapturing && !isProcessing && !faceImage && (
            <div 
              className="bg-light d-flex justify-content-center align-items-center"
              style={{ height: '240px', borderRadius: '8px', border: '1px dashed #ccc' }}
            >
              <div className="text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
                <p className="text-muted">Nhấn nút bên dưới để chụp ảnh khuôn mặt</p>
              </div>
            </div>
          )}
          
          {faceImage && !isProcessing && (
            <div className="mb-3">
              <img 
                src={faceImage} 
                alt="Khuôn mặt đã chụp" 
                style={{ 
                  width: '100%', 
                  borderRadius: '8px',
                  border: '3px solid #28a745'
                }} 
              />
              {faceRegistered && (
                <Alert variant="success" className="mt-2">
                  <strong>Đã đăng ký khuôn mặt thành công!</strong>
                  <p className="mb-0 mt-1">
                    Hãy nhớ rằng chỉ khuôn mặt này mới có thể được sử dụng để đăng nhập vào tài khoản của bạn.
                  </p>
                </Alert>
              )}
            </div>
          )}
          
          {isProcessing && (
            <div 
              className="bg-light d-flex justify-content-center align-items-center"
              style={{ height: '240px', borderRadius: '8px' }}
            >
              <div className="text-center">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <p>Đang xử lý khuôn mặt...</p>
              </div>
            </div>
          )}
        </div>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <div className="d-grid gap-2">
          {!isCapturing && !isProcessing && !faceImage && (
            <Button 
              variant="primary" 
              onClick={startCapture}
              disabled={isProcessing}
            >
              Chụp ảnh khuôn mặt
            </Button>
          )}
          
          {isCapturing && !isProcessing && (
            <Button 
              variant="secondary" 
              onClick={stopCapture}
              disabled={isProcessing}
            >
              Hủy
            </Button>
          )}
          
          {faceImage && !isProcessing && (
            <Row className="g-2">
              <Col>
                <Button 
                  variant="outline-secondary" 
                  onClick={handleRetake}
                  className="w-100"
                >
                  Chụp lại
                </Button>
              </Col>
              <Col>
                <Button 
                  variant="success" 
                  onClick={() => onSuccess && onSuccess(faceImage)}
                  className="w-100"
                >
                  Xác nhận
                </Button>
              </Col>
            </Row>
          )}
        </div>
      </Card.Body>
      <Card.Footer className="bg-white">
        <small className="text-muted">
          * Đảm bảo khuôn mặt của bạn được chiếu sáng đầy đủ và nhìn thẳng vào camera
        </small>
      </Card.Footer>
    </Card>
  );
};

export default FaceRegister; 