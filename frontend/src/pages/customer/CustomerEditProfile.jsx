import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import CustomerNav from "../../components/CustomerNav";
import profileSvg from "../../assets/img/undraw_profile.svg";
import "../../assets/main.css";

const API_BASE = "http://localhost:8080";

const CustomerEditProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      if (!token) {
        await Swal.fire("Session expired", "Please log in again.", "info");
        navigate("/auth/customer/login", { replace: true });
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/api/customer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = res.data || {};
        setProfile(data);
        setFormData((prev) => ({
          ...prev,
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
        }));
      } catch (err) {
        if (axios.isCancel?.(err)) return;
        const status = err?.response?.status;
        console.error("Error fetching profile", err);
        if (status === 401 || status === 403) {
          await Swal.fire("Session expired", "Please log in again.", "info");
          localStorage.removeItem("token");
          navigate("/auth/customer/login", { replace: true });
          return;
        }
        await Swal.fire("Error", "Couldn't load your profile.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    return () => controller.abort();
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const e = {};

    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";

    if (!formData.email.trim()) {
      e.email = "Email is required";
    } else {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      if (!emailOk) e.email = "Enter a valid email";
    }

    if (formData.phone && formData.phone.trim().length < 7) {
      e.phone = "Phone looks too short";
    }

    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 8) e.password = "Min 8 characters";
      if (formData.password !== formData.confirmPassword)
        e.confirmPassword = "Passwords do not match";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
    };
    if (formData.password) payload.password = formData.password;

    try {
      setSaving(true);
      await axios.put(`${API_BASE}/api/customer/profile`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await Swal.fire("Saved", "Your profile was updated.", "success");
      navigate("/customer/profile", { replace: true });
    } catch (err) {
      console.error("Failed to update profile", err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        await Swal.fire("Session expired", "Please log in again.", "info");
        localStorage.removeItem("token");
        navigate("/auth/customer/login", { replace: true });
        return;
      }
      Swal.fire("Error", "Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/customer/profile");

  if (loading) {
    return (
      <>
        <CustomerNav />
        <div className="container mt-3 mb-3">
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
      </>
    );
  }

  return (
    <div className="profile-page">
      <CustomerNav />
      <div className="container mt-3 mb-3">
      <div className="profile-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="profile-img-wrapper">
            <img id="profilePicture" src={profileSvg} alt="Profile" className="profile-img" />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-5">
            <h3 className="m-0" style={{
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2rem',
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              ✨ Edit Profile
            </h3>
            <button type="submit" className="btn edit-btn" disabled={saving}>
              <i className="fas fa-save me-2" /> {saving ? "💾 Saving..." : "💾 Save Changes"}
            </button>
          </div>

          <div className="row">
            {/* First Name */}
            <div className="col-md-6 mb-3">
              <label className="form-label text-white" htmlFor="firstName">First Name</label>
              <div className={`profile-field ${errors.firstName ? "is-invalid" : ""}`}>
                <i className="fas fa-user me-2" aria-hidden="true"></i>
                <input
                  id="firstName"
                  type="text"
                  className="profile-field-2 form-control"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Your first name"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                />
              </div>
              {errors.firstName && (
                <small id="firstName-error" className="text-warning">{errors.firstName}</small>
              )}
            </div>

            {/* Last Name */}
            <div className="col-md-6 mb-3">
              <label className="form-label text-white" htmlFor="lastName">Last Name</label>
              <div className={`profile-field ${errors.lastName ? "is-invalid" : ""}`}>
                <i className="fas fa-user me-2" aria-hidden="true"></i>
                <input
                  id="lastName"
                  type="text"
                  className="profile-field-2 form-control"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Your last name"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                />
              </div>
              {errors.lastName && (
                <small id="lastName-error" className="text-warning">{errors.lastName}</small>
              )}
            </div>

            {/* Email */}
            <div className="col-md-6 mb-3">
              <label className="form-label text-white" htmlFor="email">Email</label>
              <div className={`profile-field ${errors.email ? "is-invalid" : ""}`}>
                <i className="fas fa-envelope me-2" aria-hidden="true"></i>
                <input
                  id="email"
                  type="email"
                  className="profile-field-2 form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <small id="email-error" className="text-warning">{errors.email}</small>
              )}
            </div>

            {/* Phone */}
            <div className="col-md-6 mb-3">
              <label className="form-label text-white" htmlFor="phone">Phone</label>
              <div className={`profile-field ${errors.phone ? "is-invalid" : ""}`}>
                <i className="fas fa-phone me-2" aria-hidden="true"></i>
                <input
                  id="phone"
                  type="tel"
                  className="profile-field-2 form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0771234567"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </div>
              {errors.phone && (
                <small id="phone-error" className="text-warning">{errors.phone}</small>
              )}
            </div>

            {/* Password */}
            <div className="col-md-6 mb-3">
              <label className="form-label text-white" htmlFor="password">New Password</label>
              <div className={`profile-field ${errors.password ? "is-invalid" : ""}`}>
                <i className="fas fa-lock me-2" aria-hidden="true"></i>
                <input
                  id="password"
                  type="password"
                  className="profile-field-2 form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters (leave blank to keep current)"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
              </div>
              {errors.password && (
                <small id="password-error" className="text-warning">{errors.password}</small>
              )}
            </div>

            {/* Confirm Password */}
            <div className="col-md-6 mb-3">
              <label className="form-label text-white" htmlFor="confirmPassword">Confirm Password</label>
              <div className={`profile-field ${errors.confirmPassword ? "is-invalid" : ""}`}>
                <i className="fas fa-lock me-2" aria-hidden="true"></i>
                <input
                  id="confirmPassword"
                  type="password"
                  className="profile-field-2 form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                />
              </div>
              {errors.confirmPassword && (
                <small id="confirm-error" className="text-warning">{errors.confirmPassword}</small>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button type="button" className="btn btn-outline-secondary" onClick={handleCancel} disabled={saving}>
              <i className="fas fa-times me-2" /> Cancel
            </button>
            <button type="submit" className="btn edit-btn" disabled={saving}>
              <i className="fas fa-save me-2" /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default CustomerEditProfile;
