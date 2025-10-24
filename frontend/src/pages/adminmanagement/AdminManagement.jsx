import React, { useEffect, useMemo, useState } from "react";
import {
  fetchAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  changeAdminPassword,
} from "../../api/Admin";
import Swal from "sweetalert2";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  role: "",
};

// Modern Avatar Component
const UserAvatar = ({ name, size = "md" }) => {
  const sizes = { sm: "32px", md: "40px", lg: "48px" };
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
  const colors = ['#2F80ED', '#27AE60', '#F2994A', '#9B51E0', '#EB5757'];
  const color = colors[name?.length % colors.length] || '#6c757d';

  return (
    <div 
      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
      style={{ 
        width: sizes[size], 
        height: sizes[size], 
        backgroundColor: color,
        fontSize: size === 'sm' ? '12px' : '14px',
        flex: `0 0 ${sizes[size]}`,
        aspectRatio: '1 / 1'
      }}
    >
      {initials}
    </div>
  );
};

// Modern Action Buttons
const ActionButtons = ({ onEdit, onChangePassword, onDelete, itemId }) => (
  <div className="d-flex gap-1">
    <button
      className="btn btn-icon btn-sm btn-outline-primary rounded-circle"
      onClick={() => onEdit(itemId)}
      title="Edit"
    >
      <i className="fas fa-edit fa-xs" />
    </button>
    <button
      className="btn btn-icon btn-sm btn-outline-warning rounded-circle"
      onClick={() => onChangePassword(itemId)}
      title="Change Password"
    >
      <i className="fas fa-key fa-xs" />
    </button>
    <button
      className="btn btn-icon btn-sm btn-outline-danger rounded-circle"
      onClick={() => onDelete(itemId)}
      title="Delete"
    >
      <i className="fas fa-trash fa-xs" />
    </button>
  </div>
);

// Modern Card Component
const ModernCard = ({ children, className = "" }) => (
  <div className={`card modern-card border-0 shadow-sm ${className}`}>
    {children}
  </div>
);

