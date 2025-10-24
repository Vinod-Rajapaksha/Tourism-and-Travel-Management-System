import React, { useState, useEffect } from 'react';
import apiService from '../../api/Payment';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.getPayments();
      console.log('Payments API Response:', response);

      if (Array.isArray(response)) {
        if (response.length > 0) {
          setPayments(response);
        } else {
          setError('No payments found.');
        }
      } else if (response && response.data && Array.isArray(response.data)) {
        setPayments(response.data);
      } else if (response && response.error) {
        if (response.status === 401) {
          setError('Session expired. Please login again.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          setError(response.error);
        }
      } else {
        setError('Invalid payment response format.');
      }
    } catch (e) {
      console.error('Payment loading error:', e);
      setError(e?.message || 'Error loading payment data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      SUCCESS: 'tw-bg-green-100 tw-text-green-800 tw-border-green-200',
      PENDING: 'tw-bg-yellow-100 tw-text-yellow-800 tw-border-yellow-200',
      FAILED: 'tw-bg-red-100 tw-text-red-800 tw-border-red-200',
      REFUNDED: 'tw-bg-gray-100 tw-text-gray-800 tw-border-gray-200',
    };

    return (
      <span
        className={`tw-px-3 tw-py-1 tw-text-xs tw-font-semibold tw-rounded-full tw-border ${
          statusStyles[status] || 'tw-bg-gray-100 tw-text-gray-800'
        }`}
      >
        {status}
      </span>
    );
  };

  const filteredPayments =
    filterStatus === 'all'
      ? payments
      : payments.filter((p) => p.status === filterStatus);

  const totalAmount = filteredPayments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-h-64">
        <div className="tw-text-center">
          <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-b-2 tw-border-[#4e73df] tw-mx-auto tw-mb-4"></div>
          <p className="tw-text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg tw-p-6">
        <div className="tw-flex tw-items-center">
          <svg
            className="tw-w-6 tw-h-6 tw-text-red-600 tw-mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="tw-text-red-800 tw-font-medium">Error loading payments</p>
            <p className="tw-text-red-600 tw-text-sm tw-mt-1">{error}</p>
            {error.includes('Session expired') ? (
              <p className="tw-text-red-500 tw-text-sm tw-mt-2">
                Redirecting to login page...
              </p>
            ) : (
              <button
                onClick={loadPayments}
                className="tw-mt-2 tw-px-4 tw-py-2 tw-bg-red-600 tw-text-white tw-rounded-lg hover:tw-bg-red-700 tw-transition-colors tw-text-sm"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-space-y-6">
      <div className="tw-flex tw-items-center tw-justify-between">
        <div>
          <h2 className="tw-text-2xl tw-font-bold tw-text-gray-900">
            Payment History
          </h2>
          <p className="tw-text-gray-600 tw-mt-1">
            View and manage all payment transactions
          </p>
        </div>
        <div className="tw-flex tw-items-center tw-space-x-3">
          <span className="tw-text-sm tw-text-gray-500">
            Showing {filteredPayments.length} of {payments.length} payments
          </span>
          <button
            onClick={loadPayments}
            className="tw-flex tw-items-center tw-px-4 tw-py-2 tw-bg-[#4e73df] tw-text-white tw-rounded-lg hover:tw-bg-[#4266c9] tw-transition-colors"
          >
            <svg
              className="tw-w-4 tw-h-4 tw-mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-4">
        <StatCard
          title="Total Payments"
          value={payments.length}
          color="gray"
          iconPath="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
        <StatCard
          title="Successful"
          value={payments.filter((p) => p.status === 'SUCCESS').length}
          color="green"
          iconPath="M5 13l4 4L19 7"
        />
        <StatCard
          title="Pending"
          value={payments.filter((p) => p.status === 'PENDING').length}
          color="yellow"
          iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatCard
          title="Total Revenue"
          value={`Rs. ${totalAmount.toLocaleString('en-LK')}`}
          color="blue"
          iconPath="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"
        />
      </div>

      {/* Filters */}
      <div className="tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-p-4">
        <div className="tw-flex tw-items-center tw-space-x-2 tw-flex-wrap tw-gap-2">
          <span className="tw-text-sm tw-text-gray-600 tw-font-medium">
            Filter by Status:
          </span>
          {['all', 'SUCCESS', 'PENDING', 'FAILED', 'REFUNDED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-rounded-lg tw-transition-colors ${
                filterStatus === status
                  ? 'tw-bg-[#4e73df] tw-text-white tw-shadow-sm'
                  : 'tw-bg-gray-100 tw-text-gray-700 hover:tw-bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Payments' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-overflow-hidden tw-shadow-sm">
        <div className="tw-overflow-x-auto">
          <table className="tw-w-full">
            <thead className="tw-bg-gray-50 tw-border-b tw-border-gray-200">
              <tr>
                {[
                  'Payment ID',
                  'Booking ID',
                  'Package',
                  'Customer',
                  'Amount',
                  'Method',
                  'Date',
                  'Status',
                ].map((h) => (
                  <th
                    key={h}
                    className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-semibold tw-text-gray-700 tw-uppercase tw-tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tw-divide-y tw-divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="tw-px-6 tw-py-12 tw-text-center">
                    <div className="tw-text-gray-400">
                      <svg
                        className="tw-w-16 tw-h-16 tw-mx-auto tw-mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="tw-text-lg tw-font-medium">No payments found</p>
                      <p className="tw-text-sm">
                        {payments.length === 0
                          ? 'No payments have been made yet'
                          : `No payments match the "${filterStatus}" filter`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.paymentId} className="hover:tw-bg-gray-50 tw-transition-colors">
                    <td className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900">
                      #{p.paymentId ?? 'N/A'}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">{p.reservationId ?? 'N/A'}</td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">{p.packageName ?? 'N/A'}</td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">{p.customerEmail ?? 'N/A'}</td>
                    <td className="tw-px-6 tw-py-4 tw-font-semibold tw-text-[#4e73df]">
                      Rs. {(p.amount || 0).toLocaleString('en-LK')}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">{p.method || 'N/A'}</td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">{formatDate(p.paymentDate)}</td>
                    <td className="tw-px-6 tw-py-4">{getStatusBadge(p.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Simple stat card helper
const StatCard = ({ title, value, color, iconPath }) => {
  const colorClasses = {
    gray: {
      bg: 'tw-bg-gray-100',
      text: 'tw-text-gray-600',
      icon: 'tw-text-gray-600'
    },
    green: {
      bg: 'tw-bg-green-100',
      text: 'tw-text-green-600',
      icon: 'tw-text-green-600'
    },
    yellow: {
      bg: 'tw-bg-yellow-100',
      text: 'tw-text-yellow-600',
      icon: 'tw-text-yellow-600'
    },
    blue: {
      bg: 'tw-bg-blue-100',
      text: 'tw-text-[#4e73df]',
      icon: 'tw-text-[#4e73df]'
    }
  };

  const colors = colorClasses[color] || colorClasses.gray;

  return (
    <div className="tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-p-4 tw-shadow-sm hover:tw-shadow-md tw-transition-shadow">
      <div className="tw-flex tw-items-center tw-justify-between">
        <div>
          <p className="tw-text-sm tw-text-gray-600">{title}</p>
          <p className={`tw-text-2xl tw-font-bold ${colors.text}`}>
            {value}
          </p>
        </div>
        <div className={`tw-w-12 tw-h-12 ${colors.bg} tw-rounded-lg tw-flex tw-items-center tw-justify-center`}>
          <svg
            className={`tw-w-6 tw-h-6 ${colors.icon}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;