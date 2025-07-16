export const tourReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOURS':
      return action.payload;
    case 'ADD_TOUR':
      return [...state, { ...action.payload, id: Date.now() }];
    case 'UPDATE_TOUR':
      return state.map(tour => 
        tour.id === action.payload.id ? action.payload : tour
      );
    case 'DELETE_TOUR':
      return state.filter(tour => tour.id !== action.payload);
    case 'FILTER_TOURS':
      return action.payload;
    default:
      return state;
  }
};