// Modern Modal Component
const ModernModal = ({ show, onClose, title, children, size = "md" }) => {
  if (!show) return null;
  
  const sizeClass = {
    sm: "modal-sm",
    md: "",
    lg: "modal-lg",
    xl: "modal-xl"
  }[size];

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className={`modal-dialog modal-dialog-centered ${sizeClass}`}>
        <div className="modal-content modern-modal border-0 shadow-lg">
          <div className="modal-header bg-primary text-white border-0">
            <h5 className="modal-title fw-semibold">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Input Component
const ModernInput = ({ 
  label, 
  error, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false,
  ...props 
}) => (
  <div className="mb-3">
    {label && (
      <label className="form-label fw-semibold text-dark mb-2">
        {label} {required && <span className="text-danger">*</span>}
      </label>
    )}
    <input
      type={type}
      className={`form-control modern-input ${error ? 'is-invalid' : ''}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
    {error && <div className="invalid-feedback d-block">{error}</div>}
  </div>
);

// Role Badge Component
const RoleBadge = ({ role }) => {
  const roleConfig = {
    GENERAL_MANAGER: { color: "primary", label: "General Manager" },
    SENIOR_TRAVEL_CONSULTANT: { color: "success", label: "Senior Consultant" },
    CUSTOMER_SERVICE_EXECUTIVE: { color: "info", label: "Customer Service" },
    MARKETING_MANAGER: { color: "warning", label: "Marketing Manager" },
  };
  
  const config = roleConfig[role] || { color: "secondary", label: role };
  
  return (
    <span className={`badge bg-${config.color}-soft text-${config.color} rounded-pill px-2 py-1`}>
      {config.label}
    </span>
  );
};

// Modern Table Row Skeleton
const TableRowSkeleton = () => (
  <tr>
    {[...Array(6)].map((_, i) => (
      <td key={i}>
        <div className="skeleton-line" style={{ width: i === 1 ? '80%' : '60%' }}></div>
      </td>
    ))}
  </tr>
);

export default function ModernAdminsPage() {
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

  // Enhanced validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[-\s]/g, ''));
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const showSuccessAlert = (title, message) => {
    Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#2F80ED',
      timer: 3000,
      showConfirmButton: true
    });
  };

  const showErrorAlert = (title, message) => {
    Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#EB5757'
    });
  };

  const showConfirmDialog = (title, text, confirmButtonText = "Yes, proceed") => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2F80ED',
      cancelButtonColor: '#6c757d',
      confirmButtonText,
      cancelButtonText: 'Cancel'
    });
  };

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
        showErrorAlert("Access Denied", "You don't have permission to view admins.");
      } else if (error.response?.status === 401) {
        const result = await showConfirmDialog(
          "Session Expired", 
          "Your session has expired. Would you like to log in again?",
          "Yes, Log In"
        );
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      } else {
        setError("Failed to load admins. Please try again.");
        showErrorAlert("Loading Failed", "Failed to load admins. Please try again.");
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
      showErrorAlert("Authentication Required", "Please log in to create admins.");
      return;
    }
    setEditId(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowForm(true);
  }

  function onEdit(admin) {
    if (!isAuthenticated) {
      showErrorAlert("Authentication Required", "Please log in to edit admins.");
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

    // First Name validation
    if (!form.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (form.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    } else if (form.firstName.trim().length > 50) {
      errors.firstName = "First name cannot exceed 50 characters";
    }

    // Last Name validation
    if (!form.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (form.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    } else if (form.lastName.trim().length > 50) {
      errors.lastName = "Last name cannot exceed 50 characters";
    }

    // Email validation
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!form.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!validatePhone(form.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    // Role validation
    if (!form.role) {
      errors.role = "Role is required";
    }

    // Password validation (only for new admins)
    if (!editId) {
      if (!form.password) {
        errors.password = "Password is required";
      } else if (!validatePassword(form.password)) {
        errors.password = "Password must be at least 8 characters long";
      }
    }

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
        showSuccessAlert("Admin Created", "Admin has been created successfully!");
      } else {
        await updateAdmin(editId, {
          fName: form.firstName,
          lName: form.lastName,
          role: form.role,
          email: form.email,
          phone: form.phone,
        });
        showSuccessAlert("Admin Updated", "Admin information has been updated successfully!");
      }
      setShowForm(false);
      await load();
    } catch (error) {
      console.error("Failed to save admin:", error);
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        const errorMessage = error?.response?.data?.message || "Failed to save admin. Please try again.";
        showErrorAlert("Save Failed", errorMessage);
      }
    }
  }

  async function onDelete(id) {
    if (!isAuthenticated) {
      showErrorAlert("Authentication Required", "Please log in to delete admins.");
      return;
    }

    const admin = data.find(a => a.adminID === id);
    const adminName = admin ? `${admin.fName} ${admin.lName}` : 'this admin';

    // Prevent self-deletion
    const currentUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    if (currentUser.adminID === id) {
      showErrorAlert("Cannot Delete", "You cannot delete your own account.");
      return;
    }

    const result = await showConfirmDialog(
      "Confirm Delete",
      `Are you sure you want to delete ${adminName}? This action cannot be undone.`,
      "Yes, Delete"
    );

    if (!result.isConfirmed) return;

    try {
      await deleteAdmin(id);
      showSuccessAlert("Admin Deleted", `${adminName} has been deleted successfully.`);
      await load();
    } catch (err) {
      const msg = err?.response?.data?.message || "Delete failed. Please try again.";
      showErrorAlert("Delete Failed", msg);
    }
  }

  function openPwd(id) {
    if (!isAuthenticated) {
      showErrorAlert("Authentication Required", "Please log in to change passwords.");
      return;
    }
    setPwdTarget(id);
    setPwdForm({ currentPassword: "", newPassword: "" });
    setPwdErrors({});
    setShowPwd(true);
  }

  function validatePasswordForm() {
    const errors = {};

    if (!pwdForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!pwdForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (pwdForm.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters";
    } else if (pwdForm.currentPassword === pwdForm.newPassword) {
      errors.newPassword = "New password must be different from current password";
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
      showSuccessAlert("Password Updated", "Password has been changed successfully!");
    } catch (error) {
      console.error("Failed to change password:", error);
      if (error.response?.data?.errors) {
        setPwdErrors(error.response.data.errors);
      } else {
        const errorMessage = error?.response?.data?.message || "Failed to change password. Please try again.";
        showErrorAlert("Password Change Failed", errorMessage);
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
        <div className="row justify-content-center min-vh-50">
          <div className="col-md-6">
            <ModernCard className="text-center">
              <div className="card-body py-5">
                <div className="display-1 text-muted mb-4">
                  <i className="fas fa-lock"></i>
                </div>
                <h3 className="fw-bold text-dark mb-3">Authentication Required</h3>
                <p className="text-muted mb-4">Please log in to access the admin management system.</p>
                <a href="/login" className="btn btn-primary btn-lg px-4">
                  <i className="fas fa-sign-in-alt me-2"></i>Go to Login
                </a>
              </div>
            </ModernCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <div className="row align-items-center mb-4">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3">
              <i className="fas fa-user-shield text-dark fa-lg"></i>
            </div>
            <div>
              <h1 className="h3 fw-bold text-dark mb-1">Admin Management</h1>
              <p className="text-muted mb-0">Manage your administrative team efficiently and securely</p>
            </div>
          </div>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary mt-4" onClick={onCreate}>
            <i className="fa fa-plus me-2" /> New Admin
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <ModernCard className="border-left-danger">
          <div className="card-body py-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-exclamation-triangle text-danger me-3 fa-lg"></i>
              <div className="flex-grow-1">
                <h6 className="fw-semibold text-dark mb-1">Error</h6>
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

      {/* Main Content Card */}
      <ModernCard>
        <div className="card-header bg-transparent border-0 py-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="search-box position-relative">
                <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input
                  type="text"
                  className="form-control ps-5 modern-input"
                  placeholder="Search admins by name, email, or role..."
                  value={q}
                  onChange={(e) => {
                    setPage(0);
                    setQ(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-2 justify-content-md-end">
                <select
                  className="form-select modern-input w-auto"
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
                <button 
                  className="btn btn-outline-primary"
                  onClick={load}
                  disabled={loading}
                >
                  <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 modern-table">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Admin</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Created</th>
                  <th className="text-center pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <div className="text-muted">
                        <i className="fas fa-user-shield fa-3x mb-3 opacity-25"></i>
                        <h5 className="fw-semibold">No admins found</h5>
                        <p>{q ? "No admins match your search criteria." : "Get started by creating your first admin."}</p>
                        {!q && (
                          <button className="btn btn-primary mt-2" onClick={onCreate}>
                            <i className="fas fa-plus me-2"></i>Create First Admin
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((admin) => (
                    <tr key={admin.adminID} className="modern-table-row">
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <UserAvatar name={`${admin.fName} ${admin.lName}`} />
                          <div>
                            <h6 className="fw-semibold text-dark mb-1">
                              {admin.fName} {admin.lName}
                            </h6>
                            <small className="text-muted">ID: #{admin.adminID}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium text-dark">{admin.email}</div>
                          <small className="text-muted">{admin.phone || "-"}</small>
                        </div>
                      </td>
                      <td>
                        <RoleBadge role={admin.role} />
                      </td>
                      <td>
                        <span className="fw-medium text-dark">{admin.phone || "-"}</span>
                      </td>
                      <td>
                        <small className="text-muted">{formatDate(admin.createdAt)}</small>
                      </td>
                      <td className="text-center pe-4">
                        <ActionButtons
                          onEdit={() => onEdit(admin)}
                          onChangePassword={() => openPwd(admin.adminID)}
                          onDelete={() => onDelete(admin.adminID)}
                          itemId={admin.adminID}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!error && total > 0 && (
            <div className="card-footer bg-transparent border-0 py-4">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <p className="text-muted mb-0">
                    Showing <strong>{total === 0 ? 0 : page * size + 1}</strong> to{" "}
                    <strong>{Math.min((page + 1) * size, total)}</strong> of{" "}
                    <strong>{total}</strong> admins
                  </p>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-md-end gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={page === 0}
                      onClick={() => setPage(0)}
                      title="First Page"
                    >
                      <i className="fas fa-angle-double-left"></i>
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={page === 0}
                      onClick={() => setPage(p => p - 1)}
                      title="Previous Page"
                    >
                      <i className="fas fa-angle-left"></i>
                    </button>
                    <span className="btn btn-light btn-sm disabled">
                      Page {page + 1} of {totalPages}
                    </span>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={page + 1 >= totalPages}
                      onClick={() => setPage(p => p + 1)}
                      title="Next Page"
                    >
                      <i className="fas fa-angle-right"></i>
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={page + 1 >= totalPages}
                      onClick={() => setPage(totalPages - 1)}
                      title="Last Page"
                    >
                      <i className="fas fa-angle-double-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModernCard>

      {/* Admin Form Modal */}
      <ModernModal
        show={showForm}
        onClose={() => setShowForm(false)}
        title={editId ? "Edit Admin" : "Create New Admin"}
        size="lg"
      >
        <form onSubmit={onSubmitForm}>
          <div className="row g-3">
            <div className="col-md-6">
              <ModernInput
                label="First Name"
                value={form.firstName}
                onChange={(e) => {
                  setForm({ ...form, firstName: e.target.value });
                  if (formErrors.firstName) setFormErrors({...formErrors, firstName: ''});
                }}
                error={formErrors.firstName}
                required
                maxLength={50}
                placeholder="Enter first name (2-50 characters)"
              />
            </div>
            <div className="col-md-6">
              <ModernInput
                label="Last Name"
                value={form.lastName}
                onChange={(e) => {
                  setForm({ ...form, lastName: e.target.value });
                  if (formErrors.lastName) setFormErrors({...formErrors, lastName: ''});
                }}
                error={formErrors.lastName}
                required
                maxLength={50}
                placeholder="Enter last name (2-50 characters)"
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">Role *</label>
              <select
                className={`form-select modern-input ${formErrors.role ? 'is-invalid' : ''}`}
                value={form.role}
                onChange={(e) => {
                  setForm({ ...form, role: e.target.value });
                  if (formErrors.role) setFormErrors({...formErrors, role: ''});
                }}
              >
                <option value="">Select Role</option>
                <option value="GENERAL_MANAGER">General Manager</option>
                <option value="SENIOR_TRAVEL_CONSULTANT">Senior Travel Consultant</option>
                <option value="CUSTOMER_SERVICE_EXECUTIVE">Customer Service Executive</option>
                <option value="MARKETING_MANAGER">Marketing Manager</option>
              </select>
              {formErrors.role && <div className="invalid-feedback d-block">{formErrors.role}</div>}
            </div>

            <div className="col-md-6">
              <ModernInput
                label="Phone"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  if (formErrors.phone) setFormErrors({...formErrors, phone: ''});
                }}
                error={formErrors.phone}
                required
                maxLength={10}
                placeholder="10-digit phone number"
              />
            </div>
            
            <div className="col-md-6">
              <ModernInput
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (formErrors.email) setFormErrors({...formErrors, email: ''});
                }}
                error={formErrors.email}
                required
                maxLength={100}
                placeholder="Enter valid email address"
              />
            </div>

            {!editId && (
              <div className="col-md-6">
                <ModernInput
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (formErrors.password) setFormErrors({...formErrors, password: ''});
                  }}
                  error={formErrors.password}
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                />
              </div>
            )}
          </div>
          
          <div className="modal-footer border-0 pt-4">
            <button
              type="button"
              className="btn btn-light"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary px-4" type="submit">
              <i className="fas fa-save me-2"></i>
              {editId ? "Update Admin" : "Create Admin"}
            </button>
          </div>
        </form>
      </ModernModal>

      {/* Password Change Modal */}
      <ModernModal
        show={showPwd}
        onClose={() => setShowPwd(false)}
        title="Change Password"
      >
        <form onSubmit={submitPwd}>
          <ModernInput
            label="Current Password"
            type="password"
            value={pwdForm.currentPassword}
            onChange={(e) => {
              setPwdForm({ ...pwdForm, currentPassword: e.target.value });
              if (pwdErrors.currentPassword) setPwdErrors({...pwdErrors, currentPassword: ''});
            }}
            error={pwdErrors.currentPassword}
            required
            placeholder="Enter current password"
          />
          <ModernInput
            label="New Password"
            type="password"
            value={pwdForm.newPassword}
            onChange={(e) => {
              setPwdForm({ ...pwdForm, newPassword: e.target.value });
              if (pwdErrors.newPassword) setPwdErrors({...pwdErrors, newPassword: ''});
            }}
            error={pwdErrors.newPassword}
            required
            minLength={8}
            placeholder="Minimum 8 characters, different from current"
          />
          
          <div className="modal-footer border-0 pt-4">
            <button
              type="button"
              className="btn btn-light"
              onClick={() => setShowPwd(false)}
            >
              Cancel
            </button>
            <button className="btn btn-warning px-4" type="submit">
              <i className="fas fa-key me-2"></i>
              Update Password
            </button>
          </div>
        </form>
      </ModernModal>

      {/* Modern Styles */}
      <style jsx>{`
        .modern-card {
          border-radius: 16px;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          transition: all 0.3s ease;
        }
              
        .modern-modal {
          border-radius: 20px;
          overflow: hidden;
        }
        
        .modern-table {
          border: none;
        }
        
        .modern-table thead th {
          border: none;
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6c757d;
          padding: 1rem 1.5rem;
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
        
        .modern-input {
          border-radius: 12px;
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
        }
        
        .modern-input:focus {
          border-color: #2F80ED;
          box-shadow: 0 0 0 0.2rem rgba(47, 128, 237, 0.1);
        }
        
        .btn-icon {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .btn-icon:hover {
          transform: scale(1.1);
        }
        
        .border-left-danger {
          border-left: 4px solid #EB5757 !important;
        }
        
        .bg-primary-soft {
          background-color: rgba(47, 128, 237, 0.1) !important;
        }
        
        .bg-success-soft {
          background-color: rgba(39, 174, 96, 0.1) !important;
        }
        
        .bg-info-soft {
          background-color: rgba(86, 204, 242, 0.1) !important;
        }
        
        .bg-warning-soft {
          background-color: rgba(242, 153, 74, 0.1) !important;
        }
        
        .bg-secondary-soft {
          background-color: rgba(108, 117, 125, 0.1) !important;
        }
        
        .skeleton-line {
          height: 12px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 6px;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .search-box input:focus {
          border-color: #2F80ED;
          box-shadow: 0 0 0 0.2rem rgba(47, 128, 237, 0.1);
        }
        .table-responsive {
          overflow-x: hidden !important;
        }
      `}</style>
    </div>
  );
}