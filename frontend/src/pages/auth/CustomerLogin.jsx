import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import BigErrorAlert from "../../components/BigErrorAlert";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/customer/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/customer/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1.02); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1.02); }
          }
          
          @keyframes glow {
            0% { box-shadow: 0 30px 60px rgba(25, 118, 210, 0.4), 0 0 80px rgba(66, 165, 245, 0.3); }
            50% { box-shadow: 0 35px 70px rgba(25, 118, 210, 0.6), 0 0 100px rgba(66, 165, 245, 0.5); }
            100% { box-shadow: 0 30px 60px rgba(25, 118, 210, 0.4), 0 0 80px rgba(66, 165, 245, 0.3); }
          }
          
          .login-box {
            animation: glow 4s infinite;
          }
        `}
      </style>
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 25%, #64b5f6 50%, #90caf9 75%, #bbdefb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundAttachment: 'fixed'
      }}>
      <div className="w-full login-box" style={{
        maxWidth: '500px',
        background: 'rgba(255, 255, 255, 0.98)',
        border: '4px solid #1976d2',
        borderRadius: '25px',
        boxShadow: '0 30px 60px rgba(25, 118, 210, 0.4), 0 0 80px rgba(66, 165, 245, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(20px)',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
        transform: 'scale(1.02)',
        animation: 'pulse 3s infinite'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.1) 25%, rgba(100, 181, 246, 0.1) 50%, rgba(144, 202, 249, 0.1) 75%, rgba(187, 222, 251, 0.1) 100%)',
          borderRadius: '20px',
          zIndex: -1
        }}></div>
        
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 relative" style={{
            border: '6px solid transparent',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6, #90caf9, #bbdefb, #e3f2fd, #2196f3, #1e88e5) border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 15px 40px rgba(25, 118, 210, 0.4), 0 0 60px rgba(66, 165, 245, 0.5), 0 0 80px rgba(33, 150, 243, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite'
          }}>
            <i className="fas fa-user-circle text-4xl" style={{
              background: 'linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6, #90caf9)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}></i>
          </div>
          <h3 className="text-4xl font-bold mb-3" style={{
            background: 'linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6, #90caf9)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 3px 6px rgba(25, 118, 210, 0.4)',
            fontSize: '2.5rem'
          }}>
            🌟 Customer Login
          </h3>
          <p style={{ 
            color: '#1976d2', 
            opacity: 1, 
            fontWeight: '600', 
            fontSize: '1.1rem',
            textShadow: '0 1px 2px rgba(25, 118, 210, 0.2)'
          }}>
            Sign in to book your next Sri Lankan adventure
          </p>
        </div>

        {error && (
          <BigErrorAlert
            title="🚨 Login Failed!"
            message={error}
            type="error"
            onClose={() => setError("")}
            size="large"
            animation={true}
          />
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="text-center w-full">
            <label className="block mb-3" htmlFor="email" style={{
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '700',
              fontSize: '1.1rem'
            }}>
              📧 Email Address
            </label>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '3px solid rgba(25, 118, 210, 0.5)',
              borderRadius: '15px',
              padding: '1.2rem',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)'
            }}>
              <input
                id="email"
                type="email"
                className="w-full text-center"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#000000',
                  outline: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}
              />
            </div>
          </div>

          <div className="text-center w-full">
            <label className="block mb-3" htmlFor="password" style={{
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '700',
              fontSize: '1.1rem'
            }}>
              🔒 Password
            </label>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '3px solid rgba(25, 118, 210, 0.5)',
              borderRadius: '15px',
              padding: '1.2rem',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)'
            }}>
              <input
                id="password"
                type="password"
                className="w-full text-center"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#000000',
                  outline: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}
              />
            </div>
          </div>

          <div className="text-center">
                     <button
                       type="submit"
                       className="w-full py-5 font-semibold text-xl transition-all duration-300"
                       disabled={loading}
                       style={{
                         background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 25%, #64b5f6 50%, #90caf9 75%, #bbdefb 100%)',
                         border: '3px solid #1976d2',
                         color: '#ffffff',
                         borderRadius: '18px',
                         boxShadow: '0 12px 30px rgba(25, 118, 210, 0.4), 0 6px 15px rgba(66, 165, 245, 0.3)',
                         position: 'relative',
                         overflow: 'hidden',
                         fontWeight: '700',
                         fontSize: '1.2rem',
                         transform: 'scale(1.02)',
                         animation: 'pulse 2s infinite'
                       }}
                     >
              {loading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  🔄 Signing in...
                </span>
              ) : (
                "🚀 Sign In"
              )}
            </button>
          </div>
        </form>

                 <div className="text-center mt-8" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   <p style={{ color: '#000000', fontWeight: '500' }}>
                     Don't have an account?{" "}
                     <Link
                       to="/auth/customer/register"
                       style={{
                         background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                         backgroundClip: 'text',
                         WebkitBackgroundClip: 'text',
                         WebkitTextFillColor: 'transparent',
                         fontWeight: '600',
                         textDecoration: 'none',
                         transition: 'all 0.3s ease'
                       }}
                     >
                       ✨ Sign up
                     </Link>
                   </p>
                   <p>
                     <Link
                       to="/customer/packages"
                       style={{
                  color: '#000000',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                       }}
                     >
                       🌟 Continue as Guest
                     </Link>
                   </p>
                 </div>
      </div>
    </div>
    </>
  );
}