import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../api/Package';

const PopularPackage = ({ className = '' }) => {
  const [popularPackage, setPopularPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularPackage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiService.getMostPopularPackage();
        if (response && response.data) {
          setPopularPackage(response.data);
        }
      } catch (e) {
        setError(e?.message || 'Error loading popular package');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPopularPackage();
  }, []);

  if (isLoading) {
    return (
<div className={`tw-bg-white tw-rounded-2xl tw-shadow-xl tw-overflow-hidden tw-border tw-border-gray-100 ${className}`}>
  <div className="tw-p-8 tw-text-center">
    <div className="tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-b-2 tw-border-emerald-600 tw-mx-auto"></div>
    <p className="tw-mt-2 tw-text-gray-600">Loading popular package...</p>
  </div>
</div>
    );
  }

  if (error) {
    return (
<div className={`tw-bg-white tw-rounded-2xl tw-shadow-xl tw-overflow-hidden tw-border tw-border-gray-100 ${className}`}>
  <div className="tw-p-8 tw-text-center">
    <p className="tw-text-red-600">Error: {error}</p>
  </div>
</div>
    );
  }

  if (!popularPackage) {
    return (
<div className={`tw-bg-white tw-rounded-2xl tw-shadow-xl tw-overflow-hidden tw-border tw-border-gray-100 ${className}`}>
  <div className="tw-p-8 tw-text-center">
    <p className="tw-text-gray-600">No popular package data available</p>
  </div>
</div>
    );
  }

  return (
      <div className={`tw-bg-white tw-rounded-2xl tw-shadow-xl tw-overflow-hidden tw-border tw-border-gray-100 ${className}`}>
  {/* Header with gradient */}
  <div className="tw-bg-gradient-to-r tw-from-emerald-600 tw-to-teal-600 tw-text-white tw-p-4">
    <div className="tw-flex tw-items-center tw-justify-between">
      <div>
        <h3 className="tw-text-lg tw-font-bold">Most Popular Package</h3>
        <p className="tw-text-emerald-100 tw-text-sm">Featured Tour Experience</p>
      </div>
      <div className="tw-bg-white/20 tw-rounded-full tw-p-2">
        <svg className="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </div>
    </div>
  </div>

  {/* Package Image Placeholder */}
  <div className="tw-relative tw-h-48 tw-bg-gradient-to-br tw-from-emerald-50 tw-to-teal-50">
    <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
      <div className="tw-text-center">
        <svg className="tw-w-16 tw-h-16 tw-mx-auto tw-text-emerald-300 tw-mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="tw-text-emerald-600 tw-font-semibold">Package Image</p>
        <p className="tw-text-emerald-500 tw-text-sm">(You can add image here later)</p>
      </div>
    </div>
    {/* Popular Badge */}
    <div className="tw-absolute tw-top-3 tw-right-3">
      <span className="tw-bg-red-500 tw-text-white tw-text-xs tw-font-bold tw-px-2 tw-py-1 tw-rounded-full">
        POPULAR
      </span>
    </div>
  </div>

  {/* Package Details */}
  <div className="tw-p-4">
    <h4 className="tw-text-xl tw-font-bold tw-text-gray-900 tw-mb-2">
      {popularPackage.packageName || 'Most Popular Package'}
    </h4>

    <p className="tw-text-gray-600 tw-text-sm tw-mb-4 tw-leading-relaxed">
      {popularPackage.description || 'Experience the best of our city with this comprehensive tour package. Includes guided tours, exclusive access to top attractions, and authentic local experiences.'}
    </p>

    {/* Features */}
    <div className="tw-space-y-2 tw-mb-4">
      <div className="tw-flex tw-items-center tw-text-sm tw-text-gray-700">
        <svg className="tw-w-4 tw-h-4 tw-text-emerald-500 tw-mr-2 tw-flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>3-Day Guided Tour</span>
      </div>
      <div className="tw-flex tw-items-center tw-text-sm tw-text-gray-700">
        <svg className="tw-w-4 tw-h-4 tw-text-emerald-500 tw-mr-2 tw-flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>Hotel Accommodation</span>
      </div>
      <div className="tw-flex tw-items-center tw-text-sm tw-text-gray-700">
        <svg className="tw-w-4 tw-h-4 tw-text-emerald-500 tw-mr-2 tw-flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>All Meals Included</span>
      </div>
      <div className="tw-flex tw-items-center tw-text-sm tw-text-gray-700">
        <svg className="tw-w-4 tw-h-4 tw-text-emerald-500 tw-mr-2 tw-flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>Transportation</span>
      </div>
    </div>

    {/* Pricing */}
    <div className="tw-border-t tw-border-gray-200 tw-pt-4 tw-mb-4">
      <div className="tw-flex tw-items-center tw-justify-between">
        <div>
          <span className="tw-text-2xl tw-font-bold tw-text-emerald-600">
            Rs. {popularPackage.price ? popularPackage.price.toLocaleString('en-LK') : '299'}
          </span>
          {popularPackage.originalPrice && (
            <span className="tw-text-sm tw-text-gray-500 tw-line-through tw-ml-2">
              Rs. {popularPackage.originalPrice.toLocaleString('en-LK')}
            </span>
          )}
        </div>
        <div className="tw-text-right">
          <span className="tw-text-xs tw-text-gray-500">per person</span>
          {popularPackage.salesCount && (
            <div className="tw-text-xs tw-font-semibold tw-text-emerald-600">
              {popularPackage.salesCount} sold this week
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Rating */}
    <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
      <div className="tw-flex tw-items-center">
        <div className="tw-flex tw-text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="tw-text-sm tw-text-gray-600 tw-ml-2">4.8 (127 reviews)</span>
      </div>
      <span className="tw-text-xs tw-text-gray-500">Limited Time</span>
    </div>

    {/* Action Buttons */}
    <div className="tw-space-y-2">
      <Link
        to={`/package-details/${popularPackage.packageId}`}
        className="tw-w-full tw-bg-emerald-600 tw-text-white tw-font-semibold tw-py-3 tw-px-4 tw-rounded-lg hover:tw-bg-emerald-700 tw-transition-colors tw-duration-200 tw-block tw-text-center"
      >
        View Details
      </Link>
    </div>

    {/* Additional Info */}
    <div className="tw-mt-4 tw-pt-4 tw-border-t tw-border-gray-200">
      <div className="tw-flex tw-items-center tw-justify-between tw-text-xs tw-text-gray-500">
        <span>Valid until Dec 31, 2024</span>
        <span>Max 8 people</span>
      </div>
    </div>
  </div>
</div>
  );
};

export default PopularPackage;