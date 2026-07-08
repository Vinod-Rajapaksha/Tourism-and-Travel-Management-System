import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

// Modern Avatar Component
const ProfileAvatar = ({ name, role }) => {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD';
  return (
    <div className="d-flex align-items-center gap-4 p-4 rounded-3 bg-light border mb-4">
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
        style={{ width: "80px", height: "80px", backgroundColor: "#2F80ED", fontSize: "28px" }}
      >
        {initials}
      </div>
      <div>
        <h4 className="fw-bold text-dark mb-1">{name || "Administrator"}</h4>
        <span className="badge bg-primary-soft text-primary px-3 py-1 rounded-pill fw-medium mb-2 d-inline-block">
          <i className="bi bi-shield-lock-fill me-1"></i> {role || "ADMIN"}
        </span>
        <p className="text-muted small mb-0">Authorized system administrator with account management privileges.</p>
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value, isPassword = false }) => (
  <div className="col-12 col-md-6 mb-4">
    <div className="p-3 rounded-3 bg-white border h-100 shadow-sm-hover transition-all">
      <div className="text-muted small text-uppercase fw-semibold mb-1 d-flex align-items-center gap-2">
        <i className={`${icon} text-primary`}></i> {label}
      </div>
      <div className="fs-6 fw-bold text-dark font-monospace">
        {isPassword ? "••••••••••••" : (value || "Not specified")}
      </div>
    </div>
  </div>
);

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Session Expired", "Please log in to view your profile.", "info").then(() => navigate("/login"));
      return;
    }

    api
      .get(`/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error("Error fetching profile:", err);
        Swal.fire("Error", "Could not load profile data.", "error");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleEdit = () => navigate("/edit-profile");

  const handleDelete = () => {
    Swal.fire({
      title: "Delete Account?",
      text: "Are you sure you want to permanently delete your administrator account? You cannot undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EB5757",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (!result.isConfirmed) return;

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      api
        .delete(`/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          Swal.fire("Deleted!", "Your profile has been deleted.", "success");
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          navigate("/login");
        })
        .catch(() => Swal.fire("Error!", "Failed to delete account. Please try again.", "error"));
    });
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="card modern-card border-0 shadow-sm p-5 text-center">
          <div className="spinner-border text-primary mx-auto mb-3" />
          <p className="text-muted">Loading profile information...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger rounded-3 shadow-sm">Could not find administrator profile details.</div>
      </div>
    );
  }

  const fName = profile.fName || profile.fname || profile.firstName || "";
  const lName = profile.lName || profile.lname || profile.lastName || "";
  const fullName = `${fName} ${lName}`.trim() || "Administrator";

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row align-items-center mb-4">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-primary-soft">
              <i className="fas fa-user-circle text-primary fa-lg"></i>
            </div>
            <div>
              <h1 className="h3 fw-bold text-dark mb-1">My Account Profile</h1>
              <p className="text-muted mb-0">View and manage your personal administrator details and system permissions</p>
            </div>
          </div>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary rounded-pill px-4 shadow-sm fw-medium d-flex align-items-center gap-2" onClick={handleEdit}>
            <i className="fas fa-edit"></i> Edit Profile
          </button>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-xl-9 col-lg-10">
          <div className="card modern-card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
              <h5 className="fw-bold text-dark mb-0">Identity & Credentials</h5>
            </div>
            <div className="card-body p-4">
              <ProfileAvatar name={fullName} role={profile.role} />

              <h6 className="fw-bold text-muted text-uppercase small mb-3">Personal & Contact Information</h6>
              <div className="row">
                <ProfileField icon="bi bi-person" label="First Name" value={fName} />
                <ProfileField icon="bi bi-person" label="Last Name" value={lName} />
                <ProfileField icon="bi bi-envelope" label="Email Address" value={profile.email} />
                <ProfileField icon="bi bi-telephone" label="Phone Number" value={profile.phone} />
                <ProfileField icon="bi bi-shield-check" label="Assigned System Role" value={profile.role || "ADMIN"} />
                <ProfileField icon="bi bi-key" label="Account Password" value="••••••••" isPassword={true} />
              </div>

              <hr className="my-4 text-muted opacity-25" />

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h6 className="fw-bold text-danger mb-1">Danger Zone</h6>
                  <p className="text-muted small mb-0">Permanently delete your account and revoke all access.</p>
                </div>
                <button className="btn btn-outline-danger rounded-pill px-4" onClick={handleDelete}>
                  <i className="fas fa-trash me-2"></i> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
