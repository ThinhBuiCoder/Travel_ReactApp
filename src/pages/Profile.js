

// src/pages/Profile.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import BookingHistory from '../components/BookingHistory';
import ApiService from '../services/api';
import { useEffect } from 'react';

const Profile = () => {
  const { user, isAuthenticated, isAdmin, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '', // Để đổi mật khẩu
    avatar: user?.avatar || '' // Đường dẫn ảnh avatar
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [userBookingsCount, setUserBookingsCount] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsersAndBookings();
    }
    // eslint-disable-next-line
  }, [isAdmin]);

  const fetchAllUsersAndBookings = async () => {
    setLoadingUsers(true);
    setErrorUsers('');
    try {
      const [users, bookings] = await Promise.all([
        ApiService.getUsers(),
        ApiService.getBookings()
      ]);
      setAllUsers(users);
      // Đếm số booking của từng user
      const count = {};
      bookings.forEach(b => {
        count[b.userId] = (count[b.userId] || 0) + 1;
      });
      setUserBookingsCount(count);
    } catch (err) {
      setErrorUsers('Không thể tải danh sách user hoặc booking.');
    } finally {
      setLoadingUsers(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="my-4">
        <Alert variant="warning">
          Bạn cần đăng nhập để xem thông tin cá nhân.
        </Alert>
      </Container>
    );
  }

  const validate = () => {
    const newErrors = {};
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (formData.phone && !/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải gồm 10 số và bắt đầu bằng số 0';
    }
    return newErrors;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setFormData({ ...formData, avatar: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    let avatarUrl = formData.avatar;
    if (avatarFile) {
      // Lưu file vào public/avatars và lấy đường dẫn
      const fileName = `avatar_${user.id}_${Date.now()}.${avatarFile.name.split('.').pop()}`;
      try {
        // Không thể upload file trực tiếp từ client vào public, nên sẽ dùng base64 lưu vào localStorage hoặc gửi lên server nếu có backend thực sự
        // Ở đây sẽ giả lập bằng cách lưu base64 vào localStorage và dùng làm avatar
        const reader = new FileReader();
        reader.onloadend = async () => {
          localStorage.setItem(fileName, reader.result);
          avatarUrl = reader.result;
          const submitData = { ...formData, avatar: avatarUrl };
          if (!submitData.password) delete submitData.password;
          await updateProfile(submitData);
          setIsEditing(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        };
        reader.readAsDataURL(avatarFile);
        return;
      } catch (err) {
        setErrors({ avatar: 'Lỗi khi upload ảnh' });
        return;
      }
    } else {
      const submitData = { ...formData };
      if (!submitData.password) delete submitData.password;
      await updateProfile(submitData);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: '',
      avatar: user?.avatar || ''
    });
    setAvatarFile(null);
    setErrors({});
    setIsEditing(false);
  };

  // Xử lý xóa user (chỉ cho admin)
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa user "${userName}"?`)) return;
    try {
      await ApiService.deleteUser(userId);
      setAllUsers(prev => prev.filter(u => u.id !== userId));
      // Xóa luôn số booking nếu có
      setUserBookingsCount(prev => {
        const newCount = { ...prev };
        delete newCount[userId];
        return newCount;
      });
    } catch (err) {
      alert('Không thể xóa user. Vui lòng thử lại.');
    }
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header>
              <h3>👤 Thông tin cá nhân</h3>
            </Card.Header>
            <Card.Body>
              {showSuccess && (
                <Alert variant="success">
                  Thông tin đã được cập nhật thành công!
                </Alert>
              )}
              
              {!isEditing ? (
                <div>
                  {user.avatar && (
                    <div className="mb-3 text-center">
                      <img src={user.avatar} alt="avatar" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <p><strong>Tên:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Số điện thoại:</strong> {user.phone || 'Chưa cập nhật'}</p>
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    Chỉnh sửa thông tin
                  </Button>
                </div>
              ) : (
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Form.Group className="mb-3">
                    <Form.Label>Tên</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Để trống nếu không đổi"
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Ảnh đại diện (avatar)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      isInvalid={!!errors.avatar}
                    />
                    <Form.Control.Feedback type="invalid">{errors.avatar}</Form.Control.Feedback>
                    {formData.avatar && (
                      <div className="mt-2 text-center">
                        <img src={formData.avatar} alt="avatar preview" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button type="submit" variant="success">
                      Lưu thay đổi
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      Hủy
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
          {/* Hiển thị lịch sử đặt tour */}
          <div className="mt-4">
            <BookingHistory />
          </div>
        </Col>
      </Row>
      {/* ADMIN: Danh sách user */}
      {isAdmin && (
        <Row className="mt-4">
          <Col md={12}>
            <Card>
              <Card.Header>
                <h4>👥 Danh sách tất cả user</h4>
              </Card.Header>
              <Card.Body>
                {loadingUsers ? (
                  <div>Đang tải danh sách user...</div>
                ) : errorUsers ? (
                  <Alert variant="danger">{errorUsers}</Alert>
                ) : (
                  <div style={{overflowX:'auto'}}>
                    <table className="table table-bordered table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Tên</th>
                          <th>Email</th>
                          <th>Số điện thoại</th>
                          <th>Role</th>
                          <th>Ngày tạo</th>
                          <th>Số tour đã đặt</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map(u => (
                          <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.phone || '—'}</td>
                            <td>{u.role}</td>
                            <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}</td>
                            <td>{userBookingsCount[u.id] || 0}</td>
                            <td>
                              <Button variant="danger" size="sm" onClick={() => handleDeleteUser(u.id, u.name)} disabled={u.id === user.id}>
                                Xóa
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};


export default Profile;