// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { getAssignedReservations, markReservationComplete } from '../services/apiService';
import ReservationCard from '../components/ReservationCard';

function Dashboard() {
  const guideId = localStorage.getItem('guideId');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(['CONFIRMED', 'PENDING']);
  
  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getAssignedReservations(guideId, statusFilter);
      setReservations(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadReservations();
  }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const handleComplete = async (reservationId) => {
    try {
      await markReservationComplete(reservationId);
      // Reload reservations after marking complete
      loadReservations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete reservation');
    }
  };
  
  const handleStatusFilter = (status) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter(s => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };
  
  const getStatusCount = (status) => {
    return reservations.filter(r => r.status === status).length;
  };
  
  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="text-gradient fw-bold mb-2">My Reservations</h1>
              <p className="text-muted mb-0">Manage your tour reservations and bookings</p>
            </div>
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '48px', height: '48px'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V19C19 20.1046 18.1046 21 17 21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '48px', height: '48px'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="fw-bold text-warning mb-1">{getStatusCount('PENDING')}</h3>
              <p className="text-muted mb-0">Pending</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '48px', height: '48px'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="fw-bold text-primary mb-1">{getStatusCount('CONFIRMED')}</h3>
              <p className="text-muted mb-0">Confirmed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '48px', height: '48px'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2401 3.61096 17.4111C2.43727 15.5821 1.87979 13.4116 2.02168 11.2339C2.16356 9.05629 2.99721 6.95471 4.39828 5.17333C5.79935 3.39194 7.69279 2.00134 9.79619 1.16677C11.8996 0.332201 14.1003 0.0815047 16.2841 0.432883C18.4679 0.784262 20.5264 1.7259 22.1893 3.15136" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="fw-bold text-success mb-1">{getStatusCount('COMPLETED')}</h3>
              <p className="text-muted mb-0">Completed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '48px', height: '48px'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="fw-bold text-danger mb-1">{getStatusCount('CANCELLED')}</h3>
              <p className="text-muted mb-0">Cancelled</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">
                <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Filter by Status
              </h6>
              <div className="btn-group w-100" role="group">
                <button 
                  type="button" 
                  className={`btn ${statusFilter.includes('PENDING') ? 'btn-warning' : 'btn-outline-warning'} d-flex align-items-center justify-content-center`}
                  onClick={() => handleStatusFilter('PENDING')}
                >
                  <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Pending ({getStatusCount('PENDING')})
                </button>
                <button 
                  type="button" 
                  className={`btn ${statusFilter.includes('CONFIRMED') ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center justify-content-center`}
                  onClick={() => handleStatusFilter('CONFIRMED')}
                >
                  <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Confirmed ({getStatusCount('CONFIRMED')})
                </button>
                <button 
                  type="button" 
                  className={`btn ${statusFilter.includes('COMPLETED') ? 'btn-success' : 'btn-outline-success'} d-flex align-items-center justify-content-center`}
                  onClick={() => handleStatusFilter('COMPLETED')}
                >
                  <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2401 3.61096 17.4111C2.43727 15.5821 1.87979 13.4116 2.02168 11.2339C2.16356 9.05629 2.99721 6.95471 4.39828 5.17333C5.79935 3.39194 7.69279 2.00134 9.79619 1.16677C11.8996 0.332201 14.1003 0.0815047 16.2841 0.432883C18.4679 0.784262 20.5264 1.7259 22.1893 3.15136" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Completed ({getStatusCount('COMPLETED')})
                </button>
              </div>
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
      
      {/* Reservations Grid */}
      {loading ? (
        <div className="row">
          <div className="col-12">
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading reservations...</p>
            </div>
          </div>
        </div>
      ) : reservations.length === 0 ? (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <div className="mb-4">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h5 className="text-muted mb-2">No reservations found</h5>
                <p className="text-muted mb-0">
                  No reservations match your current filter criteria. Try adjusting your status filters.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {reservations.map(reservation => (
            <div className="col-lg-4 col-md-6" key={reservation.reservationID}>
              <ReservationCard 
                reservation={reservation} 
                onComplete={handleComplete} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;