import React from 'react';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import { useUser } from '../context/UserContext';

const BookingHistory = () => {
  const { user } = useUser();
  const bookings = user?.bookedTours || [];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'confirmed': { bg: 'success', text: '✅ Đã xác nhận' },
      'pending': { bg: 'warning', text: '⏳ Chờ xác nhận' },
      'cancelled': { bg: 'danger', text: '❌ Đã hủy' }
    };
    return statusConfig[status] || { bg: 'secondary', text: status };
  };

  if (bookings.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <h5>📅 Chưa có tour nào được đặt</h5>
          <p className="text-muted">Hãy khám phá và đặt tour yêu thích của bạn!</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">📋 Lịch sử đặt tour</h5>
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
                  <td>#{booking.id}</td>
                  <td>{booking.tourName}</td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</td>
                  <td className="text-success fw-bold">
                    {booking.amount.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td>{booking.paymentMethod}</td>
                  <td>
                    <Badge bg={statusInfo.bg}>
                      {statusInfo.text}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm">
                      Chi tiết
                    </Button>
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