import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import CustomerNav from "../../components/CustomerNav";
import UserProfileHeader from "../../components/UserProfileHeader";
import BigErrorAlert from "../../components/BigErrorAlert";
import "../../assets/main.css";
import profileSvg from "../../assets/img/undraw_profile.svg";

const API_BASE = "http://localhost:8080";

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Session expired", "Please log in again.", "info").then(() =>
        navigate("/auth/customer/login")
      );
      return;
    }

    axios
      .get(`${API_BASE}/api/customer/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error("Error fetching profile", err);
        setError("Couldn't load your profile. Please try again or contact support.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleEdit = () => navigate("/customer/edit-profile");

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You can't undo this! Your account and all bookings will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete my account!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff4444",
    }).then((result) => {
      if (!result.isConfirmed) return;

      const token = localStorage.getItem("token");
      axios
        .delete(`${API_BASE}/api/customer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() =>
          Swal.fire("Deleted!", "Your account has been deleted.", "success")
        )
        .then(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/auth/customer/login");
        })
        .catch(() => Swal.fire("Error!", "Something went wrong.", "error"));
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <CustomerNav />
        <UserProfileHeader />
        <div className="container p-3" style={{ 
          backgroundColor: '#f8f9fa', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)',
          backgroundAttachment: 'fixed'
        }}>
          <div className="text-center py-5">
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              padding: '3rem',
              border: '2px solid rgba(66, 165, 245, 0.2)',
              boxShadow: '0 8px 25px rgba(66, 165, 245, 0.1)',
              display: 'inline-block'
            }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#1976d2', marginBottom: '1rem' }}></i>
              <p style={{ color: '#1976d2', fontWeight: '600', margin: 0, fontSize: '1.1rem' }}>
                Loading your profile...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CustomerNav />
        <UserProfileHeader />
        <div className="container p-3" style={{ 
          backgroundColor: '#f8f9fa', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)',
          backgroundAttachment: 'fixed'
        }}>
          <BigErrorAlert
            title="🚨 Profile Error!"
            message={error}
            type="error"
            onClose={() => setError("")}
            size="large"
            animation={true}
          />
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <CustomerNav />
        <UserProfileHeader />
        <div className="container p-3" style={{ 
          backgroundColor: '#f8f9fa', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)',
          backgroundAttachment: 'fixed'
        }}>
          <BigErrorAlert
            title="🚨 Profile Not Found!"
            message="Unable to load your profile information. Please try again or contact support."
            type="error"
            onClose={() => navigate("/customer/packages")}
            size="large"
            animation={true}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <CustomerNav />
      <UserProfileHeader />
      <div className="container p-3" style={{ 
        backgroundColor: '#f8f9fa', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="page-hero mb-4" style={{
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '15px',
          border: '2px solid #1976d2',
          boxShadow: '0 4px 15px rgba(25, 118, 210, 0.1)'
        }}>
          <h3 className="m-0" style={{ 
            color: '#1976d2', 
            fontWeight: 'bold', 
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            👤 My Profile
          </h3>
          <p className="m-0 mt-2" style={{ color: '#1976d2', opacity: 1, fontWeight: '500' }}>
            Manage your account information and preferences
          </p>
        </div>

        <div className="profile-card" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '2px solid rgba(25, 118, 210, 0.3)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 20px 40px rgba(25, 118, 210, 0.2), 0 0 60px rgba(66, 165, 245, 0.1)',
          marginBottom: '20px',
          backdropFilter: 'blur(10px)',
          minHeight: 'auto',
          height: 'auto',
          overflow: 'visible'
        }}>
        <div className="profile-img-wrapper">
          <img src={profileSvg} alt="Profile" className="profile-img" />
        </div>

        <div className="d-flex justify-content-between align-items-center mb-5" style={{
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.1) 50%, rgba(100, 181, 246, 0.1) 100%)',
          padding: '20px',
          borderRadius: '15px',
          border: '2px solid rgba(25, 118, 210, 0.3)',
          boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
          backdropFilter: 'blur(5px)'
        }}>
          <h3 className="m-0" style={{
            background: 'linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2rem',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(25, 118, 210, 0.3)'
          }}>
            🌟 Profile Information
          </h3>
          <button 
            className="btn edit-btn" 
            onClick={handleEdit}
            style={{ 
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #64b5f6 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4), 0 0 30px rgba(66, 165, 245, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-edit me-2" /> ✏️ Edit Profile
          </button>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="profile-info" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(25, 118, 210, 0.3)',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
              backdropFilter: 'blur(5px)'
            }}>
              <label style={{
                color: '#1976d2',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                marginBottom: '10px',
                display: 'block'
              }}>
                👤 First Name
              </label>
              <div className="profile-field" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                backdropFilter: 'blur(3px)'
              }}>
                <i className="fas fa-user me-3" aria-hidden="true" style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.2rem'
                }}></i>
                <span style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '600', 
                  fontSize: '1.1rem'
                }}>{profile.firstName}</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="profile-info" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(25, 118, 210, 0.3)',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
              backdropFilter: 'blur(5px)'
            }}>
              <label style={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold', 
                fontSize: '1.1rem', 
                marginBottom: '10px', 
                display: 'block'
              }}>👤 Last Name</label>
              <div className="profile-field" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                backdropFilter: 'blur(3px)'
              }}>
                <i className="fas fa-user me-3" aria-hidden="true" style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.2rem'
                }}></i>
                <span style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '600', 
                  fontSize: '1.1rem'
                }}>{profile.lastName}</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="profile-info" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(25, 118, 210, 0.3)',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
              backdropFilter: 'blur(5px)'
            }}>
              <label style={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold', 
                fontSize: '1.1rem', 
                marginBottom: '10px', 
                display: 'block'
              }}>📧 Email</label>
              <div className="profile-field" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                backdropFilter: 'blur(3px)'
              }}>
                <i className="fas fa-envelope me-3" aria-hidden="true" style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.2rem'
                }}></i>
                <span style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '600', 
                  fontSize: '1.1rem'
                }}>{profile.email}</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="profile-info" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(25, 118, 210, 0.3)',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
              backdropFilter: 'blur(5px)'
            }}>
              <label style={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold', 
                fontSize: '1.1rem', 
                marginBottom: '10px', 
                display: 'block'
              }}>📱 Phone</label>
              <div className="profile-field" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                backdropFilter: 'blur(3px)'
              }}>
                <i className="fas fa-phone me-3" aria-hidden="true" style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.2rem'
                }}></i>
                <span style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '600', 
                  fontSize: '1.1rem'
                }}>{profile.phone || "Not provided"}</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="profile-info" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(25, 118, 210, 0.3)',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
              backdropFilter: 'blur(5px)'
            }}>
              <label style={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold', 
                fontSize: '1.1rem', 
                marginBottom: '10px', 
                display: 'block'
              }}>🆔 NIC</label>
              <div className="profile-field" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                backdropFilter: 'blur(3px)'
              }}>
                <i className="fas fa-id-card me-3" aria-hidden="true" style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.2rem'
                }}></i>
                <span style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '600', 
                  fontSize: '1.1rem'
                }}>{profile.nic}</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="profile-info" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(25, 118, 210, 0.3)',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
              backdropFilter: 'blur(5px)'
            }}>
              <label style={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold', 
                fontSize: '1.1rem', 
                marginBottom: '10px', 
                display: 'block'
              }}>⚥ Gender</label>
              <div className="profile-field" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                backdropFilter: 'blur(3px)'
              }}>
                <i className="fas fa-venus-mars me-3" aria-hidden="true" style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.2rem'
                }}></i>
                <span style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '600', 
                  fontSize: '1.1rem'
                }}>{profile.gender}</span>
              </div>
            </div>
          </div>

          <div className="col-12 mb-4">
            <div className="profile-info" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(25, 118, 210, 0.3)',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
              backdropFilter: 'blur(5px)'
            }}>
              <label style={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold', 
                fontSize: '1.1rem', 
                marginBottom: '10px', 
                display: 'block'
              }}>📅 Member Since</label>
              <div className="profile-field" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                backdropFilter: 'blur(3px)'
              }}>
                <i className="fas fa-calendar me-3" aria-hidden="true" style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.2rem'
                }}></i>
                <span style={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '600', 
                  fontSize: '1.1rem'
                }}>{formatDate(profile.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button 
            className="btn btn-outline-primary" 
            onClick={() => navigate("/customer/packages")}
            style={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #64b5f6 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 'bold',
              boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4), 0 0 30px rgba(66, 165, 245, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-arrow-left me-2" /> Back to Packages
          </button>
          <button 
            className="btn btn-outline-info" 
            onClick={() => navigate("/customer/history")}
            style={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #64b5f6 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 'bold',
              boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4), 0 0 30px rgba(66, 165, 245, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-calendar-check me-2" /> View Bookings
          </button>
          <button 
            className="btn btn-outline-danger" 
            onClick={handleDelete}
            style={{
              background: 'linear-gradient(135deg, #f44336 0%, #e57373 50%, #ffcdd2 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 'bold',
              boxShadow: '0 8px 20px rgba(244, 67, 54, 0.4), 0 0 30px rgba(229, 115, 115, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-trash me-2" /> Delete Account
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default CustomerProfile;
