import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import apiService from "../../api/Promotion";
import AdminEventForm from "../../components/MarketingManager/AdminEventForm";
import Reports from "../../components/MarketingManager/Reports";
import PaymentHistory from "../../components/MarketingManager/PaymentHistory";
import { formatPromotionDateRange } from "../../utils/dateUtils";
import { exportToCSV } from "../../utils/exportUtils";
import Swal from "sweetalert2";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

// ----- Status Badge -----
const StatusBadge = ({ active }) => (
  <span className={`badge ${active ? 'bg-success-soft text-success border border-success' : 'bg-secondary-soft text-secondary border border-secondary'} px-3 py-1 rounded-pill d-inline-flex align-items-center gap-1`} style={{ fontSize: "0.8rem" }}>
    <i className={`bi ${active ? 'bi-check-circle-fill' : 'bi-pause-circle-fill'}`} />
    <span className="fw-medium">{active ? 'ACTIVE CAMPAIGN' : 'INACTIVE'}</span>
  </span>
);

// ----- Stat Card -----
const StatCard = ({ title, value, sub, icon, highlight = false, loading = false }) => (
  <div className="col-12 col-md-6 col-xl-3">
    <div className={`card border-0 shadow-sm h-100 modern-card kpi-card ${highlight ? 'border-left-success' : ''}`}>
      <div className="card-body d-flex justify-content-between align-items-center py-4">
        <div className="flex-grow-1">
          <div className="text-uppercase small fw-semibold text-muted mb-2">{title}</div>
          {loading ? (
            <div className="skeleton-line mb-2" style={{ width: '80%', height: '28px' }}></div>
          ) : (
            <div className={`fs-3 fw-bold mb-1 ${highlight ? 'text-success' : 'text-dark'}`}>{value}</div>
          )}
          {sub && <div className="text-muted small">{sub}</div>}
        </div>
        <div className="display-6 theme-accent opacity-75">
          <i className={`bi ${icon}`} />
        </div>
      </div>
    </div>
  </div>
);

const COLORS = ["#27AE60", "#2F80ED", "#F2994A", "#EB5757", "#9B51E0"];

