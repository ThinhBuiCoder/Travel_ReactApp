import React from 'react';
import { Card, Form, Button, Row, Col, Badge } from 'react-bootstrap';
import { useTours } from '../context/TourContext';

const AdvancedSearchFilter = () => {
  const { filters, updateFilters, clearFilters, tours } = useTours();

  const handleFilterChange = (field, value) => {
    updateFilters({ [field]: value });
  };

  const handleClear = () => {
    clearFilters();
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">🔍 Bộ lọc nâng cao</h5>
          <Badge bg="primary">{tours.length} tour</Badge>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tìm kiếm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tên tour hoặc địa điểm..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Giá từ (VNĐ)</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Giá đến (VNĐ)</Form.Label>
              <Form.Control
                type="number"
                placeholder="10000000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Đánh giá tối thiểu</Form.Label>
              <Form.Select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="1">⭐ 1 sao trở lên</option>
                <option value="2">⭐ 2 sao trở lên</option>
                <option value="3">⭐ 3 sao trở lên</option>
                <option value="4">⭐ 4 sao trở lên</option>
                <option value="4.5">⭐ 4.5 sao trở lên</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Khởi hành từ ngày</Form.Label>
              <Form.Control
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Khởi hành đến ngày</Form.Label>
              <Form.Control
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={handleClear}>
            🗑️ Xóa bộ lọc
          </Button>
          <div className="ms-auto">
            {Object.values(filters).some(filter => filter !== '') && (
              <Badge bg="info">
                Đang áp dụng {Object.values(filters).filter(f => f !== '').length} bộ lọc
              </Badge>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdvancedSearchFilter;