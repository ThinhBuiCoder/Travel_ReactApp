import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { userReducer } from '../reducers/userReducer';

const UserContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem('vietculture-user');
    if (savedUser) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(savedUser) });
    }
  }, []);

  const login = (email, password) => {
    // Giả lập đăng nhập
    if (email && password) {
      const user = {
        id: 1,
        email: email,
        name: email.split('@')[0],
        bookedTours: []
      };
      localStorage.setItem('vietculture-user', JSON.stringify(user));
      dispatch({ type: 'LOGIN', payload: user });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('vietculture-user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('vietculture-user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_PROFILE', payload: userData });
  };

  const bookTour = (tourId, tourName, amount, paymentMethod) => {
    const updatedUser = {
      ...state.user,
      bookedTours: [...(state.user.bookedTours || []), {
        id: Date.now(),
        tourId,
        tourName,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        amount,
        paymentMethod
      }]
    };
    localStorage.setItem('vietculture-user', JSON.stringify(updatedUser));
    dispatch({ type: 'BOOK_TOUR', payload: { tourId, tourName, amount, paymentMethod } });
  };

  return (
    <UserContext.Provider value={{
      ...state,
      login,
      logout,
      updateProfile,
      bookTour
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
