import React from 'react';
import { isDateInPromotionRange } from '../../utils/dateUtils';
import { format } from 'date-fns';

const EventModal = ({ isOpen, onClose, selectedDate, promotions }) => {
  if (!isOpen || !selectedDate) return null;

  const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy');

  // Filter promotions that are active on the selected date
  const dayPromotions = promotions.filter(
      (promotion) =>
          promotion.isActive &&
          isDateInPromotionRange(selectedDate, promotion.startDate, promotion.endDate)
  );

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getEventColor = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      pink: 'bg-pink-500',
    };
    return colorMap[color || 'blue'] || 'bg-blue-500';
  };

  const getEventBgColor = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      orange: 'bg-orange-50 border-orange-200',
      red: 'bg-red-50 border-red-200',
      pink: 'bg-pink-50 border-pink-200',
    };
    return colorMap[color || 'blue'] || 'bg-blue-50 border-blue-200';
  };

  const getEventTextColor = (color) => {
    const colorMap = {
      blue: 'text-blue-700',
      green: 'text-green-700',
      purple: 'text-purple-700',
      orange: 'text-orange-700',
      red: 'text-red-700',
      pink: 'text-pink-700',
    };
    return colorMap[color || 'blue'] || 'text-blue-700';
  };

  return (
      <div className="tw-modal-overlay" onClick={handleOverlayClick}>
  <div className="tw-modal-content1">
    <div className="tw-p-0">
      {/* Header */}
      <div className="tw-bg-gradient-to-r tw-from-emerald-600 tw-to-teal-600 tw-text-white tw-p-3 tw-rounded-t-2xl">
        <div className="tw-flex tw-justify-between tw-items-start">
          <div>
            <h2 className="tw-text-base tw-font-bold tw-mb-1">{formattedDate}</h2>
            <div className="tw-flex tw-items-center tw-space-x-2 tw-text-white/80">
              <svg
                className="tw-w-3 tw-h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="tw-text-xs">
                {dayPromotions.length} promotion
                {dayPromotions.length !== 1 ? 's' : ''} available
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="tw-text-white/80 hover:tw-text-white hover:tw-bg-white/10 tw-p-1 tw-rounded-lg tw-transition-all tw-duration-200"
          >
            <svg
              className="tw-w-4 tw-h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="tw-p-3">
        {dayPromotions.length === 0 ? (
          <div className="tw-text-center tw-py-6">
            <div className="tw-w-12 tw-h-12 tw-mx-auto tw-mb-2 tw-bg-gray-100 tw-rounded-full tw-flex tw-items-center tw-justify-center">
              <svg
                className="tw-w-6 tw-h-6 tw-text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="tw-text-sm tw-font-semibold tw-text-gray-900 tw-mb-1">
              No Promotions Available
            </h3>
            <p className="tw-text-gray-500 tw-text-xs">
              Check back later for special tour offers!
            </p>
          </div>
        ) : (
          <div className="tw-space-y-3">
            {dayPromotions.map((promotion) => (
              <div
                key={promotion.id}
                className={`${getEventBgColor(
                  promotion.color
                )} tw-rounded-lg tw-p-3 hover:tw-shadow-md tw-transition-all tw-duration-200 tw-border`}
              >
                {/* Promotion Header */}
                <div className="tw-flex tw-items-start tw-justify-between tw-mb-2">
                  <div className="tw-flex tw-items-center tw-space-x-2">
                    <div
                      className={`tw-w-3 tw-h-3 tw-rounded-full ${getEventColor(
                        promotion.color
                      )}`}
                    />
                    <h3 className="tw-font-bold tw-text-gray-900 tw-text-sm">
                      {promotion.title}
                    </h3>
                  </div>
                  {promotion.time && (
                    <span className="tw-text-xs tw-font-semibold tw-text-gray-600 tw-bg-white tw-px-2 tw-py-1 tw-rounded-full tw-border">
                      {promotion.time}
                    </span>
                  )}
                </div>

                {/* Discount Badge */}
                {promotion.discount && (
                  <div className="tw-mb-2">
                    <span className="tw-inline-flex tw-items-center tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-bold tw-bg-red-100 tw-text-red-800">
                      {promotion.discount}% OFF
                    </span>
                  </div>
                )}

                {/* Promotion Description */}
                {promotion.description && (
                  <p className="tw-text-gray-700 tw-text-xs tw-leading-relaxed tw-mb-3">
                    {promotion.description}
                  </p>
                )}

                {/* Promotion Details Grid */}
                <div className="tw-grid tw-grid-cols-2 tw-gap-2 tw-mb-3">
                  {/* Current Price */}
                  {promotion.price && (
                    <div className="tw-flex tw-items-center tw-space-x-1">
                      <span className="tw-text-xs tw-font-semibold tw-text-green-700">
                        Rs. {Number(promotion.price).toLocaleString('en-LK')}
                      </span>
                    </div>
                  )}

                  {/* Original Price */}
                  {promotion.originalPrice && (
                    <div className="tw-flex tw-items-center tw-space-x-1">
                      <span className="tw-text-xs tw-font-semibold tw-text-gray-500 tw-line-through">
                        Rs. {Number(promotion.originalPrice).toLocaleString('en-LK')}
                      </span>
                    </div>
                  )}

                  {/* Duration */}
                  {promotion.duration && (
                    <div className="tw-flex tw-items-center tw-space-x-1">
                      <span className="tw-text-xs tw-font-semibold tw-text-blue-700">
                        {promotion.duration}
                      </span>
                    </div>
                  )}

                  {/* Max Participants */}
                  {promotion.maxParticipants &&
                    promotion.maxParticipants > 0 && (
                      <div className="tw-flex tw-items-center tw-space-x-1">
                        <span className="tw-text-xs tw-font-semibold tw-text-purple-700">
                          Max: {promotion.maxParticipants}
                        </span>
                      </div>
                    )}
                </div>

                {/* Promotion Terms */}
                {promotion.terms && (
                  <div className="tw-mb-3 tw-p-2 tw-bg-yellow-50 tw-border tw-border-yellow-200 tw-rounded-lg">
                    <div className="tw-flex tw-items-start tw-space-x-1">
                      <span className="tw-text-xs tw-text-yellow-800">
                        <strong>Terms:</strong> {promotion.terms}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="tw-flex tw-space-x-2 tw-pt-2 tw-border-t tw-border-gray-200">
                  <button className="tw-flex-1 tw-bg-emerald-600 tw-text-white tw-text-xs tw-font-semibold tw-py-2 tw-px-3 tw-rounded-lg hover:tw-bg-emerald-700 tw-transition-colors">
                    Book Now
                  </button>
                  <button className="tw-flex-1 tw-bg-gray-100 tw-text-gray-700 tw-text-xs tw-font-semibold tw-py-2 tw-px-3 tw-rounded-lg hover:tw-bg-gray-200 tw-transition-colors">
                    Learn More
                  </button>
                </div>

                {/* Additional Info */}
                <div className="tw-mt-2 tw-text-xs tw-text-gray-500">
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <span>Promotion ID: {promotion.id}</span>
                    {promotion.createdAt && (
                      <span>
                        Added:{' '}
                        {format(
                          new Date(promotion.createdAt),
                          'MMM dd, yyyy'
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  );
};

export default EventModal;