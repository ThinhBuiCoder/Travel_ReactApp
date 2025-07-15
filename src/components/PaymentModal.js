import React, { useState } from 'react';
import { Modal, Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import ApiService from '../services/api';
import emailjs from 'emailjs-com';

const PaymentModal = ({ show, onHide, tour }) => {
  const { user } = useUser(); // Bỏ bookTour để tránh duplicate
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
  const [error, setError] = useState('');

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
      const templateParams = {
        to_name: user.name,
        to_email: user.email,
        tour_name: tour.name,
        tour_location: tour.location,
        departure_date: new Date(tour.departureDate).toLocaleDateString('vi-VN'),
        amount: tour.price.toLocaleString('vi-VN'),
        booking_id: bookingDetails.id,
        payment_method: bookingDetails.paymentMethod
      };

      // Chỉ gửi email nếu đã cấu hình EmailJS
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        await emailjs.send(serviceId, templateId, templateParams, publicKey);
        console.log('✅ Email xác nhận đã được gửi thành công!');
      } else {
        console.log('📧 EmailJS chưa được cấu hình, bỏ qua gửi email');
      }
    } catch (error) {
      console.error('❌ Lỗi gửi email:', error);
      // Không throw error để không ảnh hưởng đến booking flow
    }
  };

  const validatePaymentForm = () => {
    if (paymentMethod === 'credit-card') {
      if (!cardInfo.cardNumber || !cardInfo.cardHolder || !cardInfo.expiryDate || !cardInfo.cvv) {
        setError('Vui lòng điền đầy đủ thông tin thẻ');
        return false;
      }
      
      // Validate card number (basic check)
      if (cardInfo.cardNumber.replace(/\s/g, '').length < 13) {
        setError('Số thẻ không hợp lệ');
        return false;
      }
      
      // Validate expiry date format
      if (!/^\d{2}\/\d{2}$/.test(cardInfo.expiryDate)) {
        setError('Ngày hết hạn phải có định dạng MM/YY');
        return false;
      }
      
      // Validate CVV
      if (!/^\d{3,4}$/.test(cardInfo.cvv)) {
        setError('CVV phải có 3-4 chữ số');
        return false;
      }
    }
    
    if (paymentMethod === 'bank-transfer') {
      if (!bankInfo.accountNumber) {
        setError('Vui lòng nhập số tài khoản');
        return false;
      }
    }
    
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validatePaymentForm()) {
      return;
    }
    
    setIsProcessing(true);

    try {
      // Giả lập quá trình thanh toán (2 giây)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentMethodText = paymentMethod === 'credit-card' ? 'Thẻ tín dụng' : 'Chuyển khoản ngân hàng';

      // 1. Tạo booking trong database (SINGLE SOURCE OF TRUTH)
      const bookingData = {
        userId: user.id,
        tourId: tour.id,
        tourName: tour.name,
        amount: tour.price,
        paymentMethod: paymentMethodText,
        // Thêm thông tin chi tiết thanh toán
        paymentDetails: paymentMethod === 'credit-card' ? {
          cardHolder: cardInfo.cardHolder,
          cardLast4: cardInfo.cardNumber.slice(-4)
        } : {
          bankName: bankInfo.bankName,
          accountNumber: bankInfo.accountNumber.slice(-4) + '****'
        }
      };

      const newBooking = await ApiService.createBooking(bookingData);
      console.log('✅ Booking saved to database:', newBooking);

      // 2. KHÔNG cập nhật localStorage để tránh duplicate
      // bookTour() function đã bị remove

      // 3. Gửi email xác nhận
      await sendConfirmationEmail({
        id: newBooking.id,
        paymentMethod: paymentMethodText
      });

      setIsProcessing(false);
      setShowSuccess(true);

      // Đóng modal sau 3 giây
      setTimeout(() => {
        setShowSuccess(false);
        onHide();
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('❌ Payment error:', error);
      setIsProcessing(false);
      setError('Có lỗi xảy ra khi đặt tour. Vui lòng thử lại!');
    }
  };

  const resetForm = () => {
    setCardInfo({ cardNumber: '', expiryDate: '', cvv: '', cardHolder: '' });
    setBankInfo({ bankName: 'vietcombank', accountNumber: '' });
    setError('');
    setShowSuccess(false);
  };

  const handleClose = () => {
    if (!isProcessing) {
      resetForm();
      onHide();
    }
  };

  // Format card number với spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardInfo(prev => ({ ...prev, cardNumber: formatted }));
  };

  if (!tour) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop={isProcessing ? 'static' : true}>
      <Modal.Header closeButton={!isProcessing}>
        <Modal.Title>💳 Thanh toán tour</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showSuccess ? (
          <Alert variant="success" className="text-center">
            <div className="mb-3" style={{ fontSize: '3rem' }}>🎉</div>
            <h4>Đặt tour thành công!</h4>
            <p>Booking đã được lưu vào hệ thống</p>
            <p>Email xác nhận đã được gửi đến <strong>{user?.email}</strong></p>
            <p className="mb-0">Cảm ơn bạn đã sử dụng dịch vụ Travel Hub!</p>
          </Alert>
        ) : (
          <>
            {/* Error Alert */}
            {error && (
              <Alert variant="danger" className="mb-3">
                <strong>❌ Lỗi:</strong> {error}
              </Alert>
            )}

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
                  disabled={isProcessing}
                />
                <Form.Check
                  type="radio"
                  id="bank-transfer"
                  name="paymentMethod"
                  value="bank-transfer"
                  checked={paymentMethod === 'bank-transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="🏦 Chuyển khoản ngân hàng"
                  disabled={isProcessing}
                />
              </div>

              {/* Credit Card Form */}
              {paymentMethod === 'credit-card' && (
                <Card className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Số thẻ *</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardNumber"
                            value={cardInfo.cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            disabled={isProcessing}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tên chủ thẻ *</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardHolder"
                            value={cardInfo.cardHolder}
                            onChange={handleCardChange}
                            placeholder="NGUYEN VAN A"
                            style={{ textTransform: 'uppercase' }}
                            disabled={isProcessing}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Ngày hết hạn *</Form.Label>
                          <Form.Control
                            type="text"
                            name="expiryDate"
                            value={cardInfo.expiryDate}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            disabled={isProcessing}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>CVV *</Form.Label>
                          <Form.Control
                            type="text"
                            name="cvv"
                            value={cardInfo.cvv}
                            onChange={handleCardChange}
                            placeholder="123"
                            maxLength={4}
                            disabled={isProcessing}
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
                      <Form.Label>Ngân hàng *</Form.Label>
                      <Form.Select
                        name="bankName"
                        value={bankInfo.bankName}
                        onChange={handleBankChange}
                        disabled={isProcessing}
                        required
                      >
                        <option value="vietcombank">Vietcombank</option>
                        <option value="techcombank">Techcombank</option>
                        <option value="bidv">BIDV</option>
                        <option value="agribank">Agribank</option>
                        <option value="mbbank">MB Bank</option>
                        <option value="acb">ACB</option>
                        <option value="sacombank">Sacombank</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Số tài khoản *</Form.Label>
                      <Form.Control
                        type="text"
                        name="accountNumber"
                        value={bankInfo.accountNumber}
                        onChange={handleBankChange}
                        placeholder="Nhập số tài khoản của bạn"
                        disabled={isProcessing}
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
                      Đang xử lý thanh toán...
                    </>
                  ) : (
                    `💳 Thanh toán ${tour.price.toLocaleString('vi-VN')} VNĐ`
                  )}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleClose} 
                  disabled={isProcessing}
                >
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