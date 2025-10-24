import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";
import BigErrorAlert from "../../components/BigErrorAlert";

export default function CustomerRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    nic: "",
    gender: "MALE"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate all required fields
    if (!form.firstName.trim()) {
      setError("First Name is required! Please enter your first name.");
      return;
    }
    if (!form.lastName.trim()) {
      setError("Last Name is required! Please enter your last name.");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required! Please enter your email address.");
      return;
    }
    if (!form.phone.trim()) {
      setError("Phone number is required! Please enter your phone number.");
      return;
    }
    if (!form.nic.trim()) {
      setError("NIC is required! Please enter your NIC number.");
      return;
    }
    if (!form.password.trim()) {
      setError("Password is required! Please enter a password.");
      return;
    }
    if (!form.confirmPassword.trim()) {
      setError("Password confirmation is required! Please confirm your password.");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Invalid email format! Please enter a valid email address.");
      return;
    }
    
    // Validate password strength
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long! Please choose a stronger password.");
      return;
    }
    
    // Validate NIC format (Sri Lankan NIC)
    const nicRegex = /^[0-9]{9}[vVxX]|[0-9]{12}$/;
    if (!nicRegex.test(form.nic)) {
      setError("Invalid NIC format! Please enter a valid Sri Lankan NIC number (9 digits + V/X or 12 digits).");
      return;
    }
    
    // Validate phone format (Sri Lankan phone)
    const phoneRegex = /^(\+94|0)[0-9]{9}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("Invalid phone format! Please enter a valid Sri Lankan phone number (e.g., +94771234567 or 0771234567).");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match! Please make sure both password fields are identical.");
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await api.post("/auth/customer/register", {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        nic: form.nic,
        gender: form.gender
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Show success message and redirect to profile
      Swal.fire({
        title: "Account Created!",
        text: "Welcome! Let's set up your profile.",
        icon: "success",
        confirmButtonText: "View Profile"
      }).then(() => {
        navigate("/customer/profile");
      });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Registration failed! Please try again or contact support.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="w-full max-w-md" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.9) 25%, rgba(227, 242, 253, 0.9) 50%, rgba(187, 222, 251, 0.85) 75%, rgba(144, 202, 249, 0.9) 100%)',
        border: '2px solid rgba(100, 181, 246, 0.6)',
        borderRadius: '1rem',
        boxShadow: '0 20px 40px rgba(100, 181, 246, 0.4), 0 0 60px rgba(66, 165, 245, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(16px)',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(100, 181, 246, 0.05) 0%, rgba(66, 165, 245, 0.05) 25%, rgba(33, 150, 243, 0.05) 50%, rgba(30, 136, 229, 0.05) 75%, rgba(25, 118, 210, 0.05) 100%)',
          borderRadius: '1rem',
          zIndex: -1
        }}></div>
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 relative" style={{
            border: '4px solid transparent',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #90caf9, #64b5f6, #42a5f5, #2196f3, #1e88e5, #1976d2, #1565c0, #0d47a1) border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 10px 30px rgba(100, 181, 246, 0.3), 0 0 40px rgba(66, 165, 245, 0.4), 0 0 60px rgba(33, 150, 243, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="fas fa-user-plus text-3xl" style={{
              background: 'linear-gradient(45deg, #90caf9, #64b5f6, #42a5f5, #2196f3)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}></i>
          </div>
          <h3 className="text-3xl font-bold mb-2" style={{
            background: 'linear-gradient(45deg, #90caf9, #64b5f6, #42a5f5, #2196f3)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(100, 181, 246, 0.3)'
          }}>
            ✨ Create Account
          </h3>
          <p style={{ color: '#333333' }}>Join us for your next adventure</p>
        </div>

        {error && (
          <BigErrorAlert
            title="🚨 Registration Error!"
            message={error}
            type="error"
            onClose={() => setError("")}
            size="large"
            animation={true}
          />
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2" htmlFor="firstName" style={{
                color: '#1976d2',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                👤 First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="w-full px-3 py-2 rounded-lg"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => setForm({...form, firstName: e.target.value})}
                required
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '2px solid rgba(100, 181, 246, 0.5)',
                  color: '#333333',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label className="block mb-2" htmlFor="lastName" style={{
                color: '#1976d2',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                👤 Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="w-full px-3 py-2 rounded-lg"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => setForm({...form, lastName: e.target.value})}
                required
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '2px solid rgba(100, 181, 246, 0.5)',
                  color: '#333333',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2" htmlFor="email" style={{
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              📧 Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 rounded-lg"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              required
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2" htmlFor="phone" style={{
                color: '#1976d2',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                📱 Phone
              </label>
              <input
                id="phone"
                type="tel"
                className="w-full px-3 py-2 rounded-lg"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '2px solid rgba(100, 181, 246, 0.5)',
                  color: '#333333',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label className="block mb-2" htmlFor="nic" style={{
                color: '#1976d2',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                🆔 NIC
              </label>
              <input
                id="nic"
                type="text"
                className="w-full px-3 py-2 rounded-lg"
                placeholder="NIC number"
                value={form.nic}
                onChange={(e) => setForm({...form, nic: e.target.value})}
                required
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '2px solid rgba(100, 181, 246, 0.5)',
                  color: '#333333',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2" htmlFor="gender" style={{
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              ⚥ Gender
            </label>
            <select
              id="gender"
              className="w-full px-3 py-2 rounded-lg"
              value={form.gender}
              onChange={(e) => setForm({...form, gender: e.target.value})}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                outline: 'none'
              }}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-2" htmlFor="password" style={{
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              🔒 Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 rounded-lg"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              required
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label className="block mb-2" htmlFor="confirmPassword" style={{
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              🔒 Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-3 py-2 rounded-lg"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
              required
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 font-semibold text-lg transition-all duration-300"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #90caf9 0%, #64b5f6 25%, #42a5f5 50%, #2196f3 75%, #1e88e5 100%)',
                border: 'none',
                color: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 8px 20px rgba(100, 181, 246, 0.3), 0 4px 10px rgba(66, 165, 245, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  🔄 Creating Account...
                </span>
              ) : (
                "✨ Create Account"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-8">
          <p style={{ color: '#333333' }}>
            Already have an account?{" "}
            <Link
              to="/auth/customer/login"
              style={{
                color: '#1976d2',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              ✨ Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}