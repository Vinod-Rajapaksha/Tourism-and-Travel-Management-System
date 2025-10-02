import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Payment, Promotion } from '../types/Event';
import apiService from '../services/api';

interface PaymentGatewayProps {
  promotions: Promotion[];
}

interface PaymentForm {
  customer: string;
  email: string;
  phone: string;
  packageId: string;
  packageName: string;
  amount: number;
  method: 'card' | 'cash' | 'bank' | 'wallet';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ promotions }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPackageId = searchParams.get('package');
  
  const [formData, setFormData] = useState<PaymentForm>({
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
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      const paymentData: Omit<Payment, 'id'> = {
        customer: formData.customer,
        amount: formData.amount,
        currency: 'LKR',
        date: new Date().toISOString(),
        status: 'pending',
        method: formData.method,
        packageId: formData.packageId,
        packageName: formData.packageName,
        packagePrice: formData.amount,
        bookingId: `BK${Date.now()}`
      };
      
      const response = await apiService.createPayment(paymentData);
      
      if (response.data) {
        // Simulate payment processing
        setTimeout(async () => {
          try {
            await apiService.updatePayment(response.data!.id, { status: 'confirmed' });
            setShowSuccess(true);
            setTimeout(() => {
              navigate('/');
            }, 3000);
          } catch (error) {
            console.error('Error confirming payment:', error);
          }
        }, 2000);
      } else {
        throw new Error(response.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ submit: 'Payment failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: keyof PaymentForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/);
    if (match) {
      return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
    }
    return value;
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your booking has been confirmed. Redirecting...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Secure Payment Gateway</h1>
          <p className="text-gray-600">Complete your booking with secure payment</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Package Info */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>
              
              {formData.packageName ? (
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">{formData.packageName}</h3>
                    <div className="text-sm opacity-90">
                      <p>Package ID: {formData.packageId}</p>
                      <p className="mt-2 text-2xl font-bold">LKR {formData.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span>LKR {formData.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-75">
                  <p>Please select a package to continue</p>
                </div>
              )}

              {/* Security Features */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <h4 className="font-semibold mb-4">Your payment is secured by:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    SSL Encryption
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    PCI Compliant
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Fraud Protection
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={formData.customer}
                        onChange={(e) => handleInputChange('customer', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                      {errors.customer && <p className="text-red-500 text-sm mt-1">{errors.customer}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="+94 77 123 4567"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Selection</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour Package *</label>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select a package</option>
                      {promotions.filter(p => p.isActive).map(promotion => (
                        <option key={promotion.id} value={promotion.id}>
                          {promotion.title} - LKR {promotion.price || '0'}
                        </option>
                      ))}
                    </select>
                    {errors.packageId && <p className="text-red-500 text-sm mt-1">{errors.packageId}</p>}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {[
                      { value: 'card', label: 'Credit Card', icon: '💳' },
                      { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
                      { value: 'wallet', label: 'Digital Wallet', icon: '📱' },
                      { value: 'cash', label: 'Cash', icon: '💵' }
                    ].map(method => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => handleInputChange('method', method.value as any)}
                        className={`p-3 border-2 rounded-lg text-center transition-all ${
                          formData.method === method.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg mb-1">{method.icon}</div>
                        <div className="text-xs font-medium">{method.label}</div>
                      </button>
                    ))}
                  </div>

                  {/* Card Details */}
                  {formData.method === 'card' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                          maxLength={19}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name *</label>
                        <input
                          type="text"
                          value={formData.cardHolderName}
                          onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Name as on card"
                        />
                        {errors.cardHolderName && <p className="text-red-500 text-sm mt-1">{errors.cardHolderName}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="MM/YY"
                          />
                          {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                          <input
                            type="text"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                            maxLength={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="123"
                          />
                          {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  {errors.submit && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      {errors.submit}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isProcessing || !formData.packageId}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </div>
                    ) : (
                      `Pay LKR ${formData.amount.toLocaleString()}`
                    )}
                  </button>
                </div>

                {/* Back to Home */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
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
