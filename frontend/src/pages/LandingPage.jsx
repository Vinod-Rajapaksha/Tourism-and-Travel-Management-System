import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="landing-card" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid rgba(100, 181, 246, 0.3)',
              borderRadius: '20px',
              padding: '3rem',
              boxShadow: '0 20px 40px rgba(100, 181, 246, 0.2), 0 0 60px rgba(66, 165, 245, 0.15)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              {/* Header Section */}
              <div className="mb-5">
                <div className="logo-icon mb-4" style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto',
                  background: 'linear-gradient(45deg, #90caf9, #64b5f6, #42a5f5, #2196f3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(100, 181, 246, 0.3)'
                }}>
                  <i className="fas fa-plane text-white" style={{ fontSize: '2rem' }}></i>
                </div>
                <h1 style={{
                  background: 'linear-gradient(45deg, #90caf9, #64b5f6, #42a5f5, #2196f3)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem'
                }}>
                  ✈️ Travel Management System
                </h1>
                <p style={{ 
                  color: '#333333', 
                  fontSize: '1.2rem',
                  marginBottom: '2rem'
                }}>
                  Your gateway to amazing travel experiences
                </p>
              </div>

              {/* Authentication Section */}
              <div className="auth-section mb-5">
                <h3 style={{ 
                  color: '#1976d2', 
                  marginBottom: '2rem',
                  fontWeight: 'bold'
                }}>
                  Get Started
                </h3>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Link 
                      to="/auth/customer/login"
                      className="btn btn-primary btn-lg w-100"
                      style={{
                        background: 'linear-gradient(135deg, #90caf9 0%, #64b5f6 50%, #42a5f5 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '15px 30px',
                        fontWeight: 'bold',
                        boxShadow: '0 8px 20px rgba(100, 181, 246, 0.3)',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        color: 'white'
                      }}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Login
                    </Link>
                  </div>
                  <div className="col-md-6 mb-3">
                    <Link 
                      to="/auth/customer/register"
                      className="btn btn-outline-primary btn-lg w-100"
                      style={{
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
                        border: '2px solid #64b5f6',
                        borderRadius: '12px',
                        padding: '15px 30px',
                        fontWeight: 'bold',
                        color: '#1976d2',
                        boxShadow: '0 8px 20px rgba(100, 181, 246, 0.2)',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none'
                      }}
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      Register
                    </Link>
                  </div>
                </div>
              </div>

              {/* Navigation Section */}
              <div className="navigation-section">
                <h4 style={{ 
                  color: '#1976d2', 
                  marginBottom: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  Explore Our Services
                </h4>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <button 
                      className="btn btn-outline-info w-100"
                      onClick={() => navigate('/auth/customer/login')}
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '2px solid #64b5f6',
                        borderRadius: '10px',
                        padding: '15px',
                        color: '#1976d2',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className="fas fa-box me-2"></i>
                      View Packages
                    </button>
                  </div>
                  <div className="col-md-4 mb-3">
                    <button 
                      className="btn btn-outline-success w-100"
                      onClick={() => navigate('/auth/customer/login')}
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '2px solid #4caf50',
                        borderRadius: '10px',
                        padding: '15px',
                        color: '#2e7d32',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className="fas fa-history me-2"></i>
                      Booking History
                    </button>
                  </div>
                  <div className="col-md-4 mb-3">
                    <button 
                      className="btn btn-outline-warning w-100"
                      onClick={() => navigate('/auth/customer/login')}
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '2px solid #ff9800',
                        borderRadius: '10px',
                        padding: '15px',
                        color: '#f57c00',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className="fas fa-user me-2"></i>
                      My Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="features-section mt-5">
                <h4 style={{ 
                  color: '#1976d2', 
                  marginBottom: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  Why Choose Us?
                </h4>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div style={{
                      padding: '1rem',
                      backgroundColor: 'rgba(100, 181, 246, 0.1)',
                      borderRadius: '10px',
                      border: '1px solid rgba(100, 181, 246, 0.3)'
                    }}>
                      <i className="fas fa-shield-alt text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                      <h6 style={{ color: '#1976d2', fontWeight: 'bold' }}>Secure Booking</h6>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>Safe and secure payment processing</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div style={{
                      padding: '1rem',
                      backgroundColor: 'rgba(100, 181, 246, 0.1)',
                      borderRadius: '10px',
                      border: '1px solid rgba(100, 181, 246, 0.3)'
                    }}>
                      <i className="fas fa-clock text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                      <h6 style={{ color: '#1976d2', fontWeight: 'bold' }}>24/7 Support</h6>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>Round-the-clock customer assistance</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div style={{
                      padding: '1rem',
                      backgroundColor: 'rgba(100, 181, 246, 0.1)',
                      borderRadius: '10px',
                      border: '1px solid rgba(100, 181, 246, 0.3)'
                    }}>
                      <i className="fas fa-star text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                      <h6 style={{ color: '#1976d2', fontWeight: 'bold' }}>Best Deals</h6>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>Exclusive offers and competitive prices</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
