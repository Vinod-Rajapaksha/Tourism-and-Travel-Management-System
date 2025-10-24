import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import profileSvg from "../../assets/img/undraw_profile.svg";
import "../../assets/admin.css";

const API_BASE = "http://localhost:8080";

const EditProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("token"), []);

  // Enhanced validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[-\s]/g, ''));
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      if (!token) {
        await Swal.fire("Session expired", "Please log in again.", "info");
        navigate("/login", { replace: true });
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/api/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = res.data || {};
        setProfile(data);
        setFormData((prev) => ({
          ...prev,
          fname: data.fname ?? data.firstName ?? "",
          lname: data.lname ?? data.lastName ?? "",
          phone: data.phone ?? data.mobile ?? "",
          email: data.email ?? "",
        }));
      } catch (err) {
        if (axios.isCancel?.(err)) return;
        const status = err?.response?.status;
        console.error("Error fetching profile", err);
        if (status === 401 || status === 403) {
          await Swal.fire("Session expired", "Please log in again.", "info");
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // First Name validation - enhanced
    if (!formData.fname.trim()) {
      newErrors.fname = "First name is required";
    } else if (formData.fname.trim().length < 2) {
      newErrors.fname = "First name must be at least 2 characters";
    } else if (formData.fname.trim().length > 50) {
      newErrors.fname = "First name cannot exceed 50 characters";
    }

    // Last Name validation - enhanced
    if (!formData.lname.trim()) {
      newErrors.lname = "Last name is required";
    } else if (formData.lname.trim().length < 2) {
      newErrors.lname = "Last name must be at least 2 characters";
    } else if (formData.lname.trim().length > 50) {
      newErrors.lname = "Last name cannot exceed 50 characters";
    }

    // Email validation - enhanced
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation - enhanced
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Password validation - enhanced
    if (formData.password || formData.confirmPassword) {
      if (!formData.password) {
        newErrors.password = "Password is required when confirming password";
      } else if (!validatePassword(formData.password)) {
        newErrors.password = "Password must be at least 8 characters long";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      fname: formData.fname.trim(),
      lname: formData.lname.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
    };
    if (formData.password) payload.password = formData.password;

    try {
      setSaving(true);
      await axios.put(`${API_BASE}/api/admin/profile`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await Swal.fire("Saved", "Your profile was updated successfully!", "success");
      navigate("/profile", { replace: true });
    } catch (err) {
      console.error("Failed to update profile", err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        await Swal.fire("Session expired", "Please log in again.", "info");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      const errorMessage = err?.response?.data?.message || "Failed to update profile. Please try again.";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/profile");

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

  return (
    <div className="container mt-5">
      <div className="profile-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="profile-img-wrapper">
            <img id="profilePicture" src={profileSvg} alt="Profile" className="profile-img" />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-5">
            <h3 className="m-0">Edit Profile</h3>
            <button type="submit" className="btn edit-btn" disabled={saving}>
              <i className="fas fa-save me-2" /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="row">
            {/* First Name */}
            <div className="col-md-4 mb-3">
              <label className="form-label text-white" htmlFor="fname">First Name *</label>
              <div className={`profile-field ${errors.fname ? "is-invalid" : ""}`}>
                <i className="fas fa-user me-2" aria-hidden="true"></i>
                <input
                  id="fname"
                  type="text"
                  className="profile-field-2 form-control"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  placeholder="Your first name (2-50 characters)"
                  aria-invalid={!!errors.fname}
                  aria-describedby={errors.fname ? "fname-error" : undefined}
                  maxLength={50}
                />
              </div>
              {errors.fname && (
                <small id="fname-error" className="text-warning">{errors.fname}</small>
              )}
            </div>

            {/* Last Name */}
            <div className="col-md-4 mb-3">
              <label className="form-label text-white" htmlFor="lname">Last Name *</label>
              <div className={`profile-field ${errors.lname ? "is-invalid" : ""}`}>
                <i className="fas fa-user me-2" aria-hidden="true"></i>
                <input
                  id="lname"
                  type="text"
                  className="profile-field-2 form-control"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  placeholder="Your last name (2-50 characters)"
                  aria-invalid={!!errors.lname}
                  aria-describedby={errors.lname ? "lname-error" : undefined}
                  maxLength={50}
                />
              </div>
              {errors.lname && (
                <small id="lname-error" className="text-warning">{errors.lname}</small>
              )}
            </div>

            {/* Phone */}
            <div className="col-md-4 mb-3">
              <label className="form-label text-white" htmlFor="phone">Phone *</label>
              <div className={`profile-field ${errors.phone ? "is-invalid" : ""}`}>
                <i className="fas fa-phone me-2" aria-hidden="true"></i>
                <input
                  id="phone"
                  type="tel"
                  className="profile-field-2 form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  maxLength={10}
                />
              </div>
              {errors.phone && (
                <small id="phone-error" className="text-warning">{errors.phone}</small>
              )}
            </div>

            {/* Email */}
            <div className="col-md-4 mb-3">
              <label className="form-label text-white" htmlFor="email">Email *</label>
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
                  maxLength={100}
                />
              </div>
              {errors.email && (
                <small id="email-error" className="text-warning">{errors.email}</small>
              )}
            </div>

            {/* Password*/}
            <div className="col-md-4 mb-3">
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
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  minLength={8}
                />
              </div>
              {errors.password && (
                <small id="password-error" className="text-warning">{errors.password}</small>
              )}
            </div>

            {/* Confirm Password */}
            <div className="col-md-4 mb-3">
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
                  minLength={8}
                />
              </div>
              {errors.confirmPassword && (
                <small id="confirm-error" className="text-warning">{errors.confirmPassword}</small>
              )}
            </div>
          </div>
            <button type="button" className="btn btn-danger delete-btn" onClick={handleCancel} disabled={saving}>
              Cancel
            </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;