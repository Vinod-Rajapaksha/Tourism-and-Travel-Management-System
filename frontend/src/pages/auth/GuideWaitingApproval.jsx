import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { checkGuideStatus } from '../../services/auth';
import Swal from 'sweetalert2';

const GuideWaitingApproval = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const email = location.state?.email || '';
  const firstName = location.state?.firstName || 'Tour Guide';
  const lastName = location.state?.lastName || '';

  const handleCheckStatus = async () => {
    if (!email) {
      Swal.fire('Info', 'Please enter your email at the guide login page to check status.', 'info');
      navigate('/guide/login');
      return;
    }

    setLoading(true);
    try {
      const res = await checkGuideStatus(email);
      if (res.status === 'ACTIVE') {
        Swal.fire({
          icon: 'success',
          title: 'Congratulations! You are Approved!',
          text: 'The General Manager has approved your tour guide application. You may now log in.',
          confirmButtonColor: '#10b981'
        });
        navigate('/guide/login');
      } else if (res.status === 'INACTIVE') {
        Swal.fire({
          icon: 'error',
          title: 'Account Deactivated',
          text: 'Your account has been deactivated. Please contact support.',
          confirmButtonColor: '#ef4444'
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Still Under Review',
          text: 'Your application is currently being reviewed by our system administrators. Thank you for your patience!',
          confirmButtonColor: '#f59e0b'
        });
      }
    } catch (err) {
      console.error('Status check failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Check Failed',
        text: 'Could not verify status at this moment. Please try again later.',
        confirmButtonColor: '#6b7280'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative py-5"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div 
              className="card border-0 shadow-lg p-4 p-md-5 rounded-5 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.6)'
              }}
            >
              {/* Pulsing Animated Icon */}
              <div className="position-relative d-inline-block mb-4 mx-auto">
                <div 
                  className="rounded-circle bg-warning bg-opacity-25 position-absolute top-50 start-50 translate-middle"
                  style={{ width: '90px', height: '90px', animation: 'pulse 2s infinite' }}
                ></div>
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle bg-warning text-white shadow position-relative"
                  style={{ width: '70px', height: '70px' }}
                >
                  <i className="bi bi-hourglass-split fs-1"></i>
                </div>
              </div>

              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wider mb-3">
                <i className="bi bi-clock me-1"></i> Status: Pending Administrative Review
              </span>

              <h2 className="fw-bold text-dark tracking-tight mb-2">
                Application Received, {firstName}!
              </h2>
              <p className="text-muted mb-4 px-md-3">
                Thank you for applying to join our elite tour guide network. Your application {email ? `(${email})` : ''} is currently under review by our General Manager.
              </p>

              {/* Status Timeline Card */}
              <div className="card bg-light border-0 rounded-4 p-4 text-start mb-4 shadow-sm">
                <h6 className="fw-bold text-dark mb-3">
                  <i className="bi bi-list-check text-warning me-2"></i> Review Timeline
                </h6>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                      <i className="bi bi-check-lg fw-bold"></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark small">1. Application Submitted</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>Identity & contact credentials received by system.</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                      <span className="spinner-grow spinner-grow-sm" role="status"></span>
                    </div>
                    <div>
                      <div className="fw-bold text-warning-dark small">2. Under General Manager Review</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>System administrators verify credentials & background.</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 opacity-50">
                    <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                      <span>3</span>
                    </div>
                    <div>
                      <div className="fw-bold text-dark small">3. Approved & Active</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>Access granted to guide schedule & assigned itineraries.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={handleCheckStatus}
                  disabled={loading || !email}
                  className="btn btn-warning btn-lg rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? (
                    <span><span className="spinner-border spinner-border-sm me-1"></span> Checking...</span>
                  ) : (
                    <span><i className="bi bi-arrow-repeat"></i> Refresh Approval Status</span>
                  )}
                </button>
                
                <Link to="/guide/login" className="btn btn-outline-dark btn-lg rounded-pill px-4 fw-semibold">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Return to Guide Login
                </Link>
              </div>

              <div className="border-top pt-3">
                <p className="text-muted small mb-0">
                  Need immediate assistance or have questions?{' '}
                  <a href="mailto:support@tourism.com" className="fw-semibold text-primary text-decoration-none">
                    Contact GM Desk <i className="bi bi-envelope small"></i>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideWaitingApproval;
