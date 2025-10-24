import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CustomerFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const customerId = localStorage.getItem('customerId');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/feedback/customer/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      } else {
        setError('Failed to load feedback');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/feedback/customer/${customerId}/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setFeedbacks(feedbacks.filter(f => f.feedbackID !== feedbackId));
      } else {
        setError('Failed to delete feedback');
      }
    } catch (err) {
      setError('Network error');
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Feedback</h2>
        <Link to="/feedback/create" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Give New Feedback
        </Link>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {feedbacks.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-comments fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No feedback given yet</h5>
            <p className="text-muted">Complete some tours and share your experience!</p>
            <Link to="/feedback/create" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>Give Your First Feedback
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          {feedbacks.map((feedback) => (
            <div key={feedback.feedbackID} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="card-title mb-0">{feedback.packageTitle}</h6>
                    <div className="dropdown">
                      <button 
                        className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                        type="button" 
                        data-bs-toggle="dropdown"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <Link 
                            to={`/feedback/edit/${feedback.feedbackID}`} 
                            className="dropdown-item"
                          >
                            <i className="fas fa-edit me-2"></i>Edit
                          </Link>
                        </li>
                        <li>
                          <button 
                            className="dropdown-item text-danger"
                            onClick={() => handleDeleteFeedback(feedback.feedbackID)}
                          >
                            <i className="fas fa-trash me-2"></i>Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-warning">
                      {renderStars(feedback.rating)}
                    </div>
                    <small className="text-muted">
                      {feedback.rating} out of 5 stars
                    </small>
                  </div>
                  
                  <p className="card-text">{feedback.comment}</p>
                  
                  <div className="mt-3">
                    <small className="text-muted">
                      <i className="fas fa-calendar me-1"></i>
                      Feedback ID: {feedback.feedbackID}
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

export default CustomerFeedback;
