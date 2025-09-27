import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../../assets/admin.css"; 
import profileSvg from "../../assets/img/undraw_profile.svg"; 

const API_BASE = "http://localhost:8080";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Session expired", "Please log in again.", "info").then(() =>
        navigate("/login")
      );
      return;
    }

    axios
      .get(`${API_BASE}/api/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error("Error fetching profile", err);
        Swal.fire("Error", "Couldn't load your profile.", "error");
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
          navigate("/login");
        })
        .catch(() => Swal.fire("Error!", "Something went wrong.", "error"));
    });
  };

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

  const fName = profile.fname || profile.fname ;
  const lName = profile.lname || profile.lname ;

  return (
    <div className="container mt-5 mb-4">
      <div className="profile-card bg-gradient-primary">
        <div className="profile-img-wrapper">
          <img
            id="profilePicture"
            src={profileSvg}
            alt="Profile"
            className="profile-img"
          />
        </div>

        <div className="d-flex justify-content-between align-items-center mb-5">
          <h3 className="m-0 text-white">My Profile</h3>
          <button className="btn edit-btn" onClick={handleEdit}>
            <i className="fas fa-edit me-2"></i> Edit Profile
          </button>
        </div>

        <div className="row">
          <ProfileField icon="fas fa-user" label="First Name" value={fName} />
          <ProfileField icon="fas fa-user" label="Last Name" value={lName} />
          <ProfileField icon="fas fa-user-circle" label="Role" value={profile.role} />
          <ProfileField icon="fas fa-phone" label="Phone" value={profile.phone} />
          <ProfileField icon="fas fa-envelope" label="Email" value={profile.email} />
          <ProfileField icon="fas fa-lock" label="Password" type="password" name="password" value={profile.passwordMasked} />
        </div>

        <button className="btn btn-danger delete-btn mt-3" onClick={handleDelete}>
          <i className="fas fa-trash me-2"></i> Delete Profile
        </button>
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value }) => (
  <div className="col-md-4 mb-3">
    <label className="form-label text-white">{label}</label>
    <div className="profile-field">
      <i className={`${icon} me-2`}></i>
      <span>{value || "Not set"}</span>
    </div>
  </div>
);

export default AdminProfile;
