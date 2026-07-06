import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import './TouristDashboard.css';

const TouristDashboard = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const userId = user?.userID || user?.clientID || user?.id || 1;
      let myRes = [];
      
      try {
        const historyRes = await api.get(`/reservations/history/${userId}`);
        const data = historyRes.data;
        myRes = Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);
      } catch (ignored) {}

      if (myRes.length === 0) {
        try {
          const res = await api.get('/reservations');
          const allRes = Array.isArray(res.data) ? res.data : [];
          myRes = allRes.filter(r => 
            r.client?.email?.toLowerCase() === user?.email?.toLowerCase() ||
            r.clientEmail?.toLowerCase() === user?.email?.toLowerCase()
          );
        } catch (ignored) {}
      }
      setReservations(myRes);

      // Check wishlist count from localStorage
      const storageKey = `ceylona_vip_wishlist_${userId}`;
      const savedWish = localStorage.getItem(storageKey);
      if (savedWish) {
        try {
          const arr = JSON.parse(savedWish);
          setWishlistCount(Array.isArray(arr) ? arr.length : 0);
        } catch (e) {
          setWishlistCount(0);
        }
      } else {
        setWishlistCount(0);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActiveReservations = () => {
    return reservations.filter(r => {
      const st = (r.status || r.reservationStatus || 'PENDING').toUpperCase();
      return st === 'CONFIRMED' || st === 'ACTIVE' || st === 'PENDING';
    });
  };

  const handleDownloadTicket = (resItem) => {
    try {
      const doc = new jsPDF();
      const pkgTitle = resItem.packageTitle || resItem.packages?.title || 'Sri Lanka Tour Package';
      const orderId = resItem.reservationID || Math.floor(1000 + Math.random() * 9000);
      const date = resItem.reservationDate || resItem.startDate || 'TBA';
      const guests = resItem.numAdults || resItem.guestCount || 2;
      const price = resItem.totalPrice ? Number(resItem.totalPrice).toLocaleString() : '145,000';

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 45, 'F');
      doc.setTextColor(245, 158, 11);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('CEYLONA TRAVELS', 105, 20, { align: 'center' });
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text('OFFICIAL TOUR VOUCHER & RECEIPT', 105, 30, { align: 'center' });

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.text(`Booking Reference: #${orderId}`, 20, 65);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Lead Traveler: ${user?.firstName || 'Traveler'} ${user?.lastName || ''}`, 20, 80);
      doc.text(`Tour Package: ${pkgTitle}`, 20, 92);
      doc.text(`Travel Date: ${date}`, 20, 104);
      doc.text(`Number of Guests: ${guests} Travelers`, 20, 116);
      doc.text(`Total Amount: LKR ${price}`, 20, 128);

      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(0.5);
      doc.rect(15, 55, 180, 100);

      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('STATUS: CONFIRMED', 105, 180, { align: 'center' });

      doc.save(`Ceylona_Ticket_${orderId}.pdf`);
      Swal.fire({
        icon: 'success',
        title: 'Voucher Downloaded!',
        text: `Your booking voucher #${orderId} has been downloaded.`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (e) {
      console.error('PDF generation failed:', e);
      Swal.fire('Error', 'Could not generate PDF receipt.', 'error');
    }
  };

  const activeTrips = getActiveReservations();
  const completedTrips = reservations.filter(r => (r.status || r.reservationStatus || '').toUpperCase() === 'COMPLETED');

  return (
    <div className="tourist-dashboard-container container py-4">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner p-4 p-md-5 mb-5 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <h1 className="fw-bold text-white mb-2">
              Welcome back, <span className="text-warning">{user?.firstName || user?.email || 'Traveler'}</span>!
            </h1>
            <p className="text-white-50 mb-4 font-size-md">
              Manage your upcoming tour reservations, explore our catalog of Sri Lankan travel packages, or update your personal account settings.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/packages" className="btn btn-warning rounded-pill px-4 py-2 fw-bold text-dark d-flex align-items-center gap-2">
                <i className="bi bi-compass-fill"></i> Explore Tour Catalog
              </Link>
              <Link to="/tourist/bookings" className="btn btn-outline-light rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2">
                <i className="bi bi-calendar-check"></i> View My Bookings
              </Link>
            </div>
          </div>
          <div className="col-lg-4 text-center d-none d-lg-block">
            <div className="d-inline-flex align-items-center justify-content-center bg-white bg-opacity-10 rounded-circle p-4" style={{ width: '120px', height: '120px' }}>
              <i className="bi bi-globe-asia-australia text-warning" style={{ fontSize: '3.5rem' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="row g-4 mb-5">
        <div className="col-lg-3 col-md-6">
          <div className="p-4 rounded-4 shadow-sm h-100 d-flex align-items-center gap-3" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary">
              <i className="bi bi-calendar2-check fs-3"></i>
            </div>
            <div>
              <span className="text-white-50 small d-block">Active Bookings</span>
              <h2 className="fw-bold text-white mb-0">{activeTrips.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="p-4 rounded-4 shadow-sm h-100 d-flex align-items-center gap-3" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="p-3 rounded-3 bg-success bg-opacity-10 text-success">
              <i className="bi bi-check2-circle fs-3"></i>
            </div>
            <div>
              <span className="text-white-50 small d-block">Completed Tours</span>
              <h2 className="fw-bold text-white mb-0">{completedTrips.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="p-4 rounded-4 shadow-sm h-100 d-flex align-items-center gap-3" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="p-3 rounded-3 bg-danger bg-opacity-10 text-danger">
              <i className="bi bi-heart fs-3"></i>
            </div>
            <div>
              <span className="text-white-50 small d-block">Saved Wishlist</span>
              <h2 className="fw-bold text-white mb-0">{wishlistCount}</h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="p-4 rounded-4 shadow-sm h-100 d-flex align-items-center gap-3" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="p-3 rounded-3 bg-warning bg-opacity-10 text-warning">
              <i className="bi bi-collection fs-3"></i>
            </div>
            <div>
              <span className="text-white-50 small d-block">Total Bookings</span>
              <h2 className="fw-bold text-white mb-0">{reservations.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Hub */}
      <h4 className="fw-bold text-white mb-4"><i className="bi bi-grid text-warning me-2"></i>Quick Navigation</h4>
      <div className="row g-4 mb-5">
        <div className="col-lg-3 col-md-6">
          <Link to="/packages" className="d-block p-4 rounded-4 text-decoration-none transition-all h-100 hover-border-warning" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="d-inline-flex p-3 rounded-3 bg-warning text-dark mb-3"><i className="bi bi-compass fs-4"></i></div>
            <h5 className="fw-bold text-white mb-2">Tour Catalog</h5>
            <p className="text-white-50 small mb-3">Explore our curated Sri Lankan travel packages and itineraries.</p>
            <span className="text-warning small fw-semibold">Browse Packages <i className="bi bi-arrow-right ms-1"></i></span>
          </Link>
        </div>

        <div className="col-lg-3 col-md-6">
          <Link to="/tourist/bookings" className="d-block p-4 rounded-4 text-decoration-none transition-all h-100 hover-border-warning" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="d-inline-flex p-3 rounded-3 bg-success text-white mb-3"><i className="bi bi-calendar-check fs-4"></i></div>
            <h5 className="fw-bold text-white mb-2">My Bookings</h5>
            <p className="text-white-50 small mb-3">View reservation status, download tickets, or reschedule dates.</p>
            <span className="text-success small fw-semibold">Manage Trips <i className="bi bi-arrow-right ms-1"></i></span>
          </Link>
        </div>

        <div className="col-lg-3 col-md-6">
          <Link to="/tourist/wishlist" className="d-block p-4 rounded-4 text-decoration-none transition-all h-100 hover-border-warning" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="d-inline-flex p-3 rounded-3 bg-danger text-white mb-3"><i className="bi bi-heart fs-4"></i></div>
            <h5 className="fw-bold text-white mb-2">Wishlist</h5>
            <p className="text-white-50 small mb-3">Compare your saved tour packages and view package details.</p>
            <span className="text-danger small fw-semibold">View Wishlist <i className="bi bi-arrow-right ms-1"></i></span>
          </Link>
        </div>

        <div className="col-lg-3 col-md-6">
          <Link to="/tourist/profile" className="d-block p-4 rounded-4 text-decoration-none transition-all h-100 hover-border-warning" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="d-inline-flex p-3 rounded-3 bg-info text-dark mb-3"><i className="bi bi-person fs-4"></i></div>
            <h5 className="fw-bold text-white mb-2">Account Profile</h5>
            <p className="text-white-50 small mb-3">Update your contact details, security settings, and travel notes.</p>
            <span className="text-info small fw-semibold">Edit Profile <i className="bi bi-arrow-right ms-1"></i></span>
          </Link>
        </div>
      </div>

      {/* Recent Trips Section */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="fw-bold text-white mb-0"><i className="bi bi-clock-history text-success me-2"></i>Active & Upcoming Tours</h4>
        <Link to="/tourist/bookings" className="btn btn-outline-light btn-sm rounded-pill px-3 fw-semibold">
          View All Bookings <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="mt-3 text-white-50">Loading booking records...</p>
        </div>
      ) : activeTrips.length === 0 ? (
        <div className="text-center py-5 rounded-4 p-5 mb-5" style={{ background: '#1e293b', border: '1px dashed rgba(255, 255, 255, 0.15)' }}>
          <i className="bi bi-calendar2-x text-white-50 display-3 mb-3 d-block"></i>
          <h5 className="fw-bold text-white mb-2">No Active Bookings Found</h5>
          <p className="text-white-50 mb-4 max-w-md mx-auto">
            You do not have any active tour reservations. Browse our tour catalog to book your next trip.
          </p>
          <Link to="/packages" className="btn btn-warning rounded-pill px-5 py-2 fw-bold text-dark">
            <i className="bi bi-compass-fill me-2"></i>Explore Tour Catalog
          </Link>
        </div>
      ) : (
        <div className="row g-4 mb-5">
          {activeTrips.slice(0, 2).map((item, idx) => {
            const pkgTitle = item.packageTitle || item.packages?.title || 'Sri Lanka Tour Package';
            const resId = item.reservationID || item.id || (1001 + idx);
            const date = item.reservationDate || item.startDate || 'Upcoming Departure';
            const guests = item.numAdults || item.guestCount || 2;
            const status = (item.status || item.reservationStatus || 'PENDING').toUpperCase();

            return (
              <div key={resId} className="col-lg-6 col-md-12">
                <div className="p-4 rounded-4 h-100" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="text-warning fw-bold small">REF #{resId}</span>
                      <h5 className="fw-bold text-white mb-1 mt-1">{pkgTitle}</h5>
                    </div>
                    <span className={`badge ${status === 'CONFIRMED' || status === 'ACTIVE' ? 'bg-success' : 'bg-warning text-dark'} px-3 py-2 rounded-pill`}>
                      {status === 'CONFIRMED' || status === 'ACTIVE' ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>

                  <div className="row g-3 mb-4 text-white-50 small">
                    <div className="col-6"><i className="bi bi-calendar-event text-success me-2"></i>Date: <strong className="text-white">{date}</strong></div>
                    <div className="col-6"><i className="bi bi-people text-info me-2"></i>Travelers: <strong className="text-white">{guests} Guests</strong></div>
                    <div className="col-12"><i className="bi bi-person-badge text-warning me-2"></i>Guide: <strong className="text-white">{item.guideName || 'Assigned prior to tour'}</strong></div>
                  </div>

                  <div className="d-flex gap-2">
                    <button onClick={() => handleDownloadTicket(item)} className="btn btn-success btn-sm rounded-pill px-4 fw-bold flex-grow-1">
                      <i className="bi bi-file-earmark-pdf me-1"></i> Download Voucher
                    </button>
                    <Link to="/tourist/bookings" className="btn btn-outline-light btn-sm rounded-pill px-4 fw-bold">
                      Manage <i className="bi bi-chevron-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TouristDashboard;
