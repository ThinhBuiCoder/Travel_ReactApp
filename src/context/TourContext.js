
// ========================================
// FILE: src/context/TourContext.js
// ========================================
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { tourReducer } from '../reducers/tourReducer';

const TourContext = createContext();

// Dữ liệu tour mẫu
const initialTours = [
  {
    id: 1,
    name: "Du lịch Đà Lạt 3N2Đ",
    location: "Đà Lạt",
    description: "Khám phá thành phố ngàn hoa với khí hậu mát mẻ quanh năm",
    price: 2500000,
    departureDate: "2024-12-01",
    image: "https://bloganchoi.com/wp-content/uploads/2021/11/review-da-lat-toan-canh-dat-lat-trong-suong-mu-som-mai-1.jpg",
    rating: 4.5,
    reviews: []
  },
  {
    id: 2,
    name: "Tour Hạ Long 2N1Đ",
    location: "Hạ Long",
    description: "Tham quan vịnh Hạ Long - Di sản thế giới",
    price: 3200000,
    departureDate: "2024-12-15",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400",
    rating: 4.8,
    reviews: []
  },
  {
    id: 3,
    name: "Tour Sapa 4N3Đ",
    location: "Sapa",
    description: "Chinh phục Fansipan và ngắm ruộng bậc thang tuyệt đẹp",
    price: 3800000,
    departureDate: "2024-12-20",
    image: "https://52hz.vn/wp-content/uploads/2021/11/7-dinh-fansipan-hung-vi.jpg",
    rating: 4.6,
    reviews: []
  },
  {
    id: 4,
    name: "Tour Phú Quốc 5N4Đ",
    location: "Phú Quốc",
    description: "Nghỉ dưỡng biển đảo với hải sản tươi ngon và cáp treo Hòn Thơm",
    price: 5200000,
    departureDate: "2024-12-25",
    image: "https://phuquoctrip.com/files/images/daily_tour/land_tour_1/land_tour_01_05.jpg",
    rating: 4.7,
    reviews: []
  },
  {
    id: 5,
    name: "Tour Hội An - Huế 4N3Đ",
    location: "Hội An",
    description: "Khám phá phố cổ Hội An và cố đô Huế với di sản văn hóa phong phú",
    price: 4100000,
    departureDate: "2024-12-30",
    image: "https://www.pullman-danang.com/wp-content/uploads/sites/86/2022/07/Cuong-Art.jpg",
    rating: 4.9,
    reviews: []
  },
  {
    id: 6,
    name: "Tour Nha Trang 3N2Đ",
    location: "Nha Trang",
    description: "Tắm biển và khám phá đảo Hòn Mun, Vinpearl Land",
    price: 3600000,
    departureDate: "2025-01-05",
    image: "https://emeraldbayhotelnhatrang.com/wp-content/uploads/2023/03/AdobeStock_315104972-1-scaled.jpg",
    rating: 4.4,
    reviews: []
  },
  {
    id: 7,
    name: "Tour Cần Thơ - Đồng bằng sông Cửu Long 3N2Đ",
    location: "Cần Thơ",
    description: "Trải nghiệm chợ nổi Cái Răng và văn hóa miệt vườn Nam Bộ",
    price: 2800000,
    departureDate: "2025-01-10",
    image: "https://valitravel.vn/wp-content/uploads/2022/10/kinh-nghiem-du-lich-cho-noi-cai-rang-moi-nhat-2022-1428.jpg",
    rating: 4.3,
    reviews: []
  },
  {
    id: 8,
    name: "Tour Ninh Bình 2N1Đ",
    location: "Ninh Bình",
    description: "Khám phá Tràng An, Tam Cốc - Bích Động và cố đô Hoa Lư",
    price: 2200000,
    departureDate: "2025-01-15",
    image: "https://media.gody.vn/images/ninh-binh/tam-coc-bich-dong/12-2016/20161213092227-tam-coc-bich-dong-gody%20(7).jpg",
    rating: 4.6,
    reviews: []
  },
  {
    id: 9,
    name: "Tour Đà Nẵng - Bà Nà Hills 3N2Đ",
    location: "Đà Nẵng",
    description: "Tham quan Cầu Vàng, Bà Nà Hills và thư giãn tại bãi biển Mỹ Khê",
    price: 3900000,
    departureDate: "2025-01-20",
    image: "https://banahills.sunworld.vn/wp-content/uploads/2020/10/DJI_0971.jpg",
    rating: 4.5,
    reviews: []
  }
];

