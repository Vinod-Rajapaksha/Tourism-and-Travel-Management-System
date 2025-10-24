import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const FeedbackPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    rating: 5,
    message: "",
    category: "general"
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      Swal.fire({
        title: "Thank You!",
        text: "Your feedback has been submitted successfully. We appreciate your input!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#1976d2"
      });
      setForm({
        name: "",
        email: "",
        subject: "",
        rating: 5,
        message: "",
        category: "general"
      });
      setSubmitting(false);
    }, 1500);
  };

  const categories = [
    { value: "general", label: "General Feedback" },
    { value: "booking", label: "Booking Experience" },
    { value: "service", label: "Customer Service" },
    { value: "website", label: "Website Experience" },
    { value: "suggestion", label: "Suggestion" },
    { value: "complaint", label: "Complaint" }
  ];

  return (
    <div className="feedback-page" style={{ 
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
              We Value Your Feedback
            </h1>
            <p style={{
              color: '#333',
              fontSize: '1.3rem',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Your opinion matters to us. Help us improve our services by sharing your thoughts, 
              suggestions, or experiences with TravelHub.
            </p>
          </div>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '3rem',
                boxShadow: '0 20px 40px rgba(100, 181, 246, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1rem',
                        marginBottom: '0.5rem',
                        display: 'block'
                      }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        required
                        style={{
                          border: '2px solid rgba(100, 181, 246, 0.3)',
                          borderRadius: '10px',
                          padding: '12px 15px',
                          fontSize: '1rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1rem',
                        marginBottom: '0.5rem',
                        display: 'block'
                      }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        required
                        style={{
                          border: '2px solid rgba(100, 181, 246, 0.3)',
                          borderRadius: '10px',
                          padding: '12px 15px',
                          fontSize: '1rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1rem',
                        marginBottom: '0.5rem',
                        display: 'block'
                      }}>
                        Category *
                      </label>
                      <select
                        className="form-control"
                        value={form.category}
                        onChange={(e) => setForm({...form, category: e.target.value})}
                        required
                        style={{
                          border: '2px solid rgba(100, 181, 246, 0.3)',
                          borderRadius: '10px',
                          padding: '12px 15px',
                          fontSize: '1rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1rem',
                        marginBottom: '0.5rem',
                        display: 'block'
                      }}>
                        Overall Rating *
                      </label>
                      <div className="d-flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setForm({...form, rating: star})}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '2rem',
                              color: star <= form.rating ? '#ffc107' : '#ddd',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="col-12 mb-4">
                      <label style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1rem',
                        marginBottom: '0.5rem',
                        display: 'block'
                      }}>
                        Subject *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.subject}
                        onChange={(e) => setForm({...form, subject: e.target.value})}
                        required
                        style={{
                          border: '2px solid rgba(100, 181, 246, 0.3)',
                          borderRadius: '10px',
                          padding: '12px 15px',
                          fontSize: '1rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                    <div className="col-12 mb-4">
                      <label style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1rem',
                        marginBottom: '0.5rem',
                        display: 'block'
                      }}>
                        Your Message *
                      </label>
                      <textarea
                        className="form-control"
                        rows="5"
                        value={form.message}
                        onChange={(e) => setForm({...form, message: e.target.value})}
                        required
                        placeholder="Please share your thoughts, suggestions, or experiences..."
                        style={{
                          border: '2px solid rgba(100, 181, 246, 0.3)',
                          borderRadius: '10px',
                          padding: '12px 15px',
                          fontSize: '1rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          transition: 'all 0.3s ease',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    <div className="col-12 text-center">
                      <button
                        type="submit"
                        disabled={submitting}
                        style={{
                          background: submitting ? 
                            'linear-gradient(135deg, #90a4ae 0%, #b0bec5 100%)' : 
                            'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '15px 40px',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          boxShadow: submitting ? 
                            '0 4px 10px rgba(144, 164, 174, 0.3)' : 
                            '0 8px 20px rgba(25, 118, 210, 0.3)',
                          transition: 'all 0.3s ease',
                          cursor: submitting ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {submitting ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Submit Feedback
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
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
              Other Ways to Reach Us
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              We're here to help and listen to your feedback
            </p>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)',
                height: '100%'
              }}>
                <i className="fas fa-envelope" style={{
                  fontSize: '3rem',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '1rem'
                }}></i>
                <h4 style={{ color: '#1976d2', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Email Us
                </h4>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                  Send us an email anytime
                </p>
                <p style={{ color: '#1976d2', fontWeight: '600' }}>
                  feedback@travelhub.com
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)',
                height: '100%'
              }}>
                <i className="fas fa-phone" style={{
                  fontSize: '3rem',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '1rem'
                }}></i>
                <h4 style={{ color: '#1976d2', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Call Us
                </h4>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                  Available 24/7 for your convenience
                </p>
                <p style={{ color: '#1976d2', fontWeight: '600' }}>
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(100, 181, 246, 0.2)',
                height: '100%'
              }}>
                <i className="fas fa-comments" style={{
                  fontSize: '3rem',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '1rem'
                }}></i>
                <h4 style={{ color: '#1976d2', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Live Chat
                </h4>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                  Chat with our support team
                </p>
                <p style={{ color: '#1976d2', fontWeight: '600' }}>
                  Available on our website
                </p>
              </div>
            </div>
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
                <Link to="/about" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  About
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

export default FeedbackPage;