export default function MarketingManagerDashboard({
  promotions: propPromotions,
  onPromotionsChange,
  calendarSettings,
  onCalendarSettingsChange,
  payments,
  onRefreshPromotions
}) {
  const [internalPromotions, setInternalPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("promotions"); // 'promotions', 'reports', 'payments'
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date");

  // Form & Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  const promotions = propPromotions || internalPromotions;

  useEffect(() => {
    if (!propPromotions) {
      loadPromotions();
    }
  }, [propPromotions]);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPromotions();
      setInternalPromotions(data || []);
      if (onPromotionsChange) onPromotionsChange(data || []);
    } catch (err) {
      console.error("Error loading promotions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (onRefreshPromotions) onRefreshPromotions();
    else loadPromotions();
  };

  // Handlers for promotions
  const handleAddPromotion = () => {
    setEditingPromotion(null);
    setShowFormModal(true);
  };

  const handleEditPromotion = (promo) => {
    setEditingPromotion(promo);
    setShowFormModal(true);
  };

  const handleSavePromotion = async (promoData) => {
    try {
      let result;
      if (editingPromotion) {
        result = await apiService.updatePromotion(promoData.id, {
          ...promoData,
          updatedAt: new Date().toISOString()
        });
        Swal.fire("Success", "Promotion updated successfully!", "success");
      } else {
        const newPromo = { ...promoData, isActive: true };
        delete newPromo.id;
        delete newPromo.createdAt;
        delete newPromo.updatedAt;
        result = await apiService.createPromotion(newPromo);
        Swal.fire("Created!", "New promotion campaign launched!", "success");
      }

      if (onRefreshPromotions) onRefreshPromotions();
      else {
        const updated = editingPromotion
          ? promotions.map(p => p.id === promoData.id ? result : p)
          : [...promotions, result];
        if (onPromotionsChange) onPromotionsChange(updated);
        else setInternalPromotions(updated);
      }
      setShowFormModal(false);
      setEditingPromotion(null);
    } catch (error) {
      console.error("Error saving promotion:", error);
      Swal.fire("Error", error.response?.data?.error || "Failed to save promotion.", "error");
    }
  };

  const handleDeletePromotion = async (id) => {
    const res = await Swal.fire({
      title: "Delete Campaign?",
      text: "This promotion will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete"
    });
    if (!res.isConfirmed) return;

    try {
      await apiService.deletePromotion(id);
      const updated = promotions.filter(p => p.id !== id);
      if (onPromotionsChange) onPromotionsChange(updated);
      else setInternalPromotions(updated);
      Swal.fire("Deleted!", "Promotion campaign removed.", "success");
    } catch (error) {
      console.error("Error deleting promotion:", error);
      Swal.fire("Error", "Could not delete promotion.", "error");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const promo = promotions.find(p => p.id === id);
      if (!promo) return;
      const result = await apiService.updatePromotion(id, {
        ...promo,
        isActive: !promo.isActive,
        updatedAt: new Date().toISOString()
      });
      if (onRefreshPromotions) onRefreshPromotions();
      else {
        const updated = promotions.map(p => p.id === id ? result : p);
        if (onPromotionsChange) onPromotionsChange(updated);
        else setInternalPromotions(updated);
      }
    } catch (error) {
      console.error("Error toggling promotion:", error);
      Swal.fire("Error", "Failed to update campaign status.", "error");
    }
  };

  // KPIs
  const activeCount = useMemo(() => promotions.filter(p => p.isActive).length, [promotions]);
  const inactiveCount = useMemo(() => promotions.length - activeCount, [promotions, activeCount]);
  const avgDiscount = useMemo(() => {
    const valid = promotions.filter(p => p.discount);
    if (!valid.length) return "0%";
    const total = valid.reduce((acc, p) => acc + (parseFloat(p.discount) || 0), 0);
    return `${Math.round(total / valid.length)}%`;
  }, [promotions]);

  // Chart Data
  const priceComparisonData = useMemo(() => {
    return promotions.slice(0, 6).map(p => ({
      name: (p.title || "Promo").substring(0, 15),
      Price: parseFloat(p.price) || 0,
      Original: parseFloat(p.originalPrice) || parseFloat(p.price) || 0
    }));
  }, [promotions]);

  const statusPieData = useMemo(() => [
    { name: "Active Campaigns", value: activeCount },
    { name: "Inactive / Paused", value: inactiveCount }
  ].filter(d => d.value > 0), [activeCount, inactiveCount]);

  // Filtered Promotions
  const filteredPromotions = useMemo(() => {
    return promotions.filter(p => {
      const strTitle = String(p.title || '').toLowerCase();
      const strDesc = String(p.description || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || strTitle.includes(query) || strDesc.includes(query);
      const matchesStatus = statusFilter === "ALL" || 
        (statusFilter === "ACTIVE" && p.isActive) || 
        (statusFilter === "INACTIVE" && !p.isActive);
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === "date") return new Date(b.startDate || 0) - new Date(a.startDate || 0);
      if (sortBy === "price_high") return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      if (sortBy === "price_low") return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      return 0;
    });
  }, [promotions, searchQuery, statusFilter, sortBy]);

  const handleExportCSV = () => {
    exportToCSV(filteredPromotions, "marketing_promotions", [
      { key: "id", label: "Promotion ID" },
      { key: "title", label: "Campaign Title" },
      { key: "startDate", label: "Start Date" },
      { key: "endDate", label: "End Date" },
      { key: "price", label: "Offer Price (Rs)" },
      { key: "originalPrice", label: "Regular Price (Rs)" },
      { key: "discount", label: "Discount" },
      { key: "isActive", label: "Active Status" }
    ]);
  };

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <div className="row align-items-center mb-4">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-primary-soft">
              <i className="fas fa-bullhorn text-primary fa-lg"></i>
            </div>
            <div>
              <h1 className="h3 fw-bold text-dark mb-1">Marketing & Promotions Command Center</h1>
              <p className="text-muted mb-0">Design promotional campaigns, track sales conversions, and monitor revenue analytics</p>
            </div>
          </div>
        </div>
        <div className="col-auto">
          <div className="d-flex gap-2 align-items-center">
            <Link to="/calendar" className="btn btn-outline-primary rounded-pill px-4 shadow-sm fw-medium d-flex align-items-center gap-2">
              <i className="bi bi-calendar3"></i> View Marketing Calendar
            </Link>
            <button className="btn btn-outline-secondary btn-icon rounded-circle shadow-sm" onClick={handleRefresh} disabled={loading} title="Refresh Data">
              <i className={`fas fa-sync-alt ${loading ? "fa-spin" : ""}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="row g-3 mb-4">
        <StatCard title="Total Campaigns" value={promotions.length} sub="All historical offers & deals" icon="bi-tags" loading={loading} />
        <StatCard title="Active Promotions" value={activeCount} sub="Currently live on client portal" icon="bi-broadcast" loading={loading} highlight={activeCount > 0} />
        <StatCard title="Inactive Offers" value={inactiveCount} sub="Expired or paused campaigns" icon="bi-archive" loading={loading} />
        <StatCard title="Average Discount" value={avgDiscount} sub="Across all tour promotions" icon="bi-percent" loading={loading} />
      </div>

      {/* Analytics Visualizations */}
      <div className="row g-4 mb-4">
        <div className="col-xl-8">
          <div className="card modern-card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 py-3 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0">Campaign Pricing vs. Regular Price Impact</h6>
              <span className="badge bg-light text-muted border">Top 6 Offers</span>
            </div>
            <div className="card-body" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: "#6c757d", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#6c757d", fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Legend />
                  <Bar dataKey="Original" name="Regular Price (Rs)" fill="#E0E0E0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Price" name="Promo Offer (Rs)" fill="#2F80ED" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card modern-card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 py-3">
              <h6 className="fw-bold text-dark mb-0">Campaign Status Ratio</h6>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                    {statusPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="d-flex border-bottom mb-4 gap-2">
        <button
          className={`btn btn-lg px-4 py-2 rounded-top-3 fw-semibold border-0 transition-all ${activeTab === "promotions" ? "bg-white text-primary border-bottom border-primary border-3 shadow-sm" : "bg-transparent text-muted"}`}
          onClick={() => setActiveTab("promotions")}
        >
          <i className="bi bi-tags-fill me-2"></i> Tour Promotions
        </button>
        <button
          className={`btn btn-lg px-4 py-2 rounded-top-3 fw-semibold border-0 transition-all ${activeTab === "reports" ? "bg-white text-primary border-bottom border-primary border-3 shadow-sm" : "bg-transparent text-muted"}`}
          onClick={() => setActiveTab("reports")}
        >
          <i className="bi bi-bar-chart-line-fill me-2"></i> Sales & Analytics Reports
        </button>
        <button
          className={`btn btn-lg px-4 py-2 rounded-top-3 fw-semibold border-0 transition-all ${activeTab === "payments" ? "bg-white text-primary border-bottom border-primary border-3 shadow-sm" : "bg-transparent text-muted"}`}
          onClick={() => setActiveTab("payments")}
        >
          <i className="bi bi-credit-card-fill me-2"></i> Payment Transactions
        </button>
      </div>

      {/* Tab 1: Promotions Management */}
      {activeTab === "promotions" && (
        <div className="card modern-card border-0 shadow-sm mb-5">
          <div className="card-header bg-transparent border-0 py-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h5 className="fw-bold text-dark mb-0">Active Marketing Campaigns Directory</h5>
              <span className="text-muted small">Managing {filteredPromotions.length} promotional offers</span>
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <input
                type="text"
                className="form-control form-control-sm modern-input"
                placeholder="Search campaign title or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "240px" }}
              />
              <select
                className="form-select form-select-sm modern-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: "140px" }}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active Only</option>
                <option value="INACTIVE">Inactive Only</option>
              </select>
              <select
                className="form-select form-select-sm modern-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: "140px" }}
              >
                <option value="date">Date Schedule</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
              </select>
              <button className="btn btn-outline-secondary btn-sm rounded-pill px-3 shadow-sm" onClick={handleExportCSV}>
                <i className="fas fa-file-csv me-1"></i> Export CSV
              </button>
              <button className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm fw-medium d-flex align-items-center gap-1" onClick={handleAddPromotion}>
                <i className="bi bi-plus-lg"></i> New Promotion
              </button>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 modern-table">
                <thead>
                  <tr>
                    <th className="ps-4">Campaign Title & Info</th>
                    <th>Schedule Period</th>
                    <th>Offer Pricing</th>
                    <th>Discount Deal</th>
                    <th className="text-center">Status</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPromotions.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-5 text-muted">No promotions found matching your criteria. Click "New Promotion" to launch one!</td></tr>
                  ) : (
                    filteredPromotions.map(promo => (
                      <tr key={promo.id} className="modern-table-row">
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                                 style={{ width: "42px", height: "42px", backgroundColor: promo.color === 'red' ? '#EB5757' : promo.color === 'green' ? '#27AE60' : promo.color === 'purple' ? '#9B51E0' : '#2F80ED' }}>
                              <i className="bi bi-tag-fill"></i>
                            </div>
                            <div>
                              <span className="d-block fw-bold text-dark">{promo.title}</span>
                              <span className="text-muted small d-inline-block text-truncate" style={{ maxWidth: "220px" }}>{promo.description || "No description provided"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small fw-medium text-dark">{formatPromotionDateRange(promo.startDate, promo.endDate)}</div>
                          {promo.time && <div className="text-muted small"><i className="bi bi-clock me-1"></i>{promo.time}</div>}
                        </td>
                        <td>
                          <div>
                            <span className="fs-6 fw-bold text-primary">Rs {promo.price || 0}</span>
                            {promo.originalPrice && (
                              <span className="text-muted text-decoration-line-through small ms-2">Rs {promo.originalPrice}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          {promo.discount ? (
                            <span className="badge bg-danger text-white px-2 py-1 rounded-1">{promo.discount}% OFF</span>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                        <td className="text-center">
                          <StatusBadge active={promo.isActive} />
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-inline-flex gap-1">
                            <button
                              className={`btn btn-icon btn-sm ${promo.isActive ? 'btn-outline-secondary' : 'btn-outline-success'} rounded-circle`}
                              onClick={() => handleToggleActive(promo.id)}
                              title={promo.isActive ? "Pause Campaign" : "Activate Campaign"}
                            >
                              <i className={`bi ${promo.isActive ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                            </button>
                            <button
                              className="btn btn-icon btn-sm btn-outline-primary rounded-circle"
                              onClick={() => handleEditPromotion(promo)}
                              title="Edit Campaign"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-icon btn-sm btn-outline-danger rounded-circle"
                              onClick={() => handleDeletePromotion(promo.id)}
                              title="Delete Campaign"
                            >
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
      )}

      {/* Tab 2: Reports */}
      {activeTab === "reports" && (
        <div className="card modern-card border-0 shadow-sm p-4 mb-5">
          <Reports promotions={promotions} />
        </div>
      )}

      {/* Tab 3: Payments */}
      {activeTab === "payments" && (
        <div className="card modern-card border-0 shadow-sm p-4 mb-5">
          <PaymentHistory />
        </div>
      )}

      {/* Add / Edit Promotion Modal */}
      {showFormModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modern-card border-0 shadow-lg overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 py-3">
                <h5 className="modal-title fw-bold">
                  {editingPromotion ? "Edit Marketing Campaign" : "Launch New Tour Promotion"}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowFormModal(false)}></button>
              </div>
              <div className="modal-body p-4 max-h-80vh overflow-auto">
                <AdminEventForm
                  promotion={editingPromotion}
                  onSave={handleSavePromotion}
                  onCancel={() => setShowFormModal(false)}
                  isEditing={!!editingPromotion}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}