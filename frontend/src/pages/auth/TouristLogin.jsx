import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginTourist } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import GlassAuthLayout from "../../components/common/GlassAuthLayout";

const TouristLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginTourist({ email, password });
      await loginWithToken(res.token);
      Swal.fire({
        icon: "success",
        title: `Welcome back, ${res.firstName}!`,
        text: "You are now logged into your tourist portal.",
        timer: 2000,
        showConfirmButton: false,
        background: "#ffffff",
        customClass: { popup: "rounded-4 shadow" },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Tourist login error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(msg);
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: msg,
        confirmButtonColor: "#0d6efd",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassAuthLayout
      title="Tourist Login"
      subtitle="Sign in to manage your bookings and custom travel itineraries"
      badgeText="Tourist Portal"
      badgeIcon="bi-person-check-fill"
      bgImage="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
      cardMaxWidth="900px"
      sideTitle="Your Island Gateway"
      sideSubtitle="Experience personalized itineraries, luxury transport, and unforgettable island adventures in Sri Lanka."
      sideHighlights={[
        "Instant tour & luxury hotel bookings",
        "24/7 dedicated travel advisor support",
        "Custom bespoke holiday planning",
      ]}
      sideIconColor="text-primary"
      badgeStyle={{
        background: "rgba(13, 110, 253, 0.15)",
        color: "#0d6efd",
        border: "1px solid rgba(13, 110, 253, 0.35)",
      }}
      footerContent={
        <p className="mb-0">
          Don't have a tourist account yet?{" "}
          <Link
            to="/register"
            className="fw-bold text-primary text-decoration-none ms-1 hover-scale d-inline-block"
          >
            Create Free Account <i className="bi bi-arrow-right small"></i>
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

      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label small fw-semibold text-dark mb-1">
            Email Address
          </label>
          <div
            className="d-flex align-items-center rounded-3 overflow-hidden shadow-sm px-3 py-2 transition-all"
            style={{
              background: "rgba(255, 255, 255, 0.65)",
              border: "1px solid rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(12px)",
              minHeight: "46px",
            }}
          >
            <span className="px-2 text-dark text-opacity-75 me-1">
              <i className="bi bi-envelope-fill"></i>
            </span>
            <input
              type="email"
              className="form-control border-0 bg-transparent shadow-none py-1 px-1 text-dark fs-6"
              style={{ boxShadow: "none", outline: "none" }}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label small fw-semibold text-dark mb-0">
              Password
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                Swal.fire({
                  title: "Password Recovery",
                  text: "Please contact support@ceylonatravels.com to securely reset your credentials.",
                  icon: "info",
                  confirmButtonColor: "#0d6efd",
                  customClass: { popup: "rounded-4 shadow" },
                });
              }}
              className="small fw-semibold text-primary text-decoration-none"
            >
              Forgot Password?
            </a>
          </div>
          <div
            className="d-flex align-items-center rounded-3 overflow-hidden shadow-sm px-3 py-2 transition-all"
            style={{
              background: "rgba(255, 255, 255, 0.65)",
              border: "1px solid rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(12px)",
              minHeight: "46px",
            }}
          >
            <span className="px-2 text-dark text-opacity-75 me-1">
              <i className="bi bi-lock-fill"></i>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control border-0 bg-transparent shadow-none py-1 px-1 text-dark fs-6"
              style={{ boxShadow: "none", outline: "none" }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn border-0 bg-transparent shadow-none px-2 text-dark text-opacity-75 hover-scale"
              style={{
                border: "none",
                background: "transparent",
                boxShadow: "none",
              }}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
              title={showPassword ? "Hide password" : "Show password"}
            >
              <i
                className={`bi ${showPassword ? "bi-eye-slash-fill text-primary" : "bi-eye"}`}
              ></i>
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center my-3">
          <div
            className="d-flex align-items-center justify-content-center me-3 flex-shrink-0"
            style={{ width: "22px", height: "22px" }}
          >
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="cursor-pointer shadow-none m-0"
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "5px",
                cursor: "pointer",
                accentColor: "#0d6efd",
              }}
            />
          </div>
          <label
            className="small text-dark text-opacity-85 cursor-pointer user-select-none mb-0 fw-medium ms-1"
            htmlFor="rememberMe"
            style={{
              fontSize: "0.92rem",
              cursor: "pointer",
            }}
          >
            Keep me signed in on this device
          </label>
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
              Authenticating...
            </span>
          ) : (
            <>
              <span>Sign In to Portal</span>
              <i className="bi bi-arrow-right-short fs-4"></i>
            </>
          )}
        </button>
      </form>
    </GlassAuthLayout>
  );
};

export default TouristLogin;
