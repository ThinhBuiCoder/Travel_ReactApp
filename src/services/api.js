const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiService {
  // ========================================
  // TOURS API
  // ========================================

  // Get all tours
  async getTours() {
    try {
      const response = await fetch(`${API_BASE_URL}/tours`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch tours`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw new Error('Không thể tải danh sách tour. Vui lòng kiểm tra kết nối mạng.');
    }
  }

  // Get single tour by ID
  async getTour(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tours/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Tour không tồn tại');
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch tour`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tour:', error);
      throw error;
    }
  }

  // Create new tour
  async createTour(tour) {
    try {
      const response = await fetch(`${API_BASE_URL}/tours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // KHÔNG gửi ID - để JSON Server tự tạo
          name: tour.name,
          location: tour.location,
          description: tour.description,
          price: tour.price,
          departureDate: tour.departureDate,
          image: tour.image || '',
          rating: 0,
          reviews: []
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to create tour`);
      }
      
      const newTour = await response.json();
      console.log('Tour created successfully:', newTour);
      return newTour;
    } catch (error) {
      console.error('Error creating tour:', error);
      throw new Error('Không thể tạo tour mới. Vui lòng thử lại.');
    }
  }

  // Update existing tour
  async updateTour(id, tour) {
    try {
      const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tour),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Tour không tồn tại');
        }
        throw new Error(`HTTP ${response.status}: Failed to update tour`);
      }
      
      const updatedTour = await response.json();
      console.log('Tour updated successfully:', updatedTour);
      return updatedTour;
    } catch (error) {
      console.error('Error updating tour:', error);
      throw new Error('Không thể cập nhật tour. Vui lòng thử lại.');
    }
  }

  // Delete tour
  async deleteTour(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Tour không tồn tại');
        }
        throw new Error(`HTTP ${response.status}: Failed to delete tour`);
      }
      
      console.log('Tour deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('Error deleting tour:', error);
      throw new Error('Không thể xóa tour. Vui lòng thử lại.');
    }
  }

  // Search tours
  async searchTours(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/tours?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to search tours`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching tours:', error);
      throw new Error('Không thể tìm kiếm tour. Vui lòng thử lại.');
    }
  }

  // Filter tours
  async filterTours(filters) {
    try {
      const params = new URLSearchParams();
      
      // Price range
      if (filters.minPrice) params.append('price_gte', filters.minPrice);
      if (filters.maxPrice) params.append('price_lte', filters.maxPrice);
      
      // Rating
      if (filters.minRating) params.append('rating_gte', filters.minRating);
      
      // Location
      if (filters.location) params.append('location_like', filters.location);
      
      // Date range
      if (filters.startDate) params.append('departureDate_gte', filters.startDate);
      if (filters.endDate) params.append('departureDate_lte', filters.endDate);
      
      const response = await fetch(`${API_BASE_URL}/tours?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to filter tours`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error filtering tours:', error);
      throw new Error('Không thể lọc tour. Vui lòng thử lại.');
    }
  }

  // ========================================
  // USERS API
  // ========================================

  // Get all users
  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch users`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Người dùng không tồn tại');
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch user`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Create new user
  async createUser(user) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password, // Lưu password
          role: user.role || 'user', // Lưu role nếu có, mặc định là 'user'
          bookedTours: [],
          createdAt: user.createdAt || new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to create user`);
      }
      
      const newUser = await response.json();
      console.log('User created successfully:', newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Không thể tạo tài khoản. Vui lòng thử lại.');
    }
  }

  // Update user
  async updateUser(id, user) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Người dùng không tồn tại');
        }
        throw new Error(`HTTP ${response.status}: Failed to update user`);
      }
      
      const updatedUser = await response.json();
      console.log('User updated successfully:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Không thể cập nhật thông tin. Vui lòng thử lại.');
    }
  }

  // Delete user
  async deleteUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Người dùng không tồn tại');
        }
        throw new Error(`HTTP ${response.status}: Failed to delete user`);
      }
      console.log('User deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Không thể xóa người dùng. Vui lòng thử lại.');
    }
  }

  // ========================================
  // BOOKINGS API
  // ========================================

  // Get all bookings
  async getBookings(userId = null) {
    try {
      const url = userId 
        ? `${API_BASE_URL}/bookings?userId=${userId}`
        : `${API_BASE_URL}/bookings`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch bookings`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Không thể tải lịch sử đặt tour. Vui lòng thử lại.');
    }
  }

  // Get single booking
  async getBooking(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Booking không tồn tại');
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch booking`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  // Create new booking
  async createBooking(booking) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: booking.userId,
          tourId: booking.tourId,
          tourName: booking.tourName,
          amount: booking.amount,
          paymentMethod: booking.paymentMethod,
          bookingDate: new Date().toISOString(),
          status: 'confirmed'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to create booking`);
      }
      
      const newBooking = await response.json();
      console.log('Booking created successfully:', newBooking);
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Không thể đặt tour. Vui lòng thử lại.');
    }
  }

  // Update booking status
  async updateBooking(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Booking không tồn tại');
        }
        throw new Error(`HTTP ${response.status}: Failed to update booking`);
      }
      
      const updatedBooking = await response.json();
      console.log('Booking updated successfully:', updatedBooking);
      return updatedBooking;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new Error('Không thể cập nhật booking. Vui lòng thử lại.');
    }
  }

  // Cancel booking
  async cancelBooking(id) {
    try {
      return await this.updateBooking(id, { status: 'cancelled' });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error('Không thể hủy booking. Vui lòng thử lại.');
    }
  }

  // Delete booking
  async deleteBooking(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Booking không tồn tại');
        }
        throw new Error(`HTTP ${response.status}: Failed to delete booking`);
      }
      
      console.log('Booking deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw new Error('Không thể xóa booking. Vui lòng thử lại.');
    }
  }

  // ========================================
  // REVIEWS API
  // ========================================

  // Add review to tour
  async addReview(tourId, review) {
    try {
      // Get current tour
      const tour = await this.getTour(tourId);
      
      // Add new review
      const newReview = {
        id: Date.now(),
        userId: review.userId,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        date: new Date().toISOString()
      };
      
      const updatedReviews = [...tour.reviews, newReview];
      
      // Calculate new average rating
      const newRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
      
      // Update tour
      const updatedTour = {
        ...tour,
        reviews: updatedReviews,
        rating: Math.round(newRating * 10) / 10 // Round to 1 decimal
      };
      
      return await this.updateTour(tourId, updatedTour);
    } catch (error) {
      console.error('Error adding review:', error);
      throw new Error('Không thể thêm đánh giá. Vui lòng thử lại.');
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  // Test connection
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/tours?_limit=1`);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Get API stats
  async getStats() {
    try {
      const [tours, users, bookings] = await Promise.all([
        this.getTours(),
        this.getUsers(),
        this.getBookings()
      ]);

      return {
        totalTours: tours.length,
        totalUsers: users.length,
        totalBookings: bookings.length,
        avgTourPrice: tours.reduce((sum, tour) => sum + tour.price, 0) / tours.length,
        avgRating: tours.reduce((sum, tour) => sum + (tour.rating || 0), 0) / tours.length
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw new Error('Không thể tải thống kê.');
    }
  }

  // Bulk operations
  async bulkCreateTours(tours) {
    try {
      const promises = tours.map(tour => this.createTour(tour));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error bulk creating tours:', error);
      throw new Error('Không thể tạo nhiều tour cùng lúc.');
    }
  }

  // Export data
  async exportData() {
    try {
      const [tours, users, bookings] = await Promise.all([
        this.getTours(),
        this.getUsers(), 
        this.getBookings()
      ]);

      return {
        tours,
        users,
        bookings,
        exportDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Không thể xuất dữ liệu.');
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

// Add request interceptor for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('🌐 API Service initialized with base URL:', API_BASE_URL);
}
// Thêm vào cuối file src/services/api.js

// Utility function to clear old admin data
export const clearOldAdminData = () => {
  const user = localStorage.getItem('travel-hub-user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      // Clear if old admin format
      if (userData.email === 'admin' || userData.email === 'admin@travel-hub.com') {
        localStorage.removeItem('travel-hub-user');
        console.log('🧹 Cleared old admin data');
        return true;
      }
    } catch (error) {
      localStorage.removeItem('travel-hub-user');
      console.log('🧹 Cleared corrupted user data');
      return true;
    }
  }
  return false;
};
export default apiService;
