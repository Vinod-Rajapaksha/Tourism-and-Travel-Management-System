// src/pages/CustomerDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCompletedReservations, getCustomerFeedback, deleteFeedback } from '../services/apiService';
import './CustomerDashboard.css';

function CustomerDashboard() {
  const navigate = useNavigate();
  const customerId = localStorage.getItem('customerId');
  const [reservations, setReservations] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reservationsData, feedbackData] = await Promise.all([
          getCompletedReservations(customerId),
          getCustomerFeedback(customerId)
        ]);
        setReservations(reservationsData);
        setFeedback(feedbackData);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchData();
    }
  }, [customerId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        console.log('Deleting feedback:', feedbackId, 'for customer:', customerId);
        await deleteFeedback(customerId, feedbackId);
        console.log('Delete successful, refreshing feedback list');
        // Refresh the feedback list
        const feedbackData = await getCustomerFeedback(customerId);
        setFeedback(feedbackData);
        setError(null);
        setSuccessMessage('Feedback deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        console.error('Delete error:', err);
        setError(err.response?.data?.message || 'Failed to delete feedback');
      }
    }
  };

  const calculateStats = () => {
    const totalTours = reservations.length;
    const totalFeedback = feedback.length;
    const averageRating = feedback.length > 0 
      ? Math.round(feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length * 10) / 10 
      : 0;
    const pendingFeedback = reservations.filter(r => !r.hasFeedback).length;
    
    return { totalTours, totalFeedback, averageRating, pendingFeedback };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold mb-2 text-primary">Welcome Back!</h1>
              <p className="text-muted mb-0">Manage your tours, feedback, and profile</p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Link to="/customer-profile" className="btn btn-outline-secondary">
                <i className="fas fa-user me-2"></i>Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {successMessage}
              <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100 bg-primary text-white">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="fas fa-map-marked-alt fa-2x"></i>
              </div>
              <h3 className="fw-bold mb-1">{stats.totalTours}</h3>
              <p className="mb-0 opacity-75">Completed Tours</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100 bg-warning text-white">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="fas fa-star fa-2x"></i>
              </div>
              <h3 className="fw-bold mb-1">{stats.totalFeedback}</h3>
              <p className="mb-0 opacity-75">Feedback Given</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100 bg-success text-white">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="fas fa-chart-line fa-2x"></i>
              </div>
              <h3 className="fw-bold mb-1">{stats.averageRating}</h3>
              <p className="mb-0 opacity-75">Average Rating</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100 bg-info text-white">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="fas fa-clock fa-2x"></i>
              </div>
              <h3 className="fw-bold mb-1">{stats.pendingFeedback}</h3>
              <p className="mb-0 opacity-75">Pending Feedback</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger slide-up" role="alert">
              <div className="d-flex align-items-center">
                <svg className="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Quick Actions</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <Link to="/feedback/create" className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
                    <i className="fas fa-plus me-2"></i>
                    Give Feedback
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to="/customer-feedback" className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center">
                    <i className="fas fa-comments me-2"></i>
                    My Feedback
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to="/customer-profile" className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center">
                    <i className="fas fa-user me-2"></i>
                    My Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <ul className="nav nav-tabs border-0">
                <li className="nav-item flex-fill">
                  <button 
                    className={`nav-link w-100 d-flex align-items-center justify-content-center ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Overview
                  </button>
                </li>
                <li className="nav-item flex-fill">
                  <button 
                    className={`nav-link w-100 d-flex align-items-center justify-content-center ${activeTab === 'reservations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reservations')}
                  >
                    <i className="fas fa-map-marked-alt me-2"></i>
                    Completed Tours ({reservations.length})
                  </button>
                </li>
                <li className="nav-item flex-fill">
                  <button 
                    className={`nav-link w-100 d-flex align-items-center justify-content-center ${activeTab === 'feedback' ? 'active' : ''}`}
                    onClick={() => setActiveTab('feedback')}
                  >
                    <i className="fas fa-star me-2"></i>
                    My Feedback ({feedback.length})
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="row">
        <div className="col-12">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="fade-in">
              <div className="row g-4">
                {/* Recent Tours */}
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0">
                      <h5 className="card-title mb-0">
                        <i className="fas fa-history me-2 text-primary"></i>
                        Recent Tours
                      </h5>
                    </div>
                    <div className="card-body">
                      {reservations.length === 0 ? (
                        <div className="text-center py-4">
                          <i className="fas fa-map-marked-alt fa-3x text-muted mb-3"></i>
                          <h6 className="text-muted">No completed tours yet</h6>
                          <p className="text-muted">Book a tour to get started!</p>
                        </div>
                      ) : (
                        <div className="list-group list-group-flush">
                          {reservations.slice(0, 3).map(reservation => (
                            <div key={reservation.reservationId} className="list-group-item border-0 px-0">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="mb-1">{reservation.packageTitle}</h6>
                                  <small className="text-muted">
                                    {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                                  </small>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  {reservation.hasFeedback ? (
                                    <span className="badge bg-success">
                                      <i className="fas fa-check me-1"></i>Feedback Given
                                    </span>
                                  ) : (
                                    <Link 
                                      to={`/feedback/create?packageId=${reservation.packageId}&reservationId=${reservation.reservationId}`}
                                      className="btn btn-sm btn-outline-primary"
                                    >
                                      <i className="fas fa-star me-1"></i>Give Feedback
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Feedback */}
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0">
                      <h5 className="card-title mb-0">
                        <i className="fas fa-star me-2 text-warning"></i>
                        Recent Feedback
                      </h5>
                    </div>
                    <div className="card-body">
                      {feedback.length === 0 ? (
                        <div className="text-center py-4">
                          <i className="fas fa-comments fa-2x text-muted mb-3"></i>
                          <h6 className="text-muted">No feedback yet</h6>
                          <p className="text-muted">Complete a tour to leave feedback!</p>
                        </div>
                      ) : (
                        <div className="list-group list-group-flush">
                          {feedback.slice(0, 3).map(item => (
                            <div key={item.feedbackID} className="list-group-item border-0 px-0">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1">{item.packageTitle}</h6>
                                  <div className="d-flex align-items-center mb-1">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <i key={i} className={`fas fa-star ${i < item.rating ? 'text-warning' : 'text-muted'}`}></i>
                                    ))}
                                    <span className="ms-2 small text-muted">{item.rating}/5</span>
                                  </div>
                                  <p className="small text-muted mb-0">{item.comment?.substring(0, 50)}...</p>
                                </div>
                                <Link 
                                  to={`/feedback/edit/${item.feedbackID}`}
                                  className="btn btn-sm btn-outline-secondary"
                                >
                                  <i className="fas fa-edit"></i>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Completed Reservations Tab */}
          {activeTab === 'reservations' && (
            <div className="fade-in">
              {reservations.length === 0 ? (
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center py-5">
                    <div className="mb-4">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h5 className="text-muted mb-2">No completed tours</h5>
                    <p className="text-muted mb-0">You haven't completed any tours yet. Book a tour to get started!</p>
                  </div>
                </div>
              ) : (
                <div className="row g-4">
                  {reservations.map(reservation => (
                    <div className="col-lg-4 col-md-6" key={reservation.reservationId}>
                      <div className="card h-100 slide-up">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <svg className="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="fw-semibold">{reservation.packageTitle}</span>
                          </div>
                          <span className="status-badge status-completed">
                            <svg className="me-1" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2401 3.61096 17.4111C2.43727 15.5821 1.87979 13.4116 2.02168 11.2339C2.16356 9.05629 2.99721 6.95471 4.39828 5.17333C5.79935 3.39194 7.69279 2.00134 9.79619 1.16677C11.8996 0.332201 14.1003 0.0815047 16.2841 0.432883C18.4679 0.784262 20.5264 1.7259 22.1893 3.15136" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            COMPLETED
                          </span>
                        </div>
                        
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-12">
                              <div className="d-flex align-items-center mb-2">
                                <svg className="me-2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <small className="text-muted fw-semibold">Tour Dates</small>
                              </div>
                              <p className="mb-0 fw-semibold">
                                {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="card-footer bg-transparent border-0 p-3">
                          {reservation.hasFeedback ? (
                            <div className="alert alert-success mb-0 d-flex align-items-center">
                              <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Feedback submitted
                            </div>
                          ) : (
                            <button 
                              onClick={() => navigate(`/feedback/create?packageId=${reservation.packageId}&reservationId=${reservation.reservationId}`)}
                              className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                            >
                              <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Leave Feedback
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="fade-in">
              {feedback.length === 0 ? (
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center py-5">
                    <div className="mb-4">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted">
                        <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h5 className="text-muted mb-2">No feedback submitted</h5>
                    <p className="text-muted mb-0">You haven't submitted any feedback yet. Complete a tour to leave feedback!</p>
                  </div>
                </div>
              ) : (
                <div className="row g-4">
                  {feedback.map(item => (
                    <div className="col-lg-4 col-md-6" key={item.feedbackID}>
                      <div className="card h-100 slide-up">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <svg className="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="fw-semibold">{item.packageTitle}</span>
                          </div>
                        </div>
                        
                        <div className="card-body">
                          <div className="mb-3">
                            <div className="rating-stars mb-2">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span key={i} className={i < item.rating ? 'text-warning' : 'text-secondary'}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <small className="text-muted fw-semibold">
                              Rating: {item.rating}/5
                            </small>
                          </div>
                          
                          <div className="mb-3">
                            <small className="text-muted fw-semibold">Comment:</small>
                            <p className="mb-0 mt-1">
                              {item.comment || <em className="text-muted">No comment provided</em>}
                            </p>
                          </div>
                        </div>
                        
                        <div className="card-footer bg-transparent border-0 p-3">
                          <div className="row g-2">
                            <div className="col-6">
                              <button 
                                onClick={() => navigate(`/feedback/edit/${item.feedbackID}`)}
                                className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center"
                              >
                                <svg className="me-1" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Edit
                              </button>
                            </div>
                            <div className="col-6">
                              <button 
                                className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center"
                                onClick={() => handleDeleteFeedback(item.feedbackID)}
                              >
                                <svg className="me-1" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