export const TourProvider = ({ children }) => {
  const [tours, dispatch] = useReducer(tourReducer, initialTours);
  const [filteredTours, setFilteredTours] = React.useState(tours);
  const [filters, setFilters] = React.useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    startDate: '',
    endDate: ''
  });

  // Áp dụng bộ lọc khi tours hoặc filters thay đổi
  useEffect(() => {
    applyFilters();
  }, [tours, filters]);

  // Hàm áp dụng các bộ lọc
  const applyFilters = () => {
    let filtered = [...tours];

    // Lọc theo từ khóa tìm kiếm
    if (filters.search) {
      filtered = filtered.filter(tour => 
        tour.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        tour.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        tour.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Lọc theo giá tối thiểu
    if (filters.minPrice) {
      filtered = filtered.filter(tour => tour.price >= parseInt(filters.minPrice));
    }

    // Lọc theo giá tối đa
    if (filters.maxPrice) {
      filtered = filtered.filter(tour => tour.price <= parseInt(filters.maxPrice));
    }

    // Lọc theo đánh giá tối thiểu
    if (filters.minRating) {
      filtered = filtered.filter(tour => (tour.rating || 0) >= parseFloat(filters.minRating));
    }

    // Lọc theo ngày khởi hành từ
    if (filters.startDate) {
      filtered = filtered.filter(tour => new Date(tour.departureDate) >= new Date(filters.startDate));
    }

    // Lọc theo ngày khởi hành đến
    if (filters.endDate) {
      filtered = filtered.filter(tour => new Date(tour.departureDate) <= new Date(filters.endDate));
    }

    setFilteredTours(filtered);
  };

  // Cập nhật bộ lọc
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Xóa tất cả bộ lọc
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

  // Thêm tour mới
  const addTour = (tour) => {
    const newTour = {
      ...tour,
      id: Date.now(), // Tạo ID unique
      rating: 0,
      reviews: []
    };
    dispatch({ type: 'ADD_TOUR', payload: newTour });
  };

  // Cập nhật tour
  const updateTour = (tour) => {
    dispatch({ type: 'UPDATE_TOUR', payload: tour });
  };

  // Xóa tour
  const deleteTour = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      dispatch({ type: 'DELETE_TOUR', payload: id });
    }
  };

  // Tìm kiếm tour (wrapper cho updateFilters)
  const searchTours = (keyword) => {
    updateFilters({ search: keyword });
  };

  // Lấy tour theo ID
  const getTourById = (id) => {
    return tours.find(tour => tour.id === parseInt(id));
  };

  // Thêm đánh giá cho tour
  const addReview = (tourId, review) => {
    const updatedTours = tours.map(tour => {
      if (tour.id === tourId) {
        const newReviews = [...tour.reviews, { 
          ...review, 
          id: Date.now(),
          date: new Date().toISOString()
        }];
        
        // Tính lại rating trung bình
        const newRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        
        return { 
          ...tour, 
          reviews: newReviews, 
          rating: Math.round(newRating * 10) / 10 // Làm tròn 1 chữ số thập phân
        };
      }
      return tour;
    });
    
    dispatch({ type: 'SET_TOURS', payload: updatedTours });
  };

  // Sắp xếp tour
  const sortTours = (sortType) => {
    let sorted = [...filteredTours];
    
    switch (sortType) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));
        break;
      default:
        break;
    }
    
    setFilteredTours(sorted);
  };

  // Thống kê
  const getStatistics = () => {
    return {
      totalTours: tours.length,
      avgPrice: tours.reduce((sum, tour) => sum + tour.price, 0) / tours.length || 0,
      avgRating: tours.reduce((sum, tour) => sum + (tour.rating || 0), 0) / tours.length || 0,
      highRatedTours: tours.filter(tour => (tour.rating || 0) >= 4).length,
      locations: [...new Set(tours.map(tour => tour.location))],
      priceRanges: {
        budget: tours.filter(tour => tour.price < 3000000).length,
        mid: tours.filter(tour => tour.price >= 3000000 && tour.price < 6000000).length,
        luxury: tours.filter(tour => tour.price >= 6000000).length
      }
    };
  };

  // Context value
  const contextValue = {
    // Data
    tours: filteredTours,
    allTours: tours,
    filters,
    
    // Filter functions
    updateFilters,
    clearFilters,
    searchTours,
    sortTours,
    
    // CRUD functions
    addTour,
    updateTour,
    deleteTour,
    getTourById,
    
    // Review functions
    addReview,
    
    // Utility functions
    getStatistics
  };

  return (
    <TourContext.Provider value={contextValue}>
      {children}
    </TourContext.Provider>
  );
};

// Hook để sử dụng TourContext
export const useTours = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTours must be used within TourProvider');
  }
  return context;
};

export default TourContext;