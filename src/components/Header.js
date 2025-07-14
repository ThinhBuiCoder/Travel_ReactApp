import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Modal, Form, Badge } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, isAuthenticated, login, logout } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      setShowLogin(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            🌍 VietCulture
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
              <Nav.Link as={Link} to="/tours">Tour du lịch</Nav.Link>
              {isAuthenticated && (
                <Nav.Link as={Link} to="/create-tour">Tạo tour</Nav.Link>
              )}
            </Nav>
            <Nav>
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/profile">
                    Xin chào, {user.name}!
                  </Nav.Link>
                  <Button variant="outline-light" onClick={logout}>
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <Button variant="outline-light" onClick={() => setShowLogin(true)}>
                  Đăng nhập
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Đăng nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Đăng nhập
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;