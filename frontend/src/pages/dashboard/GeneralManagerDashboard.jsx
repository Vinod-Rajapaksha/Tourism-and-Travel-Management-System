import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchDashboard } from "../../api/dashboard";

// ----- Status Badge -----
const StatusBadge = ({ status }) => {
  const statusConfig = {
    COMPLETED: { class: "success", icon: "bi-check-circle-fill", bg: "bg-success-subtle" },
    CONFIRMED: { class: "primary", icon: "bi-check-lg", bg: "bg-primary-subtle" },
    PENDING: { class: "warning", icon: "bi-clock", bg: "bg-warning-subtle" },
    CANCELLED: { class: "danger", icon: "bi-x-circle", bg: "bg-danger-subtle" },
    REFUNDED: { class: "info", icon: "bi-arrow-return-left", bg: "bg-info-subtle" },
  };
  
  const config = statusConfig[status] || { class: "secondary", icon: "bi-question", bg: "bg-secondary-subtle" };
  
  return (
    <span className={`badge ${config.bg} text-${config.class} border border-${config.class} d-flex align-items-center gap-1 px-2 py-1`}
    style={{ width: "120px" }}
    >
      <i className={`bi ${config.icon} small`} />
      <span className="fw-medium">{status}</span>
    </span>
  );
};

// ----- Customer Avatar -----
const CustomerAvatar = ({ name, email }) => {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CU';
  const colors = ['#2F80ED', '#27AE60', '#F2994A', '#9B51E0', '#EB5757'];
  const color = colors[name?.length % colors.length] || '#6c757d';
  
  return (
    <div className="d-flex align-items-center gap-2">
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold small"
        style={{ width: '36px', height: '36px', backgroundColor: color, fontSize: '12px' }}
      >
        {initials}
      </div>
      <div className="d-flex flex-column">
        <span className="fw-semibold text-dark">{name}</span>
        <span className="text-muted small">{email}</span>
      </div>
    </div>
  );
};

