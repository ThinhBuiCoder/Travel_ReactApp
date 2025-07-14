import React, { useState } from 'react';
import { Modal, Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useUser } from '../context/UserContext';

const PaymentModal = ({ show, onHide, tour }) => {
  const { user, bookTour } = useUser();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });
  const [bankInfo, setBankInfo] = useState({
    bankName: 'vietcombank',
    accountNumber: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankInfo(prev => ({ ...prev, [name]: value }));
  };

const sendConfirmationEmail = async (bookingDetails) => {
  try {
    // Kiểm tra nếu có cấu hình EmailJS
    if (process.env.REACT_APP_EMAILJS_SERVICE_ID && 
        process.env.REACT_APP_EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID_HERE') {
      
      // Import EmailJS chỉ khi cần thiết
      const emailjs = await import('emailjs-com');
      
      // CÁC BIẾN GỬI ĐI - PHẢI KHỚP VỚI TEMPLATE
      const templateParams = {
        to_name: user.name,                    // {{to_name}}
        to_email: user.email,                  // {{to_email}}
        tour_name: tour.name,                  // {{tour_name}}
        tour_location: tour.location,          // {{tour_location}}
        departure_date: new Date(tour.departureDate).toLocaleDateString('vi-VN'), // {{departure_date}}
        amount: tour.price.toLocaleString('vi-VN'), // {{amount}}
        booking_id: bookingDetails.id,         // {{booking_id}}
        payment_method: bookingDetails.paymentMethod // {{payment_method}}
      };

      // GỬI EMAIL QUA EMAILJS
      await emailjs.default.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,  // Service ID
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID, // Template ID
        templateParams,                            // Dữ liệu
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY   // Public Key
      );
      
      console.log('✅ Email xác nhận đã được gửi thành công!');
    } else {
      // Nếu chưa cấu hình EmailJS
      console.log('📧 Demo Email - Chưa cấu hình EmailJS:', {
        to: user.email,
        tour: tour.name,
        amount: tour.price.toLocaleString('vi-VN') + ' VNĐ',
        booking_id: bookingDetails.id
      });
    }
  } catch (error) {
    console.error('❌ Lỗi gửi email:', error);
  }
};

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Giả lập quá trình thanh toán
    setTimeout(async () => {
      const bookingDetails = {
        id: Date.now(),
        tourId: tour.id,
        tourName: tour.name,
        amount: tour.price,
        paymentMethod: paymentMethod === 'credit-card' ? 'Thẻ tín dụng' : 'Chuyển khoản'
      };

      // Thêm booking vào user context
      bookTour(tour.id, tour.name, tour.price, bookingDetails.paymentMethod);

      // Gửi email xác nhận
      await sendConfirmationEmail(bookingDetails);

      setIsProcessing(false);
      setShowSuccess(true);

      // Đóng modal sau 3 giây
      setTimeout(() => {
        setShowSuccess(false);
        onHide();
        // Reset form
        setCardInfo({ cardNumber: '', expiryDate: '', cvv: '', cardHolder: '' });
        setBankInfo({ bankName: 'vietcombank', accountNumber: '' });
      }, 3000);
    }, 2000);
  };

  if (!tour) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>💳 Thanh toán tour</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showSuccess ? (
          <Alert variant="success" className="text-center">
            <h4>🎉 Đặt tour thành công!</h4>
            <p>Email xác nhận đã được gửi đến {user?.email}</p>
            <p>Cảm ơn bạn đã sử dụng dịch vụ VietCulture!</p>
          </Alert>
        ) : (
          <>
            {/* Tour Info */}
            <Card className="mb-4">
              <Card.Body>
                <h5>📋 Thông tin tour</h5>
                <Row>
                  <Col md={6}>
                    <p><strong>Tour:</strong> {tour.name}</p>
                    <p><strong>Địa điểm:</strong> {tour.location}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Khởi hành:</strong> {new Date(tour.departureDate).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Tổng tiền:</strong> <span className="text-success fw-bold">{tour.price.toLocaleString('vi-VN')} VNĐ</span></p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Payment Form */}
            <Form onSubmit={handlePayment}>
              <h5>💳 Phương thức thanh toán</h5>
              
              {/* Payment Method Selection */}
              <div className="mb-3">
                <Form.Check
                  type="radio"
                  id="credit-card"
                  name="paymentMethod"
                  value="credit-card"
                  checked={paymentMethod === 'credit-card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="💳 Thẻ tín dụng/Thẻ ghi nợ"
                />
                <Form.Check
                  type="radio"
                  id="bank-transfer"
                  name="paymentMethod"
                  value="bank-transfer"
                  checked={paymentMethod === 'bank-transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="🏦 Chuyển khoản ngân hàng"
                />
              </div>

              {/* Credit Card Form */}
              {paymentMethod === 'credit-card' && (
                <Card className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Số thẻ</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardNumber"
                            value={cardInfo.cardNumber}
                            onChange={handleCardChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tên chủ thẻ</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardHolder"
                            value={cardInfo.cardHolder}
                            onChange={handleCardChange}
                            placeholder="NGUYEN VAN A"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Ngày hết hạn</Form.Label>
                          <Form.Control
                            type="text"
                            name="expiryDate"
                            value={cardInfo.expiryDate}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>CVV</Form.Label>
                          <Form.Control
                            type="text"
                            name="cvv"
                            value={cardInfo.cvv}
                            onChange={handleCardChange}
                            placeholder="123"
                            maxLength={3}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}

              {/* Bank Transfer Form */}
              {paymentMethod === 'bank-transfer' && (
                <Card className="mb-3">
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Ngân hàng</Form.Label>
                      <Form.Select
                        name="bankName"
                        value={bankInfo.bankName}
                        onChange={handleBankChange}
                        required
                      >
                        <option value="vietcombank">Vietcombank</option>
                        <option value="techcombank">Techcombank</option>
                        <option value="bidv">BIDV</option>
                        <option value="agribank">Agribank</option>
                        <option value="mbbank">MB Bank</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Số tài khoản</Form.Label>
                      <Form.Control
                        type="text"
                        name="accountNumber"
                        value={bankInfo.accountNumber}
                        onChange={handleBankChange}
                        placeholder="Nhập số tài khoản của bạn"
                        required
                      />
                    </Form.Group>
                    <Alert variant="info">
                      <small>
                        💡 Sau khi xác nhận, bạn sẽ nhận được thông tin chuyển khoản qua email.
                      </small>
                    </Alert>
                  </Card.Body>
                </Card>
              )}

              <div className="d-flex gap-2">
                <Button 
                  variant="success" 
                  type="submit" 
                  disabled={isProcessing}
                  className="flex-fill"
                >
                  {isProcessing ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    `💳 Thanh toán ${tour.price.toLocaleString('vi-VN')} VNĐ`
                  )}
                </Button>
                <Button variant="secondary" onClick={onHide} disabled={isProcessing}>
                  Hủy
                </Button>
              </div>
            </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal;