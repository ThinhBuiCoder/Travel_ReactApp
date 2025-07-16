import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ 
  children, 
  adminOnly = false, 
  fallback = null 
}) => {
  const { isAuthenticated, isAdmin, user } = useUser();

  if (!isAuthenticated) {
    return fallback || (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>🔐 Yêu cầu đăng nhập</Alert.Heading>
        <p>Bạn cần đăng nhập để truy cập tính năng này.</p>
      </Alert>
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <Alert variant="danger" className="text-center">
        <Alert.Heading>❌ Không có quyền truy cập</Alert.Heading>
        <p>Chỉ Admin mới có thể truy cập tính năng này.</p>
        <p>Tài khoản hiện tại: <strong>{user.name}</strong> ({user.role})</p>
      </Alert>
    );
  }

  return children;
};

export default ProtectedRoute;