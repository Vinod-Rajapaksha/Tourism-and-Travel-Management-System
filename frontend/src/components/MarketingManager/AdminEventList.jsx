import React from 'react';
import { formatPromotionDateRange } from '../../utils/dateUtils';
import { format } from 'date-fns';

const AdminEventList = ({
                          promotions,
                          onEdit,
                          onDelete,
                          onToggleActive
                        }) => {
  const getEventColor = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      pink: 'bg-pink-500'
    };

    return colorMap[color || 'blue'] || 'bg-blue-500';
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const sortedPromotions = [...promotions].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
      <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-overflow-hidden">
  <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
    <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900">
      Tour Promotions ({promotions.length})
    </h3>
  </div>

  <div className="tw-overflow-x-auto">
    <table className="tw-min-w-full tw-divide-y tw-divide-gray-200">
      <thead className="tw-bg-gray-50">
        <tr>
          <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
            Event
          </th>
          <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
            Date & Time
          </th>
          <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
            Price
          </th>
          <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
            Status
          </th>
          <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200">
        {sortedPromotions.map((promotion) => (
          <tr key={promotion.id} className={`hover:tw-bg-gray-50 ${!promotion.isActive ? 'tw-opacity-60' : ''}`}>
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
              <div className="tw-flex tw-items-center">
                <div className={`tw-w-3 tw-h-3 tw-rounded-full tw-mr-3 ${getEventColor(promotion.color)}`} />
                <div>
                  <div className="tw-text-sm tw-font-medium tw-text-gray-900">
                    {promotion.title}
                  </div>
                  {promotion.description && (
                    <div className="tw-text-sm tw-text-gray-500 tw-truncate tw-max-w-xs">
                      {promotion.description}
                    </div>
                  )}
                </div>
              </div>
            </td>
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
              <div className="tw-text-sm tw-text-gray-900">
                {formatPromotionDateRange(promotion.startDate, promotion.endDate)}
              </div>
              {promotion.time && (
                <div className="tw-text-sm tw-text-gray-500">
                  {promotion.time}
                </div>
              )}
              {promotion.duration && (
                <div className="tw-text-xs tw-text-gray-400">
                  {promotion.duration}
                </div>
              )}
            </td>
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
              <div className="tw-text-sm tw-text-gray-900">
                {promotion.price ? `Rs ${promotion.price}` : 'Not set'}
              </div>
              {promotion.originalPrice &&
                <div className="tw-text-xs tw-text-gray-500 tw-line-through">
                  Rs{promotion.originalPrice}
                </div>
              }
              {promotion.discount && (
                <div className="tw-text-xs tw-font-semibold tw-text-red-600">
                  {promotion.discount}
                </div>
              )}
              {promotion.maxParticipants && promotion.maxParticipants > 0 && (
                <div className="tw-text-xs tw-text-gray-500">
                  {promotion.discount.toString().endsWith('%')
                    ? promotion.discount
                    : `${promotion.discount}%`}
                </div>
              )}
            </td>
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
              <span className={`tw-inline-flex tw-px-2 tw-py-1 tw-text-xs tw-font-semibold tw-rounded-full ${
                promotion.isActive
                  ? 'tw-bg-green-100 tw-text-green-800'
                  : 'tw-bg-red-100 tw-text-red-800'
              }`}>
                {promotion.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-font-medium">
              <div className="tw-flex tw-space-x-2">
                <button
                  onClick={() => onEdit(promotion)}
                  className="tw-text-emerald-600 hover:tw-text-emerald-900 tw-transition-colors"
                  title="Edit promotion"
                >
                  <svg className="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onToggleActive(promotion.id)}
                  className={`tw-transition-colors ${
                    promotion.isActive
                      ? 'tw-text-orange-600 hover:tw-text-orange-900'
                      : 'tw-text-green-600 hover:tw-text-green-900'
                  }`}
                  title={promotion.isActive ? 'Deactivate' : 'Activate'}
                >
                  <svg className="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {promotion.isActive ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    )}
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this promotion?')) {
                      onDelete(promotion.id);
                    }
                  }}
                  className="tw-text-red-600 hover:tw-text-red-900 tw-transition-colors"
                  title="Delete promotion"
                >
                  <svg className="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {promotions.length === 0 && (
      <div className="tw-text-center tw-py-8">
        <div className="tw-w-16 tw-h-16 tw-mx-auto tw-mb-4 tw-bg-gray-100 tw-rounded-full tw-flex tw-items-center tw-justify-center">
          <svg className="tw-w-8 tw-h-8 tw-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="tw-text-lg tw-font-medium tw-text-gray-900 tw-mb-2">
          No promotions found
        </h3>
        <p className="tw-text-gray-500">
          Start by adding your first tour promotion.
        </p>
      </div>
    )}
  </div>
</div>
  );
};

export default AdminEventList;