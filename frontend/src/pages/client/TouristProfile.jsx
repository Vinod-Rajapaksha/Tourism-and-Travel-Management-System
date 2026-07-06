import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Swal from 'sweetalert2';
import './TouristProfile.css';

const TouristProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('PERSONAL');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nic: '',
    gender: 'MALE'
  });

  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [prefData, setPrefData] = useState({
    dietary: 'NONE',
    seating: 'WINDOW',
    emergencyContact: '',
    specialNotes: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || user.fName || '',
        lastName: user.lastName || user.lName || '',
        email: user.email || '',
        phone: user.phone || user.contactNo || '',
        nic: user.nic || user.passportNo || '',
        gender: user.gender || 'MALE'
      });

      const clientId = user.clientID || user.id || 1;
      const savedPrefs = localStorage.getItem(`ceylona_prefs_${clientId}`);
      if (savedPrefs) {
        try {
          setPrefData(JSON.parse(savedPrefs));
        } catch (e) {}
      }
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const clientId = user?.clientID || user?.id || 1;
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        nic: formData.nic,
        gender: formData.gender
      };
      await api.put(`/clients/${clientId}`, payload);
      
      const updatedUser = { ...user, ...payload };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your personal account details have been updated successfully.',
        confirmButtonColor: '#10b981'
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your account details have been updated locally.',
        confirmButtonColor: '#10b981'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      Swal.fire('Error', 'New password and confirm password do not match.', 'error');
      return;
    }
    if (pwdData.newPassword.length < 8) {
      Swal.fire('Error', 'New password must be at least 8 characters long.', 'error');
      return;
    }

    setLoading(true);
    const clientId = user?.clientID || user?.id || 1;
    try {
      await api.patch(`/clients/${clientId}/password`, {
        currentPassword: pwdData.currentPassword,
        newPassword: pwdData.newPassword
      });
      Swal.fire('Password Changed', 'Your account password was successfully updated.', 'success');
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error updating password:', err);
      Swal.fire('Error', 'Could not update password. Please verify your current password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrefsSubmit = (e) => {
    e.preventDefault();
    const clientId = user?.clientID || user?.id || 1;
    localStorage.setItem(`ceylona_prefs_${clientId}`, JSON.stringify(prefData));
    Swal.fire({
      icon: 'success',
      title: 'Preferences Saved',
      text: 'Your travel preferences have been saved for your upcoming tours.',
      confirmButtonColor: '#f59e0b'
    });
  };

  const getInitials = () => {
    const f = formData.firstName ? formData.firstName[0] : 'V';
    const l = formData.lastName ? formData.lastName[0] : 'R';
    return (f + l).toUpperCase();
  };

  return (
    <div className="profile-page-container container py-4">
      {/* Top Row: User Summary Card */}
      <div className="row g-4 mb-5">
        <div className="col-12">
          <div className="p-4 p-md-5 rounded-4 shadow-sm" style={{ background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="d-flex flex-column flex-md-row align-items-center gap-4 text-center text-md-start">
              <div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle fw-bold shadow" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                {getInitials()}
              </div>
              <div className="flex-grow-1">
                <h2 className="fw-bold text-white mb-1">{formData.firstName} {formData.lastName}</h2>
                <p className="text-white-50 mb-2"><i className="bi bi-envelope me-2"></i>{formData.email}</p>
                <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
                  <span className="badge bg-success bg-opacity-25 text-success px-3 py-1 rounded-pill">
                    <i className="bi bi-check-circle-fill me-1"></i> Active Traveler Account
                  </span>
                  {formData.phone && (
                    <span className="badge bg-secondary bg-opacity-50 text-white px-3 py-1 rounded-pill">
                      <i className="bi bi-telephone me-1"></i> {formData.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="d-flex border-bottom border-secondary border-opacity-25 mb-4 overflow-auto">
        <button 
          className={`btn btn-link text-decoration-none px-4 py-3 fw-semibold text-nowrap border-bottom border-2 transition-all ${activeTab === 'PERSONAL' ? 'text-warning border-warning' : 'text-white-50 border-transparent'}`}
          onClick={() => setActiveTab('PERSONAL')}
        >
          <i className="bi bi-person me-2"></i>Personal Information
        </button>
        <button 
          className={`btn btn-link text-decoration-none px-4 py-3 fw-semibold text-nowrap border-bottom border-2 transition-all ${activeTab === 'SECURITY' ? 'text-warning border-warning' : 'text-white-50 border-transparent'}`}
          onClick={() => setActiveTab('SECURITY')}
        >
          <i className="bi bi-shield-lock me-2"></i>Security & Password
        </button>
        <button 
          className={`btn btn-link text-decoration-none px-4 py-3 fw-semibold text-nowrap border-bottom border-2 transition-all ${activeTab === 'PREFS' ? 'text-warning border-warning' : 'text-white-50 border-transparent'}`}
          onClick={() => setActiveTab('PREFS')}
        >
          <i className="bi bi-sliders me-2"></i>Travel Preferences
        </button>
      </div>

      {/* Tab 1: Personal Information */}
      {activeTab === 'PERSONAL' && (
        <div className="p-4 p-md-5 rounded-4 shadow-sm" style={{ background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h4 className="fw-bold text-white mb-4"><i className="bi bi-person-lines-fill text-warning me-2"></i>Edit Personal Details</h4>
          <form onSubmit={handleProfileSubmit}>
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label text-white-50 small">First Name</label>
                <input 
                  type="text" 
                  className="form-control bg-dark text-white border-secondary border-opacity-50 py-2" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-white-50 small">Last Name</label>
                <input 
                  type="text" 
                  className="form-control bg-dark text-white border-secondary border-opacity-50 py-2" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-white-50 small">Email Address (Read Only)</label>
                <input 
                  type="email" 
                  className="form-control bg-dark text-white-50 border-secondary border-opacity-25 py-2" 
                  value={formData.email}
                  disabled
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-white-50 small">Contact Telephone</label>
                <input 
                  type="text" 
                  className="form-control bg-dark text-white border-secondary border-opacity-50 py-2" 
                  value={formData.phone}
                  placeholder="+94 77 123 4567"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-white-50 small">NIC or Passport Number</label>
                <input 
                  type="text" 
                  className="form-control bg-dark text-white border-secondary border-opacity-50 py-2" 
                  value={formData.nic}
                  placeholder="N1234567 / 951234567V"
                  onChange={(e) => setFormData({...formData, nic: e.target.value})}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-white-50 small">Gender</label>
                <select 
                  className="form-select bg-dark text-white border-secondary border-opacity-50 py-2"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-warning rounded-pill px-5 py-2 fw-bold text-dark">
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'SECURITY' && (
        <div className="p-4 p-md-5 rounded-4 shadow-sm max-w-lg" style={{ background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h4 className="fw-bold text-white mb-4"><i className="bi bi-key-fill text-warning me-2"></i>Change Password</h4>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="form-label text-white-50 small">Current Password</label>
              <input 
                type="password" 
                className="form-control bg-dark text-white border-secondary border-opacity-50 py-2" 
                value={pwdData.currentPassword}
                onChange={(e) => setPwdData({...pwdData, currentPassword: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-white-50 small">New Password (Min 8 chars)</label>
              <input 
                type="password" 
                className="form-control bg-dark text-white border-secondary border-opacity-50 py-2" 
                value={pwdData.newPassword}
                onChange={(e) => setPwdData({...pwdData, newPassword: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-white-50 small">Confirm New Password</label>
              <input 
                type="password" 
                className="form-control bg-dark text-white border-secondary border-opacity-50 py-2" 
                value={pwdData.confirmPassword}
                onChange={(e) => setPwdData({...pwdData, confirmPassword: e.target.value})}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-warning rounded-pill px-5 py-2 fw-bold text-dark">
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Travel Preferences */}
      {activeTab === 'PREFS' && (
        <div className="p-4 p-md-5 rounded-4 shadow-sm" style={{ background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h4 className="fw-bold text-white mb-4"><i className="bi bi-sliders text-warning me-2"></i>Tour & Travel Preferences</h4>
          <form onSubmit={handlePrefsSubmit}>
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label text-white-50 small">Dietary Requirements</label>
                <select 
                  className="form-select bg-dark text-white border-secondary border-opacity-50 py-2"
                  value={prefData.dietary}
                  onChange={(e) => setPrefData({...prefData, dietary: e.target.value})}
                >
                  <option value="NONE">No Special Requirement (Standard)</option>
                  <option value="VEGETARIAN">Vegetarian</option>
                  <option value="VEGAN">Vegan</option>
                  <option value="HALAL">Halal Certified</option>
                  <option value="GLUTEN_FREE">Gluten Free</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label text-white-50 small">Vehicle Seating Preference</label>
                <select 
                  className="form-select bg-dark text-white border-secondary border-opacity-50 py-2"
                  value={prefData.seating}
                  onChange={(e) => setPrefData({...prefData, seating: e.target.value})}
                >
                  <option value="WINDOW">Window Seat Preferred</option>
                  <option value="AISLE">Aisle Seat Preferred</option>
                  <option value="FRONT">Front Row / Chauffeur Adjacent</option>
                  <option value="NO_PREF">No Preference</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label text-white-50 small">Emergency Contact Number</label>
                <input 
                  type="text" 
                  className="form-control bg-dark text-white border-secondary border-opacity-50 py-2" 
                  placeholder="Relative / Friend Contact No."
                  value={prefData.emergencyContact}
                  onChange={(e) => setPrefData({...prefData, emergencyContact: e.target.value})}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-white-50 small">Special Requests / Medical Notes</label>
                <textarea 
                  className="form-control bg-dark text-white border-secondary border-opacity-50 py-2" 
                  rows="2"
                  placeholder="Any mobility requirements, allergies, or special requests for your tour guide..."
                  value={prefData.specialNotes}
                  onChange={(e) => setPrefData({...prefData, specialNotes: e.target.value})}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn btn-warning rounded-pill px-5 py-2 fw-bold text-dark">
              Save Preferences
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TouristProfile;
