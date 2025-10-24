import React from 'react';
import { isSameMonth, isToday, format } from 'date-fns';
import { isDateInPromotionRange } from '../../utils/dateUtils';

const DayCell = ({ date, currentMonth, promotions, onDayClick }) => {
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

  const getEventColor = (color) => {
    const colorMap = {
      blue: 'tw-bg-[#4e73df]',
      green: 'tw-bg-[#1cc88a]',
      purple: 'tw-bg-[#6f42c1]',
      orange: 'tw-bg-[#fd7e14]',
      red: 'tw-bg-[#e74a3b]',
      pink: 'tw-bg-[#e83e8c]'
    };

    return colorMap[color || 'blue'] || 'tw-bg-[#4e73df]';
  };

  const getEventTextColor = (color) => {
    const colorMap = {
      blue: 'tw-text-[#4e73df]',
      green: 'tw-text-[#1cc88a]',
      purple: 'tw-text-[#6f42c1]',
      orange: 'tw-text-[#fd7e14]',
      red: 'tw-text-[#e74a3b]',
      pink: 'tw-text-[#e83e8c]'
    };

    return colorMap[color || 'blue'] || 'tw-text-[#4e73df]';
  };

  const getEventTintClasses = (color) => {
    switch (color) {
      case 'blue':
        return 'tw-bg-blue-50 tw-border-blue-200 tw-text-[#4e73df]';
      case 'green':
        return 'tw-bg-green-50 tw-border-green-200 tw-text-[#1cc88a]';
      case 'purple':
        return 'tw-bg-purple-50 tw-border-purple-200 tw-text-[#6f42c1]';
      case 'orange':
        return 'tw-bg-orange-50 tw-border-orange-200 tw-text-[#fd7e14]';
      case 'red':
        return 'tw-bg-red-50 tw-border-red-200 tw-text-[#e74a3b]';
      case 'pink':
        return 'tw-bg-pink-50 tw-border-pink-200 tw-text-[#e83e8c]';
      default:
        return 'tw-bg-blue-50 tw-border-blue-200 tw-text-[#4e73df]';
    }
  };

  const firstPromotion = dayPromotions[0];

  return (
      <div
  className={`tw-calendar-day ${
    !isCurrentMonth ? 'tw-calendar-day-other-month' : ''
  } ${
    isCurrentDay ? 'tw-calendar-day-today' : ''
  } ${
    isWeekend ? 'tw-weekend' : ''
  }`}
  onClick={handleClick}
>
  {/* Colored accent bar when promotions exist */}
  {firstPromotion && (
    <div className={`tw-absolute tw-left-0 tw-top-0 tw-h-full tw-w-1 ${getEventColor(firstPromotion.color)} tw-rounded-l-lg`} />
  )}

  {/* Day Number */}
  <div className="tw-day-number">
    {format(date, 'd')}
  </div>

  {/* Event Count Badge */}
  {dayPromotions.length > 0 && (
    <div className="tw-event-count tw-bg-[#4e73df] tw-text-white">
      {dayPromotions.length}
    </div>
  )}

  {/* Event Dots */}
  <div className="tw-flex tw-flex-wrap tw-justify-center tw-mt-1">
    {dayPromotions.slice(0, 3).map((promotion, index) => (
      <div
        key={`${promotion.id}-${index}`}
        className={`tw-event-dot ${getEventColor(promotion.color)}`}
        title={promotion.title}
      />
    ))}
    {dayPromotions.length > 3 && (
      <div className="tw-event-dot tw-bg-gray-400" title={`+${dayPromotions.length - 3} more`}>
        <span className="tw-text-xs tw-text-white tw-font-bold">+</span>
      </div>
    )}
  </div>

  {/* Event Preview */}
  {dayPromotions.length > 0 && (
    <div className="tw-mt-2 tw-space-y-1">
      {dayPromotions.slice(0, 2).map((promotion) => (
        <div
          key={promotion.id}
          className={`tw-event-preview tw-border tw-text-xs tw-px-2 tw-py-1 tw-rounded-md tw-truncate ${getEventTintClasses(promotion.color)}`}
          title={promotion.title}
        >
          {promotion.title}
        </div>
      ))}
      {dayPromotions.length > 2 && (
        <div className="tw-event-preview tw-text-gray-600 tw-bg-gray-50 tw-border tw-border-gray-200 tw-text-xs tw-px-2 tw-py-1 tw-rounded-md">
          +{dayPromotions.length - 2} more
        </div>
      )}
    </div>
  )}

  {/* Hover Effect Indicator */}
  <div className="tw-absolute tw-inset-0 tw-bg-[#4e73df]/5 tw-opacity-0 hover:tw-opacity-100 tw-transition-opacity tw-duration-200 tw-rounded-lg tw-pointer-events-none" />
</div>
  );
};

export default DayCell;