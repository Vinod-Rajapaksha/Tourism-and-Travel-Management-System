import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:8080";

const CustomerNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/customer/login");
  };

  if (loading) {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/customer/packages">
            Travel Booking
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 25%, #e9ecef 50%, #dee2e6 75%, #ced4da 100%)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      borderBottom: '2px solid rgba(25, 118, 210, 0.3)'
    }}>
      <div className="container">
        <Link className="navbar-brand" to="/customer/packages" style={{
          background: 'linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6, #90caf9)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          textShadow: '0 1px 2px rgba(66, 165, 245, 0.3)'
        }}>
          ✈️ Travel Booking
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === "/customer/packages" ? "active" : ""}`}
                to="/customer/packages"
                style={{
                  background: location.pathname === "/customer/packages" ? 
                    'rgba(66, 165, 245, 0.2)' : 
                    'transparent',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  color: '#000000',
                  fontWeight: '600',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                📦 Packages
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === "/customer/profile" ? "active" : ""}`}
                to="/customer/profile"
                style={{
                  background: location.pathname === "/customer/profile" ? 
                    'rgba(66, 165, 245, 0.2)' : 
                    'transparent',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  color: '#000000',
                  fontWeight: '600',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                👤 Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === "/customer/payment-profiles" ? "active" : ""}`}
                to="/customer/payment-profiles"
                style={{
                  background: location.pathname === "/customer/payment-profiles" ? 
                    'rgba(66, 165, 245, 0.2)' : 
                    'transparent',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  color: '#000000',
                  fontWeight: '600',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                💳 Payment Profiles
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === "/customer/history" ? "active" : ""}`}
                  to={`/customer/history?email=${encodeURIComponent(user.email)}`}
                  style={{
                    background: location.pathname === "/customer/history" ? 
                      'rgba(66, 165, 245, 0.2)' : 
                      'transparent',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    color: '#000000',
                    fontWeight: '500'
                  }}
                >
                  📋 Bookings
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === "/customer/profile-debug" ? "active" : ""}`}
                to="/customer/profile-debug"
                style={{
                  background: location.pathname === "/customer/profile-debug" ? 
                    'rgba(66, 165, 245, 0.2)' : 
                    'transparent',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  color: '#000000',
                  fontWeight: '600',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                🔧 Debug Profile
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                  style={{
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="fas fa-user me-1" style={{color: '#ff6b6b'}}></i>
                  <span style={{
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '600'
                  }}>
                    {user.firstName} {user.lastName}
                  </span>
                </a>
                <ul className="dropdown-menu" style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 40px rgba(102, 126, 234, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <li>
                    <Link className="dropdown-item" to="/customer/profile" style={{
                      color: 'white',
                      transition: 'all 0.3s ease',
                      borderRadius: '8px',
                      margin: '2px'
                    }}>
                      <i className="fas fa-user me-2" style={{color: '#ff6b6b'}}></i>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to={`/customer/history?email=${encodeURIComponent(user.email)}`}
                      style={{
                        color: 'white',
                        transition: 'all 0.3s ease',
                        borderRadius: '8px',
                        margin: '2px'
                      }}
                    >
                      <i className="fas fa-history me-2" style={{color: '#4ecdc4'}}></i>
                      My Bookings
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/customer/payment-profiles"
                      style={{
                        color: 'white',
                        transition: 'all 0.3s ease',
                        borderRadius: '8px',
                        margin: '2px'
                      }}
                    >
                      <i className="fas fa-credit-card me-2" style={{color: '#9c27b0'}}></i>
                      Payment Profiles
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" style={{borderColor: 'rgba(255,255,255,0.2)'}} /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout} style={{
                      color: 'white',
                      transition: 'all 0.3s ease',
                      borderRadius: '8px',
                      margin: '2px'
                    }}>
                      <i className="fas fa-sign-out-alt me-2" style={{color: '#ff4757'}}></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/auth/customer/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default CustomerNav;
