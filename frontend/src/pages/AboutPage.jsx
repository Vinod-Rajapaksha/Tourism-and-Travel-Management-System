import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Priya Fernando",
      role: "General Manager",
      image: "👩‍💼",
      description: "Oversees all operations and strategic planning with 12+ years of experience in Sri Lankan tourism industry."
    },
    {
      name: "Rajesh Perera",
      role: "Senior Travel Consultant",
      image: "👨‍💼",
      description: "Expert travel advisor specializing in Sri Lankan destinations, helping you plan the perfect island adventure."
    },
    {
      name: "Kumari Silva",
      role: "Customer Service Executive",
      image: "👩‍💻",
      description: "Dedicated to providing exceptional customer support and ensuring your travel experience is seamless and memorable."
    },
    {
      name: "Nimali Jayasuriya",
      role: "Marketing Manager",
      image: "👩‍📊",
      description: "Creative marketing professional promoting Sri Lanka's beauty and our amazing travel packages to the world."
    },
    {
      name: "Saman Kumara",
      role: "Tour Guide",
      image: "👨‍✈️",
      description: "Local expert and certified tour guide with deep knowledge of Sri Lankan culture, history, and hidden gems."
    }
  ];

  const values = [
    {
      icon: "fas fa-heart",
      title: "Passion for Travel",
      description: "We believe travel transforms lives and creates lasting memories."
    },
    {
      icon: "fas fa-handshake",
      title: "Trust & Reliability",
      description: "Your safety and satisfaction are our top priorities."
    },
    {
      icon: "fas fa-users",
      title: "Customer First",
      description: "Every decision we make is with our customers' best interests in mind."
    },
    {
      icon: "fas fa-globe",
      title: "Global Reach",
      description: "Connecting people with amazing destinations around the world."
    }
  ];

  return (
    <div className="about-page" style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '2px solid rgba(100, 181, 246, 0.3)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4">
              <Link to="/" style={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                textDecoration: 'none'
              }}>
                ✈️ TravelHub
              </Link>
            </div>
            <div className="col-md-8 text-end">
              <div className="d-flex gap-3 justify-content-end">
                <Link to="/" style={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}>
                  Home
                </Link>
                <Link to="/feedback" style={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}>
                  Feedback
                </Link>
                <Link to="/customer/packages" style={{
                  background: 'linear-gradient(135deg, #90caf9 0%, #64b5f6 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>
                  View Packages
                </Link>
                <Link to="/auth/customer/login" style={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="text-center">
            <h1 style={{
              background: 'linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '3.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem'
            }}>
              About TravelHub
            </h1>
            <p style={{
              color: '#333',
              fontSize: '1.3rem',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              We are passionate about creating unforgettable travel experiences that connect people 
              with the world's most amazing destinations.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section style={{ padding: '4rem 0', background: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 style={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem'
              }}>
                Our Story
              </h2>
              <p style={{ color: '#333', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Founded in 2020, TravelHub began with a simple mission: to make world-class travel 
                accessible to everyone. What started as a small team of travel enthusiasts has grown 
                into a trusted platform serving thousands of satisfied customers worldwide.
              </p>
              <p style={{ color: '#333', fontSize: '1.1rem', lineHeight: '1.6' }}>
                We believe that travel has the power to transform lives, broaden perspectives, 
                and create lasting memories. That's why we're committed to providing exceptional 
                service, carefully curated experiences, and unbeatable value.
              </p>
            </div>
            <div className="col-lg-6 text-center">
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '20px',
                padding: '3rem',
                boxShadow: '0 20px 40px rgba(100, 181, 246, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <i className="fas fa-history" style={{
                  fontSize: '5rem',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '1rem'
                }}></i>
                <h4 style={{ color: '#1976d2', fontWeight: 'bold' }}>
                  Since 2020
                </h4>
                <p style={{ color: '#666' }}>
                  Creating amazing travel experiences
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Our Values
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              The principles that guide everything we do
            </p>
          </div>
          <div className="row">
            {values.map((value, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '15px',
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)',
                  height: '100%'
                }}>
                  <i className={value.icon} style={{
                    fontSize: '3rem',
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem'
                  }}></i>
                  <h4 style={{ color: '#1976d2', fontWeight: 'bold', marginBottom: '1rem' }}>
                    {value.title}
                  </h4>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: '4rem 0', background: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Meet Our Team
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              The passionate people behind your amazing travel experiences
            </p>
          </div>
          <div className="row">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '15px',
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)',
                  height: '100%'
                }}>
                  <div style={{
                    fontSize: '4rem',
                    marginBottom: '1rem'
                  }}>
                    {member.image}
                  </div>
                  <h4 style={{ color: '#1976d2', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {member.name}
                  </h4>
                  <p style={{ color: '#666', fontWeight: '600', marginBottom: '1rem' }}>
                    {member.role}
                  </p>
                  <p style={{ color: '#333', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-3 col-md-6 mb-4">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)'
              }}>
                <h2 style={{ color: '#1976d2', fontWeight: 'bold', fontSize: '3rem' }}>10K+</h2>
                <p style={{ color: '#666', fontWeight: '600' }}>Happy Customers</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)'
              }}>
                <h2 style={{ color: '#1976d2', fontWeight: 'bold', fontSize: '3rem' }}>50+</h2>
                <p style={{ color: '#666', fontWeight: '600' }}>Destinations</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)'
              }}>
                <h2 style={{ color: '#1976d2', fontWeight: 'bold', fontSize: '3rem' }}>4.9</h2>
                <p style={{ color: '#666', fontWeight: '600' }}>Average Rating</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)'
              }}>
                <h2 style={{ color: '#1976d2', fontWeight: 'bold', fontSize: '3rem' }}>24/7</h2>
                <p style={{ color: '#666', fontWeight: '600' }}>Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '4rem 0', 
        background: 'rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Ready to Travel with Us?
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Join thousands of satisfied travelers and start your next adventure
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/customer/packages" style={{
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: '15px 30px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-eye me-2"></i>
              Browse Packages
            </Link>
            <Link to="/auth/customer/register" style={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: '15px 30px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-user-plus me-2"></i>
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'rgba(25, 118, 210, 0.1)',
        padding: '2rem 0',
        borderTop: '2px solid rgba(100, 181, 246, 0.3)'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5 style={{ color: '#1976d2', fontWeight: 'bold' }}>
                ✈️ TravelHub
              </h5>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Your trusted partner for unforgettable travel experiences.
              </p>
            </div>
            <div className="col-md-6 text-end">
              <div className="d-flex gap-3 justify-content-end">
                <Link to="/" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  Home
                </Link>
                <Link to="/feedback" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  Feedback
                </Link>
                <Link to="/auth/customer/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  Login
                </Link>
              </div>
            </div>
          </div>
          <hr style={{ borderColor: 'rgba(100, 181, 246, 0.3)' }} />
          <div className="text-center">
            <p style={{ color: '#666', margin: 0 }}>
              © 2024 TravelHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
