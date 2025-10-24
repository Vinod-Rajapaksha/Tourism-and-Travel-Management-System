import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PackageDetails = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="tw-min-h-screen tw-bg-gray-50 tw-py-8 tw-px-4">
  <div className="tw-max-w-4xl tw-mx-auto">
    {/* Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="tw-mb-6 tw-flex tw-items-center tw-text-emerald-600 hover:tw-text-emerald-700 tw-font-medium"
    >
      <svg className="tw-w-5 tw-h-5 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to Promotions
    </button>

    {/* Package Details Card */}
    <div className="tw-bg-white tw-rounded-2xl tw-shadow-xl tw-overflow-hidden">
      {/* Package Header */}
      <div className="tw-relative tw-h-64 tw-bg-gradient-to-br tw-from-emerald-400 tw-to-teal-500">
        <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
          <div className="tw-text-center tw-text-white">
            <svg className="tw-w-24 tw-h-24 tw-mx-auto tw-mb-4 tw-opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="tw-text-2xl tw-font-bold">Package #{packageId}</p>
            <p className="tw-text-sm tw-opacity-90">Full details page</p>
          </div>
        </div>
      </div>

      {/* Package Content */}
      <div className="tw-p-8">
        <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900 tw-mb-4">Package Details</h1>
        
        <div className="tw-prose tw-max-w-none">
          <p className="tw-text-gray-600 tw-text-lg tw-mb-6">
            This is a placeholder for the package details page. 
            Here you can add:
          </p>
          
          <ul className="tw-space-y-3 tw-mb-8">
            <li className="tw-flex tw-items-start">
              <svg className="tw-w-6 tw-h-6 tw-text-emerald-500 tw-mr-3 tw-flex-shrink-0 tw-mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="tw-text-gray-700">Complete package description and itinerary</span>
            </li>
            <li className="tw-flex tw-items-start">
              <svg className="tw-w-6 tw-h-6 tw-text-emerald-500 tw-mr-3 tw-flex-shrink-0 tw-mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="tw-text-gray-700">Image gallery of destinations</span>
            </li>
            <li className="tw-flex tw-items-start">
              <svg className="tw-w-6 tw-h-6 tw-text-emerald-500 tw-mr-3 tw-flex-shrink-0 tw-mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="tw-text-gray-700">Detailed pricing and inclusions/exclusions</span>
            </li>
            <li className="tw-flex tw-items-start">
              <svg className="tw-w-6 tw-h-6 tw-text-emerald-500 tw-mr-3 tw-flex-shrink-0 tw-mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="tw-text-gray-700">Customer reviews and ratings</span>
            </li>
            <li className="tw-flex tw-items-start">
              <svg className="tw-w-6 tw-h-6 tw-text-emerald-500 tw-mr-3 tw-flex-shrink-0 tw-mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="tw-text-gray-700">Booking calendar and availability</span>
            </li>
            <li className="tw-flex tw-items-start">
              <svg className="tw-w-6 tw-h-6 tw-text-emerald-500 tw-mr-3 tw-flex-shrink-0 tw-mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="tw-text-gray-700">Terms and conditions</span>
            </li>
          </ul>

          <div className="tw-bg-emerald-50 tw-border-l-4 tw-border-emerald-500 tw-p-6 tw-rounded-r-lg">
            <h3 className="tw-text-lg tw-font-semibold tw-text-emerald-900 tw-mb-2">Development Note</h3>
            <p className="tw-text-emerald-800">
              This page is ready for your custom content. You can fetch package details from the backend API 
              using the package ID: <span className="tw-font-mono tw-font-bold">{packageId}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="tw-mt-8 tw-flex tw-gap-4">
          <button
            onClick={() => navigate('/payment?packageId=' + packageId)}
            className="tw-flex-1 tw-bg-emerald-600 tw-text-white tw-font-semibold tw-py-3 tw-px-6 tw-rounded-lg hover:tw-bg-emerald-700 tw-transition-colors tw-duration-200"
          >
            Book This Package
          </button>
          <button
            onClick={() => navigate(-1)}
            className="tw-px-6 tw-py-3 tw-border-2 tw-border-gray-300 tw-text-gray-700 tw-font-semibold tw-rounded-lg hover:tw-border-gray-400 hover:tw-bg-gray-50 tw-transition-colors tw-duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default PackageDetails;

