import React from 'react';
import { Promotion } from '../types/Event';
import { formatPromotionDateRange } from '../utils/dateUtils';
import { format } from 'date-fns';

interface AdminEventListProps {
  promotions: Promotion[];
  onEdit: (promotion: Promotion) => void;
  onDelete: (promotionId: string) => void;
  onToggleActive: (promotionId: string) => void;
}

const AdminEventList: React.FC<AdminEventListProps> = ({ 
  promotions, 
  onEdit, 
  onDelete, 
  onToggleActive 
}) => {
  const getEventColor = (color?: string): string => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      pink: 'bg-pink-500'
    };
    
    return colorMap[color || 'blue'] || 'bg-blue-500';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const sortedPromotions = [...promotions].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Tour Promotions ({promotions.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPromotions.map((promotion) => (
              <tr key={promotion.id} className={`hover:bg-gray-50 ${!promotion.isActive ? 'opacity-60' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${getEventColor(promotion.color)}`} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {promotion.title}
                      </div>
                      {promotion.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {promotion.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatPromotionDateRange(promotion.startDate, promotion.endDate)}
                  </div>
                  {promotion.time && (
                    <div className="text-sm text-gray-500">
                      {promotion.time}
                    </div>
                  )}
                  {promotion.duration && (
                    <div className="text-xs text-gray-400">
                      {promotion.duration}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {promotion.price ? `Rs ${promotion.price}` : 'Not set'}
                  </div>
                  {promotion.originalPrice && 
                    <div className="text-xs text-gray-500 line-through">
                      Rs{promotion.originalPrice}
                    </div>
                  }
                  {promotion.discount && (
                    <div className="text-xs font-semibold text-red-600">
                      {promotion.discount}
                    </div>
                  )}
                  {promotion.maxParticipants && promotion.maxParticipants > 0 && (
                    <div className="text-xs text-gray-500">
                       {promotion.discount.toString().endsWith('%')
                       ? promotion.discount
                         : `${promotion.discount}%`}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    promotion.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {promotion.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(promotion)}
                      className="text-emerald-600 hover:text-emerald-900 transition-colors"
                      title="Edit promotion"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onToggleActive(promotion.id)}
                      className={`transition-colors ${
                        promotion.isActive 
                          ? 'text-orange-600 hover:text-orange-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                      title={promotion.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete promotion"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No promotions found
            </h3>
            <p className="text-gray-500">
              Start by adding your first tour promotion.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventList;
