import React, { useState, useEffect, useMemo } from "react";
import reservationAPI from "../../api/Reservations";
import SideNav from "../../components/SideNav";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { exportToCSV } from "../../utils/exportUtils";
import "bootstrap/dist/css/bootstrap.min.css";

// ----- Status Badge -----
const StatusBadge = ({ status }) => {
  const statusConfig = {
    CONFIRMED: { class: "success", icon: "bi-check-circle-fill", bg: "bg-success-soft" },
    PENDING: { class: "warning", icon: "bi-clock-fill", bg: "bg-warning-soft" },
    CANCELLED: { class: "danger", icon: "bi-x-circle-fill", bg: "bg-danger-soft" },
    COMPLETED: { class: "info", icon: "bi-flag-fill", bg: "bg-info-soft" }
  };
  const config = statusConfig[status?.toUpperCase()] || { class: "secondary", icon: "bi-question-circle", bg: "bg-secondary-soft" };
  return (
    <span className={`badge ${config.bg} text-${config.class} border border-${config.class} d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill`} style={{ fontSize: "0.8rem" }}>
      <i className={`bi ${config.icon}`} />
      <span className="fw-medium">{status || 'UNKNOWN'}</span>
    </span>
  );
};

// ----- Stat Card -----
const StatCard = ({ title, value, sub, icon, loading = false, highlight = false }) => (
  <div className="col-12 col-md-6 col-xl-3">
    <div className={`card border-0 shadow-sm h-100 modern-card kpi-card ${highlight ? 'border-left-danger' : ''}`}>
      <div className="card-body d-flex justify-content-between align-items-center py-4">
        <div className="flex-grow-1">
          <div className="text-uppercase small fw-semibold text-muted mb-2">{title}</div>
          {loading ? (
            <div className="skeleton-line mb-2" style={{ width: '80%', height: '28px' }}></div>
          ) : (
            <div className={`fs-3 fw-bold mb-1 ${highlight ? 'text-danger' : 'text-dark'}`}>{value}</div>
          )}
          {sub && (
            loading ? (
              <div className="skeleton-line" style={{ width: '90%', height: '14px' }}></div>
            ) : (
              <div className="text-muted small">{sub}</div>
            )
          )}
        </div>
        <div className="display-6 theme-accent opacity-75">
          <i className={`bi ${icon}`} />
        </div>
      </div>
    </div>
  </div>
);

const COLORS = ["#F2994A", "#27AE60", "#EB5757", "#2F80ED", "#9B51E0"];

