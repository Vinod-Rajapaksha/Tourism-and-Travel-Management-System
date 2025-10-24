import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/main.css";
import profileSvg from "../../assets/img/undraw_profile.svg";

const AdminProfileFallback = () => {
  const navigate = useNavigate();

  // Mock profile data for testing
  const mockProfile = {
    fName: "John",
    lName: "Doe",
    role: "ADMIN",
    email: "admin@example.com",
    phone: "+1234567890",
    createdAt: new Date().toISOString()
  };

  const handleEdit = () => navigate("/edit-profile");
  const handleBackToLogin = () => navigate("/auth/customer/login");

  return (
    <div className="container mt-5 mb-4" style={{ minHeight: '100vh' }}>
      <div className="alert alert-warning mb-4" style={{
        backgroundColor: '#e3f2fd',
        border: '2px solid #1976d2',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(25,118,210,0.1)'
      }}>
        <h4 style={{ color: '#1976d2', fontWeight: 'bold' }}>⚠️ Backend Not Available</h4>
        <p style={{ color: '#1976d2', marginBottom: '15px' }}>This is a fallback profile view. The backend server is not running.</p>
        <button 
          className="btn btn-primary me-2" 
          onClick={() => window.location.reload()}
          style={{ 
            backgroundColor: '#1976d2', 
            border: 'none', 
            padding: '10px 20px',
            borderRadius: '5px',
            fontWeight: 'bold',
            color: '#ffffff'
          }}
        >
          🔄 Retry Connection
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={handleBackToLogin}
          style={{ 
            backgroundColor: '#64b5f6', 
            border: 'none', 
            padding: '10px 20px',
            borderRadius: '5px',
            fontWeight: 'bold',
            color: '#ffffff'
          }}
        >
          🔙 Back to Login
        </button>
      </div>

      <div className="profile-card" style={{
        backgroundColor: '#ffffff',
        border: '2px solid #1976d2',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 8px 25px rgba(25,118,210,0.15)',
        marginBottom: '20px'
      }}>
        <div className="profile-img-wrapper">
          <img
            id="profilePicture"
            src={profileSvg}
            alt="Profile"
            className="profile-img"
          />
        </div>

        <div className="d-flex justify-content-between align-items-center mb-5" style={{
          backgroundColor: '#e3f2fd',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #1976d2'
        }}>
          <h3 className="m-0" style={{ 
            color: '#1976d2', 
            fontWeight: 'bold',
            fontSize: '2rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>My Profile (Demo Mode)</h3>
          <button 
            className="btn edit-btn" 
            onClick={handleEdit} 
            style={{ 
              backgroundColor: '#1976d2',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 4px 8px rgba(25,118,210,0.3)'
            }}
          >
            <i className="fas fa-edit me-2"></i> Edit Profile
          </button>
        </div>

        <div className="row">
          <ProfileField icon="fas fa-user" label="First Name" value={mockProfile.fName} />
          <ProfileField icon="fas fa-user" label="Last Name" value={mockProfile.lName} />
          <ProfileField icon="fas fa-user-circle" label="Role" value={mockProfile.role} />
          <ProfileField icon="fas fa-phone" label="Phone" value={mockProfile.phone} />
          <ProfileField icon="fas fa-envelope" label="Email" value={mockProfile.email} />
          <ProfileField icon="fas fa-lock" label="Password" value="••••••••" />
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button 
            className="btn btn-outline-primary" 
            onClick={() => navigate("/customer/packages")}
            style={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              border: '2px solid #1976d2',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            <i className="fas fa-arrow-left me-2" /> Back to Dashboard
          </button>
          <div>
            <button 
              className="btn btn-outline-danger me-2" 
              onClick={() => alert("Delete functionality requires backend connection")}
              style={{
                backgroundColor: '#ffebee',
                color: '#d32f2f',
                border: '2px solid #d32f2f',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              <i className="fas fa-trash me-2"></i> Delete Profile
            </button>
            <button 
              className="btn btn-outline-info" 
              onClick={() => navigate("/customer/profile-debug")}
              style={{
                backgroundColor: '#e1f5fe',
                color: '#0277bd',
                border: '2px solid #0277bd',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              <i className="fas fa-bug me-2"></i> Debug Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value }) => (
  <div className="col-md-4 mb-4">
    <div style={{
      backgroundColor: '#e3f2fd',
      border: '2px solid #1976d2',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(25,118,210,0.1)',
      transition: 'all 0.3s ease'
    }}>
      <label className="form-label" style={{ 
        color: '#1976d2', 
        fontWeight: 'bold',
        fontSize: '1.1rem',
        marginBottom: '10px',
        display: 'block'
      }}>{label}</label>
      <div className="profile-field" style={{ 
        color: '#1976d2',
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#ffffff',
        borderRadius: '5px',
        border: '1px solid #1976d2'
      }}>
        <i className={`${icon} me-3`} style={{ 
          color: '#1976d2', 
          fontSize: '1.2rem',
          width: '20px'
        }}></i>
        <span style={{ 
          color: '#1976d2', 
          fontWeight: '600',
          fontSize: '1.1rem'
        }}>{value || "Not set"}</span>
      </div>
    </div>
  </div>
);

export default AdminProfileFallback;
