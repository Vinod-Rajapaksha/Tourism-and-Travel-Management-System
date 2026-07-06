import React, { useState, useEffect, useMemo } from 'react';
import api from "../../services/api";
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import SideNav from "../../components/SideNav";
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
    ACTIVE: { class: "success", icon: "bi-check-circle-fill", bg: "bg-success-soft" },
    INACTIVE: { class: "danger", icon: "bi-x-circle", bg: "bg-danger-soft" },
    PENDING: { class: "warning", icon: "bi-clock", bg: "bg-warning-soft" },
    Full: { class: "danger", icon: "bi-exclamation-circle", bg: "bg-danger-soft" },
    Available: { class: "success", icon: "bi-check-lg", bg: "bg-success-soft" },
  };
  const config = statusConfig[status] || { class: "secondary", icon: "bi-question", bg: "bg-secondary-soft" };
  return (
    <span className={`badge ${config.bg} text-${config.class} border border-${config.class} d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill`} style={{ fontSize: "0.8rem" }}>
      <i className={`bi ${config.icon}`} />
      <span className="fw-medium">{status}</span>
    </span>
  );
};

// ----- Avatar Component -----
const Avatar = ({ name, email }) => {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'GU';
  const colors = ['#2F80ED', '#27AE60', '#F2994A', '#9B51E0', '#EB5757'];
  const color = colors[name?.length % colors.length] || '#6c757d';
  return (
    <div className="d-flex align-items-center gap-3">
      <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: '44px', height: '44px', backgroundColor: color, fontSize: '14px', flex: '0 0 44px' }}>
        {initials}
      </div>
      <div className="d-flex flex-column text-start">
        <span className="fw-semibold text-dark">{name}</span>
        {email && <span className="text-muted small">{email}</span>}
      </div>
    </div>
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

const COLORS = ["#2F80ED", "#27AE60", "#F2994A", "#9B51E0", "#EB5757", "#56CCF2"];