export default function CustomerServiceExecutiveDashboard() {
  const [reservations, setReservations] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [guideFilter, setGuideFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("id_desc");

  // Modals
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [modalType, setModalType] = useState(""); // 'status', 'assign', 'view', 'delete'
  const [newStatus, setNewStatus] = useState("");
  const [guideId, setGuideId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const { user } = useAuth();
  const currentRole = user?.role;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resData, guidesData] = await Promise.all([
        reservationAPI.getReservations(),
        reservationAPI.getGuides()
      ]);
      setReservations(Array.isArray(resData) ? resData : resData?.data || []);
      setGuides(Array.isArray(guidesData) ? guidesData : guidesData?.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching reservation data:", err);
      setError("Failed to load reservations and guides. Please verify connection.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (reservation, type) => {
    setSelectedReservation(reservation);
    setModalType(type);
    setNewStatus(reservation.status || "PENDING");
    setGuideId(reservation.guideID || "");
  };

  const closeModal = () => {
    setSelectedReservation(null);
    setModalType("");
    setError("");
  };

  const handleAction = async () => {
    if (!selectedReservation) return;
    setActionLoading(true);
    try {
      if (modalType === "status") {
        await reservationAPI.updateReservationStatus(selectedReservation.reservationID, newStatus);
        Swal.fire("Success", "Reservation status updated successfully!", "success");
      } else if (modalType === "assign") {
        if (!guideId) {
          Swal.fire("Warning", "Please select a guide first", "warning");
          setActionLoading(false);
          return;
        }
        await reservationAPI.assignGuideToReservation(selectedReservation.reservationID, guideId);
        Swal.fire("Success", "Guide assigned successfully!", "success");
      } else if (modalType === "delete") {
        await reservationAPI.deleteReservation(selectedReservation.reservationID);
        Swal.fire("Deleted!", "Reservation has been deleted.", "success");
      }
      closeModal();
      loadData();
    } catch (err) {
      console.error("Error executing action:", err);
      Swal.fire("Error", `Failed to execute action: ${err.message}`, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // KPIs
  const pendingCount = useMemo(() => reservations.filter(r => r.status === "PENDING").length, [reservations]);
  const confirmedCount = useMemo(() => reservations.filter(r => r.status === "CONFIRMED").length, [reservations]);
  const assignedCount = useMemo(() => reservations.filter(r => r.guideID && r.guideID !== "—").length, [reservations]);
  const assignmentRatio = useMemo(() => {
    if (!reservations.length) return "0%";
    return `${Math.round((assignedCount / reservations.length) * 100)}%`;
  }, [reservations, assignedCount]);

  // Chart Data
  const statusDistributionData = useMemo(() => {
    const counts = { PENDING: 0, CONFIRMED: 0, CANCELLED: 0, COMPLETED: 0 };
    reservations.forEach(r => {
      const st = r.status?.toUpperCase();
      if (counts[st] !== undefined) counts[st]++;
      else counts.PENDING++;
    });
    return [
      { name: "Pending", value: counts.PENDING },
      { name: "Confirmed", value: counts.CONFIRMED },
      { name: "Cancelled", value: counts.CANCELLED },
      { name: "Completed", value: counts.COMPLETED }
    ].filter(item => item.value > 0);
  }, [reservations]);

  const packageBookingTrendData = useMemo(() => {
    const pkgMap = {};
    reservations.forEach(r => {
      const pkg = `Package #${r.packageID || 'N/A'}`;
      pkgMap[pkg] = (pkgMap[pkg] || 0) + 1;
    });
    return Object.keys(pkgMap).slice(0, 6).map(key => ({
      name: key,
      Bookings: pkgMap[key]
    }));
  }, [reservations]);

  // Filtered Reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      const strId = String(res.reservationID || '');
      const strUser = String(res.userID || '');
      const strPkg = String(res.packageID || '');
      const strGuide = String(res.guideID || '');
      const matchesSearch = !searchQuery || 
        strId.includes(searchQuery) || 
        strUser.includes(searchQuery) || 
        strPkg.includes(searchQuery) ||
        strGuide.includes(searchQuery);
        
      const matchesStatus = statusFilter === "ALL" || res.status?.toUpperCase() === statusFilter;
      
      const isAssigned = res.guideID && res.guideID !== "—";
      const matchesGuide = guideFilter === "ALL" || 
        (guideFilter === "ASSIGNED" && isAssigned) || 
        (guideFilter === "UNASSIGNED" && !isAssigned);

      return matchesSearch && matchesStatus && matchesGuide;
    }).sort((a, b) => {
      if (sortBy === "id_desc") return (b.reservationID || 0) - (a.reservationID || 0);
      if (sortBy === "id_asc") return (a.reservationID || 0) - (b.reservationID || 0);
      if (sortBy === "date") return new Date(b.startDate || 0) - new Date(a.startDate || 0);
      return 0;
    });
  }, [reservations, searchQuery, statusFilter, guideFilter, sortBy]);

  const handleExportCSV = () => {
    exportToCSV(filteredReservations, "customer_reservations", [
      { key: "reservationID", label: "Reservation ID" },
      { key: "userID", label: "Customer User ID" },
      { key: "packageID", label: "Tour Package ID" },
      { key: "guideID", label: "Assigned Guide ID" },
      { key: "status", label: "Booking Status" },
      { key: "startDate", label: "Start Date" },
      { key: "endDate", label: "End Date" }
    ]);
  };

  const getGuideName = (id) => {
    if (!id || id === "—") return "Unassigned";
    const guide = guides.find(g => String(g.guideID) === String(id));
    return guide ? `${guide.fname || guide.firstName} ${guide.lname || guide.lastName}` : `Guide #${id}`;
  };

  return (
    <div className="container-fluid">
          {/* Header */}
          <div className="row align-items-center mb-4">
            <div className="col">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded-3 bg-primary-soft">
                  <i className="fas fa-headset text-primary fa-lg"></i>
                </div>
                <div>
                  <h1 className="h3 fw-bold text-dark mb-1">Customer Service Executive Panel</h1>
                  <p className="text-muted mb-0">Monitor customer bookings, update statuses, and assign travel guides</p>
                </div>
              </div>
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-primary btn-icon rounded-circle shadow-sm" onClick={loadData} disabled={loading} title="Refresh Data">
                <i className={`fas fa-sync-alt ${loading ? "fa-spin" : ""}`}></i>
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger shadow-sm rounded-3 mb-4">{error}</div>}

          {/* KPI Stat Cards */}
          <div className="row g-3 mb-4">
            <StatCard title="Total Bookings" value={reservations.length} sub="All historical reservations" icon="bi-calendar-check" loading={loading} />
            <StatCard title="Pending Action" value={pendingCount} sub="Requires confirmation or guide" icon="bi-exclamation-triangle" loading={loading} highlight={pendingCount > 0} />
            <StatCard title="Confirmed Tours" value={confirmedCount} sub="Ready for departure" icon="bi-check-circle" loading={loading} />
            <StatCard title="Guide Assigned" value={assignmentRatio} sub={`${assignedCount} bookings allocated`} icon="bi-person-check" loading={loading} />
          </div>

          {/* Analytics Section */}
          <div className="row g-4 mb-4">
            <div className="col-xl-7">
              <div className="card modern-card border-0 shadow-sm h-100">
                <div className="card-header bg-transparent border-0 py-3">
                  <h6 className="fw-bold text-dark mb-0">Tour Package Booking Popularity</h6>
                </div>
                <div className="card-body" style={{ height: 320 }}>
                  {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={packageBookingTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fill: "#6c757d", fontSize: 12 }} />
                        <YAxis tick={{ fill: "#6c757d", fontSize: 12 }} allowDecimals={false} />
                        <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                        <Bar dataKey="Bookings" fill="#2F80ED" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-5">
              <div className="card modern-card border-0 shadow-sm h-100">
                <div className="card-header bg-transparent border-0 py-3">
                  <h6 className="fw-bold text-dark mb-0">Reservation Status Ratio</h6>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center" style={{ height: 320 }}>
                  {loading ? <div className="spinner-border text-primary" /> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={statusDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {statusDistributionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ paddingTop: "15px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reservations Table Section */}
          <div className="card modern-card border-0 shadow-sm mb-4">
            <div className="card-header bg-transparent border-0 py-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h5 className="fw-bold text-dark mb-0">Customer Reservations Directory</h5>
                <span className="text-muted small">Displaying {filteredReservations.length} of {reservations.length} records</span>
              </div>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <input
                  type="text"
                  className="form-control form-control-sm modern-input"
                  placeholder="Search ID, User, or Guide..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: "220px" }}
                />
                <select
                  className="form-select form-select-sm modern-input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: "140px" }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <select
                  className="form-select form-select-sm modern-input"
                  value={guideFilter}
                  onChange={(e) => setGuideFilter(e.target.value)}
                  style={{ width: "150px" }}
                >
                  <option value="ALL">All Guides</option>
                  <option value="ASSIGNED">Assigned Only</option>
                  <option value="UNASSIGNED">Unassigned Only</option>
                </select>
                <select
                  className="form-select form-select-sm modern-input"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: "130px" }}
                >
                  <option value="id_desc">Newest First</option>
                  <option value="id_asc">Oldest First</option>
                  <option value="date">Start Date</option>
                </select>
                <button className="btn btn-outline-secondary btn-sm rounded-pill px-3 shadow-sm" onClick={handleExportCSV}>
                  <i className="fas fa-file-csv me-1"></i> Export CSV
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 modern-table">
                  <thead>
                    <tr>
                      <th className="ps-4">Res #</th>
                      <th>Customer ID</th>
                      <th>Tour Package</th>
                      <th>Assigned Guide</th>
                      <th>Schedule</th>
                      <th className="text-center">Status</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i}>
                          <td colSpan="7" className="py-3"><div className="skeleton-line" style={{ height: '24px' }}></div></td>
                        </tr>
                      ))
                    ) : filteredReservations.length === 0 ? (
                      <tr><td colSpan="7" className="text-center py-5 text-muted">No reservations found matching your criteria.</td></tr>
                    ) : (
                      filteredReservations.map(res => (
                        <tr key={res.reservationID} className="modern-table-row">
                          <td className="ps-4 font-monospace fw-bold text-primary">#{res.reservationID}</td>
                          <td>
                            <span className="d-block fw-semibold text-dark">User #{res.userID}</span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border px-2 py-1">Package #{res.packageID}</span>
                          </td>
                          <td>
                            <span className={`small fw-medium ${!res.guideID || res.guideID === "—" ? "text-danger fst-italic" : "text-dark"}`}>
                              <i className="bi bi-person me-1" />
                              {getGuideName(res.guideID)}
                            </span>
                          </td>
                          <td>
                            <div className="small">
                              <span className="text-success fw-medium">{res.startDate}</span> <span className="text-muted">to</span> <span className="text-danger fw-medium">{res.endDate}</span>
                            </div>
                          </td>
                          <td className="text-center">
                            <StatusBadge status={res.status} />
                          </td>
                          <td className="text-end pe-4">
                            <div className="d-inline-flex gap-1">
                              <button className="btn btn-icon btn-sm btn-outline-secondary rounded-circle" onClick={() => openModal(res, "view")} title="View Details">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-icon btn-sm btn-outline-warning rounded-circle" onClick={() => openModal(res, "status")} title="Update Status">
                                <i className="bi bi-flag"></i>
                              </button>
                              <button className="btn btn-icon btn-sm btn-outline-primary rounded-circle" onClick={() => openModal(res, "assign")} title="Assign Guide">
                                <i className="bi bi-person-plus"></i>
                              </button>
                              <button className="btn btn-icon btn-sm btn-outline-danger rounded-circle" onClick={() => openModal(res, "delete")} title="Delete">
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

      {/* Interactive Action Modals */}
      {modalType && selectedReservation && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modern-card border-0 shadow-lg">
              
              {/* STATUS UPDATE MODAL */}
              {modalType === "status" && (
                <>
                  <div className="modal-header bg-warning text-dark border-0 py-3">
                    <h5 className="modal-title fw-bold">Update Reservation Status</h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                  </div>
                  <div className="modal-body p-4">
                    <p className="text-muted small mb-3">Change current booking status for Reservation <strong>#{selectedReservation.reservationID}</strong>:</p>
                    <label className="form-label fw-semibold">New Status</label>
                    <select className="form-select modern-input" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                  <div className="modal-footer bg-light border-0 py-3">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={closeModal}>Cancel</button>
                    <button type="button" className="btn btn-warning rounded-pill px-4 shadow-sm fw-medium" onClick={handleAction} disabled={actionLoading}>
                      {actionLoading ? "Updating..." : "Save Status"}
                    </button>
                  </div>
                </>
              )}

              {/* GUIDE ASSIGNMENT MODAL */}
              {modalType === "assign" && (
                <>
                  <div className="modal-header bg-primary text-white border-0 py-3">
                    <h5 className="modal-title fw-bold">Assign Travel Guide</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
                  </div>
                  <div className="modal-body p-4">
                    <p className="text-muted small mb-3">Select an active travel guide for Reservation <strong>#{selectedReservation.reservationID}</strong>:</p>
                    <label className="form-label fw-semibold">Travel Guide</label>
                    <select className="form-select modern-input" value={guideId} onChange={(e) => setGuideId(e.target.value)}>
                      <option value="">-- Select Guide --</option>
                      {guides.map(g => (
                        <option key={g.guideID} value={g.guideID}>
                          {g.fname || g.firstName} {g.lname || g.lastName} (NIC: {g.nic}) - {g.status || 'ACTIVE'}
                        </option>
                      ))}
                    </select>
                    {guides.length === 0 && <small className="text-danger d-block mt-2">No guides loaded or available in the system.</small>}
                  </div>
                  <div className="modal-footer bg-light border-0 py-3">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={closeModal}>Cancel</button>
                    <button type="button" className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={handleAction} disabled={actionLoading || guides.length === 0}>
                      {actionLoading ? "Assigning..." : "Assign Guide"}
                    </button>
                  </div>
                </>
              )}

              {/* DELETE CONFIRMATION MODAL */}
              {modalType === "delete" && (
                <div className="text-center p-4">
                  <i className="bi bi-exclamation-triangle display-4 text-danger mb-3 d-block" />
                  <h5 className="fw-bold mb-2">Delete Reservation?</h5>
                  <p className="text-muted small mb-4">Are you sure you want to permanently delete Reservation <strong>#{selectedReservation.reservationID}</strong>? This action cannot be undone.</p>
                  <div className="d-flex gap-2 justify-content-center">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={closeModal}>Cancel</button>
                    <button type="button" className="btn btn-danger rounded-pill px-4 shadow-sm" onClick={handleAction} disabled={actionLoading}>
                      {actionLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW DETAILS MODAL */}
              {modalType === "view" && (
                <>
                  <div className="modal-header bg-info text-white border-0 py-3">
                    <h5 className="modal-title fw-bold">Reservation Details #{selectedReservation.reservationID}</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-6"><span className="text-muted small d-block">Booking Status:</span><StatusBadge status={selectedReservation.status} /></div>
                      <div className="col-6"><span className="text-muted small d-block">Customer User ID:</span><strong>#{selectedReservation.userID}</strong></div>
                      <div className="col-6"><span className="text-muted small d-block">Tour Package ID:</span><strong>#{selectedReservation.packageID}</strong></div>
                      <div className="col-6"><span className="text-muted small d-block">Assigned Guide:</span><strong>{getGuideName(selectedReservation.guideID)}</strong></div>
                      <div className="col-6"><span className="text-muted small d-block">Start Date:</span><strong className="text-success">{selectedReservation.startDate}</strong></div>
                      <div className="col-6"><span className="text-muted small d-block">End Date:</span><strong className="text-danger">{selectedReservation.endDate}</strong></div>
                    </div>
                  </div>
                  <div className="modal-footer bg-light border-0 py-3 justify-content-between">
                    <button type="button" className="btn btn-outline-warning rounded-pill px-3 btn-sm" onClick={() => setModalType("status")}><i className="bi bi-flag me-1"></i> Change Status</button>
                    <button type="button" className="btn btn-secondary rounded-pill px-4 btn-sm" onClick={closeModal}>Close</button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}