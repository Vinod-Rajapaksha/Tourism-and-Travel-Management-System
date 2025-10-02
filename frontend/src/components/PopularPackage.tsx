import React from 'react';
import { Link } from 'react-router-dom';

interface PopularPackageProps {
  className?: string;
}

const PopularPackage: React.FC<PopularPackageProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 ${className}`}>
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Most Popular Package</h3>
            <p className="text-emerald-100 text-sm">Featured Tour Experience</p>
          </div>
          <div className="bg-white/20 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Package Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-emerald-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-emerald-600 font-semibold">Package Image</p>
            <p className="text-emerald-500 text-sm">(You can add image here later)</p>
          </div>
        </div>
        {/* Popular Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            POPULAR
          </span>
        </div>
      </div>

      {/* Package Details */}
      <div className="p-4">
        <h4 className="text-xl font-bold text-gray-900 mb-2">
          Ultimate City Explorer Package
        </h4>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          Experience the best of our city with this comprehensive tour package. Includes guided tours, 
          exclusive access to top attractions, and authentic local experiences.
        </p>

        {/* Features */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-700">
            <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>3-Day Guided Tour</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Hotel Accommodation</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>All Meals Included</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Transportation</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-emerald-600">$299</span>
              <span className="text-sm text-gray-500 line-through ml-2">$399</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">per person</span>
              <div className="text-xs font-semibold text-red-600">Save $100</div>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">4.8 (127 reviews)</span>
          </div>
          <span className="text-xs text-gray-500">Limited Time</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link 
            to="/payment?package=ultimate-city-explorer"
            className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors duration-200 block text-center"
          >
            Book This Package
          </Link>
          <button className="w-full bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm">
            View Details
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Valid until Dec 31, 2024</span>
            <span>Max 8 people</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularPackage;