const SeniorTravelConsultantDashboard = () => {
  const VALIDATION_RULES = {
    firstName: { regex: /^[a-zA-Z\s'-]{2,50}$/, message: 'First name must contain only letters (2-50 characters)' },
    lastName: { regex: /^[a-zA-Z\s'-]{2,50}$/, message: 'Last name must contain only letters (2-50 characters)' },
    phone: { regex: /^[0-9]{10}$/, message: 'Phone must be exactly 10 digits' },
    nic: { regex: /^[0-9]{9}[vVxX]$|^[0-9]{12}$/, message: 'NIC format: 9 digits + V/X or 12 digits' },
    email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
    description: { regex: /^.{10,500}$/, message: 'Description must be between 10-500 characters' },
    title: { regex: /^[a-zA-Z0-9\s\-&,']{3,100}$/, message: 'Title must be 3-100 characters' },
    price: { regex: /^\d+(\.\d{1,2})?$/, message: 'Price must be a valid number' }
  };

  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/guides')) return 'guides';
    if (path.includes('/tourpackages')) return 'packages';
    if (path.includes('/availability')) return 'availability';
    return 'dashboard';
  };

  const [currentView, setCurrentView] = useState(getCurrentView());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showViewModal, setShowViewModal] = useState(false);

  // Search & Filter State
  const [packageSearch, setPackageSearch] = useState('');
  const [packageStatusFilter, setPackageStatusFilter] = useState('ALL');
  const [packageSortBy, setPackageSortBy] = useState('title');

  const [guideSearch, setGuideSearch] = useState('');
  const [guideStatusFilter, setGuideStatusFilter] = useState('ALL');
  const [guideGenderFilter, setGuideGenderFilter] = useState('ALL');

  const [availabilitySearch, setAvailabilitySearch] = useState('');

  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    price: '',
    offer: '',
    status: 'ACTIVE'
  });

  const [guides, setGuides] = useState([]);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guideFormData, setGuideFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'MALE',
    nic: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    status: 'PENDING'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  const { user } = useAuth();
  const currentRole = user?.role;

  useEffect(() => {
    loadPackages();
    loadGuides();
    loadAvailability();
  }, []);

  useEffect(() => {
    setCurrentView(getCurrentView());
  }, [location.pathname]);

  const loadPackages = () => {
    setLoading(true);
    api.get('/packages')
      .then(response => {
        const data = response.data;
        const packageArray = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.content) ? data.content : [];
        setPackages(packageArray);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching packages:", err);
        setError(`Failed to load packages: ${err.message}`);
        setPackages([]);
        setLoading(false);
      });
  };

  const loadGuides = () => {
    setLoading(true);
    api.get("/guides")
      .then(res => {
        const data = res.data;
        const guideArray = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : Array.isArray(data?.data) ? data.data : [];
        setGuides(guideArray);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching guides:", err);
        setError(`Failed to load guides: ${err.message}`);
        setLoading(false);
      });
  };

  const loadAvailability = () => {
    setLoading(true);
    api.get("/availability")
      .then(res => {
        setAvailabilityData(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching availability:", err);
        setLoading(false);
      });
  };

  const resetForm = () => {
    setFormData({ image: '', title: '', description: '', price: '', offer: '', status: 'ACTIVE' });
    setError('');
  };

  const resetGuideForm = () => {
    setGuideFormData({ firstName: '', lastName: '', gender: 'MALE', nic: '', email: '', phone: '', password: '', confirmPassword: '', status: 'PENDING' });
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const getWordCount = (text) => text.trim().split(/\s+/).filter(word => word.length > 0).length;

  const validatePackageForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    else if (!VALIDATION_RULES.title.regex.test(formData.title)) errors.title = VALIDATION_RULES.title.message;

    if (!formData.description.trim()) errors.description = 'Description is required';
    else if (!VALIDATION_RULES.description.regex.test(formData.description)) errors.description = VALIDATION_RULES.description.message;
    else {
      const wordCount = getWordCount(formData.description);
      if (wordCount > 80) errors.description = `Description is too long (${wordCount} words, max 80)`;
    }

    const price = parseFloat(formData.price);
    if (!formData.price) errors.price = 'Price is required';
    else if (!VALIDATION_RULES.price.regex.test(formData.price)) errors.price = VALIDATION_RULES.price.message;
    else if (price <= 0) errors.price = 'Price must be greater than 0';

    if (formData.offer !== '') {
      const offer = parseFloat(formData.offer);
      if (!offer || offer <= 0) errors.offer = 'Offer price must be a positive number';
      else if (offer > price) errors.offer = 'Offer price cannot be higher than original price';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePackageInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'description') {
      const wordCount = getWordCount(value);
      if (value.trim() && wordCount > 80) setFormErrors(prev => ({ ...prev, [name]: `Too many words (${wordCount}/80)` }));
      else if (value.trim() && value.length < 10) setFormErrors(prev => ({ ...prev, [name]: 'Description too short (minimum 10 chars)' }));
      else setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'title') {
      if (value.trim() && !VALIDATION_RULES.title.regex.test(value)) setFormErrors(prev => ({ ...prev, [name]: VALIDATION_RULES.title.message }));
      else setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGuideInputChange = (e) => {
    const { name, value } = e.target;
    setGuideFormData(prev => ({ ...prev, [name]: value }));
    validateSingleField(name, value);
  };

  const validateSingleField = (fieldName, value) => {
    const rule = VALIDATION_RULES[fieldName];
    if (!rule) { setFieldErrors(prev => ({ ...prev, [fieldName]: '' })); return; }
    let errorMsg = '';
    if (!value.trim()) errorMsg = `${fieldName} is required`;
    else if (!rule.regex.test(value)) errorMsg = rule.message;
    setFieldErrors(prev => ({ ...prev, [fieldName]: errorMsg }));
  };

  const validateGuideForm = (isEdit = false) => {
    const errors = {};
    if (!guideFormData.firstName.trim()) errors.firstName = 'First name is required';
    else if (!VALIDATION_RULES.firstName.regex.test(guideFormData.firstName)) errors.firstName = VALIDATION_RULES.firstName.message;

    if (!guideFormData.lastName.trim()) errors.lastName = 'Last name is required';
    else if (!VALIDATION_RULES.lastName.regex.test(guideFormData.lastName)) errors.lastName = VALIDATION_RULES.lastName.message;

    if (!guideFormData.nic.trim()) errors.nic = 'NIC is required';
    else if (!VALIDATION_RULES.nic.regex.test(guideFormData.nic)) errors.nic = VALIDATION_RULES.nic.message;

    if (!guideFormData.email.trim()) errors.email = 'Email is required';
    else if (!VALIDATION_RULES.email.regex.test(guideFormData.email)) errors.email = VALIDATION_RULES.email.message;

    if (!guideFormData.phone.trim()) errors.phone = 'Phone is required';
    else if (!VALIDATION_RULES.phone.regex.test(guideFormData.phone)) errors.phone = VALIDATION_RULES.phone.message;

    if (!isEdit && !guideFormData.password.trim()) errors.password = 'Password is required';
    if (guideFormData.password.trim()) {
      if (guideFormData.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (guideFormData.password !== guideFormData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkDuplicateGuide = () => {
    const emailExists = guides.some(guide => guide.email.toLowerCase() === guideFormData.email.toLowerCase() && (!selectedGuide || guide.guideID !== selectedGuide.guideID));
    if (emailExists) { setError('Email already exists.'); return false; }
    const nicExists = guides.some(guide => guide.nic === guideFormData.nic && (!selectedGuide || guide.guideID !== selectedGuide.guideID));
    if (nicExists) { setError('NIC already exists.'); return false; }
    return true;
  };

  const handleCreatePackage = (e) => {
    e.preventDefault();
    if (!validatePackageForm()) return;
    setLoading(true);
    const price = parseFloat(formData.price);
    const offerValue = formData.offer === '' || formData.offer === null ? price : parseFloat(formData.offer);
    api.post('/packages', {
      image: formData.image || null, title: formData.title, description: formData.description,
      status: formData.status, price, offer: offerValue
    }).then(() => {
      loadPackages(); setShowCreateModal(false); resetForm(); setLoading(false);
      Swal.fire('Success', 'Package created successfully!', 'success');
    }).catch(err => { setError(`Failed to create package: ${err.message}`); setLoading(false); });
  };

  const handleEditPackage = (e) => {
    e.preventDefault();
    if (!validatePackageForm()) return;
    setLoading(true);
    const price = parseFloat(formData.price);
    const offer = formData.offer === '' ? price : parseFloat(formData.offer);
    api.put(`/packages/${selectedPackage.packageID}`, {
      image: formData.image, title: formData.title, description: formData.description,
      status: formData.status, price, offer
    }).then(() => {
      loadPackages(); setShowEditModal(false); resetForm(); setSelectedPackage(null); setLoading(false);
      Swal.fire('Success', 'Package updated successfully!', 'success');
    }).catch(err => { setError(`Failed to update package: ${err.message}`); setLoading(false); });
  };

  const handleDeletePackage = () => {
    setLoading(true);
    api.delete(`/packages/${selectedPackage.packageID}`)
      .then(() => {
        loadPackages(); setShowDeleteModal(false); setSelectedPackage(null); setLoading(false);
        Swal.fire('Deleted!', 'Package deleted successfully.', 'success');
      }).catch(err => { setError(`Failed to delete package: ${err.message}`); setLoading(false); });
  };

  const handleCreateGuide = (e) => {
    e.preventDefault(); setError('');
    if (!validateGuideForm()) {
      const firstError = Object.values(fieldErrors).find(err => err);
      if (firstError) setErrorModalMessage(firstError);
      setShowErrorModal(true); return;
    }
    if (!checkDuplicateGuide()) { setErrorModalMessage(error); setShowErrorModal(true); return; }
    setLoading(true);
    api.post("/guides", {
      firstName: guideFormData.firstName, lastName: guideFormData.lastName, gender: guideFormData.gender,
      nic: guideFormData.nic, email: guideFormData.email, phone: guideFormData.phone, password: guideFormData.password, status: guideFormData.status
    }).then(() => {
      loadGuides(); setShowGuideModal(false); resetGuideForm(); setSelectedGuide(null); setLoading(false);
      Swal.fire('Success', 'Guide created successfully!', 'success');
    }).catch(err => {
      setLoading(false);
      Swal.fire('Error', `Failed to create guide: ${err.response?.data?.error || err.message}`, 'error');
    });
  };

  const handleEditGuide = (e) => {
    e.preventDefault(); setError('');
    if (!validateGuideForm(true)) {
      const firstError = Object.values(fieldErrors).find(err => err);
      if (firstError) setErrorModalMessage(firstError);
      setShowErrorModal(true); return;
    }
    if (!checkDuplicateGuide()) { setErrorModalMessage(error); setShowErrorModal(true); return; }
    setLoading(true);
    const payload = {
      firstName: guideFormData.firstName, lastName: guideFormData.lastName, gender: guideFormData.gender,
      nic: guideFormData.nic, email: guideFormData.email, phone: guideFormData.phone, status: guideFormData.status
    };
    if (guideFormData.password.trim()) payload.password = guideFormData.password;
    api.put(`/guides/${selectedGuide.guideID}`, payload)
      .then(() => {
        loadGuides(); setShowGuideModal(false); resetGuideForm(); setSelectedGuide(null); setLoading(false);
        Swal.fire('Success', 'Guide updated successfully!', 'success');
      }).catch(err => {
        setLoading(false);
        Swal.fire('Error', `Failed to update guide: ${err.response?.data?.error || err.message}`, 'error');
      });
  };

  const handleDeleteGuide = (guide) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${guide.firstName} ${guide.lastName}?`,
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#e53e3e', cancelButtonColor: '#718096', confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        api.delete(`/guides/${guide.guideID}`)
          .then(() => {
            loadGuides(); setLoading(false);
            Swal.fire('Deleted!', 'Guide has been deleted successfully.', 'success');
          }).catch((err) => { setLoading(false); Swal.fire('Error', `Failed to delete guide: ${err.message}`, 'error'); });
      }
    });
  };

  const handleApproveGuide = (guide) => {
    Swal.fire({
      title: 'Approve Tour Guide?',
      text: `Are you sure you want to approve ${guide.firstName} ${guide.lastName} as an ACTIVE tour guide?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Approve Now!'
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const payload = {
          firstName: guide.firstName,
          lastName: guide.lastName,
          gender: guide.gender,
          nic: guide.nic,
          email: guide.email,
          phone: guide.phone,
          status: 'ACTIVE'
        };
        api.put(`/guides/${guide.guideID}`, payload)
          .then(() => {
            loadGuides();
            setLoading(false);
            Swal.fire('Approved!', `${guide.firstName} ${guide.lastName} is now an active tour guide and can access their schedule.`, 'success');
          }).catch((err) => {
            setLoading(false);
            Swal.fire('Error', `Failed to approve guide: ${err.response?.data?.error || err.message}`, 'error');
          });
      }
    });
  };

  const openEditModal = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({ image: pkg.image || '', title: pkg.title || '', description: pkg.description || '', price: pkg.price || '', offer: pkg.offer || '', status: pkg.status || 'ACTIVE' });
    setShowEditModal(true);
  };

  const openEditGuideModal = (guide) => {
    setSelectedGuide(guide);
    setGuideFormData({
      firstName: guide.firstName || '', lastName: guide.lastName || '', gender: guide.gender || 'MALE',
      nic: guide.nic || '', email: guide.email || '', phone: guide.phone || '', password: '', confirmPassword: '', status: guide.status || 'PENDING'
    });
    setShowPassword(false); setShowConfirmPassword(false); setShowGuideModal(true);
  };

  // KPIs & Chart Data Calculations
  const activePackagesCount = useMemo(() => packages.filter(p => p.status === 'ACTIVE').length, [packages]);
  const activeGuidesCount = useMemo(() => guides.filter(g => g.status === 'ACTIVE').length, [guides]);
  const totalAvailableSlots = useMemo(() => availabilityData.reduce((acc, curr) => acc + (parseInt(curr.available) || 0), 0), [availabilityData]);
  const avgPackagePrice = useMemo(() => {
    if (!packages.length) return 0;
    const sum = packages.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);
    return (sum / packages.length).toFixed(0);
  }, [packages]);

  const packageStatusData = useMemo(() => [
    { name: 'Active', value: activePackagesCount },
    { name: 'Inactive', value: packages.length - activePackagesCount }
  ], [packages, activePackagesCount]);

  const availabilityChartData = useMemo(() => {
    return availabilityData.slice(0, 6).map(p => ({
      name: p.title?.substring(0, 15) + (p.title?.length > 15 ? '...' : ''),
      Booked: parseInt(p.currentBookings) || 0,
      Available: parseInt(p.available) || 0
    }));
  }, [availabilityData]);

  // Filtered Lists
  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      const matchSearch = !packageSearch || pkg.title?.toLowerCase().includes(packageSearch.toLowerCase()) || pkg.description?.toLowerCase().includes(packageSearch.toLowerCase());
      const matchStatus = packageStatusFilter === 'ALL' || pkg.status === packageStatusFilter;
      return matchSearch && matchStatus;
    }).sort((a, b) => {
      if (packageSortBy === 'price') return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      return (a.title || '').localeCompare(b.title || '');
    });
  }, [packages, packageSearch, packageStatusFilter, packageSortBy]);

  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      const name = `${guide.firstName} ${guide.lastName}`.toLowerCase();
      const matchSearch = !guideSearch || name.includes(guideSearch.toLowerCase()) || guide.email?.toLowerCase().includes(guideSearch.toLowerCase());
      const matchStatus = guideStatusFilter === 'ALL' || guide.status === guideStatusFilter;
      const matchGender = guideGenderFilter === 'ALL' || guide.gender === guideGenderFilter;
      return matchSearch && matchStatus && matchGender;
    });
  }, [guides, guideSearch, guideStatusFilter, guideGenderFilter]);

  const filteredAvailability = useMemo(() => {
    return availabilityData.filter(item => !availabilitySearch || item.title?.toLowerCase().includes(availabilitySearch.toLowerCase()));
  }, [availabilityData, availabilitySearch]);

  const handleExportPackages = () => {
    exportToCSV(filteredPackages, "tour_packages", [
      { key: 'packageID', label: 'ID' },
      { key: 'title', label: 'Package Name' },
      { key: 'price', label: 'Original Price ($)' },
      { key: 'offer', label: 'Offer Price ($)' },
      { key: 'status', label: 'Status' }
    ]);
  };

  const handleExportGuides = () => {
    exportToCSV(filteredGuides, "travel_guides", [
      { key: 'guideID', label: 'ID' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'gender', label: 'Gender' },
      { key: 'status', label: 'Status' }
    ]);
  };

  return (
    <div className="container-fluid">
          {/* Header */}
          <div className="row align-items-center mb-4">
            <div className="col">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded-3 bg-primary-soft">
                  <i className="fas fa-briefcase text-primary fa-lg"></i>
                </div>
                <div>
                  <h1 className="h3 fw-bold text-dark mb-1">Senior Travel Consultant Panel</h1>
                  <p className="text-muted mb-0">Manage tour packages, travel guides, and monitor capacity</p>
                </div>
              </div>
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-primary btn-icon rounded-circle" onClick={() => { loadPackages(); loadGuides(); loadAvailability(); }} disabled={loading}>
                <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger shadow-sm rounded-3 mb-4">{error}</div>}

          {/* KPI Stat Cards */}
          <div className="row g-3 mb-4">
            <StatCard title="Total Packages" value={packages.length} sub={`${activePackagesCount} Active Campaigns`} icon="bi-box-seam" loading={loading} />
            <StatCard title="Travel Guides" value={guides.length} sub={`${activeGuidesCount} Active Guides`} icon="bi-person-badge" loading={loading} />
            <StatCard title="Available Slots" value={totalAvailableSlots} sub="Total remaining booking slots" icon="bi-calendar-check" loading={loading} />
            <StatCard title="Avg Package Price" value={`$${avgPackagePrice}`} sub="Across all listed packages" icon="bi-tag" loading={loading} />
          </div>

          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <div className="row g-4 mb-4">
              <div className="col-xl-7">
                <div className="card modern-card border-0 shadow-sm h-100">
                  <div className="card-header bg-transparent border-0 py-3 d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold text-dark mb-0">Package Booking Capacity & Availability</h6>
                  </div>
                  <div className="card-body" style={{ height: 340 }}>
                    {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div> : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={availabilityChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" tick={{ fill: '#6c757d', fontSize: 12 }} />
                          <YAxis tick={{ fill: '#6c757d', fontSize: 12 }} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                          <Legend wrapperStyle={{ paddingTop: '10px' }} />
                          <Bar dataKey="Booked" fill="#2F80ED" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Available" fill="#27AE60" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-xl-5">
                <div className="card modern-card border-0 shadow-sm h-100">
                  <div className="card-header bg-transparent border-0 py-3">
                    <h6 className="fw-bold text-dark mb-0">Package Status Distribution</h6>
                  </div>
                  <div className="card-body d-flex align-items-center justify-content-center" style={{ height: 340 }}>
                    {loading ? <div className="spinner-border text-primary" /> : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={packageStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {packageStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Packages View */}
          {currentView === 'packages' && (
            <div className="card modern-card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent border-0 py-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                  <h5 className="fw-bold text-dark mb-0">Tour Package Catalog</h5>
                  <span className="text-muted small">Showing {filteredPackages.length} packages</span>
                </div>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <input type="text" className="form-control form-control-sm modern-input" placeholder="Search packages..." value={packageSearch} onChange={e => setPackageSearch(e.target.value)} style={{ width: '200px' }} />
                  <select className="form-select form-select-sm modern-input" value={packageStatusFilter} onChange={e => setPackageStatusFilter(e.target.value)} style={{ width: '130px' }}>
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  <select className="form-select form-select-sm modern-input" value={packageSortBy} onChange={e => setPackageSortBy(e.target.value)} style={{ width: '130px' }}>
                    <option value="title">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                  </select>
                  <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={handleExportPackages}><i className="fas fa-file-csv me-1"></i> Export CSV</button>
                  <button className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm" onClick={() => { resetForm(); setShowCreateModal(true); }}><i className="bi bi-plus-circle me-1"></i> Create Package</button>
                </div>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  {filteredPackages.length === 0 ? (
                    <div className="col-12 text-center py-5">
                      <i className="bi bi-box display-4 text-muted opacity-25 mb-3 d-block" />
                      <h6 className="text-muted">No tour packages found</h6>
                    </div>
                  ) : (
                    filteredPackages.map(pkg => (
                      <div key={pkg.packageID} className="col-12 col-md-6 col-lg-4">
                        <div className="card modern-card border-0 shadow-sm h-100 overflow-hidden">
                          <img src={pkg.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'} alt={pkg.title} className="card-img-top" style={{ height: '180px', objectFit: 'cover' }} />
                          <div className="card-body d-flex flex-column p-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="fw-bold text-dark mb-0">{pkg.title}</h6>
                              <StatusBadge status={pkg.status} />
                            </div>
                            <p className="text-muted small flex-grow-1 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{pkg.description}</p>
                            <div className="d-flex align-items-center gap-2 mb-3">
                              {pkg.offer && parseFloat(pkg.offer) !== parseFloat(pkg.price) ? (
                                <>
                                  <span className="text-muted text-decoration-line-through small">${pkg.price}</span>
                                  <span className="fs-5 fw-bold text-success">${pkg.offer}</span>
                                </>
                              ) : (
                                <span className="fs-5 fw-bold text-dark">${pkg.price}</span>
                              )}
                            </div>
                            <div className="d-flex gap-2 pt-2 border-top">
                              <button className="btn btn-outline-primary btn-sm flex-grow-1 rounded-pill" onClick={() => openEditModal(pkg)}><i className="bi bi-pencil me-1"></i> Edit</button>
                              <button className="btn btn-outline-danger btn-sm flex-grow-1 rounded-pill" onClick={() => { setSelectedPackage(pkg); setShowDeleteModal(true); }}><i className="bi bi-trash me-1"></i> Delete</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Guides View */}
          {currentView === 'guides' && (
            <div className="card modern-card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent border-0 py-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                  <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    Travel Guide Management
                    {guides.filter(g => g.status === 'PENDING').length > 0 && (
                      <span 
                        className="badge bg-warning text-dark fs-6 rounded-pill px-3 shadow-sm transition-all" 
                        style={{ cursor: 'pointer', fontSize: '12px' }} 
                        onClick={() => setGuideStatusFilter('PENDING')}
                        title="Click to filter pending guides"
                      >
                        <i className="bi bi-clock-history me-1"></i>
                        {guides.filter(g => g.status === 'PENDING').length} Pending Review
                      </span>
                    )}
                  </h5>
                  <span className="text-muted small">Showing {filteredGuides.length} guides</span>
                </div>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <input type="text" className="form-control form-control-sm modern-input" placeholder="Search guides..." value={guideSearch} onChange={e => setGuideSearch(e.target.value)} style={{ width: '200px' }} />
                  <select className="form-select form-select-sm modern-input" value={guideStatusFilter} onChange={e => setGuideStatusFilter(e.target.value)} style={{ width: '130px' }}>
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING">Pending</option>
                  </select>
                  <select className="form-select form-select-sm modern-input" value={guideGenderFilter} onChange={e => setGuideGenderFilter(e.target.value)} style={{ width: '120px' }}>
                    <option value="ALL">All Genders</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={handleExportGuides}><i className="fas fa-file-csv me-1"></i> Export CSV</button>
                  <button className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm" onClick={() => { resetGuideForm(); setSelectedGuide(null); setShowGuideModal(true); }}><i className="bi bi-plus-circle me-1"></i> Add Guide</button>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0 modern-table">
                    <thead>
                      <tr>
                        <th>Guide</th>
                        <th>Contact</th>
                        <th>NIC</th>
                        <th>Gender</th>
                        <th className="text-center">Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGuides.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-5 text-muted">No guides found matching your criteria.</td></tr>
                      ) : (
                        filteredGuides.map(guide => (
                          <tr key={guide.guideID} className="modern-table-row">
                            <td className="ps-4"><Avatar name={`${guide.firstName} ${guide.lastName}`} email={guide.email} /></td>
                            <td><span className="d-block fw-medium text-dark">{guide.phone}</span><span className="text-muted small">{guide.email}</span></td>
                            <td><span className="badge bg-light text-dark border font-monospace">{guide.nic}</span></td>
                            <td>{guide.gender}</td>
                            <td className="text-center"><StatusBadge status={guide.status} /></td>
                            <td className="text-end pe-4">
                              <div className="d-inline-flex align-items-center gap-1">
                                {guide.status === 'PENDING' && (
                                  <button 
                                    className="btn btn-sm btn-success rounded-pill px-3 me-1 fw-semibold shadow-sm d-inline-flex align-items-center"
                                    onClick={() => handleApproveGuide(guide)}
                                    title="Approve Guide Application"
                                  >
                                    <i className="bi bi-check-circle-fill me-1"></i> Approve
                                  </button>
                                )}
                                <button className="btn btn-icon btn-sm btn-outline-secondary rounded-circle" onClick={() => { setSelectedGuide(guide); setShowViewModal(true); }} title="View Details"><i className="bi bi-eye"></i></button>
                                <button className="btn btn-icon btn-sm btn-outline-primary rounded-circle" onClick={() => openEditGuideModal(guide)} title="Edit"><i className="bi bi-pencil"></i></button>
                                <button className="btn btn-icon btn-sm btn-outline-danger rounded-circle" onClick={() => handleDeleteGuide(guide)} title="Delete"><i className="bi bi-trash"></i></button>
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

          {/* Availability View */}
          {currentView === 'availability' && (
            <div className="card modern-card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent border-0 py-4 d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold text-dark mb-0">Package Slot Availability Monitor</h5>
                  <span className="text-muted small">Real-time booking capacity across tours</span>
                </div>
                <input type="text" className="form-control form-control-sm modern-input" placeholder="Search package name..." value={availabilitySearch} onChange={e => setAvailabilitySearch(e.target.value)} style={{ width: '240px' }} />
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0 modern-table">
                    <thead>
                      <tr>
                        <th>Package Name</th>
                        <th className="text-center">Current Bookings</th>
                        <th className="text-center">Available Slots</th>
                        <th className="text-center">Capacity Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAvailability.length === 0 ? (
                        <tr><td colSpan="4" className="text-center py-5 text-muted">No availability data found.</td></tr>
                      ) : (
                        filteredAvailability.map(item => (
                          <tr key={item.packageID} className="modern-table-row">
                            <td className="ps-4 fw-semibold text-dark">{item.title}</td>
                            <td className="text-center"><span className="badge bg-primary-soft text-primary fs-6 px-3">{item.currentBookings || 0}</span></td>
                            <td className="text-center"><span className="badge bg-success-soft text-success fs-6 px-3">{item.available || 0}</span></td>
                            <td className="text-center"><StatusBadge status={item.status || (parseInt(item.available) > 0 ? 'Available' : 'Full')} /></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

      {/* Create Package Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modern-card border-0 shadow-lg">
              <div className="modal-header bg-primary text-white border-0 py-3">
                <h5 className="modal-title fw-bold">Create Tour Package</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <form onSubmit={handleCreatePackage}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Image URL</label>
                      <input name="image" className="form-control modern-input" placeholder="https://example.com/photo.jpg" value={formData.image} onChange={handlePackageInputChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Title *</label>
                      <input name="title" className={`form-control modern-input ${formErrors.title ? 'is-invalid' : ''}`} placeholder="Package title" value={formData.title} onChange={handlePackageInputChange} required />
                      {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Description *</label>
                      <textarea name="description" rows="3" className={`form-control modern-input ${formErrors.description ? 'is-invalid' : ''}`} placeholder="Describe the tour itinerary and highlights..." value={formData.description} onChange={handlePackageInputChange} required />
                      <div className="d-flex justify-content-between mt-1">
                        <small className="text-muted">Word count: {getWordCount(formData.description)}/80</small>
                        {formErrors.description && <small className="text-danger">{formErrors.description}</small>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Original Price ($) *</label>
                      <input type="number" step="0.01" name="price" className={`form-control modern-input ${formErrors.price ? 'is-invalid' : ''}`} placeholder="1000.00" value={formData.price} onChange={handlePackageInputChange} required />
                      {formErrors.price && <div className="invalid-feedback">{formErrors.price}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Offer Price ($)</label>
                      <input type="number" step="0.01" name="offer" className="form-control modern-input" placeholder="Leave blank for regular price" value={formData.offer} onChange={handlePackageInputChange} />
                      <small className="text-muted">Optional discount price</small>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Status</label>
                      <select name="status" className="form-select modern-input" value={formData.status} onChange={handlePackageInputChange}>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light border-0 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={loading}>{loading ? 'Creating...' : 'Create Package'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modern-card border-0 shadow-lg">
              <div className="modal-header bg-primary text-white border-0 py-3">
                <h5 className="modal-title fw-bold">Edit Tour Package</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditPackage}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Image URL</label>
                      <input name="image" className="form-control modern-input" placeholder="https://example.com/photo.jpg" value={formData.image} onChange={handlePackageInputChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Title *</label>
                      <input name="title" className="form-control modern-input" value={formData.title} onChange={handlePackageInputChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Description *</label>
                      <textarea name="description" rows="3" className="form-control modern-input" value={formData.description} onChange={handlePackageInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Original Price ($) *</label>
                      <input type="number" step="0.01" name="price" className="form-control modern-input" value={formData.price} onChange={handlePackageInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Offer Price ($)</label>
                      <input type="number" step="0.01" name="offer" className="form-control modern-input" value={formData.offer} onChange={handlePackageInputChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Status</label>
                      <select name="status" className="form-select modern-input" value={formData.status} onChange={handlePackageInputChange}>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light border-0 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={loading}>{loading ? 'Updating...' : 'Update Package'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Package Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content modern-card border-0 shadow-lg text-center p-4">
              <i className="bi bi-exclamation-triangle display-4 text-danger mb-3 d-block" />
              <h5 className="fw-bold mb-2">Delete Package?</h5>
              <p className="text-muted small mb-4">Are you sure you want to delete <strong>{selectedPackage?.title}</strong>? This cannot be undone.</p>
              <div className="d-flex gap-2 justify-content-center">
                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button type="button" className="btn btn-danger rounded-pill px-4 shadow-sm" onClick={handleDeletePackage} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Guide Modal */}
      {showGuideModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modern-card border-0 shadow-lg">
              <div className="modal-header bg-primary text-white border-0 py-3">
                <h5 className="modal-title fw-bold">{selectedGuide ? 'Edit Travel Guide' : 'Add Travel Guide'}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => { setShowGuideModal(false); setSelectedGuide(null); }}></button>
              </div>
              <form onSubmit={selectedGuide ? handleEditGuide : handleCreateGuide}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">First Name *</label>
                      <input name="firstName" className="form-control modern-input" placeholder="John" value={guideFormData.firstName} onChange={handleGuideInputChange} required />
                      {fieldErrors.firstName && <small className="text-danger">{fieldErrors.firstName}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Last Name *</label>
                      <input name="lastName" className="form-control modern-input" placeholder="Doe" value={guideFormData.lastName} onChange={handleGuideInputChange} required />
                      {fieldErrors.lastName && <small className="text-danger">{fieldErrors.lastName}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Gender *</label>
                      <select name="gender" className="form-select modern-input" value={guideFormData.gender} onChange={handleGuideInputChange}>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">NIC *</label>
                      <input name="nic" className="form-control modern-input" placeholder="123456789V or 12 digits" value={guideFormData.nic} onChange={handleGuideInputChange} required />
                      {fieldErrors.nic && <small className="text-danger">{fieldErrors.nic}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email *</label>
                      <input type="email" name="email" className="form-control modern-input" placeholder="john@example.com" value={guideFormData.email} onChange={handleGuideInputChange} required />
                      {fieldErrors.email && <small className="text-danger">{fieldErrors.email}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Phone *</label>
                      <input name="phone" className="form-control modern-input" placeholder="0771234567" value={guideFormData.phone} onChange={handleGuideInputChange} required />
                      {fieldErrors.phone && <small className="text-danger">{fieldErrors.phone}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Password {!selectedGuide && '*'}</label>
                      <div className="input-group">
                        <input type={showPassword ? "text" : "password"} name="password" className="form-control modern-input" placeholder={selectedGuide ? "Leave blank to keep current" : "Min 6 chars"} value={guideFormData.password} onChange={handleGuideInputChange} required={!selectedGuide} />
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}><i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i></button>
                      </div>
                      {fieldErrors.password && <small className="text-danger">{fieldErrors.password}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Confirm Password {!selectedGuide && '*'}</label>
                      <div className="input-group">
                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" className="form-control modern-input" placeholder="Confirm password" value={guideFormData.confirmPassword} onChange={handleGuideInputChange} required={!selectedGuide} />
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}><i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i></button>
                      </div>
                      {fieldErrors.confirmPassword && <small className="text-danger">{fieldErrors.confirmPassword}</small>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Status</label>
                      <select name="status" className="form-select modern-input" value={guideFormData.status} onChange={handleGuideInputChange}>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="PENDING">Pending</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light border-0 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => { setShowGuideModal(false); setSelectedGuide(null); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={loading}>{loading ? 'Saving...' : 'Save Guide'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Guide Modal */}
      {showViewModal && selectedGuide && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modern-card border-0 shadow-lg">
              <div className="modal-header bg-primary text-white border-0 py-3">
                <h5 className="modal-title fw-bold">Guide Profile Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => { setShowViewModal(false); setSelectedGuide(null); }}></button>
              </div>
              <div className="modal-body p-4 text-center">
                <div className="mb-3 d-flex justify-content-center">
                  <Avatar name={`${selectedGuide.firstName} ${selectedGuide.lastName}`} email={selectedGuide.email} />
                </div>
                <h5 className="fw-bold mb-1">{selectedGuide.firstName} {selectedGuide.lastName}</h5>
                <p className="text-muted small mb-3">{selectedGuide.email} · {selectedGuide.phone}</p>
                <div className="d-flex justify-content-center gap-2 mb-4">
                  <StatusBadge status={selectedGuide.status} />
                  <span className="badge bg-light text-dark border">{selectedGuide.gender}</span>
                </div>
                <div className="card bg-light border-0 p-3 text-start mb-3 rounded-3">
                  <div className="row g-2 small">
                    <div className="col-6"><span className="text-muted d-block">NIC Number:</span><strong>{selectedGuide.nic}</strong></div>
                    <div className="col-6"><span className="text-muted d-block">System Role:</span><strong>Travel Guide</strong></div>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light border-0 py-3">
                <button type="button" className="btn btn-outline-primary rounded-pill px-4" onClick={() => { setShowViewModal(false); openEditGuideModal(selectedGuide); }}>Edit Guide</button>
                <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => { setShowViewModal(false); setSelectedGuide(null); }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1100 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content modern-card border-0 shadow-lg text-center p-4">
              <i className="bi bi-x-circle display-4 text-danger mb-3 d-block" />
              <h6 className="fw-bold text-dark mb-2">Validation Error</h6>
              <p className="text-muted small mb-4">{errorModalMessage}</p>
              <button type="button" className="btn btn-danger rounded-pill px-4 shadow-sm" onClick={() => setShowErrorModal(false)}>Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeniorTravelConsultantDashboard;