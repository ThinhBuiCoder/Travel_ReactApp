import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Badge, Dropdown, Pagination } from 'react-bootstrap';
import TourCard from '../components/TourCard';
import TourForm from '../components/TourForm';
import AdvancedSearchFilter from '../components/AdvancedSearchFilter';
import ProtectedRoute from '../components/ProtectedRoute';
import { useTours } from '../context/TourContext';
import { useUser } from '../context/UserContext';

const Tours = () => {
  const { tours, searchTours, loading, error, loadTours } = useTours();
  const { isAuthenticated, isAdmin, user } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [editTour, setEditTour] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const TOURS_PER_PAGE = 9;

  // Safe user data access
  const userName = user?.name || 'Unknown';
  const userRole = user?.role || 'guest';

  useEffect(() => {
    if (tours.length === 0 && !loading) {
      loadTours();
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchTours(searchTerm);
  };

  const handleEdit = (tour) => {
    setEditTour(tour);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTour(null);
  };

  const handleRefresh = () => {
    loadTours();
    setSearchTerm('');
    setShowAdvancedFilter(false);
  };

  const getSortedTours = () => {
    let sortedTours = [...tours];
    
    switch (sortBy) {
      case 'price-asc':
        return sortedTours.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sortedTours.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return sortedTours.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'date-asc':
        return sortedTours.sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));
      case 'date-desc':
        return sortedTours.sort((a, b) => new Date(b.departureDate) - new Date(a.departureDate));
      case 'name-asc':
        return sortedTours.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sortedTours;
    }
  };

  const sortedTours = getSortedTours();

  // Pagination logic
  const totalPages = Math.ceil(sortedTours.length / TOURS_PER_PAGE);
  const paginatedTours = sortedTours.slice(
    (currentPage - 1) * TOURS_PER_PAGE,
    currentPage * TOURS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container className="my-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>
                🎯 Danh sách tour du lịch
                {isAdmin && (
                  <Badge bg="warning" text="dark" className="ms-2">
                    ADMIN VIEW
                  </Badge>
                )}
              </h1>
              <p className="text-muted mb-0">
                Khám phá những điểm đến tuyệt vời với {tours.length} tour có sẵn
                {isAuthenticated && (
                  <span className="ms-2">
                    • Đăng nhập với tư cách: <strong>{userName}</strong> ({userRole.toUpperCase()})
                  </span>
                )}
              </p>
            </div>
            <Button 
              variant="outline-secondary" 
              onClick={handleRefresh}
              disabled={loading}
            >
              🔄 Làm mới
            </Button>
          </div>
        </Col>
      </Row>

      {/* Role Info Banner */}
      {isAuthenticated && (
        <Row className="mb-3">
          <Col>
            <Alert variant={isAdmin ? 'warning' : 'info'} className="mb-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>
                    {isAdmin ? '👑 Chế độ Admin' : '👤 Chế độ User'}
                  </strong>
                  <span className="ms-2">
                    {isAdmin ? 
                      'Bạn có thể tạo, sửa, xóa tour và xem tất cả booking' : 
                      'Bạn có thể đặt tour và xem lịch sử booking của mình'
                    }
                  </span>
                </div>
                <Badge bg={isAdmin ? 'warning' : 'primary'} text={isAdmin ? 'dark' : 'white'}>
                  {userRole.toUpperCase()}
                </Badge>
              </div>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>❌ Có lỗi xảy ra</Alert.Heading>
          <p className="mb-2">{error}</p>
          <Button variant="outline-danger" size="sm" onClick={handleRefresh}>
            Thử lại
          </Button>
        </Alert>
      )}

      {/* Search and Controls */}
      <Row className="mb-4">
        <Col lg={6}>
          <Form onSubmit={handleSearch}>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Tìm kiếm nhanh theo tên hoặc địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <>🔍 Tìm</>
                )}
              </Button>
            </div>
          </Form>
        </Col>
        <Col lg={6} className="text-end">
          <div className="d-flex gap-2 justify-content-end align-items-center flex-wrap">
            {/* Sort Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                📊 Sắp xếp
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSortBy('default')}>
                  Mặc định
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setSortBy('price-asc')}>
                  💰 Giá: Thấp → Cao
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('price-desc')}>
                  💰 Giá: Cao → Thấp
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setSortBy('rating-desc')}>
                  ⭐ Đánh giá: Cao → Thấp
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setSortBy('date-asc')}>
                  📅 Ngày: Sớm → Muộn
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('date-desc')}>
                  📅 Ngày: Muộn → Sớm
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setSortBy('name-asc')}>
                  🔤 Tên A → Z
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* View Mode Toggle */}
            <div className="btn-group" role="group">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setViewMode('grid')}
                title="Hiển thị dạng lưới"
              >
                🔳
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setViewMode('list')}
                title="Hiển thị dạng danh sách"
              >
                📋
              </Button>
            </div>

            {/* Advanced Filter Toggle */}
            <Button 
              variant={showAdvancedFilter ? 'info' : 'outline-info'}
              size="sm"
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            >
              {showAdvancedFilter ? '🔼 Ẩn bộ lọc' : '🔽 Bộ lọc nâng cao'}
            </Button>

            {/* Admin Only: Add Tour Button */}
            {isAdmin && (
              <Button 
                variant="success" 
                size="sm"
                onClick={() => setShowForm(true)}
                disabled={loading}
              >
                <Badge bg="warning" text="dark" className="me-1">ADMIN</Badge>
                ➕ Thêm tour mới
              </Button>
            )}

            {/* User: Notification if not admin */}
            {isAuthenticated && !isAdmin && (
              <small className="text-muted">
                Chỉ Admin mới có thể tạo tour
              </small>
            )}
          </div>
        </Col>
      </Row>

      {/* Advanced Search Filter */}
      {showAdvancedFilter && <AdvancedSearchFilter />}

      {/* Results Summary */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <Badge bg="primary">
                {sortedTours.length} tour
              </Badge>
              {sortBy !== 'default' && (
                <Badge bg="info">
                  Đã sắp xếp
                </Badge>
              )}
              {searchTerm && (
                <Badge bg="warning" text="dark">
                  Tìm kiếm: "{searchTerm}"
                </Badge>
              )}
              {isAdmin && (
                <Badge bg="warning" text="dark">
                  👑 Admin Mode
                </Badge>
              )}
            </div>
            {sortedTours.length > 0 && (
              <small className="text-muted">
                Hiển thị {viewMode === 'grid' ? 'dạng lưới' : 'dạng danh sách'}
              </small>
            )}
          </div>
        </Col>
      </Row>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h5>🔄 Đang tải danh sách tour...</h5>
          <p className="text-muted">Vui lòng chờ trong giây lát</p>
        </div>
      )}

      {/* Tours Grid/List */}
      <>
        {viewMode === 'grid' ? (
          <Row>
            {paginatedTours.map(tour => (
              <Col md={6} lg={4} key={tour.id} className="mb-4">
                <TourCard 
                  tour={tour} 
                  onEdit={handleEdit}
                  showActions={isAdmin}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Row>
            {paginatedTours.map(tour => (
              <Col xs={12} key={tour.id} className="mb-3">
                <TourCard 
                  tour={tour} 
                  onEdit={handleEdit} 
                  viewMode="list"
                  showActions={isAdmin}
                />
              </Col>
            ))}
          </Row>
        )}
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {Array.from({ length: totalPages }, (_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={currentPage === idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        )}
      </>

      {/* Empty State */}
      {!loading && sortedTours.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-4">
            <div style={{ fontSize: '4rem' }}>🏖️</div>
          </div>
          <h3>🔍 Không tìm thấy tour nào</h3>
          <p className="text-muted mb-4">
            {searchTerm || showAdvancedFilter ? 
              'Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác' :
              'Hiện tại chưa có tour nào trong hệ thống'
            }
          </p>
          <div className="d-flex gap-2 justify-content-center">
            {(searchTerm || showAdvancedFilter) && (
              <Button variant="outline-primary" onClick={handleRefresh}>
                🔄 Xóa bộ lọc
              </Button>
            )}
            
            {/* Admin can create first tour */}
            {isAdmin && (
              <Button variant="success" onClick={() => setShowForm(true)}>
                <Badge bg="warning" text="dark" className="me-1">ADMIN</Badge>
                ➕ Tạo tour đầu tiên
              </Button>
            )}

            {/* User message if no tours */}
            {isAuthenticated && !isAdmin && (
              <Alert variant="info" className="mt-3">
                <Alert.Heading>ℹ️ Thông báo</Alert.Heading>
                <p>Hiện tại chưa có tour nào. Vui lòng liên hệ Admin để thêm tour mới.</p>
              </Alert>
            )}
          </div>
        </div>
      )}

      {/* Admin Only: Tour Form Modal */}
      {isAdmin && (
        <TourForm 
          show={showForm} 
          onHide={handleCloseForm} 
          editTour={editTour}
        />
      )}

      {/* Floating Admin Panel (if admin) */}
      {isAdmin && (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
          }}
        >
          <div className="d-flex flex-column gap-2">
            <Button
              variant="warning"
              size="sm"
              onClick={() => setShowForm(true)}
              className="shadow"
              title="Thêm tour mới (Admin)"
            >
              👑 ➕
            </Button>
            <Button
              variant="outline-warning"
              size="sm"
              onClick={handleRefresh}
              className="shadow"
              title="Refresh data (Admin)"
            >
              👑 🔄
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Tours;