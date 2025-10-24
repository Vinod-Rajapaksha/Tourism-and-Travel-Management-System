// src/pages/CreateFeedback.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createFeedback, getCompletedReservations } from '../services/apiService';

function CreateFeedback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const customerId = localStorage.getItem('customerId');
  const packageId = searchParams.get('packageId');
  const reservationId = searchParams.get('reservationId');
  
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getCompletedReservations(customerId);
        setReservations(data);
        
        // If packageId is provided, find the matching reservation
        if (packageId) {
          const reservation = data.find(r => r.packageId === parseInt(packageId));
          if (reservation) {
            setSelectedReservation(reservation);
          }
        }
      } catch (err) {
        setError('Failed to load completed reservations');
      }
    };

    if (customerId) {
      fetchReservations();
    }
  }, [customerId, packageId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReservation) {
      setError('Please select a completed tour');
      return;
    }

    if (rating < 1 || rating > 5) {
      setError('Please select a valid rating');
      return;
    }

    try {
      setLoading(true);
      await createFeedback(customerId, {
        packageId: selectedReservation.packageId,
        rating: rating,
        comment: comment.trim()
      });
      
      navigate('/customer-dashboard?tab=feedback');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
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

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4">Leave Feedback</h2>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Select Tour */}
            <div className="mb-4">
              <label className="form-label">Select Completed Tour</label>
              <select 
                className="form-select"
                value={selectedReservation?.reservationId || ''}
                onChange={(e) => {
                  const reservation = reservations.find(r => r.reservationId === parseInt(e.target.value));
                  setSelectedReservation(reservation);
                }}
                required
              >
                <option value="">Choose a completed tour...</option>
                {reservations.map(reservation => (
                  <option key={reservation.reservationId} value={reservation.reservationId}>
                    {reservation.packageTitle} - {new Date(reservation.startDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

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
              <label className="form-label">Comment (Optional)</label>
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

            {/* Submit Button */}
            <div className="d-flex gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/customer-dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateFeedback;
