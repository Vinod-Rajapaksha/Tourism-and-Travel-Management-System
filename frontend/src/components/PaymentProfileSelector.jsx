import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PaymentProfileSelector = ({ onProfileSelect, selectedProfileId, disabled = false }) => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            setError('Failed to load payment profiles');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        const profileId = e.target.value;
        const selectedProfile = profiles.find(p => p.profileID.toString() === profileId);
        onProfileSelect(selectedProfile);
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <span>Loading payment profiles...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
            </div>
        );
    }

    if (profiles.length === 0) {
        return (
            <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                No payment profiles found. Please create a payment profile first.
            </div>
        );
    }

    return (
        <div className="mb-3">
            <label className="form-label">
                <i className="fas fa-credit-card me-2"></i>
                Select Payment Profile
            </label>
            <select
                className="form-control"
                value={selectedProfileId || ''}
                onChange={handleProfileChange}
                disabled={disabled}
                style={{
                    border: '2px solid rgba(66, 165, 245, 0.3)',
                    borderRadius: '10px',
                    padding: '12px 15px',
                    fontSize: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.3s ease'
                }}
            >
                <option value="">Choose a payment profile...</option>
                {profiles.map((profile) => (
                    <option key={profile.profileID} value={profile.profileID}>
                        {profile.profileName} - {profile.cardNumber} {profile.isDefault ? '(Default)' : ''}
                    </option>
                ))}
            </select>
            
            {profiles.length > 0 && (
                <div className="mt-2">
                    <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        You can manage your payment profiles in the Payment Profiles section.
                    </small>
                </div>
            )}
        </div>
    );
};

export default PaymentProfileSelector;
