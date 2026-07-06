import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerTourist } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import GlassAuthLayout from "../../components/common/GlassAuthLayout";

const TouristRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "MALE",
    nic: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number (7-15 digits).");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await registerTourist({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        gender: formData.gender,
        nic: formData.nic.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      if (res && res.token) {
        await loginWithToken(res.token);
      }

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: `Welcome aboard, ${formData.firstName}! You are now ready to book unforgettable tours.`,
        timer: 2500,
        showConfirmButton: false,
        background: "#ffffff",
        customClass: { popup: "rounded-4 shadow" },
      });

      navigate("/packages");
    } catch (err) {
      console.error("Tourist registration error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Registration failed. Please try again.";
      setError(msg);
      Swal.fire({
        icon: "error",
        title: "Registration Error",
        text: msg,
        confirmButtonColor: "#0d6efd",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassAuthLayout
      title="Create Tourist Account"
      subtitle="Register to start booking tours and bespoke travel packages"
      badgeText="Tourist Registration"
      badgeIcon="bi-person-plus-fill"
      bgImage="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=80"
      cardMaxWidth="1080px"
      sideTitle="Begin Your Island Journey"
      sideSubtitle="Unlock exclusive member travel rates, customized day-to-day itineraries, and verified luxury transport."
      sideHighlights={[
        "Access 50+ curated Sri Lanka holiday packages",
        "Manage bookings & custom travel requests in real-time",
        "Free cancellation & flexible itinerary changes",
      ]}
      sideIconColor="text-primary"
      badgeStyle={{
        background: "rgba(13, 110, 253, 0.15)",
        color: "#0d6efd",
        border: "1px solid rgba(13, 110, 253, 0.35)",
      }}
      footerContent={
        <p className="mb-0">
          Already have a tourist account?{" "}
          <Link
            to="/login"
            className="fw-bold text-primary text-decoration-none ms-1 hover-scale d-inline-block"
          >
            Sign In <i className="bi bi-arrow-right small"></i>
          </Link>
        </p>
      }
    >
      {error && (
        <div
          className="alert alert-danger d-flex align-items-center rounded-4 small py-2 px-3 mb-4 border-0 shadow-sm"
          role="alert"
          style={{ background: "#fef2f2", color: "#991b1b" }}
        >
          <i className="bi bi-exclamation-triangle-fill me-2 fs-6 text-danger"></i>
          <div className="flex-grow-1">{error}</div>
          <button
            type="button"
            className="btn-close btn-close-sm ms-2"
            onClick={() => setError("")}
            aria-label="Close"
          ></button>
        </div>
      )}

      <form onSubmit={handleRegister} className="d-flex flex-column gap-3">
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-dark mb-1">
              First Name *
            </label>
            <div
              className="d-flex align-items-center rounded-3 overflow-hidden shadow-sm px-3 py-1.5 transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                minHeight: "44px",
              }}
            >
              <span className="px-2 text-dark text-opacity-75 me-1">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                type="text"
                name="firstName"
                className="form-control border-0 bg-transparent shadow-none py-1 px-1 text-dark small"
                style={{ boxShadow: "none", outline: "none" }}
                placeholder="e.g. Kasun"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-dark mb-1">
              Last Name *
            </label>
            <div
              className="d-flex align-items-center rounded-3 overflow-hidden shadow-sm px-3 py-1.5 transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                minHeight: "44px",
              }}
            >
              <span className="px-2 text-dark text-opacity-75 me-1">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                type="text"
                name="lastName"
                className="form-control border-0 bg-transparent shadow-none py-1 px-1 text-dark small"
                style={{ boxShadow: "none", outline: "none" }}
                placeholder="e.g. Perera"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-dark mb-1">
              Gender *
            </label>
            <div
              className="d-flex align-items-center rounded-3 overflow-hidden shadow-sm px-3 py-1.5 transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                minHeight: "44px",
              }}
            >
              <span className="px-2 text-dark text-opacity-75 me-1">
                <i className="bi bi-gender-ambiguous"></i>
              </span>
              <select
                name="gender"
                className="form-select border-0 bg-transparent shadow-none py-1 px-1 text-dark small cursor-pointer"
                style={{
                  boxShadow: "none",
                  outline: "none",
                  paddingLeft: "4px",
                }}
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-dark mb-1">
              NIC / Passport Number *
            </label>
            <div
              className="d-flex align-items-center rounded-3 overflow-hidden shadow-sm px-3 py-1.5 transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                minHeight: "44px",
              }}
            >
              <span className="px-2 text-dark text-opacity-75 me-1">
                <i className="bi bi-card-heading"></i>
              </span>
              <input
                type="text"
                name="nic"
                className="form-control border-0 bg-transparent shadow-none py-1 px-1 text-dark small"
                style={{ boxShadow: "none", outline: "none" }}
                placeholder="983123456V / Passport"
                value={formData.nic}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-dark mb-1">
              Email Address *
            </label>
            <div
              className="d-flex align-items-center rounded-3 overflow-hidden shadow-sm px-3 py-1.5 transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                minHeight: "44px",
              }}
            >
              <span className="px-2 text-dark text-opacity-75 me-1">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                name="email"
                className="form-control border-0 bg-transparent shadow-none py-1 px-1 text-dark small"
                style={{ boxShadow: "none", outline: "none" }}
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-dark mb-1">
              Phone Number *
            </label>
            <div
              className="d-flex align-items-center rounded-3 overflow-hidden shadow-sm px-3 py-1.5 transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                minHeight: "44px",
              }}
            >
              <span className="px-2 text-dark text-opacity-75 me-1">
                <i className="bi bi-telephone-fill"></i>
              </span>
              <input
                type="tel"
                name="phone"
                className="form-control border-0 bg-transparent shadow-none py-1 px-1 text-dark small"
                style={{ boxShadow: "none", outline: "none" }}
                placeholder="0771234567"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-dark mb-1">
              Password (min. 8 chars) *
            </label>
            <div
              className="d-flex align-items-center rounded-3 overflow-hidden shadow-sm px-3 py-1.5 transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                minHeight: "44px",
              }}
            >
              <span className="px-2 text-dark text-opacity-75 me-1">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control border-0 bg-transparent shadow-none py-1 px-1 text-dark small"
                style={{ boxShadow: "none", outline: "none" }}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn border-0 bg-transparent shadow-none px-2 text-dark text-opacity-75 hover-scale"
                style={{ border: "none", background: "transparent", boxShadow: "none" }}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash-fill text-primary" : "bi-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-dark mb-1">
              Confirm Password *
            </label>
            <div
              className="d-flex align-items-center rounded-3 overflow-hidden shadow-sm px-3 py-1.5 transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                minHeight: "44px",
              }}
            >
              <span className="px-2 text-dark text-opacity-75 me-1">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="form-control border-0 bg-transparent shadow-none py-1 px-1 text-dark small"
                style={{ boxShadow: "none", outline: "none" }}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn border-0 bg-transparent shadow-none px-2 text-dark text-opacity-75 hover-scale"
                style={{ border: "none", background: "transparent", boxShadow: "none" }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                <i
                  className={`bi ${showConfirmPassword ? "bi-eye-slash-fill text-primary" : "bi-eye"}`}
                ></i>
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2 mt-2 border-0 hover-scale"
          style={{
            background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
          }}
        >
          {loading ? (
            <span className="d-flex align-items-center gap-2">
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              ></span>{" "}
              Creating Account...
            </span>
          ) : (
            <>
              <span>Create Tourist Account</span>
              <i className="bi bi-arrow-right-short fs-4"></i>
            </>
          )}
        </button>
      </form>
    </GlassAuthLayout>
  );
};

export default TouristRegister;
