import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../services/api';
import BigErrorAlert from '../../components/BigErrorAlert';

export default function PaymentProfiles() {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);

    useEffect(() => {
        fetchPaymentProfiles();
    }, []);

    const fetchPaymentProfiles = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/customer/payment-profiles');
            setProfiles(response.data || []);
        } catch (err) {
            console.error('Error fetching payment profiles:', err);
            setError('Failed to load payment profiles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSetDefault = async (profileId) => {
        try {
            await api.patch(`/api/customer/payment-profiles/${profileId}/set-default`);
            await Swal.fire('Success', 'Default payment profile updated!', 'success');
            fetchPaymentProfiles();
        } catch (err) {
            console.error('Error setting default profile:', err);
            Swal.fire('Error', 'Failed to set default profile.', 'error');
        }
    };

    const handleDeleteProfile = async (profileId, profileName) => {
        const result = await Swal.fire({
            title: 'Delete Payment Profile',
            text: `Are you sure you want to delete "${profileName}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/api/customer/payment-profiles/${profileId}`);
                await Swal.fire('Deleted!', 'Payment profile has been deleted.', 'success');
                fetchPaymentProfiles();
            } catch (err) {
                console.error('Error deleting profile:', err);
                Swal.fire('Error', 'Failed to delete payment profile.', 'error');
            }
        }
    };

    const handleEditProfile = (profile) => {
        setEditingProfile(profile);
        setShowCreateForm(true);
    };

    if (loading) {
        return (
            <div className="container py-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4" style={{ maxWidth: '1200px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0" style={{
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold'
                }}>
                    💳 Payment Profiles
                </h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingProfile(null);
                        setShowCreateForm(true);
                    }}
                    style={{
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        fontWeight: '600'
                    }}
                >
                    ➕ Add Payment Profile
                </button>
            </div>

            {error && (
                <div className="mb-4">
                    <BigErrorAlert
                        title="Error"
                        message={error}
                        type="error"
                        onClose={() => setError('')}
                    />
                </div>
            )}

            {profiles.length === 0 ? (
                <div className="text-center py-5">
                    <div className="mb-4">
                        <i className="fas fa-credit-card" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                    </div>
                    <h4 className="text-muted">No Payment Profiles</h4>
                    <p className="text-muted">You haven't added any payment profiles yet.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingProfile(null);
                            setShowCreateForm(true);
                        }}
                        style={{
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '12px 24px',
                            fontWeight: '600'
                        }}
                    >
                        Create Your First Payment Profile
                    </button>
                </div>
            ) : (
                <div className="row">
                    {profiles.map((profile) => (
                        <div key={profile.profileID} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100" style={{
                                borderRadius: '15px',
                                border: profile.isDefault ? '2px solid #28a745' : '1px solid #dee2e6',
                                boxShadow: profile.isDefault ? '0 8px 25px rgba(40, 167, 69, 0.2)' : '0 4px 15px rgba(0, 0, 0, 0.1)'
                            }}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="card-title mb-0">{profile.profileName}</h5>
                                        {profile.isDefault && (
                                            <span className="badge bg-success">Default</span>
                                        )}
                                    </div>
                                    
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className={`fas fa-${getPaymentMethodIcon(profile.paymentMethod)} me-2`}></i>
                                            <span className="text-muted">{profile.paymentMethod.replace('_', ' ')}</span>
                                        </div>
                                        <div className="text-muted small">
                                            <div>💳 {profile.cardNumber}</div>
                                            <div>👤 {profile.cardHolderName}</div>
                                            <div>📅 {profile.expiryMonth}/{profile.expiryYear}</div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-muted small">
                                            <div>📍 {profile.billingAddress}</div>
                                            <div>{profile.city}, {profile.postalCode}</div>
                                            <div>{profile.country}</div>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        {!profile.isDefault && (
                                            <button
                                                className="btn btn-outline-success btn-sm"
                                                onClick={() => handleSetDefault(profile.profileID)}
                                            >
                                                Set Default
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => handleEditProfile(profile)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDeleteProfile(profile.profileID, profile.profileName)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreateForm && (
                <PaymentProfileForm
                    profile={editingProfile}
                    onClose={() => {
                        setShowCreateForm(false);
                        setEditingProfile(null);
                    }}
                    onSuccess={() => {
                        setShowCreateForm(false);
                        setEditingProfile(null);
                        fetchPaymentProfiles();
                    }}
                />
            )}
        </div>
    );
}

const PaymentProfileForm = ({ profile, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        profileName: profile?.profileName || '',
        paymentMethod: profile?.paymentMethod || 'CREDIT_CARD',
        cardNumber: profile?.cardNumber || '',
        cardHolderName: profile?.cardHolderName || '',
        expiryMonth: profile?.expiryMonth || '',
        expiryYear: profile?.expiryYear || '',
        billingAddress: profile?.billingAddress || '',
        city: profile?.city || '',
        postalCode: profile?.postalCode || '',
        country: profile?.country || '',
        isDefault: profile?.isDefault || false
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!form.profileName.trim()) newErrors.profileName = 'Profile name is required';
        if (!form.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        if (!form.cardHolderName.trim()) newErrors.cardHolderName = 'Card holder name is required';
        if (!form.expiryMonth.trim()) newErrors.expiryMonth = 'Expiry month is required';
        if (!form.expiryYear.trim()) newErrors.expiryYear = 'Expiry year is required';
        if (!form.billingAddress.trim()) newErrors.billingAddress = 'Billing address is required';
        if (!form.city.trim()) newErrors.city = 'City is required';
        if (!form.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
        if (!form.country.trim()) newErrors.country = 'Country is required';

        // Card number validation
        if (form.cardNumber && !/^[0-9\s-]{13,19}$/.test(form.cardNumber)) {
            newErrors.cardNumber = 'Invalid card number format';
        }

        // Expiry month validation
        if (form.expiryMonth && !/^(0[1-9]|1[0-2])$/.test(form.expiryMonth)) {
            newErrors.expiryMonth = 'Invalid month format (MM)';
        }

        // Expiry year validation
        if (form.expiryYear && !/^[0-9]{4}$/.test(form.expiryYear)) {
            newErrors.expiryYear = 'Invalid year format (YYYY)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSaving(true);
        try {
            if (profile) {
                await api.put(`/api/customer/payment-profiles/${profile.profileID}`, form);
                await Swal.fire('Success', 'Payment profile updated successfully!', 'success');
            } else {
                await api.post('/api/customer/payment-profiles', form);
                await Swal.fire('Success', 'Payment profile created successfully!', 'success');
            }
            onSuccess();
        } catch (err) {
            console.error('Error saving payment profile:', err);
            Swal.fire('Error', 'Failed to save payment profile.', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ borderRadius: '15px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {profile ? 'Edit Payment Profile' : 'Create Payment Profile'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Profile Name *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.profileName ? 'is-invalid' : ''}`}
                                        value={form.profileName}
                                        onChange={(e) => setForm({...form, profileName: e.target.value})}
                                    />
                                    {errors.profileName && <div className="invalid-feedback">{errors.profileName}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Payment Method *</label>
                                    <select
                                        className="form-control"
                                        value={form.paymentMethod}
                                        onChange={(e) => setForm({...form, paymentMethod: e.target.value})}
                                    >
                                        <option value="CREDIT_CARD">Credit Card</option>
                                        <option value="DEBIT_CARD">Debit Card</option>
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                        <option value="PAYPAL">PayPal</option>
                                        <option value="DIGITAL_WALLET">Digital Wallet</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Card Number *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                                        value={form.cardNumber}
                                        onChange={(e) => setForm({...form, cardNumber: e.target.value})}
                                        placeholder="1234 5678 9012 3456"
                                    />
                                    {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Card Holder Name *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.cardHolderName ? 'is-invalid' : ''}`}
                                        value={form.cardHolderName}
                                        onChange={(e) => setForm({...form, cardHolderName: e.target.value})}
                                    />
                                    {errors.cardHolderName && <div className="invalid-feedback">{errors.cardHolderName}</div>}
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Expiry Month *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.expiryMonth ? 'is-invalid' : ''}`}
                                        value={form.expiryMonth}
                                        onChange={(e) => setForm({...form, expiryMonth: e.target.value})}
                                        placeholder="MM"
                                        maxLength="2"
                                    />
                                    {errors.expiryMonth && <div className="invalid-feedback">{errors.expiryMonth}</div>}
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Expiry Year *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.expiryYear ? 'is-invalid' : ''}`}
                                        value={form.expiryYear}
                                        onChange={(e) => setForm({...form, expiryYear: e.target.value})}
                                        placeholder="YYYY"
                                        maxLength="4"
                                    />
                                    {errors.expiryYear && <div className="invalid-feedback">{errors.expiryYear}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Billing Address *</label>
                                    <textarea
                                        className={`form-control ${errors.billingAddress ? 'is-invalid' : ''}`}
                                        value={form.billingAddress}
                                        onChange={(e) => setForm({...form, billingAddress: e.target.value})}
                                        rows="2"
                                    />
                                    {errors.billingAddress && <div className="invalid-feedback">{errors.billingAddress}</div>}
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">City *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                        value={form.city}
                                        onChange={(e) => setForm({...form, city: e.target.value})}
                                    />
                                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Postal Code *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
                                        value={form.postalCode}
                                        onChange={(e) => setForm({...form, postalCode: e.target.value})}
                                    />
                                    {errors.postalCode && <div className="invalid-feedback">{errors.postalCode}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Country *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                        value={form.country}
                                        onChange={(e) => setForm({...form, country: e.target.value})}
                                    />
                                    {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="isDefault"
                                            checked={form.isDefault}
                                            onChange={(e) => setForm({...form, isDefault: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="isDefault">
                                            Set as default payment profile
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const getPaymentMethodIcon = (method) => {
    switch (method) {
        case 'CREDIT_CARD':
        case 'DEBIT_CARD':
            return 'credit-card';
        case 'BANK_TRANSFER':
            return 'university';
        case 'PAYPAL':
            return 'paypal';
        case 'DIGITAL_WALLET':
            return 'mobile-alt';
        default:
            return 'credit-card';
    }
};
