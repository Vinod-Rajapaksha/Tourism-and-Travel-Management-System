import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserProfileHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Add custom styles for SweetAlert2
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .swal2-popup-custom {
        border-radius: 20px !important;
        box-shadow: 0 20px 40px rgba(25, 118, 210, 0.3), 0 0 60px rgba(66, 165, 245, 0.2) !important;
        border: 3px solid rgba(25, 118, 210, 0.2) !important;
        backdrop-filter: blur(10px) !important;
      }
      
      .swal2-title-custom {
        font-size: 1.8rem !important;
        font-weight: bold !important;
        color: #1976d2 !important;
        margin-bottom: 1rem !important;
      }
      
      .swal2-content-custom {
        font-size: 1rem !important;
        line-height: 1.6 !important;
      }
      
      .swal2-confirm-custom {
        background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%) !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 12px 24px !important;
        font-size: 1rem !important;
        font-weight: bold !important;
        box-shadow: 0 8px 20px rgba(25, 118, 210, 0.4) !important;
        transition: all 0.3s ease !important;
        margin: 0 8px !important;
      }
      
      .swal2-confirm-custom:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 12px 25px rgba(25, 118, 210, 0.5) !important;
      }
      
      .swal2-cancel-custom {
        background: linear-gradient(135deg, #666 0%, #999 100%) !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 12px 24px !important;
        font-size: 1rem !important;
        font-weight: bold !important;
        box-shadow: 0 8px 20px rgba(102, 102, 102, 0.4) !important;
        transition: all 0.3s ease !important;
        margin: 0 8px !important;
      }
      
      .swal2-cancel-custom:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 12px 25px rgba(102, 102, 102, 0.5) !important;
      }
      
      .swal2-close {
        color: #1976d2 !important;
        font-size: 1.5rem !important;
        font-weight: bold !important;
        transition: all 0.3s ease !important;
      }
      
      .swal2-close:hover {
        color: #42a5f5 !important;
        transform: scale(1.1) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "🚪 Logout Confirmation",
      html: `
        <div style="
          background: linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.1) 100%);
          border: 2px solid rgba(25, 118, 210, 0.2);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          margin: 1rem 0;
        ">
          <div style="
            background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem auto;
            box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
            animation: pulse 2s infinite;
          ">
            <i class="fas fa-sign-out-alt" style="
              font-size: 2rem;
              color: white;
            "></i>
          </div>
          <h3 style="
            color: #1976d2;
            font-weight: bold;
            margin-bottom: 1rem;
            font-size: 1.5rem;
          ">Ready to Leave?</h3>
          <p style="
            color: #666;
            font-size: 1.1rem;
            line-height: 1.6;
            margin: 0;
          ">Are you sure you want to logout? You'll need to sign in again to access your account.</p>
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        </style>
      `,
      showCancelButton: true,
      confirmButtonText: "🚪 Yes, Logout",
      cancelButtonText: "❌ Cancel",
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#666",
      width: "500px",
      padding: "2rem",
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 248, 255, 0.95) 100%)",
      backdropFilter: "blur(10px)",
      customClass: {
        popup: "swal2-popup-custom",
        title: "swal2-title-custom",
        content: "swal2-content-custom",
        confirmButton: "swal2-confirm-custom",
        cancelButton: "swal2-cancel-custom"
      },
      buttonsStyling: true,
      showCloseButton: true,
      closeButtonHtml: '<i class="fas fa-times"></i>',
      allowOutsideClick: false,
      allowEscapeKey: true,
      focusConfirm: false,
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading state
        Swal.fire({
          title: "🔄 Logging out...",
          text: "Please wait while we sign you out",
          icon: "info",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Simulate logout process
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          
          Swal.fire({
            title: "✅ Successfully Logged Out!",
            html: `
              <div style="
                background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%);
                border: 2px solid rgba(76, 175, 80, 0.2);
                border-radius: 15px;
                padding: 2rem;
                text-align: center;
                margin: 1rem 0;
              ">
                <div style="
                  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
                  width: 80px;
                  height: 80px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 0 auto 1.5rem auto;
                  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
                  animation: bounce 0.6s ease-in-out;
                ">
                  <i class="fas fa-check" style="
                    font-size: 2rem;
                    color: white;
                  "></i>
                </div>
                <h3 style="
                  color: #4caf50;
                  font-weight: bold;
                  margin-bottom: 1rem;
                  font-size: 1.5rem;
                ">See You Soon!</h3>
                <p style="
                  color: #666;
                  font-size: 1.1rem;
                  line-height: 1.6;
                  margin: 0;
                ">You have been successfully logged out. Thank you for using our service!</p>
              </div>
              <style>
                @keyframes bounce {
                  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                  40% { transform: translateY(-10px); }
                  60% { transform: translateY(-5px); }
                }
              </style>
            `,
            icon: false,
            confirmButtonText: "🏠 Go to Home",
            confirmButtonColor: "#4caf50",
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
              popup: "swal2-popup-custom",
              confirmButton: "swal2-confirm-custom"
            }
          }).then(() => {
            navigate("/");
          });
        }, 1500);
      }
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.9) 25%, rgba(227, 242, 253, 0.9) 50%, rgba(187, 222, 251, 0.85) 75%, rgba(144, 202, 249, 0.9) 100%)',
      border: '2px solid rgba(100, 181, 246, 0.3)',
      borderRadius: '15px',
      padding: '1.5rem',
      margin: '1rem',
      boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2), 0 0 40px rgba(66, 165, 245, 0.1)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: '10px',
      zIndex: 1000
    }}>
      <div className="row align-items-center">
        <div className="col-md-8">
          <div className="d-flex align-items-center">
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(45deg, #90caf9, #64b5f6, #42a5f5, #2196f3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem',
              boxShadow: '0 5px 15px rgba(100, 181, 246, 0.3)'
            }}>
              <i className="fas fa-user text-white" style={{ fontSize: '1.5rem' }}></i>
            </div>
            <div>
              <h4 style={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                margin: '0',
                fontSize: '1.5rem'
              }}>
                Welcome back, {user.firstName}!
              </h4>
              <p style={{ 
                color: '#666', 
                margin: '0',
                fontSize: '0.9rem'
              }}>
                {user.email} • Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 text-end">
          <div className="d-flex gap-2 justify-content-end">
            <button
              onClick={() => navigate('/customer/profile')}
              style={{
                background: 'linear-gradient(135deg, #90caf9 0%, #64b5f6 50%, #42a5f5 100%)',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(100, 181, 246, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="fas fa-user me-1"></i>
              Profile
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 50%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(245, 87, 108, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="fas fa-sign-out-alt me-1"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
