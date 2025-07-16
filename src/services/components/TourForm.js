import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { useTours } from '../context/TourContext';

const TourForm = ({ show, onHide, editTour = null }) => {
  const { addTour, updateTour } = useTours();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    price: '',
    departureDate: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editTour) {
      setFormData({
        ...editTour,
        price: editTour.price.toString() // Convert to string for form input
      });
    } else {
      setFormData({
        name: '',
        location: '',
        description: '',
        price: '',
        departureDate: '',
        image: ''
      });
    }
    // Reset states when modal opens/closes
    setError('');
    setSuccess(false);
    setLoading(false);
  }, [editTour, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Tên tour không được để trống');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Địa điểm không được để trống');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Mô tả không được để trống');
      return false;
    }
    if (!formData.price || parseInt(formData.price) <= 0) {
      setError('Giá tour phải lớn hơn 0');
      return false;
    }
    if (!formData.departureDate) {
      setError('Ngày khởi hành không được để trống');
      return false;
    }
    
    // Validate departure date is not in the past
    const departureDate = new Date(formData.departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (departureDate < today) {
      setError('Ngày khởi hành không thể là ngày trong quá khứ');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tourData = {
        ...formData,
        price: parseInt(formData.price),
        rating: editTour ? editTour.rating : 0,
        reviews: editTour ? editTour.reviews : []
      };

      if (editTour) {
        await updateTour({ ...tourData, id: editTour.id });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onHide();
          resetForm();
        }, 1500);
      } else {
        await addTour(tourData);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onHide();
          resetForm();
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving tour:', error);
      setError(editTour ? 'Không thể cập nhật tour. Vui lòng thử lại!' : 'Không thể tạo tour mới. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      description: '',
      price: '',
      departureDate: '',
      image: ''
    });
    setError('');
    setSuccess(false);
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop={loading ? 'static' : true}>
      <Modal.Header closeButton={!loading}>
        <Modal.Title>
          {editTour ? '✏️ Chỉnh sửa tour' : '➕ Tạo tour mới'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Success Alert */}
        {success && (
          <Alert variant="success" className="mb-3">
            <Alert.Heading>🎉 Thành công!</Alert.Heading>
            <p className="mb-0">
              {editTour ? 'Tour đã được cập nhật thành công!' : 'Tour mới đã được tạo thành công!'}
            </p>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-3">
            <Alert.Heading>❌ Lỗi</Alert.Heading>
            <p className="mb-0">{error}</p>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tên tour *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên tour (VD: Du lịch Đà Lạt 3N2Đ)"
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Địa điểm *</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Nhập địa điểm (VD: Đà Lạt)"
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mô tả *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả chi tiết về tour..."
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Giá (VNĐ) *</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Nhập giá tour (VD: 2500000)"
              min="1"
              required
              disabled={loading}
            />
            <Form.Text className="text-muted">
              Giá tour tính bằng VNĐ, phải lớn hơn 0
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ngày khởi hành *</Form.Label>
            <Form.Control
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]} // Không cho chọn ngày quá khứ
              required
              disabled={loading}
            />
            <Form.Text className="text-muted">
              Ngày khởi hành không được là ngày trong quá khứ
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>URL hình ảnh</Form.Label>
            <Form.Control
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
            <Form.Text className="text-muted">
              Nhập URL hình ảnh đại diện cho tour (tùy chọn)
            </Form.Text>
          </Form.Group>

          {/* Image Preview */}
          {formData.image && (
            <div className="mb-3">
              <Form.Label>Xem trước hình ảnh:</Form.Label>
              <div className="border rounded p-2">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    height: '200px', 
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="d-flex gap-2 justify-content-end">
            <Button 
              variant="secondary" 
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {editTour ? 'Đang cập nhật...' : 'Đang tạo tour...'}
                </>
              ) : (
                <>
                  {editTour ? '💾 Cập nhật tour' : '🎯 Tạo tour mới'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TourForm;