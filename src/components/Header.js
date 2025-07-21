import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Modal, Form, Alert, Spinner, Badge, Tabs, Tab } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import FaceLogin from './FaceLogin';
import FaceRegister from './FaceRegister';

const Header = () => {
  const { user, isAuthenticated, isAdmin, login, logout, loading, error, register } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loginTab, setLoginTab] = useState('password');
  const [registerTab, setRegisterTab] = useState('form');
  const [faceImage, setFaceImage] = useState(null);

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
    
    // Tạo đối tượng người dùng để đăng ký
    const userData = { 
      name, 
      email, 
      password,
      faceImage // Thêm dữ liệu khuôn mặt
    };
    
    const result = await register(userData);
    
    if (result.success) {
      setShowRegister(false);
      resetForms();
    }
  };

  const resetForms = () => {
    setEmail('');
    setPassword('');
    setName('');
    setFaceImage(null);
    setRegisterTab('form');
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    resetForms();
    setLoginTab('password');
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
    resetForms();
  };

  const handleFaceLoginSuccess = (user) => {
    setShowLogin(false);
    setLoginTab('password');
  };

  const handleFaceCapture = (imageData) => {
    setFaceImage(imageData);
  };

  const handleFaceRegisterSuccess = () => {
    // Chuyển sang tab thông tin cá nhân để hoàn tất đăng ký
    setRegisterTab('form');
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

      {/* Login Modal - Với tab đăng nhập bằng khuôn mặt */}
      <Modal show={showLogin} onHide={handleCloseLogin} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🔐 Đăng nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            activeKey={loginTab}
            onSelect={(k) => setLoginTab(k)}
            className="mb-3"
          >
            <Tab eventKey="password" title="Đăng nhập bằng mật khẩu">
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
            </Tab>
            <Tab eventKey="face" title="Đăng nhập bằng khuôn mặt">
              <FaceLogin onSuccess={handleFaceLoginSuccess} />
            </Tab>
          </Tabs>

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

      {/* Register Modal - Với tab đăng ký khuôn mặt */}
      <Modal show={showRegister} onHide={handleCloseRegister} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📝 Đăng ký tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            activeKey={registerTab}
            onSelect={(k) => setRegisterTab(k)}
            className="mb-3"
          >
            <Tab eventKey="face" title="Bước 1: Đăng ký khuôn mặt">
              <Alert variant="info">
                <Alert.Heading>Đăng ký khuôn mặt để đăng nhập nhanh hơn</Alert.Heading>
                <p>
                  Hãy chụp ảnh khuôn mặt của bạn để sử dụng cho việc đăng nhập sau này. 
                  Sau khi đăng ký khuôn mặt thành công, hãy chuyển sang tab "Thông tin cá nhân" để hoàn tất đăng ký.
                </p>
              </Alert>
              
              <FaceRegister 
                onSuccess={handleFaceRegisterSuccess} 
                onFaceCapture={handleFaceCapture} 
              />
              
              <div className="d-flex justify-content-between mt-3">
                <Button 
                  variant="outline-secondary" 
                  onClick={handleCloseRegister}
                >
                  Hủy
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => setRegisterTab('form')}
                >
                  Tiếp theo: Nhập thông tin
                </Button>
              </div>
            </Tab>
            <Tab eventKey="form" title="Bước 2: Thông tin cá nhân">
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}
              
              {faceImage ? (
                <Alert variant="success" className="d-flex align-items-center mb-3">
                  <div style={{ width: '50px', height: '50px', marginRight: '15px' }}>
                    <img 
                      src={faceImage} 
                      alt="Khuôn mặt đã đăng ký" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                    />
                  </div>
                  <div>
                    <strong>Đã đăng ký khuôn mặt thành công!</strong><br />
                    <small>Bạn có thể sử dụng khuôn mặt để đăng nhập sau này.</small>
                  </div>
                </Alert>
              ) : (
                <Alert variant="warning" className="mb-3">
                  <div className="d-flex align-items-center">
                    <div style={{ fontSize: '1.5rem', marginRight: '10px' }}>⚠️</div>
                    <div>
                      <strong>Bạn chưa đăng ký khuôn mặt</strong><br />
                      <small>
                        Khuyến nghị đăng ký khuôn mặt để đăng nhập nhanh hơn.{' '}
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0"
                          onClick={() => setRegisterTab('face')}
                        >
                          Đăng ký khuôn mặt ngay
                        </Button>
                      </small>
                    </div>
                  </div>
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
                <div className="d-flex justify-content-between">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setRegisterTab('face')}
                  >
                    Quay lại
                  </Button>
                  <Button 
                    variant="success" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Đang đăng ký...
                      </>
                    ) : (
                      'Hoàn tất đăng ký'
                    )}
                  </Button>
                </div>
              </Form>
            </Tab>
          </Tabs>

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
                Đăng nhập ngay
              </Button>
            </small>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;