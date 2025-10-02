import React from 'react';
import { Promotion } from '../types/Event';
import { isDateInPromotionRange } from '../utils/dateUtils';
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  promotions: Promotion[];
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, selectedDate, promotions }) => {
  if (!isOpen || !selectedDate) return null;

  const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy');

  // Filter promotions that are active on the selected date
  const dayPromotions = promotions.filter(
    (promotion) =>
      promotion.isActive &&
      isDateInPromotionRange(selectedDate, promotion.startDate, promotion.endDate)
  );

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getEventColor = (color?: string): string => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      pink: 'bg-pink-500',
    };
    return colorMap[color || 'blue'] || 'bg-blue-500';
  };

  const getEventBgColor = (color?: string): string => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      orange: 'bg-orange-50 border-orange-200',
      red: 'bg-red-50 border-red-200',
      pink: 'bg-pink-50 border-pink-200',
    };
    return colorMap[color || 'blue'] || 'bg-blue-50 border-blue-200';
  };

  const getEventTextColor = (color?: string): string => {
    const colorMap: Record<string, string> = {
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
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-base font-bold mb-1">{formattedDate}</h2>
                <div className="flex items-center space-x-2 text-white/80">
                  <svg
                    className="w-3 h-3"
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
                  <span className="text-xs">
                    {dayPromotions.length} promotion
                    {dayPromotions.length !== 1 ? 's' : ''} available
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
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
          <div className="p-3">
            {dayPromotions.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
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
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  No Promotions Available
                </h3>
                <p className="text-gray-500 text-xs">
                  Check back later for special tour offers!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dayPromotions.map((promotion) => (
                  <div
                    key={promotion.id}
                    className={`${getEventBgColor(
                      promotion.color
                    )} rounded-lg p-3 hover:shadow-md transition-all duration-200 border`}
                  >
                    {/* Promotion Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getEventColor(
                            promotion.color
                          )}`}
                        />
                        <h3 className="font-bold text-gray-900 text-sm">
                          {promotion.title}
                        </h3>
                      </div>
                      {promotion.time && (
                        <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded-full border">
                          {promotion.time}
                        </span>
                      )}
                    </div>

                    {/* Discount Badge */}
                    {promotion.discount && (
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                          {promotion.discount}% OFF
                        </span>
                      </div>
                    )}

                    {/* Promotion Description */}
                    {promotion.description && (
                      <p className="text-gray-700 text-xs leading-relaxed mb-3">
                        {promotion.description}
                      </p>
                    )}

                    {/* Promotion Details Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {/* Current Price */}
                      {promotion.price && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-semibold text-green-700">
                            Rs. {Number(promotion.price).toLocaleString('en-LK')}
                          </span>
                        </div>
                      )}

                      {/* Original Price */}
                      {promotion.originalPrice && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-semibold text-gray-500 line-through">
                            Rs. {Number(promotion.originalPrice).toLocaleString('en-LK')}
                          </span>
                        </div>
                      )}

                      {/* Duration */}
                      {promotion.duration && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-semibold text-blue-700">
                            {promotion.duration}
                          </span>
                        </div>
                      )}

                      {/* Max Participants */}
                      {promotion.maxParticipants &&
                        promotion.maxParticipants > 0 && (
                          <div className="flex items-center space-x-1">
                            <span className="text-xs font-semibold text-purple-700">
                              Max: {promotion.maxParticipants}
                            </span>
                          </div>
                        )}
                    </div>

                    {/* Promotion Terms */}
                    {promotion.terms && (
                      <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start space-x-1">
                          <span className="text-xs text-yellow-800">
                            <strong>Terms:</strong> {promotion.terms}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2 border-t border-gray-200">
                      <button className="flex-1 bg-emerald-600 text-white text-xs font-semibold py-2 px-3 rounded-lg hover:bg-emerald-700 transition-colors">
                        Book Now
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 text-xs font-semibold py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                        Learn More
                      </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-2 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
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
