import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiService from '../../api/Payment';

const PaymentGateway = ({ promotions, currentUser }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const selectedPackageId = searchParams.get('package');

    const [formData, setFormData] = useState({
        customer: '',
        email: '',
        phone: '',
        packageId: selectedPackageId || '',
        packageName: '',
        amount: 0,
        method: 'card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: ''
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (selectedPackageId) {
            const selectedPromotion = promotions.find(p => p.id === selectedPackageId);
            if (selectedPromotion) {
                const price = selectedPromotion.price ? parseFloat(selectedPromotion.price.replace(/[^\d.]/g, '')) : 0;
                setFormData(prev => ({
                    ...prev,
                    packageId: selectedPromotion.id,
                    packageName: selectedPromotion.title,
                    amount: price
                }));
            }
        }
    }, [selectedPackageId, promotions]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customer.trim()) newErrors.customer = 'Customer name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.packageId) newErrors.packageId = 'Please select a package';
        if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';

        if (formData.method === 'card') {
            if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
            if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits';
            if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = 'Expiry date must be MM/YY format';
            if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
            if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be 3-4 digits';
            if (!formData.cardHolderName.trim()) newErrors.cardHolderName = 'Card holder name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsProcessing(true);

        try {
            // FIXED: Match backend DTO structure exactly
            const paymentData = {
                // Required fields by backend
                userId: 1, // You need to get this from user authentication or context
                packageId: formData.packageId,
                amount: formData.amount,

                // Optional but should match backend field names
                customerEmail: formData.email,
                customerPhone: formData.phone,
                method: formData.method,
                packageName: formData.packageName,
                packagePrice: formData.amount,

                // Backend will auto-generate these if not provided
                // bookingId: `BK${Date.now()}`,
                // currency: 'LKR',
                // status: 'PENDING'
            };

            console.log('Sending payment data:', paymentData); // Debug log

            const response = await apiService.createPayment(paymentData);

            if (response.data) {
                console.log('Payment created successfully:', response.data);

                // Simulate payment processing
                setTimeout(async () => {
                    try {
                        // Update payment status to SUCCESS (uppercase as per backend enum)
                        const updateData = {
                            status: 'SUCCESS' // Uppercase to match PaymentStatus enum
                        };

                        await apiService.updatePayment(response.data.paymentId, updateData);
                        setShowSuccess(true);
                        setTimeout(() => {
                            navigate('/');
                        }, 3000);
                    } catch (error) {
                        console.error('Error confirming payment:', error);
                        setErrors({ submit: 'Payment confirmation failed. Please contact support.' });
                    }
                }, 2000);
            } else {
                throw new Error(response.error || 'Payment creation failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            setErrors({ submit: error.message || 'Payment failed. Please try again.' });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\s/g, '');
        const match = cleaned.match(/(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/);
        if (match) {
            return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
        }
        return value;
    };

    if (showSuccess) {
        return (
            <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-green-50 tw-to-green-100">
  <div className="tw-bg-white tw-p-8 tw-rounded-2xl tw-shadow-xl tw-text-center tw-max-w-md tw-mx-4">
    <div className="tw-w-16 tw-h-16 tw-bg-green-500 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
      <svg className="tw-w-8 tw-h-8 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 className="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-2">Payment Successful!</h2>
    <p className="tw-text-gray-600 tw-mb-4">Your booking has been confirmed. Redirecting...</p>
    <div className="tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-b-2 tw-border-green-500 tw-mx-auto"></div>
  </div>
</div>
        );
    }

    return (
        <div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-blue-50 tw-to-indigo-100 tw-py-8">
  <div className="tw-max-w-4xl tw-mx-auto tw-px-4">
    <div className="tw-text-center tw-mb-8">
      <h1 className="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-2">Secure Payment Gateway</h1>
      <p className="tw-text-gray-600">Complete your booking with secure payment</p>
    </div>

    <div className="tw-bg-white tw-rounded-2xl tw-shadow-xl tw-overflow-hidden">
      <div className="tw-grid md:tw-grid-cols-2 tw-gap-0">
        {/* Left side - Booking Summary (unchanged) */}
        <div className="tw-bg-gradient-to-br tw-from-indigo-500 tw-to-purple-600 tw-p-8 tw-text-white">
          <h2 className="tw-text-2xl tw-font-bold tw-mb-6">Booking Summary</h2>

          {formData.packageName ? (
            <div className="tw-space-y-4">
              <div className="tw-bg-white/10 tw-rounded-lg tw-p-4">
                <h3 className="tw-font-semibold tw-text-lg tw-mb-2">{formData.packageName}</h3>
                <div className="tw-text-sm tw-opacity-90">
                  <p>Package ID: {formData.packageId}</p>
                  <p className="tw-mt-2 tw-text-2xl tw-font-bold">LKR {formData.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="tw-border-t tw-border-white/20 tw-pt-4">
                <div className="tw-flex tw-justify-between tw-items-center tw-text-lg tw-font-semibold">
                  <span>Total Amount:</span>
                  <span>LKR {formData.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="tw-text-center tw-opacity-75">
              <p>Please select a package to continue</p>
            </div>
          )}

          <div className="tw-mt-8 tw-pt-8 tw-border-t tw-border-white/20">
            <h4 className="tw-font-semibold tw-mb-4">Your payment is secured by:</h4>
            <div className="tw-space-y-2 tw-text-sm">
              <div className="tw-flex tw-items-center">
                <svg className="tw-w-4 tw-h-4 tw-mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                SSL Encryption
              </div>
              <div className="tw-flex tw-items-center">
                <svg className="tw-w-4 tw-h-4 tw-mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                PCI Compliant
              </div>
              <div className="tw-flex tw-items-center">
                <svg className="tw-w-4 tw-h-4 tw-mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Fraud Protection
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Payment Form (unchanged UI) */}
        <div className="tw-p-8">
          <form onSubmit={handleSubmit} className="tw-space-y-6">
            {/* Customer Information Section (unchanged) */}
            <div>
              <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">Customer Information</h3>
              <div className="tw-space-y-4">
                <div>
                  <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => handleInputChange('customer', e.target.value)}
                    className="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.customer && <p className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.customer}</p>}
                </div>

                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                  <div>
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-border-transparent"
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-border-transparent"
                      placeholder="+94 77 123 4567"
                    />
                    {errors.phone && <p className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Package Selection Section (unchanged) */}
            <div>
              <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">Package Selection</h3>
              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Tour Package *</label>
                <select
                  value={formData.packageId}
                  onChange={(e) => {
                    const selected = promotions.find(p => p.id === e.target.value);
                    if (selected) {
                      const price = selected.price ? parseFloat(selected.price.replace(/[^\d.]/g, '')) : 0;
                      setFormData(prev => ({
                        ...prev,
                        packageId: selected.id,
                        packageName: selected.title,
                        amount: price
                      }));
                    }
                  }}
                  className="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-border-transparent"
                >
                  <option value="">Select a package</option>
                  {promotions.filter(p => p.isActive).map(promotion => (
                    <option key={promotion.id} value={promotion.id}>
                      {promotion.title} - LKR {promotion.price || '0'}
                    </option>
                  ))}
                </select>
                {errors.packageId && <p className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.packageId}</p>}
              </div>
            </div>

            {/* Payment Method Section (unchanged) */}
            <div>
              <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">Payment Method</h3>
              <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-2 tw-mb-4">
                {[
                  { value: 'card', label: 'Credit Card', icon: '💳' },
                  { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
                  { value: 'wallet', label: 'Digital Wallet', icon: '📱' },
                  { value: 'cash', label: 'Cash', icon: '💵' }
                ].map(method => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => handleInputChange('method', method.value)}
                    className={`tw-p-3 tw-border-2 tw-rounded-lg tw-text-center tw-transition-all ${
                      formData.method === method.value
                        ? 'tw-border-indigo-500 tw-bg-indigo-50 tw-text-indigo-700'
                        : 'tw-border-gray-200 hover:tw-border-gray-300'
                    }`}
                  >
                    <div className="tw-text-lg tw-mb-1">{method.icon}</div>
                    <div className="tw-text-xs tw-font-medium">{method.label}</div>
                  </button>
                ))}
              </div>

              {formData.method === 'card' && (
                <div className="tw-space-y-4 tw-p-4 tw-bg-gray-50 tw-rounded-lg">
                  <div>
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Card Number *</label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-border-transparent"
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && <p className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div>
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Card Holder Name *</label>
                    <input
                      type="text"
                      value={formData.cardHolderName}
                      onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                      className="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-border-transparent"
                      placeholder="Name as on card"
                    />
                    {errors.cardHolderName && <p className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.cardHolderName}</p>}
                  </div>

                  <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                    <div>
                      <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Expiry Date *</label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                          }
                          handleInputChange('expiryDate', value);
                        }}
                        maxLength={5}
                        className="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-border-transparent"
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && <p className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.expiryDate}</p>}
                    </div>

                    <div>
                      <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">CVV *</label>
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                        maxLength={4}
                        className="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-border-transparent"
                        placeholder="123"
                      />
                      {errors.cvv && <p className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button Section */}
            <div className="tw-pt-4">
              {errors.submit && (
                <div className="tw-mb-4 tw-p-3 tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg tw-text-red-700">
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || !formData.packageId}
                className="tw-w-full tw-bg-gradient-to-r tw-from-indigo-500 tw-to-purple-600 tw-text-white tw-py-3 tw-px-6 tw-rounded-lg tw-font-semibold hover:tw-from-indigo-600 hover:tw-to-purple-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-ring-offset-2 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-transition-all"
              >
                {isProcessing ? (
                  <div className="tw-flex tw-items-center tw-justify-center">
                    <div className="tw-animate-spin tw-rounded-full tw-h-5 tw-w-5 tw-border-b-2 tw-border-white tw-mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay LKR ${formData.amount.toLocaleString()}`
                )}
              </button>
            </div>

            <div className="tw-text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="tw-text-indigo-600 hover:tw-text-indigo-700 tw-font-medium"
              >
                ← Back to Home
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
    );
};

export default PaymentGateway;