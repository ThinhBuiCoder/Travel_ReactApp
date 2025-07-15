import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Badge, Dropdown } from 'react-bootstrap';
import TourCard from '../components/TourCard';
import TourForm from '../components/TourForm';
import AdvancedSearchFilter from '../components/AdvancedSearchFilter';
import { useTours } from '../context/TourContext';
import { useUser } from '../context/UserContext';

const Tours = () => {
  const { tours, searchTours, loading, error, loadTours } = useTours();
  const { isAuthenticated } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [editTour, setEditTour] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Load tours when component mounts
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

  // Sort tours based on selected option
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

  return (
    <Container className="my-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>🎯 Danh sách tour du lịch</h1>
              <p className="text-muted mb-0">
                Khám phá những điểm đến tuyệt vời với {tours.length} tour có sẵn
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
          <div className="d-flex gap-2 justify-content-end align-items-center">
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
              >
                🔳
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setViewMode('list')}
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

            {/* Add Tour Button */}
            {isAuthenticated && (
              <Button 
                variant="success" 
                size="sm"
                onClick={() => setShowForm(true)}
                disabled={loading}
              >
                ➕ Thêm tour mới
              </Button>
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
            <div className="d-flex gap-2 align-items-center">
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
      {!loading && (
        <>
          {viewMode === 'grid' ? (
            <Row>
              {sortedTours.map(tour => (
                <Col md={6} lg={4} key={tour.id} className="mb-4">
                  <TourCard tour={tour} onEdit={handleEdit} />
                </Col>
              ))}
            </Row>
          ) : (
            <Row>
              {sortedTours.map(tour => (
                <Col xs={12} key={tour.id} className="mb-3">
                  <TourCard tour={tour} onEdit={handleEdit} viewMode="list" />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

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
            {isAuthenticated && (
              <Button variant="success" onClick={() => setShowForm(true)}>
                ➕ Tạo tour đầu tiên
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Tour Form Modal */}
      <TourForm 
        show={showForm} 
        onHide={handleCloseForm} 
        editTour={editTour}
      />
    </Container>
  );
};

export default Tours;