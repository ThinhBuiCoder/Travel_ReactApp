import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import ApiService from '../services/api';

const BookingHistory = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // CHỈ load từ database, KHÔNG merge localStorage
      const dbBookings = await ApiService.getBookings(user.id);
      console.log('📋 Loaded bookings from database:', dbBookings);
      
      setBookings(dbBookings);
    } catch (err) {
      console.error('❌ Error loading bookings:', err);
      setError('Không thể tải lịch sử đặt tour. Vui lòng thử lại.');
      
      // Fallback: Chỉ dùng localStorage nếu database fail
      const localBookings = user?.bookedTours || [];
      console.log('📱 Fallback to localStorage:', localBookings);
      setBookings(localBookings);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'confirmed': { bg: 'success', text: '✅ Đã xác nhận' },
      'pending': { bg: 'warning', text: '⏳ Chờ xác nhận' },
      'cancelled': { bg: 'danger', text: '❌ Đã hủy' }
    };
    return statusConfig[status] || { bg: 'secondary', text: status };
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy booking này?')) {
      try {
        await ApiService.cancelBooking(bookingId);
        loadBookings(); // Reload after cancel
      } catch (error) {
        alert('Không thể hủy booking. Vui lòng thử lại.');
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <h5 className="mt-3">Đang tải lịch sử đặt tour...</h5>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger">
            <Alert.Heading>❌ Lỗi</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" size="sm" onClick={loadBookings}>
              Thử lại
            </Button>
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <div style={{ fontSize: '3rem' }}>📅</div>
          <h5>Chưa có tour nào được đặt</h5>
          <p className="text-muted">Hãy khám phá và đặt tour yêu thích của bạn!</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">📋 Lịch sử đặt tour</h5>
        <div className="d-flex gap-2">
          <Badge bg="primary">{bookings.length} booking</Badge>
          <Button variant="outline-primary" size="sm" onClick={loadBookings}>
            🔄 Refresh
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Table responsive hover>
          <thead>
            <tr>
              <th>Mã đặt tour</th>
              <th>Tên tour</th>
              <th>Ngày đặt</th>
              <th>Số tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => {
              const statusInfo = getStatusBadge(booking.status);
              return (
                <tr key={booking.id}>
                  <td>
                    <strong>#{booking.id}</strong>
                  </td>
                  <td>{booking.tourName}</td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</td>
                  <td className="text-success fw-bold">
                    {booking.amount.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td>
                    <Badge bg="info" text="dark">
                      {booking.paymentMethod}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={statusInfo.bg}>
                      {statusInfo.text}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm">
                        📋 Chi tiết
                      </Button>
                      {booking.status === 'confirmed' && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          ❌ Hủy
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default BookingHistory;