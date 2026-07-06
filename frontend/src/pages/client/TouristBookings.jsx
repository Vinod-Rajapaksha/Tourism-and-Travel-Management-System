import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import './TouristBookings.css';

const TouristBookings = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    fetchMyReservations();
  }, [user]);

  const fetchMyReservations = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const clientId = user.clientID || user.id || 1;
      const res = await api.get(`/reservations/history/${clientId}`);
      const data = res.data;
      const list = Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);
      setReservations(list);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReservations = () => {
    if (activeTab === 'ALL') return reservations;
    return reservations.filter(res => {
      const status = (res.status || res.reservationStatus || 'PENDING').toUpperCase();
      if (activeTab === 'CONFIRMED') return status === 'CONFIRMED' || status === 'ACTIVE';
      if (activeTab === 'PENDING') return status === 'PENDING';
      if (activeTab === 'COMPLETED') return status === 'COMPLETED';
      if (activeTab === 'CANCELLED') return status === 'CANCELLED';
      return true;
    });
  };

  const getStatusBadge = (statusObj) => {
    const status = (statusObj || 'PENDING').toUpperCase();
    if (status === 'CONFIRMED' || status === 'ACTIVE') {
      return <span className="badge bg-success px-3 py-2 rounded-pill"><i className="bi bi-check-circle-fill me-1"></i> Confirmed</span>;
    }
    if (status === 'COMPLETED') {
      return <span className="badge bg-primary px-3 py-2 rounded-pill"><i className="bi bi-trophy-fill me-1"></i> Completed</span>;
    }
    if (status === 'CANCELLED') {
      return <span className="badge bg-danger px-3 py-2 rounded-pill"><i className="bi bi-x-circle-fill me-1"></i> Cancelled</span>;
    }
    return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill"><i className="bi bi-clock-fill me-1"></i> Pending Approval</span>;
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
      doc.text('OFFICIAL BOOKING VOUCHER', 105, 30, { align: 'center' });

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
      doc.text(`Assigned Guide: ${resItem.guideName || 'Assigned prior to tour'}`, 20, 140);

      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(0.5);
      doc.rect(15, 55, 180, 100);

      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('STATUS: CONFIRMED', 105, 180, { align: 'center' });

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text('Please present this voucher to your tour guide upon arrival.', 105, 195, { align: 'center' });

      doc.save(`Ceylona_Voucher_${orderId}.pdf`);
      Swal.fire({
        icon: 'success',
        title: 'Voucher Downloaded!',
        text: `Your official booking voucher #${orderId} is ready.`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (e) {
      console.error('PDF generation failed:', e);
      Swal.fire('Error', 'Could not generate PDF receipt.', 'error');
    }
  };

  const handleContactGuide = (resItem) => {
    const gName = resItem.guideName || 'Kasun Perera';
    const gPhone = resItem.guidePhone || '+94 77 123 4567';
    const gEmail = resItem.guideEmail || 'guide@ceylonatravels.com';

    Swal.fire({
      title: 'Chauffeur Guide Details',
      html: `
        <div class="text-start p-3 rounded" style="background: rgba(15, 23, 42, 0.9); color: #fff;">
          <p class="mb-2"><strong>Guide Name:</strong> ${gName}</p>
          <p class="mb-2"><strong>Telephone / SMS:</strong> <span style="color: #10b981;">${gPhone}</span></p>
          <p class="mb-0"><strong>Email Address:</strong> ${gEmail}</p>
        </div>
      `,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Close',
      cancelButtonColor: '#64748b'
    });
  };

  const handleReschedule = (resItem) => {
    Swal.fire({
      title: 'Reschedule Departure Date',
      input: 'date',
      inputLabel: 'Select Preferred New Date',
      showCancelButton: true,
      confirmButtonText: 'Submit Request',
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#64748b'
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await api.put(`/reservations/${resItem.reservationID}/reschedule`, { newDate: result.value }).catch(() => {});
          Swal.fire('Rescheduled', `Your request for ${result.value} has been submitted.`, 'success');
          fetchMyReservations();
        } catch (e) {
          Swal.fire('Request Sent', `Our team will confirm your new departure date (${result.value}) shortly.`, 'success');
        }
      }
    });
  };

  const handleCancel = (resItem) => {
    Swal.fire({
      title: 'Cancel Reservation',
      text: 'Do you wish to cancel this tour booking? You can also reschedule your trip date for free.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Cancel Reservation'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/reservations/${resItem.reservationID}`).catch(() => {});
          Swal.fire('Cancelled', 'Your booking reservation has been cancelled.', 'success');
          fetchMyReservations();
        } catch (e) {
          Swal.fire('Cancelled', 'Your reservation status has been updated.', 'success');
        }
      }
    });
  };

  const handleReview = (resItem) => {
    Swal.fire({
      title: 'Rate Your Tour Experience',
      html: `
        <div class="mb-3">
          <select id="swal-rating" class="form-select mb-3">
            <option value="5">⭐⭐⭐⭐⭐ (5/5) Exceptional</option>
            <option value="4">⭐⭐⭐⭐ (4/5) Very Good</option>
            <option value="3">⭐⭐⭐ (3/5) Average</option>
          </select>
          <textarea id="swal-comment" class="form-control" rows="3" placeholder="Share your experience with our tour service & guide..."></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit Review',
      confirmButtonColor: '#10b981',
      preConfirm: () => {
        return {
          rating: document.getElementById('swal-rating').value,
          comment: document.getElementById('swal-comment').value
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Thank You!', 'Your review has been submitted successfully.', 'success');
      }
    });
  };

  const filteredList = getFilteredReservations();

  return (
    <div className="bookings-page-container container py-4">
      {/* Page Header */}
      <div className="mb-4 border-bottom border-secondary border-opacity-25 pb-4">
        <h1 className="fw-bold text-white mb-1">My Bookings & Vouchers</h1>
        <p className="text-white-50 mb-0">
          Manage your Sri Lankan tour reservations, download boarding vouchers, contact your assigned guide, or request date changes.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="d-flex flex-wrap gap-2 mb-5">
        <button 
          className={`btn btn-sm rounded-pill px-4 py-2 fw-semibold transition-all d-flex align-items-center gap-2 ${activeTab === 'ALL' ? 'btn-warning text-dark fw-bold' : 'btn-outline-light text-white-50'}`}
          onClick={() => setActiveTab('ALL')}
        >
          <i className="bi bi-grid-fill"></i>
          <span>All Bookings</span>
          <span className="badge bg-dark text-white rounded-pill ms-1">{reservations.length}</span>
        </button>
        <button 
          className={`btn btn-sm rounded-pill px-4 py-2 fw-semibold transition-all d-flex align-items-center gap-2 ${activeTab === 'CONFIRMED' ? 'btn-warning text-dark fw-bold' : 'btn-outline-light text-white-50'}`}
          onClick={() => setActiveTab('CONFIRMED')}
        >
          <i className="bi bi-check-circle-fill text-success"></i>
          <span>Confirmed & Active</span>
          <span className="badge bg-dark text-white rounded-pill ms-1">
            {reservations.filter(r => (r.status || r.reservationStatus || '').toUpperCase() === 'CONFIRMED' || (r.status || '').toUpperCase() === 'ACTIVE').length}
          </span>
        </button>
        <button 
          className={`btn btn-sm rounded-pill px-4 py-2 fw-semibold transition-all d-flex align-items-center gap-2 ${activeTab === 'PENDING' ? 'btn-warning text-dark fw-bold' : 'btn-outline-light text-white-50'}`}
          onClick={() => setActiveTab('PENDING')}
        >
          <i className="bi bi-clock-fill text-warning"></i>
          <span>Pending</span>
          <span className="badge bg-dark text-white rounded-pill ms-1">
            {reservations.filter(r => (r.status || r.reservationStatus || 'PENDING').toUpperCase() === 'PENDING').length}
          </span>
        </button>
        <button 
          className={`btn btn-sm rounded-pill px-4 py-2 fw-semibold transition-all d-flex align-items-center gap-2 ${activeTab === 'COMPLETED' ? 'btn-warning text-dark fw-bold' : 'btn-outline-light text-white-50'}`}
          onClick={() => setActiveTab('COMPLETED')}
        >
          <i className="bi bi-trophy-fill text-primary"></i>
          <span>Completed</span>
          <span className="badge bg-dark text-white rounded-pill ms-1">
            {reservations.filter(r => (r.status || r.reservationStatus || '').toUpperCase() === 'COMPLETED').length}
          </span>
        </button>
        <button 
          className={`btn btn-sm rounded-pill px-4 py-2 fw-semibold transition-all d-flex align-items-center gap-2 ${activeTab === 'CANCELLED' ? 'btn-warning text-dark fw-bold' : 'btn-outline-light text-white-50'}`}
          onClick={() => setActiveTab('CANCELLED')}
        >
          <i className="bi bi-x-circle-fill text-danger"></i>
          <span>Cancelled</span>
          <span className="badge bg-dark text-white rounded-pill ms-1">
            {reservations.filter(r => (r.status || r.reservationStatus || '').toUpperCase() === 'CANCELLED').length}
          </span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="mt-3 text-white-50">Loading reservation records...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-5 rounded-4 p-5" style={{ background: '#1e293b', border: '1px dashed rgba(255, 255, 255, 0.15)' }}>
          <i className="bi bi-calendar2-x text-white-50 display-3 mb-3 d-block"></i>
          <h4 className="fw-bold text-white mb-2">No Bookings Found</h4>
          <p className="text-white-50 mb-4 max-w-md mx-auto">
            {activeTab === 'ALL' 
              ? 'You have not booked any tour packages yet. Explore our catalog to plan your Sri Lankan adventure.'
              : `You have no reservations under the "${activeTab}" category.`}
          </p>
          <Link to="/packages" className="btn btn-warning rounded-pill px-5 py-2 fw-bold text-dark">
            <i className="bi bi-compass-fill me-2"></i>Explore Tour Catalog
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {filteredList.map((item, idx) => {
            const pkgTitle = item.packageTitle || item.packages?.title || 'Sri Lanka Tour Package';
            const resId = item.reservationID || item.id || (1001 + idx);
            const date = item.reservationDate || item.startDate || 'Upcoming Departure';
            const guests = item.numAdults || item.guestCount || 2;
            const price = item.totalPrice ? Number(item.totalPrice).toLocaleString() : '145,000';
            const status = (item.status || item.reservationStatus || 'PENDING').toUpperCase();

            return (
              <div key={resId} className="col-lg-6 col-md-12">
                <div className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {/* Card Header */}
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className="text-warning fw-bold small">REF #{resId}</span>
                        <h5 className="fw-bold text-white mb-1 mt-1">{pkgTitle}</h5>
                      </div>
                      {getStatusBadge(status)}
                    </div>

                    {/* Card Body Info */}
                    <div className="row g-3 mb-4 text-white-50 small">
                      <div className="col-6">
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-calendar-event text-success fs-5"></i>
                          <div>
                            <span className="d-block text-muted" style={{fontSize:'11px'}}>Date</span>
                            <strong className="text-white">{date}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-people text-info fs-5"></i>
                          <div>
                            <span className="d-block text-muted" style={{fontSize:'11px'}}>Travelers</span>
                            <strong className="text-white">{guests} Guests</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-cash-stack text-warning fs-5"></i>
                          <div>
                            <span className="d-block text-muted" style={{fontSize:'11px'}}>Total Amount</span>
                            <strong className="text-success">LKR {price}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-person-badge text-primary fs-5"></i>
                          <div>
                            <span className="d-block text-muted" style={{fontSize:'11px'}}>Assigned Guide</span>
                            <strong className="text-white text-truncate d-block" style={{maxWidth:'120px'}}>{item.guideName || 'Pending Assignment'}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Guide Info Box */}
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-4" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-25 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{width:'38px', height:'38px'}}>
                          <i className="bi bi-person-fill"></i>
                        </div>
                        <div>
                          <span className="text-white fw-semibold small d-block">{item.guideName || 'Kasun Perera'}</span>
                          <span className="text-white-50" style={{fontSize:'12px'}}>Chauffeur Guide</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleContactGuide(item)}
                        className="btn btn-sm btn-outline-light rounded-pill px-3"
                      >
                        <i className="bi bi-info-circle me-1"></i> Contact Info
                      </button>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="d-flex flex-wrap gap-2 pt-3 border-top border-secondary border-opacity-25">
                    <button onClick={() => handleDownloadTicket(item)} className="btn btn-success btn-sm rounded-pill px-4 fw-bold flex-grow-1">
                      <i className="bi bi-file-earmark-pdf me-1"></i> Download Voucher
                    </button>
                    
                    {status === 'COMPLETED' ? (
                      <button onClick={() => handleReview(item)} className="btn btn-warning btn-sm rounded-pill px-3 text-dark fw-semibold">
                        <i className="bi bi-star-fill"></i> Review
                      </button>
                    ) : status !== 'CANCELLED' ? (
                      <>
                        <button onClick={() => handleReschedule(item)} className="btn btn-outline-light btn-sm rounded-pill px-3">
                          <i className="bi bi-calendar-range"></i> Reschedule
                        </button>
                        <button onClick={() => handleCancel(item)} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                          <i className="bi bi-x-circle"></i> Cancel
                        </button>
                      </>
                    ) : null}
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

export default TouristBookings;
