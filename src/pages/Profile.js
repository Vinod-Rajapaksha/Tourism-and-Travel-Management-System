// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile, getMyCustomerProfile, updateMyCustomerProfile } from '../services/apiService';

function Profile() {
  const role = localStorage.getItem('role');
  const guideId = localStorage.getItem('guideId');
  const customerId = localStorage.getItem('customerId');
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    phoneNumbers: ['']
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        let data;
        
        if (role === 'ROLE_TOUR_GUIDE') {
          data = await getMyProfile();
        } else if (role === 'ROLE_CUSTOMER') {
          data = await getMyCustomerProfile();
        } else {
          throw new Error('Invalid user role');
        }
        
        setProfile(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          gender: data.gender || '',
          phoneNumbers: data.phoneNumbers || ['']
        });
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [role]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhoneChange = (index, value) => {
    const newPhoneNumbers = [...formData.phoneNumbers];
    newPhoneNumbers[index] = value;
    setFormData({
      ...formData,
      phoneNumbers: newPhoneNumbers
    });
  };

  const addPhoneNumber = () => {
    setFormData({
      ...formData,
      phoneNumbers: [...formData.phoneNumbers, '']
    });
  };

  const removePhoneNumber = (index) => {
    if (formData.phoneNumbers.length > 1) {
      const newPhoneNumbers = formData.phoneNumbers.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        phoneNumbers: newPhoneNumbers
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setError(null);
    
    try {
      console.log('Updating profile with data:', formData);
      
      if (role === 'ROLE_TOUR_GUIDE') {
        console.log('Guide ID:', guideId);
        await updateMyProfile(guideId, formData);
        // Refresh profile data
        const updatedProfile = await getMyProfile();
        setProfile(updatedProfile);
      } else if (role === 'ROLE_CUSTOMER') {
        console.log('Customer ID:', customerId);
        await updateMyCustomerProfile(customerId, formData);
        // Refresh profile data
        const updatedProfile = await getMyCustomerProfile();
        setProfile(updatedProfile);
      }
      
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div className="container">
      <h2 className="mb-4">My Profile</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Edit Profile</h5>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label">Gender</label>
                  <select
                    className="form-select"
                    id="gender"
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Phone Numbers</label>
                  {formData.phoneNumbers.map((phone, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                      />
                      {formData.phoneNumbers.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removePhoneNumber(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={addPhoneNumber}
                  >
                    + Add Phone Number
                  </button>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100" 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Account Information</h5>
              
              <table className="table">
                <tbody>
                  <tr>
                    <th>Guide ID:</th>
                    <td>{profile?.guideID}</td>
                  </tr>
                  <tr>
                    <th>Email:</th>
                    <td>{profile?.email}</td>
                  </tr>
                  <tr>
                    <th>NIC:</th>
                    <td>{profile?.nic || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <th>Status:</th>
                    <td>
                      <span className={`badge ${profile?.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>
                        {profile?.status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Phone Numbers:</th>
                    <td>
                      {profile?.phoneNumbers && profile.phoneNumbers.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {profile.phoneNumbers.map((phone, index) => (
                            <li key={index}>{phone}</li>
                          ))}
                        </ul>
                      ) : (
                        'No phone numbers added'
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Created:</th>
                    <td>{profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : 'Unknown'}</td>
                  </tr>
                </tbody>
              </table>
              
              <div className="alert alert-info mt-3" role="alert">
                <small>
                  <strong>Note:</strong> Email and NIC changes require admin approval. 
                  Please contact administrator for these changes.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;