import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import SideNav from "../../components/SideNav";

const SeniorTravelConsultantDashboard = () => {
  // Validation rules
  const VALIDATION_RULES = {
    firstName: {
      regex: /^[a-zA-Z\s'-]{2,50}$/,
      message: 'First name must contain only letters (2-50 characters)'
    },
    lastName: {
      regex: /^[a-zA-Z\s'-]{2,50}$/,
      message: 'Last name must contain only letters (2-50 characters)'
    },
    phone: {
      regex: /^[0-9]{10}$/,
      message: 'Phone must be exactly 10 digits'
    },
    nic: {
      regex: /^[0-9]{9}[vVxX]$/,
      message: 'NIC format: 9 digits + V/X (e.g., 123456789V)'
    },
    email: {
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format'
    },
    description: {
      regex: /^.{10,500}$/,  // 10-500 characters
      message: 'Description must be between 10-500 characters (approximately 10-80 words)'
    },
    title: {
      regex: /^[a-zA-Z0-9\s\-&,']{3,100}$/,
      message: 'Title must be 3-100 characters, alphanumeric with spaces and basic punctuation'
    },
    price: {
      regex: /^\d+(\.\d{1,2})?$/,
      message: 'Price must be a valid number'
    }
  };

  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current view from URL path
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/guides')) return 'guides';
    if (path.includes('/tourpackages')) return 'packages';
    if (path.includes('/availability')) return 'availability';
    if (path.includes('/dashboard')) return 'dashboard';
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

  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    price: '',
    offer: '',
    status: 'ACTIVE'
  });

  // Guide management state
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

  // Get user role from auth
  const { user } = useAuth();
  const currentRole = user?.role;

  useEffect(() => {
    // Debug: Check token
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
    }
  }, []);

  useEffect(() => {
    loadPackages();
    loadGuides();
    loadAvailability();
  }, []);

  // Update current view when URL changes
  useEffect(() => {
    setCurrentView(getCurrentView());
  }, [location.pathname]);

  const loadPackages = () => {
    setLoading(true);
    setError('');
    
    api.get('/packages')
      .then(response => {
        console.log('Loaded packages:', response.data);
        const data = response.data;
        const packageArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.content)
          ? data.content
          : [];

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
    setError('');
    
    api.get("/guides")
      .then(res => {
        console.log("Loaded guides:", res.data);
        const data = res.data;
        const guideArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.data)
          ? data.data
          : [];

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
    setError('');
    
    api.get("/availability")
      .then(res => {
        console.log("Loaded availability:", res.data);
        setAvailabilityData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching availability:", err);
        setError(`Failed to load availability: ${err.message}`);
        setLoading(false);
      });
  };

  const resetForm = () => {
    setFormData({
      image: '',
      title: '',
      description: '',
      price: '',
      offer: '',
      status: 'ACTIVE'
    });
    setError('');
  };

  const resetGuideForm = () => {
    setGuideFormData({
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
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const validatePackageForm = () => {
    const errors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (!VALIDATION_RULES.title.regex.test(formData.title)) {
      errors.title = VALIDATION_RULES.title.message;
    }
    
    // Description validation
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (!VALIDATION_RULES.description.regex.test(formData.description)) {
      errors.description = VALIDATION_RULES.description.message;
    } else {
      const wordCount = getWordCount(formData.description);
      if (wordCount > 80) {
        errors.description = `Description is too long (${wordCount} words, max 80)`;
      }
    }
    
    // Price validation
    const price = parseFloat(formData.price);
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (!VALIDATION_RULES.price.regex.test(formData.price)) {
      errors.price = VALIDATION_RULES.price.message;
    } else if (price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    
    // Offer validation
    if (formData.offer !== '') {
      const offer = parseFloat(formData.offer);
      if (!offer || offer <= 0) {
        errors.offer = 'Offer price must be a positive number';
      } else if (offer > price) {
        errors.offer = 'Offer price cannot be higher than original price';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuideInputChange = (e) => {
    const { name, value } = e.target;
    setGuideFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation
    validateSingleField(name, value);
  };

  const handlePackageInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation for specific fields
    if (name === 'description') {
      const wordCount = getWordCount(value);
      if (value.trim() && wordCount > 80) {
        setFormErrors(prev => ({
          ...prev,
          [name]: `Too many words (${wordCount}/80)`
        }));
      } else if (value.trim() && value.length < 10) {
        setFormErrors(prev => ({
          ...prev,
          [name]: 'Description too short (minimum 10 characters)'
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
    
    if (name === 'title') {
      if (value.trim() && !VALIDATION_RULES.title.regex.test(value)) {
        setFormErrors(prev => ({
          ...prev,
          [name]: VALIDATION_RULES.title.message
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
    
    if (name === 'price') {
      if (value && parseFloat(value) <= 0) {
        setFormErrors(prev => ({
          ...prev,
          [name]: 'Price must be greater than 0'
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const validateSingleField = (fieldName, value) => {
    const rule = VALIDATION_RULES[fieldName];
    
    if (!rule) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
      return;
    }
    
    let errorMsg = '';
    
    if (!value.trim()) {
      errorMsg = `${fieldName} is required`;
    } else if (!rule.regex.test(value)) {
      errorMsg = rule.message;
    }
    
    setFieldErrors(prev => ({ ...prev, [fieldName]: errorMsg }));
  };

  const handleCreatePackage = (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!validatePackageForm()) {
      return;
    }

    setLoading(true);

    const price = parseFloat(formData.price);
    const offerValue = formData.offer === '' || formData.offer === null 
      ? price 
      : parseFloat(formData.offer);

    const payload = {
      image: formData.image || null,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      price: price,
      offer: offerValue
    };

    console.log('Creating package with payload:', payload);

    api.post('/packages', payload)
      .then(response => {
        console.log('Created package:', response.data);
        loadPackages();
        setShowCreateModal(false);
        resetForm();
        setLoading(false);
        Swal.fire('Package created successfully!');
      })
      .catch(err => {
        console.error("Full create error:", err);
        setError(`Failed to create package: ${err.message}`);
        setLoading(false);
      });
  };

  const handleEditPackage = (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!validatePackageForm()) {
      return;
    }

    setLoading(true);
    
    const price = parseFloat(formData.price);
    const offer = formData.offer === '' ? price : parseFloat(formData.offer);

    const payload = {
      image: formData.image,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      price,
      offer
    };

    console.log('Updating package:', selectedPackage.packageID, 'with payload:', payload);

    api.put(`/packages/${selectedPackage.packageID}`, payload)
      .then(response => {
        console.log('Updated package:', response.data);
        loadPackages();
        setShowEditModal(false);
        resetForm();
        setSelectedPackage(null);
        setLoading(false);
        Swal.fire('Package updated successfully!');
      })
      .catch(err => {
        console.error("Full update error:", err);
        setError(`Failed to update package: ${err.message}`);
        setLoading(false);
      });
  };

  const handleDeletePackage = () => {
    setLoading(true);
    
    console.log('Deleting package:', selectedPackage.packageID);
    
    api.delete(`/packages/${selectedPackage.packageID}`)
      .then(response => {
        console.log('Delete response:', response.data);
        loadPackages();
        setShowDeleteModal(false);
        setSelectedPackage(null);
        setLoading(false);
        Swal.fire('Package deleted successfully!');
      })
      .catch(err => {
        console.error("Full delete error:", err);
        setError(`Failed to delete package: ${err.message}`);
        setLoading(false);
      });
  };

  const openEditModal = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      image: pkg.image || '',
      title: pkg.title || '',
      description: pkg.description || '',
      price: pkg.price || '',
      offer: pkg.offer || '',
      status: pkg.status || 'ACTIVE'
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (pkg) => {
    setSelectedPackage(pkg);
    setShowDeleteModal(true);
  };

  // Guide Management Functions
  const validateGuideForm = (isEdit = false) => {
    const errors = {};
    
    // First Name
    if (!guideFormData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (!VALIDATION_RULES.firstName.regex.test(guideFormData.firstName)) {
      errors.firstName = VALIDATION_RULES.firstName.message;
    }
    
    // Last Name
    if (!guideFormData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (!VALIDATION_RULES.lastName.regex.test(guideFormData.lastName)) {
      errors.lastName = VALIDATION_RULES.lastName.message;
    }
    
    // NIC
    if (!guideFormData.nic.trim()) {
      errors.nic = 'NIC is required';
    } else if (!VALIDATION_RULES.nic.regex.test(guideFormData.nic)) {
      errors.nic = VALIDATION_RULES.nic.message;
    }
    
    // Email
    if (!guideFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!VALIDATION_RULES.email.regex.test(guideFormData.email)) {
      errors.email = VALIDATION_RULES.email.message;
    }
    
    // Phone
    if (!guideFormData.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!VALIDATION_RULES.phone.regex.test(guideFormData.phone)) {
      errors.phone = VALIDATION_RULES.phone.message;
    }
    
    // Password
    if (!isEdit && !guideFormData.password.trim()) {
      errors.password = 'Password is required';
    }
    
    if (guideFormData.password.trim()) {
      if (guideFormData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      if (guideFormData.password !== guideFormData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkDuplicateGuide = () => {
    const emailExists = guides.some(guide => 
      guide.email.toLowerCase() === guideFormData.email.toLowerCase() &&
      (!selectedGuide || guide.guideID !== selectedGuide.guideID)
    );
    
    if (emailExists) {
      setError('Email already exists. Please use a different email address.');
      return false;
    }
    
    const nicExists = guides.some(guide => 
      guide.nic === guideFormData.nic &&
      (!selectedGuide || guide.guideID !== selectedGuide.guideID)
    );
    
    if (nicExists) {
      setError('NIC already exists. Please use a different NIC.');
      return false;
    }
    
    return true;
  };

  const handleCreateGuide = (e) => {
    e.preventDefault();
    setError('');

    if (!validateGuideForm()) {
      const firstError = Object.values(fieldErrors).find(err => err);
      if (firstError) setErrorModalMessage(firstError);
      setShowErrorModal(true);
      return;
    }
    
    if (!checkDuplicateGuide()) {
      const duplicateError = error;
      setErrorModalMessage(duplicateError);
      setShowErrorModal(true);
      return;
    }

    setLoading(true);

    const payload = {
      firstName: guideFormData.firstName,
      lastName: guideFormData.lastName,
      gender: guideFormData.gender,
      nic: guideFormData.nic,
      email: guideFormData.email,
      phone: guideFormData.phone,
      password: guideFormData.password,
      status: guideFormData.status
    };

    console.log('Creating guide with payload:', payload);

    api.post("/guides", payload)
      .then(res => {
        console.log('Created guide:', res.data);
        loadGuides();
        setShowGuideModal(false);
        resetGuideForm();
        setSelectedGuide(null);
        setLoading(false);
        Swal.fire('Guide created successfully!');
      })
      .catch(err => {
        console.error("Full create error:", err);
        setLoading(false);
        
        if (err.response && err.response.status === 409) {
          const errorData = err.response.data;
          const errorMessage = errorData.error || 'Duplicate entry detected';
          const field = errorData.field;
          
          setError(errorMessage);
          
          Swal.fire({
            icon: 'error',
            title: field === 'email' ? 'Duplicate Email' : 'Duplicate NIC',
            text: errorMessage,
            confirmButtonColor: '#667eea'
          });
          return;
        }
        
        setError(`Failed to create guide: ${err.message}`);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to create guide: ${err.response?.data?.error || err.message}`,
          confirmButtonColor: '#667eea'
        });
      });
  };

  const handleEditGuide = (e) => {
    e.preventDefault();
    setError('');

    if (!validateGuideForm(true)) {
      const firstError = Object.values(fieldErrors).find(err => err);
      if (firstError) setErrorModalMessage(firstError);
      setShowErrorModal(true);
      return;
    }
    
    if (!checkDuplicateGuide()) {
      const duplicateError = error;
      setErrorModalMessage(duplicateError);
      setShowErrorModal(true);
      return;
    }

    setLoading(true);

    const payload = {
      firstName: guideFormData.firstName,
      lastName: guideFormData.lastName,
      gender: guideFormData.gender,
      nic: guideFormData.nic,
      email: guideFormData.email,
      phone: guideFormData.phone,
      status: guideFormData.status
    };

    if (guideFormData.password.trim()) {
      payload.password = guideFormData.password;
    }

    console.log('Updating guide:', selectedGuide.guideID, 'with payload:', payload);

    api.put(`/guides/${selectedGuide.guideID}`, payload)
      .then(res => {
        console.log('Updated guide:', res.data);
        loadGuides();
        setShowGuideModal(false);
        resetGuideForm();
        setSelectedGuide(null);
        setLoading(false);
        Swal.fire('Guide updated successfully!');
      })
      .catch(err => {
        console.error("Full update error:", err);
        setLoading(false);
        
        if (err.response && err.response.status === 409) {
          const errorData = err.response.data;
          const errorMessage = errorData.error || 'Duplicate entry detected';
          const field = errorData.field;
          
          setError(errorMessage);
          
          Swal.fire({
            icon: 'error',
            title: field === 'email' ? 'Duplicate Email' : 'Duplicate NIC',
            text: errorMessage,
            confirmButtonColor: '#667eea'
          });
          return;
        }
        
        setError(`Failed to update guide: ${err.message}`);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to update guide: ${err.response?.data?.error || err.message}`,
          confirmButtonColor: '#667eea'
        });
      });
  };

  const handleDeleteGuide = (guide) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${guide.firstName} ${guide.lastName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#718096',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        api.delete(`/guides/${guide.guideID}`)
          .then(() => {
            loadGuides();
            setLoading(false);
            Swal.fire('Deleted!', 'Guide has been deleted successfully.', 'success');
          })
          .catch((err) => {
            console.error("Delete guide error:", err);
            setLoading(false);
            Swal.fire('Error', `Failed to delete guide: ${err.message}`, 'error');
          });
      }
    });
  };

  const openEditGuideModal = (guide) => {
    setSelectedGuide(guide);
    setGuideFormData({
      firstName: guide.firstName || '',
      lastName: guide.lastName || '',
      gender: guide.gender || 'MALE',
      nic: guide.nic || '',
      email: guide.email || '',
      phone: guide.phone || '',
      password: '',
      confirmPassword: '',
      status: guide.status || 'PENDING'
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowGuideModal(true);
  };

  // Modal styles (keep all your existing modal styles)
  const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalStyle = {
    background: 'white',
    padding: '0',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  };

  const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem 2rem 1rem 2rem',
    borderBottom: '1px solid #e2e8f0'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '2rem'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#4a5568',
    fontWeight: '600'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: '#f8f9fa',
    color: '#6c757d',
    border: '2px solid #e9ecef'
  };

  // Error Modal
  const ErrorModalComponent = () => (
    showErrorModal && (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{ color: '#c53030', margin: '0 0 1rem 0' }}>Validation Error</h3>
          <p style={{ color: '#742a2a', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>
            {errorModalMessage}
          </p>
          <button
            onClick={() => setShowErrorModal(false)}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Got it
          </button>
        </div>
      </div>
    )
  );

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* External Sidebar */}
      <SideNav 
        currentRole={currentRole} 
        onItemClick={() => {
          // Handle any sidebar item clicks if needed
        }}
      />
      
      {/* Main content */}
      <main style={{ 
        flex: 1, 
        padding: '2rem',
        overflow: 'auto',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        {error && (
          <div style={{
            background: 'rgba(248, 215, 218, 0.9)',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#6c757d',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Loading...
          </div>
        )}

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '2rem',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              color: '#2d3748',
              marginBottom: '1rem',
              fontSize: '2.5rem',
              fontWeight: '700'
            }}>Senior Travel Consultant Dashboard</h1>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '2rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
                  {packages.filter(pkg => pkg.status === 'ACTIVE').length}
                </h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Active Packages</p>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #38a169, #2f855a)',
                color: 'white',
                padding: '2rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
                  {packages.length}
                </h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Total Packages</p>
              </div>
            </div>
          </div>
        )}

        {/* Packages View */}
        {currentView === 'packages' && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '2rem',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{ 
                color: '#2d3748',
                margin: 0,
                fontSize: '2rem',
                fontWeight: '700'
              }}>Package Management</h2>
              <button
                style={primaryButtonStyle}
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
              >
                 Create Package
              </button>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gap: '1.5rem', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
            }}>
              {packages.map(pkg => (
                <div key={pkg.packageID} style={{ 
                  background: 'white', 
                  padding: '0',
                  borderRadius: '15px', 
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0'
                }}>
                  <img 
                    src={pkg.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'} 
                    alt={pkg.title} 
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover' 
                    }} 
                  />
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ 
                      margin: '0 0 0.5rem 0',
                      color: '#2d3748',
                      fontSize: '1.25rem'
                    }}>{pkg.title}</h3>
                    <p style={{ 
                        color: '#718096',
                        marginBottom: '1rem',
                        lineHeight: '1.5',
                        height: '3em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {pkg.description}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      marginBottom: '1rem',
                      alignItems: 'center'
                    }}>
                      {pkg.offer && pkg.offer !== pkg.price ? (
                        <>
                          <span style={{ 
                            textDecoration: 'line-through',
                            color: '#a0aec0',
                            fontSize: '1.1rem'
                          }}>${pkg.price}</span>
                          <span style={{ 
                            color: '#38a169',
                            fontWeight: '700',
                            fontSize: '1.3rem'
                          }}>${pkg.offer}</span>
                        </>
                      ) : (
                        <span style={{ 
                          color: '#2d3748',
                          fontWeight: '700',
                          fontSize: '1.3rem'
                        }}>${pkg.price}</span>
                      )}
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        background: pkg.status === 'ACTIVE' 
                          ? 'rgba(56, 161, 105, 0.1)' 
                          : pkg.status === 'INACTIVE'
                          ? 'rgba(245, 101, 101, 0.1)'
                          : 'rgba(237, 137, 54, 0.1)',
                        color: pkg.status === 'ACTIVE' 
                          ? '#38a169' 
                          : pkg.status === 'INACTIVE'
                          ? '#f56565'
                          : '#ed8936',
                        border: `1px solid ${pkg.status === 'ACTIVE' 
                          ? 'rgba(56, 161, 105, 0.3)' 
                          : pkg.status === 'INACTIVE'
                          ? 'rgba(245, 101, 101, 0.3)'
                          : 'rgba(237, 137, 54, 0.3)'}`
                      }}>
                        {pkg.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        onClick={() => openEditModal(pkg)} 
                        style={{
                          ...buttonStyle,
                          flex: 1,
                          background: 'rgba(66, 153, 225, 0.1)',
                          color: '#4299e1',
                          border: '1px solid rgba(66, 153, 225, 0.3)'
                        }}
                      >
                         Edit
                      </button>
                      <button 
                        onClick={() => openDeleteModal(pkg)}
                        style={{
                          ...buttonStyle,
                          flex: 1,
                          background: 'rgba(245, 101, 101, 0.1)',
                          color: '#f56565',
                          border: '1px solid rgba(245, 101, 101, 0.3)'
                        }}
                      >
                         Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Guides View */}
        {currentView === 'guides' && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '2rem',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{ 
                color: '#2d3748',
                margin: 0,
                fontSize: '2rem',
                fontWeight: '700'
              }}>Guide Management</h2>
              <button
                style={primaryButtonStyle}
                onClick={() => {
                  resetGuideForm();
                  setSelectedGuide(null);
                  setShowGuideModal(true);
                }}
              >
                 Add Guide
              </button>
            </div>

            <div style={{ 
              background: 'white',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white'
                  }}>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left',
                      fontWeight: '600'
                    }}>Name</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left',
                      fontWeight: '600'
                    }}>Email</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left',
                      fontWeight: '600'
                    }}>Phone</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>Status</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {guides.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ 
                        padding: '2rem', 
                        textAlign: 'center',
                        color: '#718096'
                      }}>
                        No guides found. Add your first guide!
                      </td>
                    </tr>
                  ) : (
                    guides.map((guide, index) => (
                      <tr key={guide.guideID} style={{ 
                        borderBottom: '1px solid #e2e8f0',
                        background: index % 2 === 0 ? '#f8f9fa' : 'white'
                      }}>
                        <td style={{ padding: '1rem', color: '#2d3748', fontWeight: '500' }}>
                          {guide.firstName} {guide.lastName}
                        </td>
                        <td style={{ padding: '1rem', color: '#718096' }}>{guide.email}</td>
                        <td style={{ padding: '1rem', color: '#718096' }}>{guide.phone}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            background: guide.status === 'ACTIVE' 
                              ? 'rgba(56, 161, 105, 0.1)' 
                              : guide.status === 'INACTIVE'
                              ? 'rgba(245, 101, 101, 0.1)'
                              : 'rgba(237, 137, 54, 0.1)',
                            color: guide.status === 'ACTIVE' 
                              ? '#38a169' 
                              : guide.status === 'INACTIVE'
                              ? '#f56565'
                              : '#ed8936',
                            border: `1px solid ${guide.status === 'ACTIVE' 
                              ? 'rgba(56, 161, 105, 0.3)' 
                              : guide.status === 'INACTIVE'
                              ? 'rgba(245, 101, 101, 0.3)'
                              : 'rgba(237, 137, 54, 0.3)'}`
                          }}>
                            {guide.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button 
                              onClick={() => {
                                setSelectedGuide(guide);
                                setShowViewModal(true);
                              }}
                              style={{
                                ...buttonStyle,
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                background: 'rgba(102, 126, 234, 0.1)',
                                color: '#667eea',
                                border: '1px solid rgba(102, 126, 234, 0.3)'
                              }}
                            >
                               View
                            </button>
                            <button 
                              onClick={() => openEditGuideModal(guide)}
                              style={{
                                ...buttonStyle,
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                background: 'rgba(66, 153, 225, 0.1)',
                                color: '#4299e1',
                                border: '1px solid rgba(66, 153, 225, 0.3)'
                              }}
                            >
                               Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteGuide(guide)}
                              style={{
                                ...buttonStyle,
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                background: 'rgba(245, 101, 101, 0.1)',
                                color: '#f56565',
                                border: '1px solid rgba(245, 101, 101, 0.3)'
                              }}
                            >
                               Delete
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
        )}

        {/* Availability View */}
        {currentView === 'availability' && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '2rem',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ 
              color: '#2d3748',
              marginBottom: '2rem',
              fontSize: '2rem',
              fontWeight: '700'
            }}>Package Availability Dashboard</h2>
            
            <div style={{ 
              background: 'white',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white'
                  }}>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left',
                      fontWeight: '600'
                    }}>Package Name</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>Current Bookings</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>Available</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {availabilityData.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ 
                        padding: '2rem', 
                        textAlign: 'center',
                        color: '#718096'
                      }}>
                        No availability data found.
                      </td>
                    </tr>
                  ) : (
                    availabilityData.map((pkg, index) => (
                      <tr key={pkg.packageID} style={{ 
                        borderBottom: '1px solid #e2e8f0',
                        background: index % 2 === 0 ? '#f8f9fa' : 'white'
                      }}>
                        <td style={{ 
                          padding: '1rem', 
                          color: '#2d3748', 
                          fontWeight: '500' 
                        }}>
                          {pkg.title}
                        </td>
                        <td style={{ 
                          padding: '1rem', 
                          textAlign: 'center',
                          color: '#718096',
                          fontSize: '1.1rem',
                          fontWeight: '600'
                        }}>
                          {pkg.currentBookings}
                        </td>
                        <td style={{ 
                          padding: '1rem', 
                          textAlign: 'center',
                          color: '#718096',
                          fontSize: '1.1rem',
                          fontWeight: '600'
                        }}>
                          {pkg.available}
                        </td>
                        <td style={{ 
                          padding: '1rem', 
                          textAlign: 'center' 
                        }}>
                          <span style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            background: pkg.status === 'Full' 
                              ? 'rgba(245, 101, 101, 0.1)' 
                              : 'rgba(56, 161, 105, 0.1)',
                            color: pkg.status === 'Full' 
                              ? '#f56565' 
                              : '#38a169',
                            border: `1px solid ${pkg.status === 'Full' 
                              ? 'rgba(245, 101, 101, 0.3)' 
                              : 'rgba(56, 161, 105, 0.3)'}`
                          }}>
                            {pkg.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ 
                margin: 0,
                color: '#2d3748',
                fontSize: '1.5rem'
              }}>Create Package</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: '#a0aec0'
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreatePackage} style={formStyle}>
              <div>
                <label style={labelStyle}>Image URL</label>
                <input 
                  name="image" 
                  placeholder="https://example.com/image.jpg" 
                  value={formData.image} 
                  onChange={handlePackageInputChange}
                  style={inputStyle}
                />
              </div>
              
              <div>
  <label style={labelStyle}>Title *</label>
  <input 
    name="title" 
    placeholder="Package title" 
    value={formData.title} 
    onChange={handlePackageInputChange}
    style={{
      ...inputStyle,
      borderColor: formErrors.title ? '#f56565' : '#e2e8f0'
    }}
    required
  />
  {formErrors.title && (
    <p style={{ color: '#c53030', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
      {formErrors.title}
    </p>
  )}
</div>
              
              <div>
  <label style={labelStyle}>Description *</label>
  <textarea 
    name="description" 
    placeholder="Package description" 
    value={formData.description} 
    onChange={handlePackageInputChange}
    style={{
      ...inputStyle,
      minHeight: '100px',
      resize: 'vertical',
      borderColor: formErrors.description ? '#f56565' : '#e2e8f0'
    }}
    required
  />
  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
    <span style={{ color: '#718096', fontSize: '0.85rem' }}>
      Word count: {getWordCount(formData.description)}/80
    </span>
    {formErrors.description && (
      <p style={{ color: '#c53030', fontSize: '0.85rem', margin: 0 }}>
        {formErrors.description}
      </p>
    )}
  </div>
</div>
              
              <div>
  <label style={labelStyle}>Original Price *</label>
  <input 
    type="number" 
    name="price" 
    placeholder="1000" 
    value={formData.price} 
    onChange={handlePackageInputChange}
    style={{
      ...inputStyle,
      borderColor: formErrors.price ? '#f56565' : '#e2e8f0'
    }}
    min="0"
    step="0.01"
    required
  />
  {formErrors.price && (
    <p style={{ color: '#c53030', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
      {formErrors.price}
    </p>
  )}
</div>
                
                <div>
  <label style={labelStyle}>Offer Price (Optional)</label>
  <input 
    type="number" 
    name="offer" 
    placeholder="Leave empty for no discount" 
    value={formData.offer} 
    onChange={handlePackageInputChange}
    style={inputStyle}
    min="0"
    step="0.01"
  />
  <small style={{ color: '#718096', fontSize: '0.85rem' }}>
    Leave empty to show only original price
  </small>
</div>
              
              
              <div>
                <label style={labelStyle}>Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handlePackageInputChange}
                  style={inputStyle}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  
                </select>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'flex-end',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0',
                marginTop: '1rem'
              }}>
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  style={secondaryButtonStyle}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={primaryButtonStyle}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ 
                margin: 0,
                color: '#2d3748',
                fontSize: '1.5rem'
              }}>Edit Package</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: '#a0aec0'
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditPackage} style={formStyle}>
              <div>
                <label style={labelStyle}>Image URL</label>
                <input 
                  name="image" 
                  placeholder="https://example.com/image.jpg" 
                  value={formData.image} 
                  onChange={handlePackageInputChange}
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={labelStyle}>Title *</label>
                <input 
                  name="title" 
                  placeholder="Package title" 
                  value={formData.title} 
                  onChange={handlePackageInputChange}
                  style={inputStyle}
                  required
                />
              </div>
              
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea 
                  name="description" 
                  placeholder="Package description" 
                  value={formData.description} 
                  onChange={handlePackageInputChange}
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                  required
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
  <div>
    <label style={labelStyle}>Original Price *</label>
    <input 
      type="number" 
      name="price" 
      placeholder="1000" 
      value={formData.price} 
      onChange={handlePackageInputChange}
      style={{
        ...inputStyle,
        borderColor: formErrors.price ? '#f56565' : '#e2e8f0'
      }}
      min="0"
      step="0.01"
      required
    />
    {formErrors.price && (
      <p style={{ color: '#c53030', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
        {formErrors.price}
      </p>
    )}
  </div>
  
  <div>
    <label style={labelStyle}>Offer Price (Optional)</label>
    <input 
      type="number" 
      name="offer" 
      placeholder="Leave empty for no discount" 
      value={formData.offer} 
      onChange={handlePackageInputChange}
      style={inputStyle}
      min="0"
      step="0.01"
    />
    <small style={{ color: '#718096', fontSize: '0.85rem' }}>
      Leave empty to show only original price
    </small>
  </div>
</div>
              
              <div>
                <label style={labelStyle}>Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handlePackageInputChange}
                  style={inputStyle}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  
                </select>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'flex-end',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0',
                marginTop: '1rem'
              }}>
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  style={secondaryButtonStyle}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={primaryButtonStyle}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={modalOverlayStyle}>
          <div style={{ 
            background: 'white', 
            padding: '2rem',
            borderRadius: '20px', 
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0',
              color: '#2d3748',
              fontSize: '1.5rem'
            }}>Delete Package</h3>
            <p style={{ 
              margin: '0 0 2rem 0',
              color: '#718096',
              lineHeight: '1.6'
            }}>
              Are you sure you want to delete <strong>{selectedPackage?.title}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowDeleteModal(false)}
                style={secondaryButtonStyle}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeletePackage}
                style={{
                  ...buttonStyle,
                  background: 'linear-gradient(135deg, #f56565, #e53e3e)',
                  color: 'white'
                }}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Guide Modal */}
{showGuideModal && (
  <div style={modalOverlayStyle}>
    <div style={modalStyle}>
      <div style={modalHeaderStyle}>
        <h3 style={{ 
          margin: 0,
          color: '#2d3748',
          fontSize: '1.5rem'
        }}>
          {selectedGuide ? 'Edit Guide' : 'Add Guide'}
        </h3>
        <button 
          onClick={() => {
            setShowGuideModal(false);
            setSelectedGuide(null);
          }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            color: '#a0aec0'
          }}
        >
          ×
        </button>
      </div>
      
      <form onSubmit={selectedGuide ? handleEditGuide : handleCreateGuide} style={formStyle}>
        {error && (
    <div style={{
      background: 'rgba(248, 215, 218, 0.9)',
      color: '#721c24',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      border: '1px solid #f5c6cb',
      fontSize: '0.9rem'
    }}>
      {error}
    </div>
  )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>First Name *</label>
            <input 
              name="firstName" 
              placeholder="John" 
              value={guideFormData.firstName} 
              onChange={handleGuideInputChange}
              style={inputStyle}
              required
            />
            {fieldErrors.firstName && (
  <p style={{ color: '#c53030', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
    {fieldErrors.firstName}
  </p>
)}
          </div>
          
          <div>
            <label style={labelStyle}>Last Name *</label>
            <input 
              name="lastName" 
              placeholder="Doe" 
              value={guideFormData.lastName} 
              onChange={handleGuideInputChange}
              style={inputStyle}
              required
            />
            {fieldErrors.lastName && (
  <p style={{ color: '#c53030', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
    {fieldErrors.lastNameName}
  </p>
)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Gender *</label>
            <select 
  name="gender" 
  value={guideFormData.gender} 
  onChange={handleGuideInputChange}
  style={inputStyle}
>
  <option value="MALE">Male</option>
  <option value="FEMALE">Female</option>
  <option value="OTHER">Other</option>
</select>
          </div>
          
          <div>
            <label style={labelStyle}>NIC *</label>
            <input 
              name="nic" 
              placeholder="123456789V" 
              value={guideFormData.nic} 
              onChange={handleGuideInputChange}
              style={inputStyle}
              required
            />
            {fieldErrors.nic && (
  <p style={{ color: '#c53030', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
    {fieldErrors.nic}
  </p>
)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Email *</label>
            <input 
              type="email"
              name="email" 
              placeholder="john@example.com" 
              value={guideFormData.email} 
              onChange={handleGuideInputChange}
              style={inputStyle}
              required
            />
            {fieldErrors.email && (
  <p style={{ color: '#c53030', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
    {fieldErrors.email}
  </p>
)}
          </div>
          
          <div>
            <label style={labelStyle}>Phone *</label>
            <input 
              name="phone" 
              placeholder="0771234567" 
              value={guideFormData.phone} 
              onChange={handleGuideInputChange}
              style={inputStyle}
              required
            />
            {<fieldErrors className="phone"></fieldErrors> && (
  <p style={{ color: '#c53030', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
    {fieldErrors.phone}
  </p>
)}
          </div>
        </div>
            <div>
  <label style={labelStyle}>Password {!selectedGuide && '*'}</label>
  <div style={{ position: 'relative' }}>
    <input 
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder={selectedGuide ? "Leave empty to keep current password" : "Enter password"}
      value={guideFormData.password}
      onChange={handleGuideInputChange}
      style={inputStyle}
      required={!selectedGuide}
    />
    {fieldErrors.password && (
  <p style={{ color: '#c53030', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
    {fieldErrors.firstName}
  </p>
)}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#718096',
        fontSize: '1.2rem'
      }}
    >
      {showPassword ? '👁️' : '👁️‍🗨️'}
    </button>
  </div>
  {!selectedGuide && <small style={{ color: '#718096', fontSize: '0.85rem' }}>Minimum 6 characters</small>}
</div>

<div>
  <label style={labelStyle}>Confirm Password {!selectedGuide && '*'}</label>
  <div style={{ position: 'relative' }}>
    <input 
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      placeholder={selectedGuide ? "Confirm new password if changing" : "Confirm password"}
      value={guideFormData.confirmPassword}
      onChange={handleGuideInputChange}
      style={inputStyle}
      required={!selectedGuide}
    />
    {fieldErrors.confirmPassword && (
  <p style={{ color: '#c53030', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
    {fieldErrors.confirmPassword}
  </p>
)}
    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#718096',
        fontSize: '1.2rem'
      }}
    >
      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
    </button>
  </div>
</div>

        


        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          
          <div>
            <label style={labelStyle}>Status</label>
            <select 
              name="status" 
              value={guideFormData.status} 
              onChange={handleGuideInputChange}
              style={inputStyle}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'flex-end',
          paddingTop: '1rem',
          borderTop: '1px solid #e2e8f0',
          marginTop: '1rem'
        }}>
          <button 
            type="button" 
            onClick={() => {
              setShowGuideModal(false);
              setSelectedGuide(null);
            }}
            style={secondaryButtonStyle}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            style={primaryButtonStyle}
            disabled={loading}
          >
            {loading ? (selectedGuide ? 'Updating...' : 'Creating...') : (selectedGuide ? 'Update Guide' : 'Save Guide')}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{/* View Guide Modal */}
{showViewModal && selectedGuide && (
  <div style={modalOverlayStyle}>
    <div style={{
      background: 'white',
      borderRadius: '20px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={modalHeaderStyle}>
        <h3 style={{ 
          margin: 0,
          color: '#2d3748',
          fontSize: '1.5rem'
        }}>
          Guide Details
        </h3>
        <button 
          onClick={() => {
            setShowViewModal(false);
            setSelectedGuide(null);
          }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            color: '#a0aec0'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gap: '1.5rem'
        }}>
          {/* Name Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                color: '#718096',
                marginBottom: '0.5rem',
                fontWeight: '600'
              }}>First Name</label>
              <p style={{ 
                margin: 0,
                color: '#2d3748',
                fontSize: '1rem',
                fontWeight: '500'
              }}>{selectedGuide.firstName}</p>
            </div>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                color: '#718096',
                marginBottom: '0.5rem',
                fontWeight: '600'
              }}>Last Name</label>
              <p style={{ 
                margin: 0,
                color: '#2d3748',
                fontSize: '1rem',
                fontWeight: '500'
              }}>{selectedGuide.lastName}</p>
            </div>
          </div>

          {/* Personal Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                color: '#718096',
                marginBottom: '0.5rem',
                fontWeight: '600'
              }}>Gender</label>
              <p style={{ 
                margin: 0,
                color: '#2d3748',
                fontSize: '1rem'
              }}>{selectedGuide.gender}</p>
            </div>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                color: '#718096',
                marginBottom: '0.5rem',
                fontWeight: '600'
              }}>NIC</label>
              <p style={{ 
                margin: 0,
                color: '#2d3748',
                fontSize: '1rem'
              }}>{selectedGuide.nic}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                color: '#718096',
                marginBottom: '0.5rem',
                fontWeight: '600'
              }}>Email</label>
              <p style={{ 
                margin: 0,
                color: '#2d3748',
                fontSize: '1rem'
              }}>{selectedGuide.email}</p>
            </div>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                color: '#718096',
                marginBottom: '0.5rem',
                fontWeight: '600'
              }}>Phone</label>
              <p style={{ 
                margin: 0,
                color: '#2d3748',
                fontSize: '1rem'
              }}>{selectedGuide.phone}</p>
            </div>
          </div>
          <div>
  <label style={{ 
    display: 'block',
    fontSize: '0.875rem',
    color: '#718096',
    marginBottom: '0.5rem',
    fontWeight: '600'
  }}>Password</label>
  <p style={{
    margin: 0,
    color: '#2d3748',
    fontSize: '1rem',
    letterSpacing: '3px'
  }}>••••••••</p>
</div>

            <div>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                color: '#718096',
                marginBottom: '0.5rem',
                fontWeight: '600'
              }}>Status</label>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                background: selectedGuide.status === 'ACTIVE' 
                  ? 'rgba(56, 161, 105, 0.1)' 
                  : selectedGuide.status === 'INACTIVE'
                  ? 'rgba(245, 101, 101, 0.1)'
                  : 'rgba(237, 137, 54, 0.1)',
                color: selectedGuide.status === 'ACTIVE' 
                  ? '#38a169' 
                  : selectedGuide.status === 'INACTIVE'
                  ? '#f56565'
                  : '#ed8936',
                border: `1px solid ${selectedGuide.status === 'ACTIVE' 
                  ? 'rgba(56, 161, 105, 0.3)' 
                  : selectedGuide.status === 'INACTIVE'
                  ? 'rgba(245, 101, 101, 0.3)'
                  : 'rgba(237, 137, 54, 0.3)'}`
              }}>
                {selectedGuide.status}
              </span>
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'flex-end',
          paddingTop: '1.5rem',
          marginTop: '1.5rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <button 
            onClick={() => {
              setShowViewModal(false);
              openEditGuideModal(selectedGuide);
            }}
            style={{
              ...buttonStyle,
              background: 'rgba(66, 153, 225, 0.1)',
              color: '#4299e1',
              border: '1px solid rgba(66, 153, 225, 0.3)'
            }}
          >
             Edit Guide
          </button>
          <button 
            onClick={() => {
              setShowViewModal(false);
              setSelectedGuide(null);
            }}
            style={secondaryButtonStyle}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  
)}
<ErrorModalComponent />
    </div>
  );
};

export default SeniorTravelConsultantDashboard;