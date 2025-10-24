import React from 'react';

function ReservationCard({ reservation, onComplete }) {
  const getStatusBadge = (status) => {
    const statusClasses = {
      'PENDING': 'status-badge status-pending',
      'CONFIRMED': 'status-badge status-confirmed',
      'COMPLETED': 'status-badge status-completed',
      'CANCELLED': 'status-badge status-cancelled'
    };
    
    return statusClasses[status] || 'status-badge';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'CONFIRMED':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'COMPLETED':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2401 3.61096 17.4111C2.43727 15.5821 1.87979 13.4116 2.02168 11.2339C2.16356 9.05629 2.99721 6.95471 4.39828 5.17333C5.79935 3.39194 7.69279 2.00134 9.79619 1.16677C11.8996 0.332201 14.1003 0.0815047 16.2841 0.432883C18.4679 0.784262 20.5264 1.7259 22.1893 3.15136" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'CANCELLED':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
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
        <span className={getStatusBadge(reservation.status)}>
          {getStatusIcon(reservation.status)}
          <span className="ms-1">{reservation.status}</span>
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
              <small className="text-muted fw-semibold">Tour Date</small>
            </div>
            <p className="mb-0 fw-semibold">{formatDate(reservation.date)}</p>
          </div>
          
          {reservation.clientName && (
            <div className="col-12">
              <div className="d-flex align-items-center mb-2">
                <svg className="me-2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <small className="text-muted fw-semibold">Client</small>
              </div>
              <p className="mb-0 fw-semibold">{reservation.clientName}</p>
            </div>
          )}
          
          {reservation.guideName && (
            <div className="col-12">
              <div className="d-flex align-items-center mb-2">
                <svg className="me-2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <small className="text-muted fw-semibold">Guide</small>
              </div>
              <p className="mb-0 fw-semibold">{reservation.guideName}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="card-footer bg-transparent border-0 p-3">
        {reservation.status !== 'COMPLETED' && reservation.status !== 'CANCELLED' && (
          <button
            className="btn btn-success w-100 d-flex align-items-center justify-content-center"
            onClick={() => onComplete(reservation.reservationID)}
          >
            <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2401 3.61096 17.4111C2.43727 15.5821 1.87979 13.4116 2.02168 11.2339C2.16356 9.05629 2.99721 6.95471 4.39828 5.17333C5.79935 3.39194 7.69279 2.00134 9.79619 1.16677C11.8996 0.332201 14.1003 0.0815047 16.2841 0.432883C18.4679 0.784262 20.5264 1.7259 22.1893 3.15136" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Mark as Complete
          </button>
        )}
        
        {reservation.status === 'COMPLETED' && (
          <div className="alert alert-success mb-0 d-flex align-items-center">
            <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2401 3.61096 17.4111C2.43727 15.5821 1.87979 13.4116 2.02168 11.2339C2.16356 9.05629 2.99721 6.95471 4.39828 5.17333C5.79935 3.39194 7.69279 2.00134 9.79619 1.16677C11.8996 0.332201 14.1003 0.0815047 16.2841 0.432883C18.4679 0.784262 20.5264 1.7259 22.1893 3.15136" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tour Completed
          </div>
        )}
        
        {reservation.status === 'CANCELLED' && (
          <div className="alert alert-danger mb-0 d-flex align-items-center">
            <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Tour Cancelled
          </div>
        )}
      </div>
    </div>
  );
}

export default ReservationCard;
