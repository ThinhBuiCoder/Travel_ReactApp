export const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'BOOK_TOUR':
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
    default:
      return state;
  }
};
