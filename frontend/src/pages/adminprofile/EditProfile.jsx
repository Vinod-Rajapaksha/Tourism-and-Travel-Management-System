import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE = "http://localhost:8080";

export default function EditProfile() {
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
  const token = useMemo(() => localStorage.getItem("token") || sessionStorage.getItem("token"), []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      if (!token) {
        await Swal.fire("Session Expired", "Please log in again.", "info");
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
          await Swal.fire("Session Expired", "Please log in again.", "info");
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }
        await Swal.fire("Error", "Could not load your profile.", "error");
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fname.trim()) newErrors.fname = "First name is required";
    else if (formData.fname.trim().length < 2) newErrors.fname = "First name must be at least 2 characters";

    if (!formData.lname.trim()) newErrors.lname = "Last name is required";
    else if (formData.lname.trim().length < 2) newErrors.lname = "Last name must be at least 2 characters";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[-\s]/g, ""))) newErrors.phone = "Must be a valid 10-digit number";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address format";

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        fname: formData.fname.trim(),
        lname: formData.lname.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      };
      if (formData.password) payload.password = formData.password;

      await axios.put(`${API_BASE}/api/admin/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await Swal.fire("Updated!", "Your profile information has been saved successfully.", "success");
      navigate("/admin-profile");
    } catch (err) {
      console.error("Error saving profile:", err);
      const msg = err.response?.data?.message || "Failed to update profile.";
      Swal.fire("Save Failed", msg, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="card modern-card border-0 shadow-sm p-5 text-center">
          <div className="spinner-border text-primary mx-auto mb-3" />
          <p className="text-muted">Loading profile editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row align-items-center mb-4">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-primary-soft">
              <i className="fas fa-user-edit text-primary fa-lg"></i>
            </div>
            <div>
              <h1 className="h3 fw-bold text-dark mb-1">Edit Account Profile</h1>
              <p className="text-muted mb-0">Update your personal contact details and account security credentials</p>
            </div>
          </div>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate("/admin-profile")} disabled={saving}>
            <i className="fas fa-arrow-left me-2"></i> Back to Profile
          </button>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-xl-8 col-lg-10">
          <div className="card modern-card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-dark mb-0">Profile Information Form</h5>
              <span className="text-muted small">* Indicates required field</span>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">First Name *</label>
                    <input
                      type="text"
                      className={`form-control modern-input ${errors.fname ? "is-invalid" : ""}`}
                      name="fname"
                      value={formData.fname}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                    {errors.fname && <div className="invalid-feedback">{errors.fname}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Last Name *</label>
                    <input
                      type="text"
                      className={`form-control modern-input ${errors.lname ? "is-invalid" : ""}`}
                      name="lname"
                      value={formData.lname}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                    {errors.lname && <div className="invalid-feedback">{errors.lname}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Email Address *</label>
                    <input
                      type="email"
                      className={`form-control modern-input ${errors.email ? "is-invalid" : ""}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Phone Number *</label>
                    <input
                      type="tel"
                      className={`form-control modern-input ${errors.phone ? "is-invalid" : ""}`}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit number"
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                </div>

                <hr className="my-4 text-muted opacity-25" />

                <h6 className="fw-bold text-dark mb-1">Change Account Password</h6>
                <p className="text-muted small mb-3">Leave blank if you do not wish to change your current password.</p>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">New Password</label>
                    <input
                      type="password"
                      className={`form-control modern-input ${errors.password ? "is-invalid" : ""}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 8 characters"
                      autoComplete="new-password"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Confirm New Password</label>
                    <input
                      type="password"
                      className={`form-control modern-input ${errors.confirmPassword ? "is-invalid" : ""}`}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat new password"
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate("/admin-profile")} disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm fw-medium" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2" /> Saving...</> : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}