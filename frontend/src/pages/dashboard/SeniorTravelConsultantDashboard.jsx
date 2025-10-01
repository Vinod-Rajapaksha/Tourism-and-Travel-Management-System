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


  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    price: '',
    offer: '',
    status: 'ACTIVE'
  });

  const api = "http://localhost:8080/api/packages";

  useEffect(() => {
    loadPackages();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
    <h2 style={{ color: '#2d3748' }}>Guide Management</h2>
    <p>Here you will manage tour guides (coming soon).</p>
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
    </div>
  );
};

export default SeniorTravelConsultantDashboard;