import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, isAuthenticated, isAdmin, login, logout, loading, error, register } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    
    if (result.success) {
      setShowLogin(false);
      setEmail('');
      setPassword('');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await register({ name, email, password });
    
    if (result.success) {
      setShowRegister(false);
      setName('');
      setEmail('');
      setPassword('');
    }
  };

  const resetForms = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    resetForms();
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
    resetForms();
  };

  // Safe role access with fallback
  const userRole = user?.role || 'guest';
  const userName = user?.name || 'Unknown';

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
        <Container fluid>
          <div className="d-flex align-items-center w-100 justify-content-between">
            {/* Logo bên trái */}
            <Navbar.Brand as={Link} to="/" className="me-3 mb-0">
              🌍 Travel Hub
              {isAdmin && (
                <Badge bg="warning" text="dark" className="ms-2">
                  ADMIN
                </Badge>
              )}
            </Navbar.Brand>

            {/* Menu ở giữa */}
            <Nav className="mx-auto flex-grow-1 justify-content-center">
              <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
              <Nav.Link as={Link} to="/tours">Tour du lịch</Nav.Link>
              {isAdmin && (
                <Nav.Link as={Link} to="/create-tour">
                  <Badge bg="warning" text="dark" className="me-1">ADMIN</Badge>
                  Quản lý tour
                </Nav.Link>
              )}
            </Nav>

            {/* Đăng nhập/Đăng ký hoặc User bên phải */}
            <Nav className="ms-3 mb-0">
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/profile">
                    <span className="me-2">
                      {isAdmin ? '👑' : '👤'} {userName}
                    </span>
                    <Badge bg={isAdmin ? 'warning' : 'info'} text={isAdmin ? 'dark' : 'white'}>
                      {userRole.toUpperCase()}
                    </Badge>
                  </Nav.Link>
                  <Button variant="outline-light" onClick={logout} size="sm">
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={() => setShowLogin(true)}
                  >
                    Đăng nhập
                  </Button>
                  <Button 
                    variant="light" 
                    size="sm"
                    onClick={() => setShowRegister(true)}
                  >
                    Đăng ký
                  </Button>
                </div>
              )}
            </Nav>
          </div>
        </Container>
      </Navbar>

      {/* Login Modal - Removed demo info */}
      <Modal show={showLogin} onHide={handleCloseLogin}>
        <Modal.Header closeButton>
          <Modal.Title>🔐 Đăng nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                disabled={loading}
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small className="text-muted">
              Chưa có tài khoản?{' '}
              <Button 
                variant="link" 
                size="sm" 
                className="p-0"
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              >
                Đăng ký ngay
              </Button>
            </small>
          </div>
        </Modal.Body>
      </Modal>

      {/* Register Modal */}
      <Modal show={showRegister} onHide={handleCloseRegister}>
        <Modal.Header closeButton>
          <Modal.Title>📝 Đăng ký tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}
          
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên"
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                disabled={loading}
                minLength={6}
              />
              <Form.Text className="text-muted">
                Mật khẩu phải có ít nhất 6 ký tự
              </Form.Text>
            </Form.Group>
            <Button 
              variant="success" 
              type="submit" 
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Đang tạo tài khoản...
                </>
              ) : (
                'Đăng ký'
              )}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small className="text-muted">
              Đã có tài khoản?{' '}
              <Button 
                variant="link" 
                size="sm" 
                className="p-0"
                onClick={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              >
                Đăng nhập
              </Button>
            </small>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;