import React, { useEffect, useMemo, useState } from "react";
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
  changePassword,
} from "../../api/Client";

const emptyForm = {
  firstName: "",
  lastName: "",
  gender: "MALE",
  nic: "",
  email: "",
  password: "",
  phone: "",
};

export default function ClientsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const [showPwd, setShowPwd] = useState(false);
  const [pwdTarget, setPwdTarget] = useState(null);
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwdErrors, setPwdErrors] = useState({});

  const isAuthenticated = useMemo(() => {
    return !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
  }, []);

  async function load() {
    if (!isAuthenticated) {
      setError("Please log in to access this page.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetchClients({ q, page, size, sort: "createdAt" });
      setData(res.content || []);
      setTotal(res.totalElements || 0);
    } catch (error) {
      console.error("Failed to load clients:", error);
      if (error.response?.status === 403) {
        setError("Access denied. You don't have permission to view clients.");
      } else if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError("Failed to load clients. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [q, page, size, isAuthenticated]);

  function onCreate() {
    if (!isAuthenticated) {
      alert("Please log in to create clients.");
      return;
    }
    setEditId(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowForm(true);
  }

  function onEdit(client) {
    if (!isAuthenticated) {
      alert("Please log in to edit clients.");
      return;
    }
    setEditId(client.userID);
    setForm({
      firstName: client.firstName || "",
      lastName: client.lastName || "",
      gender: client.gender || "MALE",
      nic: client.nic || "",
      email: client.email || "",
      phone: client.phone || "",
      password: "",
    });
    setFormErrors({});
    setShowForm(true);
  }

  function validateForm() {
    const errors = {};
    
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Email is invalid";
    }
    if (!form.nic.trim()) errors.nic = "NIC is required";
    if (!form.phone.trim()) errors.phone = "Phone is required";
    if (!editId && !form.password) {
      errors.password = "Password is required";
    } else if (!editId && form.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmitForm(e) {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editId == null) {
        await createClient(form);
      } else {
        await updateClient(editId, form);
      }
      setShowForm(false);
      await load();
    } catch (error) {
      console.error("Failed to save client:", error);
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        alert(error?.response?.data?.message || "Failed to save client. Please try again.");
      }
    }
  }

  async function onDelete(id) {
    if (!isAuthenticated) {
      alert("Please log in to delete clients.");
      return;
    }

    if (!window.confirm("Delete this client? This action cannot be undone.")) return;
    
    try {
      await deleteClient(id);
      await load();
    } catch (err) {
      const msg = err?.response?.data?.message || "Delete failed. Please try again.";
      alert(msg);
    }
  }

  function openPwd(id) {
    if (!isAuthenticated) {
      alert("Please log in to change passwords.");
      return;
    }
    setPwdTarget(id);
    setPwdForm({ currentPassword: "", newPassword: "" });
    setPwdErrors({});
    setShowPwd(true);
  }

  function validatePasswordForm() {
    const errors = {};
    
    if (!pwdForm.currentPassword) errors.currentPassword = "Current password is required";
    if (!pwdForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (pwdForm.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters";
    }

    setPwdErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submitPwd(e) {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;

    try {
      await changePassword(pwdTarget, pwdForm);
      setShowPwd(false);
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Failed to change password:", error);
      if (error.response?.data?.errors) {
        setPwdErrors(error.response.data.errors);
      } else {
        alert(error?.response?.data?.message || "Failed to change password. Please try again.");
      }
    }
  }

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / size)), [total, size]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "-";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-warning text-center">
              <h4>Authentication Required</h4>
              <p>Please log in to access the clients management system.</p>
              <a href="/login" className="btn btn-primary">Go to Login</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="mb-0">Manage Clients</h3>
          <small className="text-muted">Total: {total} clients</small>
        </div>
        <button className="btn btn-primary" onClick={onCreate}>
          <i className="fa fa-plus me-2" /> New Client
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fa fa-exclamation-triangle me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      <div className="card shadow">
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-sm-6 col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa fa-search"></i>
                </span>
                <input
                  className="form-control"
                  placeholder="Search name, email, or NIC..."
                  value={q}
                  onChange={(e) => {
                    setPage(0);
                    setQ(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-sm-6 col-md-4 ms-auto">
              <select
                className="form-select"
                value={size}
                onChange={(e) => {
                  setPage(0);
                  setSize(parseInt(e.target.value, 10));
                }}
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th width="80">ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>NIC</th>
                  <th>Phone</th>
                  <th width="100">Gender</th>
                  <th width="180">Created</th>
                  <th width="160">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm me-2" />
                      Loading clients...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-4">
                      <i className="fa fa-users me-2"></i>
                      {q ? "No clients match your search criteria." : "No clients found."}
                    </td>
                  </tr>
                ) : (
                  data.map((client) => (
                    <tr key={client.userID}>
                      <td className="fw-bold">#{client.userID}</td>
                      <td>
                        <strong>{client.firstName} {client.lastName}</strong>
                      </td>
                      <td>{client.email}</td>
                      <td>
                        <code>{client.nic || "-"}</code>
                      </td>
                      <td>{client.phone || "-"}</td>
                      <td>
                        <span className={`badge ${
                          client.gender === 'MALE' ? 'bg-primary' : 'bg-primary'
                        }`}>
                          {client.gender}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {formatDate(client.createdAt)}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEdit(client)}
                            title="Edit Client"
                          >
                            <i className="fa fa-edit" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => openPwd(client.userID)}
                            title="Change Password"
                          >
                            <i className="fa fa-key" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(client.userID)}
                            title="Delete Client"
                          >
                            <i className="fa fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!error && total > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Showing <strong>{total === 0 ? 0 : page * size + 1}</strong> to{" "}
                <strong>{Math.min((page + 1) * size, total)}</strong> of{" "}
                <strong>{total}</strong> clients
              </div>
              <div className="btn-group">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page === 0}
                  onClick={() => setPage(0)}
                  title="First Page"
                >
                  <i className="fa fa-angle-double-left" />
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  title="Previous Page"
                >
                  <i className="fa fa-angle-left" />
                </button>
                <span className="btn btn-outline-secondary btn-sm disabled">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  title="Next Page"
                >
                  <i className="fa fa-angle-right" />
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage(totalPages - 1)}
                  title="Last Page"
                >
                  <i className="fa fa-angle-double-right" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <form className="modal-content" onSubmit={onSubmitForm}>
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fa fa-user me-2"></i>
                  {editId ? "Edit Client" : "Create New Client"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowForm(false)}
                />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name *</label>
                    <input
                      className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                      value={form.firstName}
                      onChange={(e) => {
                        setForm({ ...form, firstName: e.target.value });
                        if (formErrors.firstName) setFormErrors({...formErrors, firstName: ''});
                      }}
                      required
                      maxLength={50}
                    />
                    {formErrors.firstName && (
                      <div className="invalid-feedback">{formErrors.firstName}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name *</label>
                    <input
                      className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                      value={form.lastName}
                      onChange={(e) => {
                        setForm({ ...form, lastName: e.target.value });
                        if (formErrors.lastName) setFormErrors({...formErrors, lastName: ''});
                      }}
                      required
                      maxLength={50}
                    />
                    {formErrors.lastName && (
                      <div className="invalid-feedback">{formErrors.lastName}</div>
                    )}
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label">Gender *</label>
                    <select
                      className="form-select"
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label">NIC *</label>
                    <input
                      className={`form-control ${formErrors.nic ? 'is-invalid' : ''}`}
                      value={form.nic}
                      onChange={(e) => {
                        setForm({ ...form, nic: e.target.value });
                        if (formErrors.nic) setFormErrors({...formErrors, nic: ''});
                      }}
                      required
                      maxLength={20}
                    />
                    {formErrors.nic && (
                      <div className="invalid-feedback">{formErrors.nic}</div>
                    )}
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label">Phone *</label>
                    <input
                      className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                      value={form.phone}
                      onChange={(e) => {
                        setForm({ ...form, phone: e.target.value });
                        if (formErrors.phone) setFormErrors({...formErrors, phone: ''});
                      }}
                      required
                      maxLength={15}
                    />
                    {formErrors.phone && (
                      <div className="invalid-feedback">{formErrors.phone}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (formErrors.email) setFormErrors({...formErrors, email: ''});
                      }}
                      required
                      maxLength={100}
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback">{formErrors.email}</div>
                    )}
                  </div>

                  {!editId && (
                    <div className="col-md-6">
                      <label className="form-label">Password *</label>
                      <input
                        type="password"
                        className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                        value={form.password}
                        onChange={(e) => {
                          setForm({ ...form, password: e.target.value });
                          if (formErrors.password) setFormErrors({...formErrors, password: ''});
                        }}
                        required
                        minLength={8}
                        placeholder="Minimum 8 characters"
                      />
                      {formErrors.password && (
                        <div className="invalid-feedback">{formErrors.password}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  <i className="fa fa-save me-2"></i>
                  {editId ? "Update Client" : "Create Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPwd && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={submitPwd}>
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">
                  <i className="fa fa-key me-2"></i>
                  Change Password
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPwd(false)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Current Password *</label>
                  <input
                    type="password"
                    className={`form-control ${pwdErrors.currentPassword ? 'is-invalid' : ''}`}
                    value={pwdForm.currentPassword}
                    onChange={(e) => {
                      setPwdForm({ ...pwdForm, currentPassword: e.target.value });
                      if (pwdErrors.currentPassword) setPwdErrors({...pwdErrors, currentPassword: ''});
                    }}
                    required
                  />
                  {pwdErrors.currentPassword && (
                    <div className="invalid-feedback">{pwdErrors.currentPassword}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password *</label>
                  <input
                    type="password"
                    className={`form-control ${pwdErrors.newPassword ? 'is-invalid' : ''}`}
                    minLength={8}
                    value={pwdForm.newPassword}
                    onChange={(e) => {
                      setPwdForm({ ...pwdForm, newPassword: e.target.value });
                      if (pwdErrors.newPassword) setPwdErrors({...pwdErrors, newPassword: ''});
                    }}
                    required
                    placeholder="Minimum 8 characters"
                  />
                  {pwdErrors.newPassword && (
                    <div className="invalid-feedback">{pwdErrors.newPassword}</div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setShowPwd(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-warning" type="submit">
                  <i className="fa fa-key me-2"></i>
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}