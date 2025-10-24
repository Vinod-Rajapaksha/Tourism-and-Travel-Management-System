import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerNav from "../../components/CustomerNav";

const API_BASE = "http://localhost:8080";

const ProfileDebug = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token ? "Present" : "Missing");
    
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    console.log("Fetching profile from:", `${API_BASE}/api/customer/profile`);
    
    axios
      .get(`${API_BASE}/api/customer/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Profile response:", res.data);
        setProfile(res.data);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        setError(err.response?.data || err.message || "Unknown error");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <CustomerNav />
        <div className="container mt-3">
          <div className="alert alert-info">Loading profile...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CustomerNav />
        <div className="container mt-3">
          <div className="alert alert-danger">
            <h4>Error Loading Profile</h4>
            <p>{error}</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate("/customer/packages")}
            >
              Go to Packages
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CustomerNav />
      <div className="container mt-3">
        <div className="card">
          <div className="card-header">
            <h3>Profile Debug Information</h3>
          </div>
          <div className="card-body">
            <h5>Raw Profile Data:</h5>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
            
            <h5>Profile Fields:</h5>
            <ul>
              <li>User ID: {profile?.userId}</li>
              <li>First Name: {profile?.firstName}</li>
              <li>Last Name: {profile?.lastName}</li>
              <li>Email: {profile?.email}</li>
              <li>Phone: {profile?.phone}</li>
              <li>NIC: {profile?.nic}</li>
              <li>Gender: {profile?.gender}</li>
              <li>Created At: {profile?.createdAt}</li>
            </ul>
            
            <button 
              className="btn btn-primary" 
              onClick={() => navigate("/customer/profile")}
            >
              Go to Real Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDebug;
