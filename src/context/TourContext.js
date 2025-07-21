import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { tourReducer } from '../reducers/tourReducer';
import ApiService from '../services/api';

const TourContext = createContext();

export const TourProvider = ({ children }) => {
  const [tours, dispatch] = useReducer(tourReducer, []);
  const [filteredTours, setFilteredTours] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [filters, setFilters] = React.useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    startDate: '',
    endDate: ''
  });

  // Load tours từ API khi component mount
  useEffect(() => {
    loadTours();
  }, []);

  // Apply filters khi tours hoặc filters thay đổi
  useEffect(() => {
    applyFilters();
  }, [tours, filters]);

  const loadTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const toursData = await ApiService.getTours();
      dispatch({ type: 'SET_TOURS', payload: toursData });
    } catch (err) {
      setError('Không thể tải danh sách tour. Vui lòng thử lại.');
      console.error('Error loading tours:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết tour theo ID
  const getTourById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      // Tìm tour trong state trước
      const cachedTour = tours.find(tour => tour.id === parseInt(id) || tour.id === id);
      if (cachedTour) {
        setLoading(false);
        return cachedTour;
      }
      // Nếu không tìm thấy, gọi API
      const tour = await ApiService.getTour(id);
      return tour;
    } catch (err) {
      setError('Không thể tải thông tin tour. Vui lòng thử lại.');
      console.error('Error fetching tour:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tours];

    if (filters.search) {
      filtered = filtered.filter(tour => 
        tour.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        tour.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(tour => tour.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(tour => tour.price <= parseInt(filters.maxPrice));
    }

    if (filters.minRating) {
      filtered = filtered.filter(tour => tour.rating >= parseFloat(filters.minRating));
    }

    if (filters.startDate) {
      filtered = filtered.filter(tour => new Date(tour.departureDate) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(tour => new Date(tour.departureDate) <= new Date(filters.endDate));
    }

    setFilteredTours(filtered);
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      startDate: '',
      endDate: ''
    });
  };

  const addTour = async (tour) => {
    try {
      setLoading(true);
      const newTour = await ApiService.createTour(tour);
      dispatch({ type: 'ADD_TOUR', payload: newTour });
      return newTour;
    } catch (err) {
      setError('Không thể tạo tour mới. Vui lòng thử lại.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTour = async (tour) => {
    try {
      setLoading(true);
      const updatedTour = await ApiService.updateTour(tour.id, tour);
      dispatch({ type: 'UPDATE_TOUR', payload: updatedTour });
      return updatedTour;
    } catch (err) {
      setError('Không thể cập nhật tour. Vui lòng thử lại.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTour = async (id) => {
    try {
      setLoading(true);
      await ApiService.deleteTour(id);
      dispatch({ type: 'DELETE_TOUR', payload: id });
    } catch (err) {
      setError('Không thể xóa tour. Vui lòng thử lại.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchTours = (keyword) => {
    updateFilters({ search: keyword });
  };

  const addReview = async (tourId, review) => {
    try {
      const tour = tours.find(t => t.id === tourId);
      if (!tour) return;

      const newReviews = [...tour.reviews, { ...review, id: Date.now() }];
      const newRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
      
      const updatedTour = {
        ...tour,
        reviews: newReviews,
        rating: newRating
      };

      await updateTour(updatedTour);
    } catch (err) {
      setError('Không thể thêm đánh giá. Vui lòng thử lại.');
      throw err;
    }
  };

  return (
    <TourContext.Provider value={{
      tours: filteredTours,
      allTours: tours,
      loading,
      error,
      filters,
      updateFilters,
      clearFilters,
      addTour,
      updateTour,
      deleteTour,
      searchTours,
      addReview,
      loadTours,
      getTourById
    }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTours = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTours must be used within TourProvider');
  }
  return context;
};