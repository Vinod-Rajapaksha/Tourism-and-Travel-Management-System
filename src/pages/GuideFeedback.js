import React, { useEffect, useState } from 'react';

function GuideFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const guideId = localStorage.getItem('guideId');

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const [feedbacksResponse, statsResponse] = await Promise.all([
        fetch(`http://localhost:8080/api/feedback/guide/${guideId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch(`http://localhost:8080/api/feedback/guide/${guideId}/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (feedbacksResponse.ok) {
        const feedbacksData = await feedbacksResponse.json();
        setFeedbacks(feedbacksData);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (err) {
      setError('Failed to load feedback data');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fas fa-star ${i < rating ? 'text-warning' : 'text-muted'}`}
      />
    ));
  };

  if (loading) {
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
      <h2 className="mb-4">Feedback Reviews</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <h3 className="card-title">{stats.totalFeedbacks}</h3>
                <p className="card-text">Total Reviews</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <h3 className="card-title">{stats.averageRating.toFixed(1)}</h3>
                <p className="card-text">Average Rating</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body text-center">
                <h3 className="card-title">{stats.fiveStar}</h3>
                <p className="card-text">5-Star Reviews</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body text-center">
                <h3 className="card-title">{stats.fourStar}</h3>
                <p className="card-text">4-Star Reviews</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Distribution */}
      {stats && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Rating Distribution</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = rating === 5 ? stats.fiveStar :
                             rating === 4 ? stats.fourStar :
                             rating === 3 ? stats.threeStar :
                             rating === 2 ? stats.twoStar : stats.oneStar;
                const percentage = stats.totalFeedbacks > 0 ? (count / stats.totalFeedbacks) * 100 : 0;
                
                return (
                  <div key={rating} className="col-md-2 text-center mb-2">
                    <div className="d-flex align-items-center justify-content-center mb-1">
                      <span className="me-2">{rating}</span>
                      <i className="fas fa-star text-warning"></i>
                    </div>
                    <div className="progress" style={{ height: '20px' }}>
                      <div 
                        className="progress-bar bg-warning" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <small className="text-muted">{count} reviews</small>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Customer Reviews</h5>
        </div>
        <div className="card-body">
          {feedbacks.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-comments fa-3x text-muted mb-3"></i>
              <p className="text-muted">No feedback received yet.</p>
              <p className="text-muted">Complete some tours to start receiving customer reviews!</p>
            </div>
          ) : (
            <div className="row">
              {feedbacks.map((feedback) => (
                <div key={feedback.feedbackID} className="col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title mb-0">{feedback.customerName}</h6>
                        <div className="text-warning">
                          {renderStars(feedback.rating)}
                        </div>
                      </div>
                      <p className="card-text text-muted small mb-2">
                        Package: {feedback.packageTitle}
                      </p>
                      <p className="card-text">{feedback.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GuideFeedback;
