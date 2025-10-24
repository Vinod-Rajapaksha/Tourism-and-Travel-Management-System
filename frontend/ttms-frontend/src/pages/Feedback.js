// src/pages/Feedback.js
import React, { useEffect, useState } from 'react';
import { getGuideFeedback } from '../services/apiService';

function Feedback() {
  const guideId = localStorage.getItem('guideId');
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const data = await getGuideFeedback(guideId);
        setFeedback(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load feedback');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, [guideId]);
  
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-warning' : 'text-secondary'}>
          ★
        </span>
      );
    }
    return stars;
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
      <h2 className="mb-4">Customer Feedback</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {feedback.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No feedback available for your guided tours yet.
        </div>
      ) : (
        <div className="row">
          {feedback.map(item => (
            <div className="col-md-6 mb-4" key={item.feedbackID}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.packageTitle}</h5>
                  
                  <div className="mb-2 fs-4">
                    {renderStars(item.rating)}
                    <span className="ms-2 text-muted fs-6">
                      ({item.rating}/5)
                    </span>
                  </div>
                  
                  <p className="card-text">
                    {item.comment || <em>No comment provided</em>}
                  </p>
                  
                  <div className="text-muted mt-3">
                    <small>
                      By: {item.userName}<br/>
                      {item.submittedAt && new Date(item.submittedAt).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feedback;