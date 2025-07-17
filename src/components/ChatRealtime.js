import React, { useEffect, useRef, useState } from 'react';
import { Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000'; // Đổi nếu server chat chạy port khác

const ChatRealtime = () => {
  const { user, isAuthenticated, isAdmin } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const chatBoxRef = useRef(null); // Thay cho chatEndRef

  useEffect(() => {
    if (!isAuthenticated) return;
    // Kết nối socket
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });

    socketRef.current.on('connect', () => setConnected(true));
    socketRef.current.on('disconnect', () => setConnected(false));

    // Nhận lịch sử chat
    socketRef.current.on('chat_history', (history) => {
      setMessages(history);
    });
    // Nhận tin nhắn mới
    socketRef.current.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    // Chỉ scroll trong khung chat, không kéo cả trang
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    const msg = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      },
      text: input.trim()
    };
    socketRef.current.emit('chat_message', msg);
    setInput('');
  };

  if (!isAuthenticated) {
    return (
      <Card className="mb-4">
        <Card.Header>
          <h5>💬 Chat real time</h5>
        </Card.Header>
        <Card.Body>
          <div className="text-center text-muted">Bạn cần đăng nhập để sử dụng chat realtime.</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4 chat-container">
      <Card.Header>
        <h5>💬 Chat real time {isAdmin ? <Badge bg="warning" text="dark">ADMIN</Badge> : <Badge bg="primary">USER</Badge>}</h5>
        <small className={connected ? 'text-success' : 'text-danger'}>
          {connected ? 'Đã kết nối server chat' : 'Mất kết nối...'}</small>
      </Card.Header>
      <Card.Body>
        <div ref={chatBoxRef} style={{ height: 300, overflowY: 'auto', marginBottom: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
          <ListGroup variant="flush">
            {messages.length === 0 && (
              <ListGroup.Item className="bg-transparent text-center text-muted">
                <em>Chưa có tin nhắn nào. Hãy bắt đầu trò chuyện!</em>
              </ListGroup.Item>
            )}
            {messages.map((msg, idx) => (
              <ListGroup.Item
                key={msg.id || idx}
                className={
                  msg.user?.id === user.id
                    ? 'text-end bg-transparent'
                    : 'bg-transparent'
                }
              >
                <div>
                  <strong>
                    {msg.user?.name || 'Ẩn danh'}
                    {msg.user?.role === 'admin' && (
                      <Badge bg="warning" text="dark" className="ms-1">ADMIN</Badge>
                    )}
                    {msg.user?.role === 'user' && (
                      <Badge bg="primary" className="ms-1">USER</Badge>
                    )}
                  </strong>
                  <span className="ms-2 text-muted" style={{ fontSize: 12 }}>
                    {msg.time ? new Date(msg.time).toLocaleTimeString() : ''}
                  </span>
                </div>
                <div>{msg.text}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        <Form onSubmit={handleSend} className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!connected}
            autoComplete="off"
          />
          <Button type="submit" variant="light" disabled={!connected || !input.trim()}>
            Gửi
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChatRealtime; 