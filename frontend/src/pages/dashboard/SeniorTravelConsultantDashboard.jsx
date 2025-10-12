import React, { useState, useEffect } from 'react';

const SeniorTravelConsultantDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
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
  gender: 'Male',
  nic: '',
  email: '',
  phone: '',
  languages: '',
  region: '',
  experience: '',
  status: 'PENDING'
});

  const api = "http://localhost:8080/api/packages";
  const guideApi = "http://localhost:8080/api/guides";  

  useEffect(() => {
    loadPackages();
    loadGuides();
  }, []);

  const loadPackages = () => {
    setLoading(true);
    setError('');
    
    fetch(api)
      .then(response => {
        console.log('Load packages response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Loaded packages:', data);
        setPackages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching packages:", err);
        setError(`Failed to load packages: ${err.message}`);
        setLoading(false);
        // Demo data fallback
        setPackages([
          {
            packageID: 1,
            title: 'Sample Package',
            description: 'A sample travel package',
            price: 1000,
            offer: 800,
            status: 'ACTIVE',
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300'
          }
        ]);
      });
  };

  const loadGuides = () => {
  setLoading(true);
  
  fetch(guideApi)
    .then(response => {
      console.log('Load guides response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Loaded guides:', data);
      setGuides(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching guides:", err);
      setLoading(false);
      // Demo data fallback
      setGuides([
        {
          guideID: 1,
          firstName: 'John',
          lastName: 'Doe',
          gender: 'Male',
          nic: '123456789V',
          email: 'john@gmail.com',
          phone: '0771234567',
          languages: 'English, Sinhala',
          region: 'Western Province',
          experience: 5,
          status: 'ACTIVE'
        },
        {
          guideID: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          gender: 'Female',
          nic: '987654321V',
          email: 'jane@gmail.com',
          phone: '0779876543',
          languages: 'English, Tamil',
          region: 'Northern Province',
          experience: 3,
          status: 'PENDING'
        }
      ]);
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
    gender: 'Male',
    nic: '',
    email: '',
    phone: '',
    languages: '',
    region: '',
    experience: '',
    status: 'PENDING'
  });
  setError('');
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
};

const validateForm = () => {
  // Title
  if (!formData.title.trim()) {
    setError('Title is required');
    return false;
  }

  // Description
  if (!formData.description.trim()) {
    setError('Description is required');
    return false;
  }

  // Price
  const price = parseFloat(formData.price);
  if (!price || price <= 0) {
    setError('Price must be a positive number');
    return false;
  }

  // Offer only validate if user typed something
  if (formData.offer !== '') {
    const offer = parseFloat(formData.offer);
    if (!offer || offer <= 0) {
      setError('Offer price must be a positive number');
      return false;
    }
    if (offer > price) {
      setError('Offer price cannot be higher than original price');
      return false;
    }
  }

  return true;
};



const handleCreatePackage = (e) => {
  e.preventDefault();
  setError('');

  if (!validateForm()) return;

  setLoading(true);

  const price = parseFloat(formData.price);
  // Fix: check if offer is empty string or if it can't be parsed
  const offerValue = formData.offer === '' || formData.offer === null 
    ? price 
    : parseFloat(formData.offer);

  const payload = {
    image: formData.image || null,
    title: formData.title,
    description: formData.description,
    status: formData.status,
    price: price,
    offer: offerValue  // using the computed value
  };

  console.log('Creating package with payload:', payload);

  fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(response => {
      console.log('Create response status:', response.status);
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`HTTP ${response.status}: ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Created package:', data);
      loadPackages();
      setShowCreateModal(false);
      resetForm();
      setLoading(false);
      alert('Package created successfully!');
    })
    .catch(err => {
      console.error("Full create error:", err);
      setError(`Failed to create package: ${err.message}`);
      setLoading(false);

      // Demo fallback
      const newPackage = { ...payload, packageID: Date.now() };
      setPackages(prev => [...prev, newPackage]);
      setShowCreateModal(false);
      resetForm();
      alert('Package created successfully! (Demo mode)');
    });
};


  const handleEditPackage = (e) => {
  e.preventDefault();
  setError('');

  if (!validateForm()) return;

  setLoading(true);

  const price = parseFloat(formData.price);
  const offer = formData.offer === '' ? price : parseFloat(formData.offer);

  //  build clean payload
  const payload = {
    image: formData.image,
    title: formData.title,
    description: formData.description,
    status: formData.status,
    price,
    offer
  };

  console.log('Updating package:', selectedPackage.packageID, 'with payload:', payload);

  fetch(`${api}/${selectedPackage.packageID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(response => {
      console.log('Update response status:', response.status);
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`HTTP ${response.status}: ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Updated package:', data);
      loadPackages();
      setShowEditModal(false);
      resetForm();
      setSelectedPackage(null);
      setLoading(false);
      alert('Package updated successfully!');
    })
    .catch(err => {
      console.error("Full update error:", err);
      setError(`Failed to update package: ${err.message}`);
      setLoading(false);

      // Demo fallback
      setPackages(prev =>
        prev.map(pkg =>
          pkg.packageID === selectedPackage.packageID ? { ...pkg, ...payload } : pkg
        )
      );
      setShowEditModal(false);
      resetForm();
      setSelectedPackage(null);
      alert('Package updated successfully! (Demo mode)');
    });
};


  const handleDeletePackage = () => {
    setLoading(true);
    
    console.log('Deleting package:', selectedPackage.packageID);
    
    fetch(`${api}/${selectedPackage.packageID}`, {
      method: 'DELETE'
    })
      .then(response => {
        console.log('Delete response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        loadPackages();
        setShowDeleteModal(false);
        setSelectedPackage(null);
        setLoading(false);
        alert('Package deleted successfully!');
      })
      .catch(err => {
        console.error("Full delete error:", err);
        setError(`Failed to delete package: ${err.message}`);
        setLoading(false);
        
        // Demo fallback
        setPackages(prev => prev.filter(pkg => pkg.packageID !== selectedPackage.packageID));
        setShowDeleteModal(false);
        setSelectedPackage(null);
        alert('Package deleted successfully! (Demo mode)');
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
const validateGuideForm = () => {
  if (!guideFormData.firstName.trim()) {
    setError('First name is required');
    return false;
  }
  if (!guideFormData.lastName.trim()) {
    setError('Last name is required');
    return false;
  }
  if (!guideFormData.nic.trim()) {
    setError('NIC is required');
    return false;
  }
  if (!guideFormData.email.trim()) {
    setError('Email is required');
    return false;
  }
  if (!guideFormData.phone.trim()) {
    setError('Phone is required');
    return false;
  }
  if (!guideFormData.languages.trim()) {
    setError('Languages are required');
    return false;
  }
  if (!guideFormData.region.trim()) {
    setError('Region is required');
    return false;
  }
  const exp = parseInt(guideFormData.experience);
  if (!exp || exp < 0) {
    setError('Experience must be a positive number');
    return false;
  }
  return true;
};

const handleCreateGuide = (e) => {
  e.preventDefault();
  setError('');

  if (!validateGuideForm()) return;

  setLoading(true);

  const payload = {
    firstName: guideFormData.firstName,
    lastName: guideFormData.lastName,
    gender: guideFormData.gender,
    nic: guideFormData.nic,
    email: guideFormData.email,
    phone: guideFormData.phone,
    languages: guideFormData.languages,
    region: guideFormData.region,
    experience: parseInt(guideFormData.experience),
    status: guideFormData.status
  };

  console.log('Creating guide with payload:', payload);

  fetch(guideApi, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(response => {
      console.log('Create guide response status:', response.status);
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`HTTP ${response.status}: ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Created guide:', data);
      loadGuides();
      setShowGuideModal(false);
      resetGuideForm();
      setSelectedGuide(null);
      setLoading(false);
      alert('Guide created successfully!');
    })
    .catch(err => {
      console.error("Full create error:", err);
      setError(`Failed to create guide: ${err.message}`);
      setLoading(false);

      // Demo fallback
      const newGuide = { ...payload, guideID: Date.now() };
      setGuides(prev => [...prev, newGuide]);
      setShowGuideModal(false);
      resetGuideForm();
      setSelectedGuide(null);
      alert('Guide created successfully! (Demo mode)');
    });
};

const handleEditGuide = (e) => {
  e.preventDefault();
  setError('');

  if (!validateGuideForm()) return;

  setLoading(true);

  const payload = {
    firstName: guideFormData.firstName,
    lastName: guideFormData.lastName,
    gender: guideFormData.gender,
    nic: guideFormData.nic,
    email: guideFormData.email,
    phone: guideFormData.phone,
    languages: guideFormData.languages,
    region: guideFormData.region,
    experience: parseInt(guideFormData.experience),
    status: guideFormData.status
  };

  console.log('Updating guide:', selectedGuide.guideID, 'with payload:', payload);

  fetch(`${guideApi}/${selectedGuide.guideID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(response => {
      console.log('Update guide response status:', response.status);
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`HTTP ${response.status}: ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Updated guide:', data);
      loadGuides();
      setShowGuideModal(false);
      resetGuideForm();
      setSelectedGuide(null);
      setLoading(false);
      alert('Guide updated successfully!');
    })
    .catch(err => {
      console.error("Full update error:", err);
      setError(`Failed to update guide: ${err.message}`);
      setLoading(false);

      // Demo fallback
      setGuides(prev =>
        prev.map(guide =>
          guide.guideID === selectedGuide.guideID ? { ...guide, ...payload } : guide
        )
      );
      setShowGuideModal(false);
      resetGuideForm();
      setSelectedGuide(null);
      alert('Guide updated successfully! (Demo mode)');
    });
};

const handleToggleGuideStatus = (guide) => {
  const newStatus = guide.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  setLoading(true);

  const payload = {
    ...guide,
    status: newStatus
  };

  fetch(`${guideApi}/${guide.guideID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      loadGuides();
      setLoading(false);
      alert(`Guide ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully!`);
    })
    .catch(err => {
      console.error("Toggle status error:", err);
      setLoading(false);

      // Demo fallback
      setGuides(prev =>
        prev.map(g =>
          g.guideID === guide.guideID ? { ...g, status: newStatus } : g
        )
      );
      alert(`Guide ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully! (Demo mode)`);
    });
};

const openEditGuideModal = (guide) => {
  setSelectedGuide(guide);
  setGuideFormData({
    firstName: guide.firstName || '',
    lastName: guide.lastName || '',
    gender: guide.gender || 'Male',
    nic: guide.nic || '',
    email: guide.email || '',
    phone: guide.phone || '',
    languages: guide.languages || '',
    region: guide.region || '',
    experience: guide.experience || '',
    status: guide.status || 'PENDING'
  });
  setShowGuideModal(true);
};

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

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '1rem 0',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          padding: '1rem', 
          textAlign: 'center', 
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            margin: 0,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}> TravelPro</h2>
        </div>
<nav style={{ padding: '0 1rem' }}>
  <button
    style={{
      width: '100%',
      padding: '1rem',
      border: 'none',
      background: activeView === 'dashboard'
        ? 'linear-gradient(135deg, #667eea, #764ba2)'
        : 'transparent',
      color: activeView === 'dashboard' ? 'white' : '#4a5568',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '1rem',
      borderRadius: '12px',
      marginBottom: '0.5rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    }}
    onClick={() => setActiveView('dashboard')}
  >
    Dashboard
  </button>

  <button
    style={{
      width: '100%',
      padding: '1rem',
      border: 'none',
      background: activeView === 'packages'
        ? 'linear-gradient(135deg, #667eea, #764ba2)'
        : 'transparent',
      color: activeView === 'packages' ? 'white' : '#4a5568',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '1rem',
      borderRadius: '12px',
      marginBottom: '0.5rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    }}
    onClick={() => setActiveView('packages')}
  >
    Package Management
  </button>

  <button
    style={{
      width: '100%',
      padding: '1rem',
      border: 'none',
      background: activeView === 'guides'
        ? 'linear-gradient(135deg, #667eea, #764ba2)'
        : 'transparent',
      color: activeView === 'guides' ? 'white' : '#4a5568',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '1rem',
      borderRadius: '12px',
      marginBottom: '0.5rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    }}
    onClick={() => setActiveView('guides')}
  >
    Guide Management
  </button>

  <button
    style={{
      width: '100%',
      padding: '1rem',
      border: 'none',
      background: activeView === 'availability'
        ? 'linear-gradient(135deg, #667eea, #764ba2)'
        : 'transparent',
      color: activeView === 'availability' ? 'white' : '#4a5568',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '1rem',
      borderRadius: '12px',
      marginBottom: '0.5rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    }}
    onClick={() => setActiveView('availability')}
  >
    Availability Dashboard
  </button>

  <button
    style={{
      width: '100%',
      padding: '1rem',
      border: 'none',
      background: activeView === 'settings'
        ? 'linear-gradient(135deg, #667eea, #764ba2)'
        : 'transparent',
      color: activeView === 'settings' ? 'white' : '#4a5568',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '1rem',
      borderRadius: '12px',
      marginBottom: '0.5rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    }}
    onClick={() => setActiveView('settings')}
  >
    Settings
  </button>
</nav>

      </aside>

      {/* Main content */}
      <main style={{ 
        flex: 1, 
        padding: '2rem',
        overflow: 'auto'
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

        {activeView === 'dashboard' && (
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

        {activeView === 'packages' && (
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
                      lineHeight: '1.5'
                    }}>{pkg.description}</p>
                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      marginBottom: '1rem',
                      alignItems: 'center'
                    }}>
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
        
{activeView === 'guides' && (
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

{activeView === 'availability' && (
  <div style={{ 
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
  }}>
    <h2 style={{ color: '#2d3748' }}>Availability Dashboard</h2>
    <p>Here you will track tour availability (coming soon).</p>
  </div>
)}

{activeView === 'settings' && (
  <div style={{ 
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
  }}>
    <h2 style={{ color: '#2d3748' }}>Settings</h2>
    <p>Here you will configure your preferences (coming soon).</p>
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
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={labelStyle}>Title *</label>
                <input 
                  name="title" 
                  placeholder="Package title" 
                  value={formData.title} 
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                />
                 {formErrors.title && <p style={{ color: "red", fontSize: "0.85rem" }}>{formErrors.title}</p>}
              </div>
              
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea 
                  name="description" 
                  placeholder="Package description" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                  required
                />
                 {formErrors.description && <p style={{ color: "red", fontSize: "0.85rem" }}>{formErrors.description}</p>}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Original Price *</label>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="1000" 
                    value={formData.price} 
                    onChange={handleInputChange}
                    style={inputStyle}
                    min="0"
                    step="0.01"
                    required
                  />
                   {formErrors.price && <p style={{ color: "red", fontSize: "0.85rem" }}>{formErrors.price}</p>}
                </div>
                
                <div>
                  <label style={labelStyle}>Offer Price *</label>
                  <input 
                    type="number" 
                    name="offer" 
                    placeholder="800" 
                    value={formData.offer} 
                    onChange={handleInputChange}
                    style={inputStyle}
                    min="0"
                    step="0.01"
                  
                  />
                   {formErrors.offer && <p style={{ color: "red", fontSize: "0.85rem" }}>{formErrors.offer}</p>}
                </div>
              </div>
              
              <div>
                <label style={labelStyle}>Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleInputChange}
                  style={inputStyle}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="DRAFT">Draft</option>
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
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={labelStyle}>Title *</label>
                <input 
                  name="title" 
                  placeholder="Package title" 
                  value={formData.title} 
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    style={inputStyle}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label style={labelStyle}>Offer Price *</label>
                  <input 
                    type="number" 
                    name="offer" 
                    placeholder="800" 
                    value={formData.offer} 
                    onChange={handleInputChange}
                    style={inputStyle}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label style={labelStyle}>Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleInputChange}
                  style={inputStyle}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="DRAFT">Draft</option>
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
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
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
          </div>
        </div>

        <div>
          <label style={labelStyle}>Languages *</label>
          <input 
            name="languages" 
            placeholder="English, Sinhala, Tamil" 
            value={guideFormData.languages} 
            onChange={handleGuideInputChange}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Region *</label>
          <input 
            name="region" 
            placeholder="Western Province" 
            value={guideFormData.region} 
            onChange={handleGuideInputChange}
            style={inputStyle}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Experience (Years) *</label>
            <input 
              type="number"
              name="experience" 
              placeholder="5" 
              value={guideFormData.experience} 
              onChange={handleGuideInputChange}
              style={inputStyle}
              min="0"
              required
            />
          </div>
          
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

          {/* Professional Info */}
          <div style={{
            paddingBottom: '1rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <label style={{ 
              display: 'block',
              fontSize: '0.875rem',
              color: '#718096',
              marginBottom: '0.5rem',
              fontWeight: '600'
            }}>Languages</label>
            <p style={{ 
              margin: 0,
              color: '#2d3748',
              fontSize: '1rem'
            }}>{selectedGuide.languages}</p>
          </div>

          <div style={{
            paddingBottom: '1rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <label style={{ 
              display: 'block',
              fontSize: '0.875rem',
              color: '#718096',
              marginBottom: '0.5rem',
              fontWeight: '600'
            }}>Region</label>
            <p style={{ 
              margin: 0,
              color: '#2d3748',
              fontSize: '1rem'
            }}>{selectedGuide.region}</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                color: '#718096',
                marginBottom: '0.5rem',
                fontWeight: '600'
              }}>Experience</label>
              <p style={{ 
                margin: 0,
                color: '#2d3748',
                fontSize: '1rem',
                fontWeight: '500'
              }}>{selectedGuide.experience} years</p>
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
  </div>
)}
    </div>
  );
};

export default SeniorTravelConsultantDashboard;