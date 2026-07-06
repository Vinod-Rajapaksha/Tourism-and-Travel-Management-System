import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginGuide } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import GlassAuthLayout from "../../components/common/GlassAuthLayout";

const GuideLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginGuide({ email, password });
      await loginWithToken(res.token);
      Swal.fire({
        icon: "success",
        title: `Welcome back, Guide ${res.firstName}!`,
        text: "Accessing your assigned tours & schedule.",
        timer: 2000,
        showConfirmButton: false,
        background: "#ffffff",
        customClass: { popup: "rounded-4 shadow" },
      });
      navigate("/guide/dashboard");
    } catch (err) {
      console.error("Guide login error:", err);
      const data = err.response?.data;

      // Check if status is PENDING
      if (err.response?.status === 403 && data?.status === "PENDING") {
        Swal.fire({
          icon: "info",
          title: "Application Under Review",
          text:
            data.message ||
            "Your account is currently waiting for approval by the General Manager.",
          confirmButtonColor: "#0f766e",
        });
        navigate("/guide/waiting-approval", {
          state: {
            email: data.email || email,
            firstName: data.firstName || "Tour Guide",
            lastName: data.lastName || "",
          },
        });
        return;
      }

      const msg =
        data?.message ||
        data?.error ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(msg);
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: msg,
        confirmButtonColor: "#0f766e",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassAuthLayout
      title="Guide Login"
      subtitle="Sign in to view your assigned tours and itinerary schedules"
      badgeText="Guide Portal"
      badgeIcon="bi-person-badge-fill"
      bgImage="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1920&q=80"
      cardMaxWidth="900px"
      sideTitle="Certified Guide Network"
      sideSubtitle="Join our professional guide network, coordinate live tour schedules, and deliver memorable travel experiences."
      sideHighlights={[
        "Real-time assigned itinerary notifications",
        "Direct communication with tour coordinators",
        "Verified professional guide profile & ratings",
      ]}
      sideIconColor="#0f766e"
      badgeStyle={{
        background: "rgba(15, 118, 110, 0.12)",
        color: "#0f766e",
        border: "1px solid rgba(15, 118, 110, 0.3)",
      }}
      footerContent={
        <p className="mb-0">
          Want to become a certified tour guide?{" "}
          <Link
            to="/guide/register"
            className="fw-bold text-decoration-none ms-1 hover-scale d-inline-block"
            style={{ color: "#0f766e" }}
          >
            Apply Now <i className="bi bi-arrow-right small"></i>
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
            Guide Email Address
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
              placeholder="guide@tourism.com"
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
                Swal.fire(
                  "Info",
                  "Please contact the General Manager to reset guide credentials.",
                  "info"
                );
              }}
              className="small fw-semibold text-decoration-none"
              style={{ color: "#0f766e" }}
            >
              Forgot?
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
              style={{ border: "none", background: "transparent", boxShadow: "none" }}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
              title={showPassword ? "Hide password" : "Show password"}
            >
              <i
                className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye"}`}
                style={showPassword ? { color: "#0f766e" } : {}}
              ></i>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn w-100 py-3 rounded-4 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2 mt-3 border-0 hover-scale text-white"
          style={{
            background: "linear-gradient(135deg, #0f766e 0%, #115e59 100%)",
          }}
        >
          {loading ? (
            <span className="d-flex align-items-center gap-2">
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              ></span>{" "}
              Verifying Credentials...
            </span>
          ) : (
            <>
              <span>Sign In to Guide Dashboard</span>
              <i className="bi bi-box-arrow-in-right fs-4"></i>
            </>
          )}
        </button>
      </form>
    </GlassAuthLayout>
  );
};

export default GuideLogin;
