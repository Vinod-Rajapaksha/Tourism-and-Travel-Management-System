import React from "react";
import { useNavigate } from "react-router-dom";
import UserProfileHeader from "../../components/UserProfileHeader";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: "View Packages",
      description: "Browse available travel packages",
      icon: "fas fa-box",
      color: "linear-gradient(135deg, #90caf9 0%, #64b5f6 50%, #42a5f5 100%)",
      route: "/customer/packages"
    },
    {
      title: "My Bookings",
      description: "View your booking history",
      icon: "fas fa-calendar-check",
      color: "linear-gradient(135deg, #4caf50 0%, #66bb6a 50%, #81c784 100%)",
      route: "/customer/history"
    },
    {
      title: "My Profile",
      description: "Manage your profile information",
      icon: "fas fa-user",
      color: "linear-gradient(135deg, #ff9800 0%, #ffb74d 50%, #ffcc80 100%)",
      route: "/customer/profile"
    },
    {
      title: "Book Now",
      description: "Make a new booking",
      icon: "fas fa-plus-circle",
      color: "linear-gradient(135deg, #e91e63 0%, #f06292 50%, #f48fb1 100%)",
      route: "/customer/book"
    },
    {
      title: "Payment Profiles",
      description: "Manage your payment methods",
      icon: "fas fa-credit-card",
      color: "linear-gradient(135deg, #9c27b0 0%, #ba68c8 50%, #ce93d8 100%)",
      route: "/customer/payment-profiles"
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)',
      backgroundAttachment: 'fixed',
      paddingBottom: '2rem'
    }}>
      {/* Profile Header */}
      <UserProfileHeader />
      
      {/* Main Content */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Welcome Section */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid rgba(100, 181, 246, 0.3)',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <h1 style={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>
                🎯 Customer Dashboard
              </h1>
              <p style={{ 
                color: '#666', 
                fontSize: '1.1rem',
                marginBottom: '0'
              }}>
                Manage your travel bookings and explore new adventures
              </p>
            </div>

            {/* Dashboard Cards */}
            <div className="row">
              {dashboardCards.map((card, index) => (
                <div key={index} className="col-lg-6 col-md-6 mb-4">
                  <div 
                    onClick={() => navigate(card.route)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid rgba(100, 181, 246, 0.3)',
                      borderRadius: '15px',
                      padding: '2rem',
                      boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)',
                      backdropFilter: 'blur(10px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-5px)';
                      e.target.style.boxShadow = '0 15px 40px rgba(100, 181, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 10px 30px rgba(100, 181, 246, 0.2)';
                    }}
                  >
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: card.color,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                    }}>
                      <i className={`${card.icon} text-white`} style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h3 style={{
                      color: '#1976d2',
                      fontWeight: 'bold',
                      marginBottom: '1rem',
                      fontSize: '1.5rem'
                    }}>
                      {card.title}
                    </h3>
                    <p style={{
                      color: '#666',
                      fontSize: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      {card.description}
                    </p>
                    <div style={{
                      background: card.color,
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '25px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                    }}>
                      <i className="fas fa-arrow-right me-2"></i>
                      Explore
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats Section */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid rgba(100, 181, 246, 0.3)',
              borderRadius: '20px',
              padding: '2rem',
              marginTop: '2rem',
              boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{
                color: '#1976d2',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                🚀 Quick Actions
              </h3>
              <div className="row">
                <div className="col-md-4 text-center mb-3">
                  <button
                    onClick={() => navigate('/customer/packages')}
                    style={{
                      background: 'linear-gradient(135deg, #90caf9 0%, #64b5f6 100%)',
                      border: 'none',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 10px rgba(100, 181, 246, 0.3)',
                      transition: 'all 0.3s ease',
                      width: '100%'
                    }}
                  >
                    <i className="fas fa-search me-2"></i>
                    Browse Packages
                  </button>
                </div>
                <div className="col-md-4 text-center mb-3">
                  <button
                    onClick={() => navigate('/customer/history')}
                    style={{
                      background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                      border: 'none',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)',
                      transition: 'all 0.3s ease',
                      width: '100%'
                    }}
                  >
                    <i className="fas fa-history me-2"></i>
                    View History
                  </button>
                </div>
                <div className="col-md-4 text-center mb-3">
                  <button
                    onClick={() => navigate('/customer/profile')}
                    style={{
                      background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                      border: 'none',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 10px rgba(255, 152, 0, 0.3)',
                      transition: 'all 0.3s ease',
                      width: '100%'
                    }}
                  >
                    <i className="fas fa-cog me-2"></i>
                    Manage Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
