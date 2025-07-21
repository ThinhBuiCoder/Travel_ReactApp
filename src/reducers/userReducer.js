export const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'LOGIN_SUCCESS':
      return action.payload; // Payload là user object
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return null; // Đặt state về null khi đăng xuất
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        ...action.payload,
        error: null
      };
    
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isAdmin: action.payload.isAdmin,
        loading: false,
        error: null
      };
    
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        error: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    // Legacy support for old booking system (deprecated)
    case 'BOOK_TOUR':
      console.warn('BOOK_TOUR action is deprecated. Use API-based booking instead.');
      const newBooking = {
        id: Date.now(),
        tourId: action.payload.tourId,
        tourName: action.payload.tourName,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        amount: action.payload.amount,
        paymentMethod: action.payload.paymentMethod
      };
      return {
        ...state,
        user: {
          ...state.user,
          bookedTours: [...(state.user.bookedTours || []), newBooking]
        }
      };
    
    // Role management actions
    case 'UPDATE_ROLE':
      return {
        ...state,
        user: { ...state.user, role: action.payload },
        isAdmin: action.payload === 'admin'
      };
    
    // Session management
    case 'REFRESH_SESSION':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isAdmin: action.payload.user.role === 'admin',
        error: null
      };
    
    case 'SESSION_EXPIRED':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      };
    
    default:
      return state;
  }
};

// Helper functions for reducer
export const createUserState = (user) => ({
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  },
  isAuthenticated: true,
  isAdmin: user.role === 'admin',
  loading: false,
  error: null
});

export const createErrorState = (error) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error
});

// Action creators (for consistent action dispatching)
export const userActions = {
  loginStart: () => ({
    type: 'LOGIN_START'
  }),
  
  loginSuccess: (user) => ({
    type: 'LOGIN_SUCCESS',
    payload: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      isAdmin: user.role === 'admin'
    }
  }),
  
  loginFailure: (error) => ({
    type: 'LOGIN_FAILURE',
    payload: error
  }),
  
  logout: () => ({
    type: 'LOGOUT'
  }),
  
  updateProfile: (updates) => ({
    type: 'UPDATE_PROFILE',
    payload: updates
  }),
  
  registerStart: () => ({
    type: 'REGISTER_START'
  }),
  
  registerSuccess: (user) => ({
    type: 'REGISTER_SUCCESS',
    payload: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      isAdmin: user.role === 'admin'
    }
  }),
  
  registerFailure: (error) => ({
    type: 'REGISTER_FAILURE',
    payload: error
  }),
  
  setError: (error) => ({
    type: 'SET_ERROR',
    payload: error
  }),
  
  clearError: () => ({
    type: 'CLEAR_ERROR'
  }),
  
  setLoading: (loading) => ({
    type: 'SET_LOADING',
    payload: loading
  }),
  
  updateRole: (role) => ({
    type: 'UPDATE_ROLE',
    payload: role
  }),
  
  refreshSession: (user) => ({
    type: 'REFRESH_SESSION',
    payload: { user }
  }),
  
  sessionExpired: () => ({
    type: 'SESSION_EXPIRED'
  })
};

// Validation helpers
export const validateUserData = (user) => {
  const errors = [];
  
  if (!user.name || user.name.trim().length < 2) {
    errors.push('Tên phải có ít nhất 2 ký tự');
  }
  
  if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
    errors.push('Email không hợp lệ');
  }
  
  if (!user.password || user.password.length < 6) {
    errors.push('Mật khẩu phải có ít nhất 6 ký tự');
  }
  
  return errors;
};

// Role checking utilities
export const isAdmin = (user) => user && user.role === 'admin';
export const isUser = (user) => user && user.role === 'user';
export const hasRole = (user, role) => user && user.role === role;

// Permission checking
export const canManageTours = (user) => isAdmin(user);
export const canBookTours = (user) => user && (isAdmin(user) || isUser(user));
export const canViewAllBookings = (user) => isAdmin(user);
export const canCancelBooking = (user, booking) => {
  return isAdmin(user) || (user && booking.userId === user.id);
};