// ----- Table Card -----
const TableCard = ({ rows, title }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const sortedRows = useMemo(() => {
    if (!rows) return [];
    return [...rows].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
  }, [rows, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('desc'); }
  };

  const SortableHeader = ({ children, field }) => (
    <th className="cursor-pointer user-select-none" onClick={() => handleSort(field)} style={{ minWidth: '120px' }}>
      <div className="d-flex align-items-center gap-1">
        {children}
        <i className={`bi bi-arrow-${sortField === field ? (sortDirection === 'asc' ? 'up' : 'down') : 'up-down'} text-muted small`} />
      </div>
    </th>
  );

  return (
    <div className="card shadow-sm border-0 modern-table-card">
      <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
        <div>
          <h5 className="fw-bold mb-0 text-dark">{title}</h5>
          <span className="text-muted small">{sortedRows.length} reservations found</span>
        </div>
      </div>
      
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <SortableHeader field="customer">Customer</SortableHeader>
                <SortableHeader field="tourType">Package</SortableHeader>
                <SortableHeader field="date">Travel Date</SortableHeader>
                <th>Status</th>         
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((booking) => (
                <tr key={booking.reservationId} className="reservation-row">
                  <td><CustomerAvatar name={booking.customer} email={booking.email} /></td>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-semibold text-dark">{booking.tourType}</span>
                      <span className="text-muted small">#{booking.code}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-medium text-dark">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-muted small">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={booking.status} /></td>
                </tr>
              ))}
              {(!rows || rows.length === 0) && (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center">
                      <i className="bi bi-calendar-x display-4 text-muted mb-3" />
                      <h5 className="text-muted mb-2">No reservations found</h5>
                      <p className="text-muted mb-3">There are no recent reservations to display.</p>
                      <NavLink to="/reservation" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-2" /> Create First Booking
                      </NavLink>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {rows && rows.length > 0 && (
          <div className="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
            <span className="text-muted small">Showing <strong>{Math.min(sortedRows.length, 10)}</strong> of <strong>{sortedRows.length}</strong> reservations</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ----- Stat Card -----
const StatCard = ({ title, value, sub, icon }) => (
  <div className="col-12 col-md-6 col-xl-3">
    <div className="card border-0 shadow-sm h-100 kpi-card">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <div className="text-uppercase small fw-semibold text-muted">{title}</div>
          <div className="fs-4 fw-bold">{value}</div>
          {sub && <div className="text-muted small mt-1">{sub}</div>}
        </div>
        <div className="display-6 theme-accent"><i className={`bi ${icon}`} /></div>
      </div>
    </div>
  </div>
);

const COLORS = ["#2F80ED", "#27AE60", "#F2994A", "#9B51E0", "#EB5757", "#56CCF2", "#6FCF97"];

// ----- Main Dashboard -----
export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [months, setMonths] = useState(9);

  const currency = (n) => (n ?? 0).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  async function load() {
    try { setLoading(true); setError(""); const res = await fetchDashboard({ months }); setData(res); }
    catch (e) { console.error(e); setError(e?.response?.data?.message || "Failed to load dashboard."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load();}, [months]);

  const series = useMemo(() => (data?.earningSeries ?? []).map((d) => ({ month: d.monthLabel, value: d.value })), [data]);

  return (
    <div className="container-fluid p-0">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="h3 mb-1">Dashboard Overview</h1>
          <div className="text-muted">Welcome back, {data?.name ?? "General Manager"}</div>
        </div>

        <div className="d-flex gap-2">
          <select className="form-select form-select-sm" value={months} onChange={(e) => setMonths(parseInt(e.target.value, 10))}>
            <option value={3}>Last 3 months</option>
            <option value={6}>Last 6 months</option>
            <option value={9}>Last 9 months</option>
            <option value={12}>Last 12 months</option>
          </select>
          <button 
            className="btn btn-outline-primary"
            onClick={load}
            disabled={loading}
            >
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
          </button>
          </div>
      </div>

      {error && <div className="alert alert-danger d-flex align-items-center" role="alert"><i className="bi bi-exclamation-triangle-fill me-2" />{error}</div>}
      {loading ? <div className="text-center py-5">Loading dashboard…</div> : (
        <>
          <div className="row g-3 mb-3">
            <StatCard title="Net Earnings" value={currency(data?.totalEarningsNet)} sub={`Gross ${currency(data?.totalEarningsGross)} · Refunds ${currency(data?.totalRefunds)}`} icon="bi-cash-coin" />
            <StatCard title="Total Bookings" value={data?.totalBookings ?? 0} sub={`Completed ${data?.completedBookings ?? 0}`} icon="bi-journal-check" />
            <StatCard title="Active Users" value={data?.activeUsers ?? 0} sub="Last 90 days" icon="bi-people" />
            <StatCard title="Data Window" value={`${months} months`} sub="Adjust with filters" icon="bi-sliders" />
          </div>

          <div className="row g-4">
            <div className="col-xl-8">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white fw-semibold d-flex justify-content-between align-items-center">Monthly Earnings</div>
                <div className="card-body" style={{ height: 340 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white fw-semibold">Top Packages</div>
                <div className="card-body d-flex align-items-center justify-content-center" style={{ height: 340 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, right: 20, bottom: 0, left: 20 }}>
                      <Pie 
                        data={data?.packageShare ?? []} dataKey="value" nameKey="name" cx="50%" cy="50%" 
                        innerRadius={50} outerRadius={80} paddingAngle={2}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {(data?.packageShare ?? []).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        wrapperStyle={{
                          paddingTop: '30px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-1">
            <TableCard rows={data?.recentBookings ?? []} title="Recent Reservations" />
          </div>

          {/* Styles */}
          <style>{`
            .modern-table-card { background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.8); }
            .reservation-row { transition: all 0.2s ease; border-left: 3px solid transparent; }
            .reservation-row:hover { background-color: rgba(47, 128, 237, 0.04) !important; border-left-color: #2F80ED; transform: translateX(2px); }
            .table > :not(caption) > * > * { padding: 1rem 0.75rem; vertical-align: middle; }
            .table-responsive {overflow-x: hidden !important;}
            .cursor-pointer { cursor: pointer; }
            .dropdown-menu { border-radius: 12px; padding: 0.5rem; }
            .dropdown-item { border-radius: 8px; padding: 0.5rem 0.75rem; transition: all 0.2s ease; }
            .dropdown-item:hover { background-color: rgba(47, 128, 237, 0.1); }
            .bg-success-subtle { background-color: rgba(39, 174, 96, 0.1) !important; }
            .bg-primary-subtle { background-color: rgba(47, 128, 237, 0.1) !important; }
            .bg-warning-subtle { background-color: rgba(242, 153, 74, 0.1) !important; }
            .bg-danger-subtle { background-color: rgba(235, 87, 87, 0.1) !important; }
            .bg-info-subtle { background-color: rgba(86, 204, 242, 0.1) !important; }
            .bg-secondary-subtle { background-color: rgba(108, 117, 125, 0.1) !important; }
            .kpi-card { background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%); border-radius: 14px; }
            .theme-accent { color: #2F80ED; }
          `}</style>
        </>
      )}
    </div>
  );
}
