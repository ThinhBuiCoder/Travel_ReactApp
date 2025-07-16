import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { userReducer } from '../reducers/userReducer';
import ApiService, { clearOldAdminData } from '../services/api';

const UserContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    // Clear old admin data before checking stored auth
    clearOldAdminData();
    checkStoredAuth();
  }, []);

  const checkStoredAuth = () => {
    const savedUser = localStorage.getItem('travel-hub-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // Validate user data format
        if (user.id && user.email && user.role) {
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { 
              user, 
              isAdmin: user.role === 'admin' 
            } 
          });
        } else {
          // Invalid format, clear it
          localStorage.removeItem('travel-hub-user');
        }
      } catch (error) {
        localStorage.removeItem('travel-hub-user');
      }
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' });

      // Authenticate with database
      const users = await ApiService.getUsers();
      const user = users.find(u => 
        u.email === email && u.password === password
      );

      if (user) {
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };

        localStorage.setItem('travel-hub-user', JSON.stringify(userData));
        
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { 
            user: userData, 
            isAdmin: user.role === 'admin' 
          } 
        });
        
        return { success: true, user: userData };
      } else {
        dispatch({ 
          type: 'LOGIN_FAILURE', 
          payload: 'Email hoặc mật khẩu không đúng' 
        });
        return { success: false, error: 'Email hoặc mật khẩu không đúng' };
      }
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'Không thể đăng nhập. Vui lòng thử lại.' 
      });
      return { success: false, error: 'Không thể đăng nhập. Vui lòng thử lại.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('travel-hub-user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = { ...state.user, ...userData };
      
      // Update in database
      await ApiService.updateUser(state.user.id, updatedUser);
      
      localStorage.setItem('travel-hub-user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_PROFILE', payload: userData });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Không thể cập nhật thông tin' };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const newUser = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'user', // Default role
        createdAt: new Date().toISOString()
      };

      const createdUser = await ApiService.createUser(newUser);
      
      const userAuth = {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role
      };

      localStorage.setItem('travel-hub-user', JSON.stringify(userAuth));
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: userAuth, 
          isAdmin: false 
        } 
      });
      
      return { success: true, user: userAuth };
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'Không thể tạo tài khoản' 
      });
      return { success: false, error: 'Không thể tạo tài khoản' };
    }
  };

  return (
    <UserContext.Provider value={{
      ...state,
      login,
      logout,
      register,
      updateProfile
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