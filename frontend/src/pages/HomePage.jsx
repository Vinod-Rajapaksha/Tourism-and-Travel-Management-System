import React from "react";
import { useNavigate, Link } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "fas fa-mountain",
      title: "Sri Lankan Heritage",
      description: "Discover ancient temples, UNESCO World Heritage sites, and rich cultural experiences across the Pearl of the Indian Ocean."
    },
    {
      icon: "fas fa-shield-alt",
      title: "Safe & Secure",
      description: "Your safety is our priority with verified local guides, secure accommodations, and reliable transportation throughout Sri Lanka."
    },
    {
      icon: "fas fa-phone",
      title: "Local Support",
      description: "24/7 customer support with local expertise. Call us at +94 11 234 5678 for immediate assistance."
    },
    {
      icon: "fas fa-rupee-sign",
      title: "Best Value",
      description: "Affordable packages with authentic Sri Lankan experiences. Get the best deals for your island adventure."
    }
  ];

  const testimonials = [
    {
      name: "Priya Fernando",
      location: "Colombo, Sri Lanka",
      text: "Exceptional service! Our family tour to Kandy and Sigiriya was perfectly organized. The local guide was knowledgeable and friendly.",
      rating: 5
    },
    {
      name: "David Kumar",
      location: "Kandy, Sri Lanka",
      text: "Amazing experience exploring the hill country and tea plantations. The accommodation and transport were top-notch!",
      rating: 5
    },
    {
      name: "Nimali Perera",
      location: "Galle, Sri Lanka",
      text: "Perfect beach holiday in the south coast. Great value for money and excellent customer support throughout our stay.",
      rating: 5
    }
  ];

  return (
    <div className="home-page" style={{ 
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
              <h3 style={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                margin: 0
              }}>
                ✈️ TravelHub
              </h3>
            </div>
            <div className="col-md-8 text-end">
              <div className="d-flex gap-3 justify-content-end">
                <Link to="/about" style={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}>
                  About
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
                <button 
                  onClick={() => navigate('/customer/packages')}
                  style={{
                    background: 'linear-gradient(135deg, #90caf9 0%, #64b5f6 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  👀 Browse Packages
                </button>
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
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 style={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '3.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                lineHeight: '1.2'
              }}>
                Discover Sri Lanka's Hidden Gems
              </h1>
              <p style={{
                color: '#333',
                fontSize: '1.2rem',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>
                Experience the Pearl of the Indian Ocean like never before with our carefully crafted Sri Lankan tour packages. 
                From ancient temples to pristine beaches, from hill country to wildlife safaris, we make your Sri Lankan adventure unforgettable.
              </p>
              <div className="d-flex gap-3">
                <button 
                  onClick={() => navigate('/customer/packages')}
                  style={{
                    background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="fas fa-eye me-2"></i>
                  👀 Browse Packages
                </button>
                <Link 
                  to="/auth/customer/register"
                  style={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '15px 30px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="fas fa-user-plus me-2"></i>
                  Get Started
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '20px',
                padding: '3rem',
                boxShadow: '0 20px 40px rgba(100, 181, 246, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <i className="fas fa-globe-americas" style={{
                  fontSize: '8rem',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '1rem'
                }}></i>
                <h3 style={{ color: '#1976d2', fontWeight: 'bold' }}>
                  Explore Sri Lanka
                </h3>
                <p style={{ color: '#666' }}>
                  Your island adventure starts here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              Why Choose Us?
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              We provide exceptional Sri Lankan travel experiences with unmatched local expertise
            </p>
          </div>
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '15px',
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)',
                  transition: 'all 0.3s ease',
                  height: '100%'
                }}>
                  <i className={feature.icon} style={{
                    fontSize: '3rem',
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem'
                  }}></i>
                  <h4 style={{ color: '#1976d2', fontWeight: 'bold', marginBottom: '1rem' }}>
                    {feature.title}
                  </h4>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              What Our Customers Say
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Real experiences from real travelers
            </p>
          </div>
          <div className="row">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '15px',
                  padding: '2rem',
                  boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)',
                  height: '100%'
                }}>
                  <div className="mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star text-warning"></i>
                    ))}
                  </div>
                  <p style={{ color: '#333', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                    "{testimonial.text}"
                  </p>
                  <div>
                    <h6 style={{ color: '#1976d2', fontWeight: 'bold', margin: 0 }}>
                      {testimonial.name}
                    </h6>
                    <small style={{ color: '#666' }}>
                      {testimonial.location}
                    </small>
                  </div>
                </div>
              </div>
            ))}
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
            Ready to Start Your Journey?
          </h2>
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Join thousands of satisfied travelers and create unforgettable memories in beautiful Sri Lanka
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <button 
              onClick={() => navigate('/customer/packages')}
              style={{
                background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="fas fa-eye me-2"></i>
              👀 Browse Packages
            </button>
            <Link 
              to="/auth/customer/register"
              style={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                color: 'white',
                textDecoration: 'none',
                padding: '15px 30px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
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
                Your trusted partner for unforgettable Sri Lankan travel experiences.
              </p>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#1976d2', fontWeight: 'bold', margin: '0.5rem 0' }}>
                  📞 Contact Us:
                </p>
                <p style={{ color: '#666', margin: '0.25rem 0' }}>
                  Phone: +94 11 234 5678
                </p>
                <p style={{ color: '#666', margin: '0.25rem 0' }}>
                  Email: info@travelhub.lk
                </p>
                <p style={{ color: '#666', margin: '0.25rem 0' }}>
                  Address: 123 Galle Road, Colombo 03, Sri Lanka
                </p>
              </div>
            </div>
            <div className="col-md-6 text-end">
              <div className="d-flex gap-3 justify-content-end">
                <Link to="/about" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  About
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

export default HomePage;
