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
    COMPLETED: { class: "success", icon: "bi-check-circle-fill", bg: "bg-success-soft" },
    CONFIRMED: { class: "primary", icon: "bi-check-lg", bg: "bg-primary-soft" },
    PENDING: { class: "warning", icon: "bi-clock", bg: "bg-warning-soft" },
    CANCELLED: { class: "danger", icon: "bi-x-circle", bg: "bg-danger-soft" },
    REFUNDED: { class: "info", icon: "bi-arrow-return-left", bg: "bg-info-soft" },
  };
  
  const config = statusConfig[status] || { class: "secondary", icon: "bi-question", bg: "bg-secondary-soft" };
  
  return (
    <span className={`badge ${config.bg} text-${config.class} border border-${config.class} d-flex align-items-center gap-1 px-2 py-1 rounded-pill`}
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
    <div className="d-flex align-items-center gap-3">
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
        style={{ 
          width: '48px', 
          height: '48px', 
          backgroundColor: color, 
          fontSize: '14px',
          flex: '0 0 48px'
        }}
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

// Modern Card Component
const ModernCard = ({ children, className = "" }) => (
  <div className={`card modern-card border-0 shadow-sm ${className}`}>
    {children}
  </div>
);

// Modern Table Skeleton
const TableRowSkeleton = () => (
  <tr>
    {[...Array(4)].map((_, i) => (
      <td key={i}>
        <div className="skeleton-line" style={{ 
          width: i === 0 ? '80%' : i === 3 ? '100px' : '60%',
          height: i === 0 ? '20px' : '16px'
        }}></div>
      </td>
    ))}
  </tr>
);

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
    <th className="cursor-pointer user-select-none" onClick={() => handleSort(field)} style={{ minWidth: '140px' }}>
      <div className="d-flex align-items-center gap-1">
        {children}
        <i className={`bi bi-arrow-${sortField === field ? (sortDirection === 'asc' ? 'up' : 'down') : 'up-down'} text-muted small`} />
      </div>
    </th>
  );

  return (
    <ModernCard className="modern-table-card">
      <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center py-4">
        <div>
          <h5 className="fw-bold mb-0 text-dark">{title}</h5>
          <span className="text-muted small">{sortedRows.length} reservations found</span>
        </div>
      </div>
      
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 modern-table">
            <thead className="table-light">
              <tr>
                <SortableHeader field="customer">Customer</SortableHeader>
                <SortableHeader field="tourType">Package</SortableHeader>
                <SortableHeader field="date">Travel Date</SortableHeader>
                <th className="text-center">Status</th>         
              </tr>
            </thead>
            <tbody>
              {!rows ? (
                [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
              ) : sortedRows.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center">
                      <i className="bi bi-calendar-x display-4 text-muted mb-3 opacity-25" />
                      <h5 className="text-muted mb-2">No reservations found</h5>
                      <p className="text-muted mb-3">There are no recent reservations to display.</p>
                      <NavLink to="/reservation" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-2" /> Create First Booking
                      </NavLink>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedRows.map((booking) => (
                  <tr key={booking.reservationId} className="modern-table-row">
                    <td className="ps-4">
                      <CustomerAvatar name={booking.customer} email={booking.email} />
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-semibold text-dark">{booking.tourType}</span>
                        <span className="text-muted small">#{booking.code}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-medium text-dark">
                          {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-muted small">
                          {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                      </div>
                    </td>
                    <td className="text-center pe-4">
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {rows && rows.length > 0 && (
          <div className="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
            <span className="text-muted small">
              Showing <strong>{Math.min(sortedRows.length, 10)}</strong> of <strong>{sortedRows.length}</strong> reservations
            </span>
          </div>
        )}
      </div>
    </ModernCard>
  );
};

// ----- Stat Card -----
const StatCard = ({ title, value, sub, icon, loading = false }) => (
  <div className="col-12 col-md-6 col-xl-3">
    <div className="card border-0 shadow-sm h-100 modern-card kpi-card">
      <div className="card-body d-flex justify-content-between align-items-center py-4">
        <div className="flex-grow-1">
          <div className="text-uppercase small fw-semibold text-muted mb-2">{title}</div>
          {loading ? (
            <div className="skeleton-line mb-2" style={{ width: '80%', height: '28px' }}></div>
          ) : (
            <div className="fs-3 fw-bold text-dark mb-1">{value}</div>
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

// Chart Skeleton Component
const ChartSkeleton = () => (
  <div className="skeleton-chart">
    <div className="skeleton-line mb-3" style={{ width: '30%', height: '20px' }}></div>
    <div className="skeleton-bars">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton-bar" style={{ height: `${Math.random() * 80 + 20}px` }}></div>
      ))}
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
    try { 
      setLoading(true); 
      setError(""); 
      const res = await fetchDashboard({ months }); 
      setData(res); 
    }
    catch (e) { 
      console.error(e); 
      setError(e?.response?.data?.message || "Failed to load dashboard."); 
    }
    finally { 
      setLoading(false); 
    }
  }

  useEffect(() => { 
    load();
  }, [months]);

  const series = useMemo(() => (data?.earningSeries ?? []).map((d) => ({ month: d.monthLabel, value: d.value })), [data]);

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <div className="row align-items-center mb-4">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-primary-soft">
              <i className="fas fa-chart-line text-primary fa-lg"></i>
            </div>
            <div>
              <h1 className="h3 fw-bold text-dark mb-1">Dashboard Overview</h1>
              <p className="text-muted mb-0">Welcome back, {data?.name ?? "General Manager"}</p>
            </div>
          </div>
        </div>
        <div className="col-auto">
          <div className="d-flex gap-2 align-items-center">
            <select 
              className="form-select modern-input form-select-sm" 
              value={months} 
              onChange={(e) => setMonths(parseInt(e.target.value, 10))}
            >
              <option value={3}>Last 3 months</option>
              <option value={6}>Last 6 months</option>
              <option value={9}>Last 9 months</option>
              <option value={12}>Last 12 months</option>
            </select>
            <button 
              className="btn btn-outline-primary btn-icon rounded-circle"
              onClick={load}
              disabled={loading}
            >
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <ModernCard className="border-left-danger mb-4">
          <div className="card-body py-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-exclamation-triangle text-danger me-3 fa-lg"></i>
              <div className="flex-grow-1">
                <h6 className="fw-semibold text-dark mb-1">Error Loading Dashboard</h6>
                <p className="text-muted mb-0">{error}</p>
              </div>
              <button 
                className="btn-close" 
                onClick={() => setError("")}
              ></button>
            </div>
          </div>
        </ModernCard>
      )}

      {loading && !data ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="row g-3 mb-4">
            <StatCard 
              title="Net Earnings" 
              value={currency(data?.totalEarningsNet)} 
              sub={`Gross ${currency(data?.totalEarningsGross)} · Refunds ${currency(data?.totalRefunds)}`} 
              icon="bi-cash-coin"
              loading={loading}
            />
            <StatCard 
              title="Total Bookings" 
              value={data?.totalBookings ?? 0} 
              sub={`Completed ${data?.completedBookings ?? 0}`} 
              icon="bi-journal-check"
              loading={loading}
            />
            <StatCard 
              title="Active Users" 
              value={data?.activeUsers ?? 0} 
              sub="Last 90 days" 
              icon="bi-people"
              loading={loading}
            />
            <StatCard 
              title="Data Window" 
              value={`${months} months`} 
              sub="Adjust with filters" 
              icon="bi-sliders"
              loading={loading}
            />
          </div>

          {/* Charts Row */}
          <div className="row g-4 mb-4">
            <div className="col-xl-8">
              <ModernCard>
                <div className="card-header bg-transparent border-0 py-4">
                  <h6 className="fw-semibold text-dark mb-0">Monthly Earnings</h6>
                </div>
                <div className="card-body" style={{ height: 340 }}>
                  {loading ? (
                    <ChartSkeleton />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={series} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fill: '#6c757d' }}
                          axisLine={{ stroke: '#e9ecef' }}
                        />
                        <YAxis 
                          tick={{ fill: '#6c757d' }}
                          axisLine={{ stroke: '#e9ecef' }}
                          tickFormatter={(value) => currency(value).replace('$', '$')}
                        />
                        <Tooltip 
                          formatter={(value) => [currency(value), 'Earnings']}
                          labelFormatter={(label) => `Month: ${label}`}
                          contentStyle={{ 
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          strokeWidth={3} 
                          stroke="#2F80ED"
                          dot={{ fill: '#2F80ED', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#2F80ED' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </ModernCard>
            </div>

            <div className="col-xl-4">
              <ModernCard className="h-100">
              <div className="card h-100 border-0 modern-card">
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
              </ModernCard>
            </div>
          </div>

          {/* Recent Reservations Table */}
          <div className="row g-4">
            <TableCard rows={data?.recentBookings ?? []} title="Recent Reservations" />
          </div>
        </>
      )}

      {/* Modern Styles */}
      <style jsx>{`
        .modern-card {
          border-radius: 16px;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          transition: all 0.3s ease;
        }
        
        .modern-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
        
        .modern-table {
          border: none;
          margin-bottom: 0;
        }
        
        .modern-table thead th {
          border: none;
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6c757d;
          padding: 1rem 1.5rem;
          background-color: #f8f9fa;
        }
        
        .modern-table tbody td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f1f3f4;
          vertical-align: middle;
        }
        
        .modern-table-row {
          transition: all 0.2s ease;
          border-left: 4px solid transparent;
        }
        
        .modern-table-row:hover {
          background-color: rgba(47, 128, 237, 0.04) !important;
          border-left-color: #2F80ED;
          transform: translateX(4px);
        }
        
        .kpi-card {
          background: linear-gradient(135deg, #ffffff 0%, #f9fbff 100%);
          border-left: 4px solid #2F80ED;
        }
        
        .theme-accent { 
          color: #2F80ED; 
        }
        
        .bg-primary-soft {
          background-color: rgba(47, 128, 237, 0.1) !important;
        }
        
        .bg-success-soft {
          background-color: rgba(39, 174, 96, 0.1) !important;
        }
        
        .bg-warning-soft {
          background-color: rgba(242, 153, 74, 0.1) !important;
        }
        
        .bg-danger-soft {
          background-color: rgba(235, 87, 87, 0.1) !important;
        }
        
        .bg-info-soft {
          background-color: rgba(86, 204, 242, 0.1) !important;
        }
        
        .bg-secondary-soft {
          background-color: rgba(108, 117, 125, 0.1) !important;
        }
        
        .border-left-danger {
          border-left: 4px solid #EB5757 !important;
        }
        
        .skeleton-line {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 6px;
        }
        
        .skeleton-chart {
          padding: 20px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .skeleton-bars {
          display: flex;
          align-items: end;
          gap: 12px;
          height: 100%;
          padding-bottom: 30px;
        }
        
        .skeleton-bar {
          flex: 1;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px 4px 0 0;
          min-height: 20px;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .modern-input {
          border-radius: 12px;
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
          background: #fff;
        }
        
        .modern-input:focus {
          border-color: #2F80ED;
          box-shadow: 0 0 0 0.2rem rgba(47, 128, 237, 0.1);
        }
        
        .btn-icon {
          width: 38px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .btn-icon:hover {
          transform: scale(1.05);
        }
        
        .table-responsive {
          overflow-x: hidden !important;
        }
        
        .cursor-pointer { 
          cursor: pointer; 
        }
      `}</style>
    </div>
  );
}