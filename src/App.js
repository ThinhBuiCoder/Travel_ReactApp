import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { TourProvider } from './context/TourContext';
import { UserProvider } from './context/UserContext';

import Header from './components/Header';
import Home from './pages/Home';
import Tours from './pages/Tours';
import CreateTour from './pages/CreateTour';
import Profile from './pages/Profile';
import TourDetail from './pages/TourDetail';
import VoiceCommandHandler from './components/VoiceCommandHandler';
import SimpleVoiceButton from './components/SimpleVoiceButton';

function App() {
  useEffect(() => {
    console.log('App mounted - Checking if components are loaded');
  }, []);

  return (
    <UserProvider>
      <TourProvider>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/tour/:id" element={<TourDetail />} />
              <Route path="/create-tour" element={<CreateTour />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <VoiceCommandHandler />
            <SimpleVoiceButton />
            
            <footer className="bg-dark text-white py-5 mt-5">
              <Container>
                <div className="row text-start mb-3">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <h4 className="fw-bold mb-2" style={{color:'#fff'}}>Về Chúng Tôi</h4>
                    <div style={{width:'60px',height:'4px',background:'#e74c3c',borderRadius:'2px',marginBottom:'1rem'}}></div>
                    <div style={{color:'#dbe5ea', lineHeight:'1.7', fontSize:'1.1rem'}}>
                      <div>Kết nối du khách với những trải nghiệm văn hóa độc đáo và nơi lưu trú ấm cúng trên khắp Việt Nam.</div>
                      <div>Chúng tôi mang đến những giá trị bền vững và góp phần phát triển du lịch cộng đồng.</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h4 className="fw-bold mb-2" style={{color:'#fff'}}>Liên Hệ</h4>
                    <div style={{width:'60px',height:'4px',background:'#e74c3c',borderRadius:'2px',marginBottom:'1rem'}}></div>
                    <ul className="list-unstyled" style={{color:'#dbe5ea',fontSize:'1.1rem'}}>
                      <li className="mb-2"><span role="img" aria-label="location">📍</span> Khu đô thị FPT City, Ngũ Hành Sơn, Da Nang 550000, Vietnam</li>
                      <li className="mb-2"><span role="img" aria-label="email">✉️</span> vietculture@.vn</li>
                      <li className="mb-2"><span role="img" aria-label="phone">📞</span> 0123 456 789</li>
                      <li><span role="img" aria-label="hotline">🎧</span> 1900 1234</li>
                    </ul>
                  </div>
                </div>
                <div className="text-center pt-3" style={{borderTop:'1px solid #ffffff22'}}>
                  <p className="mb-0">&copy; 2025 VietCulture</p>
                </div>
              </Container>
            </footer>
          </div>
        </Router>
      </TourProvider>
    </UserProvider>
  );
}

export default App;