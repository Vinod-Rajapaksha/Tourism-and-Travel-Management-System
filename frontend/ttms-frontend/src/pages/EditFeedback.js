// src/pages/EditFeedback.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerFeedback, updateFeedback, deleteFeedback } from '../services/apiService';

function EditFeedback() {
  const { feedbackId } = useParams();
  const navigate = useNavigate();
  const customerId = localStorage.getItem('customerId');
  
  const [feedback, setFeedback] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const feedbackList = await getCustomerFeedback(customerId);
        const currentFeedback = feedbackList.find(f => f.feedbackID === parseInt(feedbackId));
        
        if (!currentFeedback) {
          setError('Feedback not found');
          return;
        }
        
        setFeedback(currentFeedback);
        setRating(currentFeedback.rating);
        setComment(currentFeedback.comment || '');
      } catch (err) {
        setError('Failed to load feedback');
      }
    };

    if (customerId && feedbackId) {
      fetchFeedback();
    }
  }, [customerId, feedbackId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      setError('Please select a valid rating');
      return;
    }

    try {
      setLoading(true);
      await updateFeedback(customerId, parseInt(feedbackId), {
        rating: rating,
        comment: comment.trim()
      });
      
      navigate('/customer-dashboard?tab=feedback');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await deleteFeedback(customerId, parseInt(feedbackId));
      navigate('/customer-dashboard?tab=feedback');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete feedback');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (currentRating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        className={`btn btn-link p-0 me-1 ${i < currentRating ? 'text-warning' : 'text-secondary'}`}
        onClick={() => setRating(i + 1)}
        style={{ fontSize: '1.5rem', textDecoration: 'none' }}
      >
        ★
      </button>
    ));
  };

  if (!feedback) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4">Edit Feedback</h2>
          <p className="text-muted">Editing feedback for: <strong>{feedback.packageTitle}</strong></p>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-4">
              <label className="form-label">Rating</label>
              <div className="d-flex align-items-center">
                {renderStars(rating)}
                <span className="ms-2 text-muted">({rating}/5)</span>
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="form-label">Comment</label>
              <textarea
                className="form-control"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this tour..."
              />
              <div className="form-text">
                Please keep your feedback constructive and appropriate.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Feedback'}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/customer-dashboard')}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-outline-danger"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditFeedback;
