import React from 'react';
import { isSameMonth, isToday, format } from 'date-fns';
import { Promotion } from '../types/Event';
import { isDateInPromotionRange } from '../utils/dateUtils';

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  promotions: Promotion[];
  onDayClick: (date: Date) => void;
}

const DayCell: React.FC<DayCellProps> = ({ date, currentMonth, promotions, onDayClick }) => {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isCurrentDay = isToday(date);
  const weekdayIndex = parseInt(format(date, 'i')); // 1 (Mon) .. 7 (Sun)
  const isWeekend = weekdayIndex >= 6;
  
  // Filter promotions for this specific day
  const dayPromotions = promotions.filter(promotion => 
    promotion.isActive && isDateInPromotionRange(date, promotion.startDate, promotion.endDate)
  );

  const handleClick = () => {
    onDayClick(date);
  };

  const getEventColor = (color?: string): string => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      pink: 'bg-pink-500'
    };
    
    return colorMap[color || 'blue'] || 'bg-emerald-500';
  };

  const getEventTextColor = (color?: string): string => {
    const colorMap: Record<string, string> = {
      blue: 'text-blue-700',
      green: 'text-green-700',
      purple: 'text-purple-700',
      orange: 'text-orange-700',
      red: 'text-red-700',
      pink: 'text-pink-700'
    };
    
    return colorMap[color || 'blue'] || 'text-emerald-700';
  };

  const getEventTintClasses = (color?: string): string => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'green':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'purple':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'orange':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'red':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'pink':
        return 'bg-pink-50 border-pink-200 text-pink-700';
      default:
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    }
  };

  const firstPromotion = dayPromotions[0];

  return (
    <div
      className={`calendar-day ${
        !isCurrentMonth ? 'calendar-day-other-month' : ''
      } ${
        isCurrentDay ? 'calendar-day-today' : ''
      } ${
        isWeekend ? 'weekend' : ''
      }`}
      onClick={handleClick}
    >
      {/* Colored accent bar when promotions exist */}
      {firstPromotion && (
        <div className={`absolute left-0 top-0 h-full w-1 ${getEventColor(firstPromotion.color)} rounded-l-lg`} />
      )}

      {/* Day Number */}
      <div className="day-number">
        {format(date, 'd')}
      </div>

      {/* Event Count Badge */}
      {dayPromotions.length > 0 && (
        <div className="event-count">
          {dayPromotions.length}
        </div>
      )}

      {/* Event Dots */}
      <div className="flex flex-wrap justify-center mt-1">
        {dayPromotions.slice(0, 3).map((promotion, index) => (
          <div
            key={`${promotion.id}-${index}`}
            className={`event-dot ${getEventColor(promotion.color)}`}
            title={promotion.title}
          />
        ))}
        {dayPromotions.length > 3 && (
          <div className="event-dot bg-gray-400" title={`+${dayPromotions.length - 3} more`}>
            <span className="text-xs text-white font-bold">+</span>
          </div>
        )}
      </div>

      {/* Event Preview */}
      {dayPromotions.length > 0 && (
        <div className="mt-2 space-y-1">
          {dayPromotions.slice(0, 2).map((promotion) => (
            <div
              key={promotion.id}
              className={`event-preview border ${getEventTintClasses(promotion.color)}`}
              title={promotion.title}
            >
              {promotion.title}
            </div>
          ))}
          {dayPromotions.length > 2 && (
            <div className="event-preview text-gray-600 bg-gray-50 border border-gray-200">
              +{dayPromotions.length - 2} more
            </div>
          )}
        </div>
      )}

      {/* Hover Effect Indicator */}
      <div className="absolute inset-0 bg-emerald-500/5 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none" />
    </div>
  );
};

export default DayCell;
