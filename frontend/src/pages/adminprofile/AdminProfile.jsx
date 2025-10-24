import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../../assets/main.css"; 
import profileSvg from "../../assets/img/undraw_profile.svg";
import AdminProfileFallback from "./AdminProfileFallback"; 

const API_BASE = "http://localhost:8080";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
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
      .get(`${API_BASE}/api/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Admin profile response:", res.data);
        setProfile(res.data);
      })
      .catch((err) => {
        console.error("Error fetching admin profile", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          Swal.fire("Session expired", "Please log in again.", "info").then(() => {
            localStorage.removeItem("token");
            navigate("/auth/customer/login");
          });
        } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
          console.log("Backend not available, using fallback");
          setUseFallback(true);
        } else {
          Swal.fire("Error", "Couldn't load your profile.", "error");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleEdit = () => navigate("/edit-profile");

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You can't undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff4444",
    }).then((result) => {
      if (!result.isConfirmed) return;

      axios
        .delete(`${API_BASE}/api/admin/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() =>
          Swal.fire("Deleted!", "Your profile has been deleted.", "success")
        )
        .then(() => {
          localStorage.removeItem("token");
          navigate("/auth/customer/login");
        })
        .catch(() => Swal.fire("Error!", "Something went wrong.", "error"));
    });
  };

  if (useFallback) {
    return <AdminProfileFallback />;
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="profile-card skeleton">
          <div className="skeleton-bar w-25 mb-4"></div>
          <div className="row">
            {[...Array(6)].map((_, i) => (
              <div className="col-md-4 mb-3" key={i}>
                <div className="skeleton-field" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">No profile data found.</div>
      </div>
    );
  }

  const fName = profile.fName || profile.fname || "Not set";
  const lName = profile.lName || profile.lname || "Not set";

  return (
    <div className="container mt-5 mb-4" style={{ minHeight: '100vh' }}>
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
          }}>My Profile</h3>
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
          <ProfileField icon="fas fa-user" label="First Name" value={fName} />
          <ProfileField icon="fas fa-user" label="Last Name" value={lName} />
          <ProfileField icon="fas fa-user-circle" label="Role" value={profile.role} />
          <ProfileField icon="fas fa-phone" label="Phone" value={profile.phone} />
          <ProfileField icon="fas fa-envelope" label="Email" value={profile.email} />
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
          <button 
            className="btn btn-outline-danger" 
            onClick={handleDelete}
            style={{
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              border: '2px solid #d32f2f',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            <i className="fas fa-trash me-2" /> Delete Profile
          </button>
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

export default AdminProfile;
