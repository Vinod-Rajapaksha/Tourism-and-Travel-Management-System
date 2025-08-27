import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/main.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const qs = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const success = qs.get("success");   
  const urlError = qs.get("error"); 

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(urlError || "");
  const [justRegistered, setJustRegistered] = useState(success === "registered");

  useEffect(() => {
    if (justRegistered) {
      const t = setTimeout(() => setJustRegistered(false), 4000);
      return () => clearTimeout(t);
    }
  }, [justRegistered]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form); 
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="background" aria-hidden="true" />

      <div className="container">
        <div className="content">
          {justRegistered && (
            <div id="popup-message" className="popup-success" role="status" aria-live="polite">
              🎉 Registration successful! You can now log in.
            </div>
          )}

          <h2 className="logo">
            <i className="fas fa-key" aria-hidden />Admin
          </h2>
          <div className="text-sci">
            <h2><span>Login Your Admin Account</span></h2>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>

        <div className="logreg-box">
          <div className="form-container active">
            <div className="form-box">
              
              <form className="user" style={{ marginTop: "2rem" }} onSubmit={onSubmit} noValidate>
                <h2>Welcome Back!</h2>

                <div className="input-box mt-5">
                  <input
                    type="email"
                    id="email-input"
                    name="email"
                    required
                    placeholder=" "
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    autoComplete="email"
                    aria-describedby="email-label"
                    autoFocus
                  />
                  <label id="email-label" htmlFor="email-input">Email</label>
                  <i className="icon fas fa-envelope" aria-hidden />
                </div>

                <div className="input-box mt-5">
                  <input
                    type={showPwd ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    placeholder=" "
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    autoComplete="current-password"
                    aria-describedby="password-label"
                  />
                  <label id="password-label" htmlFor="password">Password</label>

                  <i
                    className={`icon-right fas ${showPwd ? "fa-eye" : "fa-eye-slash"} password-toggle`}
                    id="show-password"
                    role="button"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    onClick={() => setShowPwd((s) => !s)}
                  />
                  <i className="icon fas fa-lock" aria-hidden />
                </div>

                <button type="submit" className="btn1 mt-5" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
