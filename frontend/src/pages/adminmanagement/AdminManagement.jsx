import React, { useEffect, useMemo, useState } from "react";
import {
  fetchAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  changeAdminPassword,
} from "../../api/Admin";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  role: "",
};

export default function AdminsPage() {
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
      const res = await fetchAdmins({ q, page, size, sort: "createdAt" });
      setData(res.content || []);
      setTotal(res.totalElements || 0);
    } catch (error) {
      console.error("Failed to load admins:", error);
      if (error.response?.status === 403) {
        setError("Access denied. You don't have permission to view admins.");
      } else if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError("Failed to load admins. Please try again.");
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
      alert("Please log in to create admins.");
      return;
    }
    setEditId(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowForm(true);
  }

  function onEdit(admin) {
    if (!isAuthenticated) {
      alert("Please log in to edit admins.");
      return;
    }
    setEditId(admin.adminID);
    setForm({
      firstName: admin.fName || "",
      lastName: admin.lName || "",
      email: admin.email || "",
      phone: admin.phone || "",
      password: "",
      role: admin.role || "ADMIN",
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
    if (!form.phone.trim()) errors.phone = "Phone is required";
    if (!editId && !form.password) {
      errors.password = "Password is required";
    } else if (!editId && form.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!form.role) errors.role = "Role is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmitForm(e) {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editId == null) {
        await createAdmin({
          fName: form.firstName,
          lName: form.lastName,
          role: form.role,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
      } else {
        await updateAdmin(editId, {
          fName: form.firstName,
          lName: form.lastName,
          role: form.role,
          email: form.email,
          phone: form.phone,
        });
      }
      setShowForm(false);
      await load();
    } catch (error) {
      console.error("Failed to save admin:", error);
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        alert(error?.response?.data?.message || "Failed to save admin. Please try again.");
      }
    }
  }

  async function onDelete(id) {
    if (!isAuthenticated) {
      alert("Please log in to delete admins.");
      return;
    }

    if (!window.confirm("Delete this admin? This action cannot be undone.")) return;

    try {
      await deleteAdmin(id);
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
      await changeAdminPassword(pwdTarget, pwdForm);
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
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
              <p>Please log in to access the admins management system.</p>
              <a href="/login" className="btn btn-primary">
                Go to Login
              </a>
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
          <h3 className="mb-0">Manage Admins</h3>
          <small className="text-muted">Total: {total} admins</small>
        </div>
        <button className="btn btn-primary" onClick={onCreate}>
          <i className="fa fa-plus me-2" /> New Admin
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
                  placeholder="Search name, email..."
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
                  <th>Role</th>
                  <th>Phone</th>
                  <th width="100">Created</th>
                  <th width="160">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm me-2" />
                      Loading admins...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      <i className="fa fa-users me-2"></i>
                      {q ? "No admins match your search criteria." : "No admins found."}
                    </td>
                  </tr>
                ) : (
                  data.map((admin) => (
                    <tr key={admin.adminID}>
                      <td className="fw-bold">#{admin.adminID}</td>
                      <td>
                        <strong>{admin.fName} {admin.lName}</strong>
                      </td>
                      <td>{admin.email}</td>
                      <td>{admin.role}</td>
                      <td>{admin.phone}</td>
                      <td className="text-muted small">
                        {formatDate(admin.createdAt)}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEdit(admin)}
                            title="Edit Admin"
                          >
                            <i className="fa fa-edit" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => openPwd(admin.adminID)}
                            title="Change Password"
                          >
                            <i className="fa fa-key" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(admin.adminID)}
                            title="Delete Admin"
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
                <strong>{total}</strong> admins
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
                  
                  <div className="col-md-6">
                    <label className="form-label">Role *</label>
                    <select
                      className="form-select"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="GENERAL_MANAGER">GENERAL MANAGER</option>
                      <option value="SENIOR_TRAVEL_CONSULTANT">SENIOR TRAVEL CONSULTANT</option>
                      <option value="CUSTOMER_SERVICE_EXECUTIVE">CUSTOMER SERVICE EXECUTIVE</option>
                      <option value="MARKETING_MANAGER">MARKETING MANAGER</option>
                    </select>
                  </div>

                  <div className="col-md-6">
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
      </div>
    </div>
  );
}
