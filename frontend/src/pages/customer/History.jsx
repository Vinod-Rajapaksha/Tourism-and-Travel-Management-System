import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Swal from "sweetalert2";
import BigErrorAlert from "../../components/BigErrorAlert";
import CustomerNav from "../../components/CustomerNav";
import UserProfileHeader from "../../components/UserProfileHeader";

export default function History() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = useMemo(() => params.get("email") || "", [params]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please login to view your booking history",
        icon: "info",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#1976d2"
      }).then(() => {
        navigate("/auth/customer/login");
      });
      return;
    }

    async function load() {
      if (!email) return;
      setLoading(true);
      setErr("");
      try {
        const { data } = await api.get(`/customer/bookings`, { params: { email } });
        setItems(data || []);
      } catch (error) {
        console.error('History loading error:', error);
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        
        if (status === 401) {
          setErr("Authentication required. Please login first.");
        } else if (status === 403) {
          setErr("Access denied. Please check your permissions.");
        } else if (status === 404) {
          setErr("No bookings found for this email address.");
        } else {
          setErr(`Failed to load history: ${message || 'Unknown error'}`);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [email, navigate]);

  async function cancel(id) {
    try {
      await api.patch(`/customer/bookings/${id}/cancel`);
      const { data } = await api.get(`/customer/bookings`, { params: { email } });
      setItems(data || []);
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to cancel booking";
      alert(msg);
    }
  }

  async function remove(id) {
    try {
      await api.delete(`/customer/bookings/${id}`);
      const { data } = await api.get(`/customer/bookings`, { params: { email } });
      setItems(data || []);
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message || e?.message || "Delete failed";
      if (status === 409) {
        alert(msg || "Cannot delete booking due to related records. It was cancelled instead.");
        const { data } = await api.get(`/customer/bookings`, { params: { email } });
        setItems(data || []);
      } else if (status === 404) {
        alert("Booking not found. Reloading list.");
        const { data } = await api.get(`/customer/bookings`, { params: { email } });
        setItems(data || []);
      } else {
        alert(msg);
      }
    }
  }

  // Check if user is authenticated
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const isAuthenticated = token && user;

  return (
    <>
      <CustomerNav />
      {isAuthenticated && <UserProfileHeader />}
      <div className="container p-3" style={{ 
        backgroundColor: '#f8f9fa', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="page-hero mb-4" style={{
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '15px',
          border: '2px solid #1976d2',
          boxShadow: '0 4px 15px rgba(25, 118, 210, 0.1)'
        }}>
          <h3 className="m-0" style={{ 
            color: '#1976d2', 
            fontWeight: 'bold', 
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📋 Your Booking History
          </h3>
          <p className="m-0 mt-2" style={{ color: '#1976d2', opacity: 1, fontWeight: '500' }}>
            View and manage your travel bookings
          </p>
        </div>

        <div className="row">
          <div className="col-12">
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              padding: '2rem',
              border: '2px solid rgba(66, 165, 245, 0.2)',
              boxShadow: '0 8px 25px rgba(66, 165, 245, 0.1)',
              backdropFilter: 'blur(10px)',
              marginBottom: '2rem'
            }}>
              <h5 style={{
                color: '#1976d2',
                fontWeight: 'bold',
                marginBottom: '1rem',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🔍 Search Bookings
              </h5>
              <div className="input-group" style={{ maxWidth: '480px' }}>
                <input 
                  className="form-control" 
                  placeholder="Enter email address to search bookings" 
                  defaultValue={email} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') window.location.assign(`/customer/history?email=${encodeURIComponent(e.currentTarget.value)}`);
                  }}
                  style={{
                    border: '2px solid rgba(66, 165, 245, 0.3)',
                    borderRadius: '10px',
                    padding: '12px 15px',
                    fontSize: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.3s ease'
                  }}
                />
                <button 
                  className="btn" 
                  onClick={(e) => {
                    const inp = e.currentTarget.parentElement.querySelector('input');
                    window.location.assign(`/customer/history?email=${encodeURIComponent(inp.value)}`);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🔍 Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              padding: '3rem',
              border: '2px solid rgba(66, 165, 245, 0.2)',
              boxShadow: '0 8px 25px rgba(66, 165, 245, 0.1)',
              display: 'inline-block'
            }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#1976d2', marginBottom: '1rem' }}></i>
              <p style={{ color: '#1976d2', fontWeight: '600', margin: 0, fontSize: '1.1rem' }}>
                Loading your bookings...
              </p>
            </div>
          </div>
        )}

        {err && (
          <div className="mb-4">
            <BigErrorAlert
              title="🚨 Booking History Error!"
              message={err}
              type="error"
              onClose={() => setErr("")}
              size="large"
              animation={true}
            />
            {err.includes("Authentication required") && (
              <div className="text-center mt-3">
                <Link 
                  to="/auth/customer/login" 
                  style={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🔑 Login Now
                </Link>
              </div>
            )}
          </div>
        )}

        {!loading && !err && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '15px',
            padding: '2rem',
            border: '2px solid rgba(66, 165, 245, 0.2)',
            boxShadow: '0 8px 25px rgba(66, 165, 245, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            {items?.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(25, 118, 210, 0.1)' }}>
                      <th style={{ color: '#1976d2', fontWeight: 'bold', border: 'none' }}>ID</th>
                      <th style={{ color: '#1976d2', fontWeight: 'bold', border: 'none' }}>Confirmation</th>
                      <th style={{ color: '#1976d2', fontWeight: 'bold', border: 'none' }}>Package</th>
                      <th style={{ color: '#1976d2', fontWeight: 'bold', border: 'none' }}>Status</th>
                      <th style={{ color: '#1976d2', fontWeight: 'bold', border: 'none' }}>Start Date</th>
                      <th style={{ color: '#1976d2', fontWeight: 'bold', border: 'none' }}>End Date</th>
                      <th style={{ color: '#1976d2', fontWeight: 'bold', border: 'none' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r) => (
                      <tr key={r.reservationID} style={{ borderBottom: '1px solid rgba(66, 165, 245, 0.1)' }}>
                        <td style={{ color: '#333', fontWeight: '500' }}>{r.reservationID}</td>
                        <td>
                          <span style={{
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                            color: '#ffffff',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
                          }}>
                            {r.confirmationNumber || 'N/A'}
                          </span>
                        </td>
                        <td style={{ color: '#333', fontWeight: '500' }}>
                          {r.Packages?.title || r.package?.title || r.packageID}
                        </td>
                        <td>
                          <span style={{
                            background: r.status === 'CONFIRMED' 
                              ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
                              : r.status === 'CANCELLED' 
                              ? 'linear-gradient(135deg, #f44336 0%, #e57373 100%)'
                              : 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                            color: '#ffffff',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                          }}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ color: '#333', fontWeight: '500' }}>{r.startDate}</td>
                        <td style={{ color: '#333', fontWeight: '500' }}>{r.endDate}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm" 
                              onClick={() => cancel(r.reservationID)}
                              style={{
                                background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.5rem 1rem',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.4)';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(255, 152, 0, 0.3)';
                              }}
                            >
                              🚫 Cancel
                            </button>
                            <button 
                              className="btn btn-sm" 
                              onClick={() => remove(r.reservationID)}
                              style={{
                                background: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.5rem 1rem',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(244, 67, 54, 0.4)';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(244, 67, 54, 0.3)';
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '15px',
                  padding: '3rem',
                  border: '2px solid rgba(66, 165, 245, 0.2)',
                  boxShadow: '0 8px 25px rgba(66, 165, 245, 0.1)',
                  display: 'inline-block'
                }}>
                  <i className="fas fa-calendar-times" style={{ fontSize: '3rem', color: '#1976d2', marginBottom: '1rem' }}></i>
                  <h5 style={{ color: '#1976d2', fontWeight: 'bold', marginBottom: '1rem' }}>
                    📋 No Bookings Found
                  </h5>
                  <p style={{ color: '#666', marginBottom: '2rem' }}>
                    You don't have any bookings yet. Start exploring our amazing Sri Lankan tour packages!
                  </p>
                  <Link 
                    to="/customer/packages" 
                    style={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🌟 Browse Packages
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}


