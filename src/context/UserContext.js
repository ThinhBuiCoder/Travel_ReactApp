import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { userReducer } from '../reducers/userReducer';
import ApiService from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [faceDatabase, setFaceDatabase] = useState({});

  // Kiểm tra xem có user đã đăng nhập trong localStorage không
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: parsedUser });
      } catch (err) {
        console.error('Lỗi khi parse user từ localStorage:', err);
        localStorage.removeItem('user');
      }
    }
    
    // Tải dữ liệu khuôn mặt từ localStorage
    const storedFaceDatabase = localStorage.getItem('faceDatabase');
    if (storedFaceDatabase) {
      try {
        const parsedFaceDatabase = JSON.parse(storedFaceDatabase);
        setFaceDatabase(parsedFaceDatabase);
      } catch (err) {
        console.error('Lỗi khi parse dữ liệu khuôn mặt từ localStorage:', err);
        localStorage.removeItem('faceDatabase');
      }
    }
  }, []);

  const login = async (emailOrUser, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Nếu emailOrUser là một đối tượng user (từ đăng nhập khuôn mặt)
      if (typeof emailOrUser === 'object' && emailOrUser !== null) {
        const userData = emailOrUser;
        
        // Lưu thông tin user vào localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Cập nhật state
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
        
        setLoading(false);
        return { success: true };
      }
      
      // Đăng nhập thông thường bằng email và password
      const email = emailOrUser;
      
      // Gọi API đăng nhập
      const users = await ApiService.getUsers();
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        // Lưu thông tin user vào localStorage
        localStorage.setItem('user', JSON.stringify(foundUser));
        
        // Cập nhật state
        dispatch({ type: 'LOGIN_SUCCESS', payload: foundUser });
        
        setLoading(false);
        return { success: true };
      } else {
        setError('Email hoặc mật khẩu không chính xác');
        dispatch({ type: 'LOGIN_FAILURE' });
        setLoading(false);
        return { success: false };
      }
    } catch (err) {
      console.error('Lỗi khi đăng nhập:', err);
      setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
      dispatch({ type: 'LOGIN_FAILURE' });
      setLoading(false);
      return { success: false };
    }
  };

  const loginWithFace = async (faceData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Kiểm tra xem khuôn mặt có trong cơ sở dữ liệu không
      const matchedUser = await findUserByFace(faceData);
      
      if (matchedUser) {
        // Lưu thông tin user vào localStorage
        localStorage.setItem('user', JSON.stringify(matchedUser));
        
        // Cập nhật state
        dispatch({ type: 'LOGIN_SUCCESS', payload: matchedUser });
        
        setLoading(false);
        return { success: true, user: matchedUser };
      } else {
        setError('Không thể xác thực khuôn mặt. Vui lòng thử lại hoặc đăng nhập bằng mật khẩu.');
        dispatch({ type: 'LOGIN_FAILURE' });
        setLoading(false);
        return { success: false };
      }
    } catch (err) {
      console.error('Lỗi khi đăng nhập bằng khuôn mặt:', err);
      setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
      dispatch({ type: 'LOGIN_FAILURE' });
      setLoading(false);
      return { success: false };
    }
  };

  const findUserByFace = async (faceData) => {
    // Trong thực tế, đây sẽ là thuật toán so sánh khuôn mặt phức tạp
    
    // Lấy tất cả email từ cơ sở dữ liệu khuôn mặt
    const emails = Object.keys(faceDatabase);
    
    if (emails.length === 0) {
      console.log('Không có dữ liệu khuôn mặt nào trong cơ sở dữ liệu');
      return null;
    }
    
    try {
      // Tạo một canvas để so sánh hình ảnh
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Tải hình ảnh đầu vào
      const inputImage = await loadImage(faceData);
      
      // Kích thước chuẩn cho việc so sánh
      const standardWidth = 100;
      const standardHeight = 100;
      
      // Vẽ hình ảnh đầu vào lên canvas với kích thước chuẩn
      canvas.width = standardWidth;
      canvas.height = standardHeight;
      ctx.drawImage(inputImage, 0, 0, standardWidth, standardHeight);
      
      // Lấy dữ liệu pixel của hình ảnh đầu vào
      const inputImageData = ctx.getImageData(0, 0, standardWidth, standardHeight).data;
      
      // Biến để lưu trữ email của người dùng có khuôn mặt khớp nhất
      let bestMatchEmail = null;
      let bestMatchScore = 0;
      const THRESHOLD = 0.7; // Ngưỡng để xác định khuôn mặt khớp (70% trở lên)
      
      // So sánh với từng khuôn mặt trong cơ sở dữ liệu
      for (const email of emails) {
        const storedFaceData = faceDatabase[email];
        
        // Tải hình ảnh đã lưu
        const storedImage = await loadImage(storedFaceData);
        
        // Vẽ hình ảnh đã lưu lên canvas với kích thước chuẩn
        ctx.clearRect(0, 0, standardWidth, standardHeight);
        ctx.drawImage(storedImage, 0, 0, standardWidth, standardHeight);
        
        // Lấy dữ liệu pixel của hình ảnh đã lưu
        const storedImageData = ctx.getImageData(0, 0, standardWidth, standardHeight).data;
        
        // Tính toán độ tương đồng giữa hai hình ảnh
        const similarityScore = calculateSimilarity(inputImageData, storedImageData);
        
        console.log(`Độ tương đồng với ${email}: ${similarityScore}`);
        
        // Nếu độ tương đồng cao hơn ngưỡng và cao hơn điểm tốt nhất hiện tại
        if (similarityScore > THRESHOLD && similarityScore > bestMatchScore) {
          bestMatchScore = similarityScore;
          bestMatchEmail = email;
        }
      }
      
      if (bestMatchEmail) {
        console.log(`Tìm thấy khuôn mặt khớp với email: ${bestMatchEmail}, điểm: ${bestMatchScore}`);
        
        // Lấy thông tin người dùng từ API
        const users = await ApiService.getUsers();
        const matchedUser = users.find(u => u.email === bestMatchEmail);
        
        if (matchedUser) {
          return matchedUser;
        } else {
          // Nếu không tìm thấy user trong API, trả về user giả lập
          return {
            id: Math.floor(Math.random() * 1000),
            name: bestMatchEmail.split('@')[0],
            email: bestMatchEmail,
            role: 'user'
          };
        }
      }
      
      return null;
    } catch (err) {
      console.error('Lỗi khi so sánh khuôn mặt:', err);
      return null;
    }
  };
  
  // Hàm tải hình ảnh
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  };
  
  // Hàm tính toán độ tương đồng giữa hai hình ảnh
  const calculateSimilarity = (imageData1, imageData2) => {
    // Trong thực tế, đây sẽ là thuật toán so sánh phức tạp
    // Ở đây chúng ta sử dụng một thuật toán đơn giản để so sánh pixel
    
    let matchingPixels = 0;
    const totalPixels = imageData1.length / 4; // Mỗi pixel có 4 giá trị (RGBA)
    
    // So sánh từng pixel
    for (let i = 0; i < imageData1.length; i += 4) {
      // Tính chênh lệch màu sắc
      const rDiff = Math.abs(imageData1[i] - imageData2[i]);
      const gDiff = Math.abs(imageData1[i + 1] - imageData2[i + 1]);
      const bDiff = Math.abs(imageData1[i + 2] - imageData2[i + 2]);
      
      // Nếu chênh lệch màu sắc nhỏ, coi như pixel khớp
      if (rDiff + gDiff + bDiff < 150) { // Ngưỡng chênh lệch
        matchingPixels++;
      }
    }
    
    // Tính tỷ lệ pixel khớp
    return matchingPixels / totalPixels;
  };

  const logout = () => {
    // Xóa thông tin user khỏi localStorage
    localStorage.removeItem('user');
    
    // Cập nhật state
    dispatch({ type: 'LOGOUT' });
    
    // Đảm bảo rằng người dùng được chuyển hướng về trang chủ sau khi đăng xuất
    window.location.href = '/';
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Kiểm tra xem email đã tồn tại chưa
      const users = await ApiService.getUsers();
      const existingUser = users.find(u => u.email === userData.email);
      
      if (existingUser) {
        setError('Email đã được sử dụng. Vui lòng chọn email khác.');
        setLoading(false);
        return { success: false };
      }
      
      // Tạo user mới
      const newUser = await ApiService.createUser(userData);
      
      // Nếu có dữ liệu khuôn mặt, lưu vào cơ sở dữ liệu khuôn mặt
      if (userData.faceImage) {
        // Thêm vào cơ sở dữ liệu khuôn mặt
        const updatedFaceDatabase = {
          ...faceDatabase,
          [userData.email]: userData.faceImage
        };
        
        // Cập nhật state và localStorage
        setFaceDatabase(updatedFaceDatabase);
        localStorage.setItem('faceDatabase', JSON.stringify(updatedFaceDatabase));
        console.log('Đã lưu dữ liệu khuôn mặt cho email:', userData.email);
      }
      
      // Tự động đăng nhập sau khi đăng ký
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Lỗi khi đăng ký:', err);
      setError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
      setLoading(false);
      return { success: false };
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated,
      isAdmin,
      loading,
      error,
      login,
      loginWithFace,
      logout,
      register
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};