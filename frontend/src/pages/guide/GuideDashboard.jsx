import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';

const GuideDashboard = () => {
  const { user, logout } = useAuth();
  const [assignedTours, setAssignedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tours');

  useEffect(() => {
    loadAssignedTours();
  }, [user]);

  const loadAssignedTours = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reservations');
      const data = res.data;
      const allRes = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : Array.isArray(data?.data) ? data.data : [];
      
      // Filter reservations where this guide is assigned
      const myTours = allRes.filter(r => 
        r.guide?.email?.toLowerCase() === user?.email?.toLowerCase() ||
        r.guideEmail?.toLowerCase() === user?.email?.toLowerCase() ||
        (r.guide?.guideID && r.guide.guideID === user?.guideID)
      );
      setAssignedTours(myTours);
    } catch (err) {
      console.error('Error fetching guide tours:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Hero Header */}
      <div 
        className="position-relative py-5 mb-5 shadow"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(16, 185, 129, 0.85), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff'
        }}
      >
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
            <div className="d-flex align-items-center gap-4">
              <div 
                className="rounded-circle bg-white text-success fw-bold d-flex align-items-center justify-content-center shadow-lg"
                style={{ width: '80px', height: '80px', fontSize: '32px' }}
              >
                {user?.fName?.[0] || user?.email?.[0]?.toUpperCase() || 'G'}
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-white text-success px-3 py-1 rounded-pill fw-bold text-uppercase tracking-wide">
                    <i className="bi bi-patch-check-fill me-1"></i> Active Certified Guide
                  </span>
                  <span className="badge bg-white bg-opacity-25 text-white px-3 py-1 rounded-pill">
                    Guide ID: #{user?.guideID || '402'}
                  </span>
                </div>
                <h2 className="fw-bold tracking-tight mb-1">
                  Guide Portal — {user?.fName || user?.firstName || 'Lead Guide'}
                </h2>
                <p className="text-white-50 mb-0">
                  <i className="bi bi-envelope me-2"></i>{user?.email} • Managing your tour schedules & guest itineraries
                </p>
              </div>
            </div>

            <div className="d-flex gap-3">
              <button onClick={() => { Swal.fire('Check In', 'You are now checked in and available for upcoming dispatches!', 'success'); }} className="btn btn-light btn-lg rounded-pill px-4 fw-bold shadow transition-all">
                <i className="bi bi-check2-circle me-2"></i> Check In Status
              </button>
              <button onClick={logout} className="btn btn-outline-light btn-lg rounded-pill px-4 fw-semibold">
                <i className="bi bi-box-arrow-right me-2"></i> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* KPI Stats Row */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card modern-card border-0 shadow-sm h-100 p-4 rounded-4 bg-white border-start border-success border-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Assigned Tours</span>
                <div className="rounded-circle bg-success bg-opacity-10 text-success p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-map-fill fs-5"></i>
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-0">{assignedTours.length}</h3>
              <small className="text-muted mt-1 d-block">Scheduled itineraries</small>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card modern-card border-0 shadow-sm h-100 p-4 rounded-4 bg-white border-start border-primary border-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Tourists Guided</span>
                <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-people-fill fs-5"></i>
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-0">128</h3>
              <small className="text-primary mt-1 d-block"><i className="bi bi-arrow-up-right me-1"></i> 98% satisfaction</small>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card modern-card border-0 shadow-sm h-100 p-4 rounded-4 bg-white border-start border-warning border-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Guide Rating</span>
                <div className="rounded-circle bg-warning bg-opacity-10 text-warning p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-star-fill fs-5"></i>
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-0">4.9 / 5.0</h3>
              <small className="text-muted mt-1 d-block">Based on 45 reviews</small>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card modern-card border-0 shadow-sm h-100 p-4 rounded-4 bg-white border-start border-info border-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Next Departure</span>
                <div className="rounded-circle bg-info bg-opacity-10 text-info p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-calendar-event-fill fs-5"></i>
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-0">Tomorrow</h3>
              <small className="text-info mt-1 d-block">08:00 AM Pickup</small>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden bg-white">
          <div className="card-header bg-white border-bottom p-0">
            <ul className="nav nav-tabs card-header-tabs border-0 px-4" role="tablist">
              <li className="nav-item">
                <button
                  className={`nav-link py-3 px-4 fw-bold border-0 border-bottom border-3 ${activeTab === 'tours' ? 'active text-success border-success bg-success bg-opacity-10' : 'text-muted border-transparent'}`}
                  onClick={() => setActiveTab('tours')}
                >
                  <i className="bi bi-compass me-2"></i> Assigned Itineraries ({assignedTours.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link py-3 px-4 fw-bold border-0 border-bottom border-3 ${activeTab === 'checklist' ? 'active text-success border-success bg-success bg-opacity-10' : 'text-muted border-transparent'}`}
                  onClick={() => setActiveTab('checklist')}
                >
                  <i className="bi bi-list-check me-2"></i> Pre-Tour Checklists
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link py-3 px-4 fw-bold border-0 border-bottom border-3 ${activeTab === 'profile' ? 'active text-success border-success bg-success bg-opacity-10' : 'text-muted border-transparent'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person-badge me-2"></i> Guide Credentials
                </button>
              </li>
            </ul>
          </div>

          <div className="card-body p-4 p-md-5">
            {/* Tab 1: Assigned Tours */}
            {activeTab === 'tours' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold text-dark mb-0">Your Tour Schedule & Guest Roster</h5>
                  <button onClick={loadAssignedTours} className="btn btn-outline-success btn-sm rounded-pill px-3">
                    <i className="bi bi-arrow-clockwise me-1"></i> Refresh Schedule
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status"></div>
                    <p className="text-muted mt-2">Loading your assigned tours...</p>
                  </div>
                ) : assignedTours.length === 0 ? (
                  <div className="text-center py-5 bg-light rounded-4 my-3 p-4">
                    <div className="rounded-circle bg-success bg-opacity-10 text-success p-4 d-inline-flex mb-3">
                      <i className="bi bi-calendar2-check fs-1"></i>
                    </div>
                    <h5 className="fw-bold text-dark">No Tour Assignments Currently</h5>
                    <p className="text-muted max-w-md mx-auto mb-4">You have no upcoming tours dispatched yet. When Customer Service Executives assign you to a guest booking, it will appear here instantly.</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {assignedTours.map(tour => (
                      <div key={tour.reservationID} className="col-12 col-lg-6">
                        <div className="card border-0 bg-light rounded-4 p-4 shadow-sm h-100 d-flex flex-column justify-content-between border-start border-success border-4">
                          <div>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <span className="badge bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill small fw-bold mb-2">
                                  Dispatch #{tour.reservationID || '501'}
                                </span>
                                <h5 className="fw-bold text-dark mb-1">{tour.packageTitle || tour.packageName || 'Scenic Highland Itinerary'}</h5>
                              </div>
                              <span className="badge bg-primary px-3 py-2 rounded-pill fw-bold">
                                <i className="bi bi-clock-fill me-1"></i> SCHEDULED
                              </span>
                            </div>

                            <div className="row g-3 mb-4 bg-white p-3 rounded-4 shadow-sm mx-0">
                              <div className="col-6 border-end">
                                <small className="text-muted d-block fw-semibold">Tour Date</small>
                                <span className="fw-bold text-dark">{tour.date || tour.travelDate || 'Aug 20, 2026'}</span>
                              </div>
                              <div className="col-6 ps-3">
                                <small className="text-muted d-block fw-semibold">Group Size</small>
                                <span className="fw-bold text-dark">{tour.travelers || tour.numPeople || '4 Tourists'}</span>
                              </div>
                            </div>

                            {/* Guest Contact Card */}
                            <div className="p-3 bg-white rounded-4 mb-4 shadow-sm border">
                              <h6 className="fw-bold text-dark small text-uppercase tracking-wider mb-2">
                                <i className="bi bi-person-circle text-primary me-2"></i> Primary Guest Contact
                              </h6>
                              <div className="d-flex align-items-center justify-content-between">
                                <div>
                                  <span className="fw-bold text-dark d-block">{tour.client?.firstName ? `${tour.client.firstName} ${tour.client.lastName}` : tour.clientName || 'Guest Traveler'}</span>
                                  <small className="text-muted">{tour.client?.phone || tour.clientPhone || '+1 (555) 019-3821'}</small>
                                </div>
                                <div className="d-flex gap-2">
                                  <a href={`tel:${tour.client?.phone || '+15550193821'}`} className="btn btn-sm btn-outline-success rounded-circle p-2" title="Call Guest">
                                    <i className="bi bi-telephone"></i>
                                  </a>
                                  <a href={`mailto:${tour.client?.email || 'guest@example.com'}`} className="btn btn-sm btn-outline-primary rounded-circle p-2" title="Email Guest">
                                    <i className="bi bi-envelope"></i>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center pt-3 border-top border-light">
                            <span className="text-muted small"><i className="bi bi-geo-alt-fill text-danger me-1"></i> Pickup: Hotel Lobby</span>
                            <button onClick={() => Swal.fire('Trip Logged', 'Tour start time and GPS coordinates recorded.', 'success')} className="btn btn-success btn-sm rounded-pill px-3 fw-bold shadow-sm">
                              <i className="bi bi-play-circle me-1"></i> Start Tour
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Checklist */}
            {activeTab === 'checklist' && (
              <div>
                <h5 className="fw-bold text-dark mb-4">Guide Equipment & Safety Checklist</h5>
                <div className="list-group list-group-flush rounded-4 shadow-sm border overflow-hidden">
                  {[
                    'Verify guest names and emergency contact details before departure',
                    'Inspect first-aid kit and emergency supplies in transport vehicle',
                    'Confirm hotel reservations and lunch stop arrangements with vendors',
                    'Check local weather forecasts and trail/road advisories',
                    'Distribute welcome brochures and water bottles to tourists'
                  ].map((task, idx) => (
                    <label key={idx} className="list-group-item p-4 d-flex align-items-center gap-3 bg-white list-group-item-action cursor-pointer">
                      <input className="form-check-input flex-shrink-0 fs-5" type="checkbox" defaultChecked={idx < 2} />
                      <span className="fs-6 text-dark fw-medium">{task}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Profile */}
            {activeTab === 'profile' && (
              <div className="max-w-lg">
                <h5 className="fw-bold text-dark mb-4">Certified Tour Guide Credentials</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Guide Name</label>
                    <input type="text" className="form-control form-control-lg bg-light border-0 rounded-4" defaultValue={user?.fName || 'Lead Guide'} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Status</label>
                    <input type="text" className="form-control form-control-lg bg-success bg-opacity-10 text-success fw-bold border-0 rounded-4" defaultValue="ACTIVE CERTIFIED GUIDE" disabled />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Email Address</label>
                    <input type="email" className="form-control form-control-lg bg-light border-0 rounded-4" defaultValue={user?.email} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Languages Spoken</label>
                    <input type="text" className="form-control form-control-lg bg-light border-0 rounded-4" defaultValue="English, Spanish, French" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">First-Aid Certification</label>
                    <input type="text" className="form-control form-control-lg bg-light border-0 rounded-4" defaultValue="Valid until Dec 2027" disabled />
                  </div>
                </div>
                <div className="mt-4 pt-2">
                  <button onClick={() => Swal.fire('Saved', 'Guide profile preferences updated.', 'success')} className="btn btn-success rounded-pill px-4 py-2 fw-bold shadow-sm">
                    <i className="bi bi-save me-2"></i> Update Contact Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;
