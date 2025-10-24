import React from 'react';
import { getMonthDays, getWeekDays } from '../../utils/dateUtils';
import DayCell from './DayCell';

const MonthView = ({ currentMonth, promotions, onDateClick }) => {
    const monthDays = getMonthDays(currentMonth);
    const weekDays = getWeekDays();

    return (
        <div className="tw-calendar-grid">
  {/* Week day headers */}
  <div className="tw-grid tw-grid-cols-7 tw-week-header">
    {weekDays.map((day) => (
      <div
        key={day}
        className="tw-week-header-cell"
      >
        {day}
      </div>
    ))}
  </div>

  {/* Calendar grid */}
  <div className="tw-grid tw-grid-cols-7">
    {monthDays.map((date, index) => (
      <DayCell
        key={index}
        date={date}
        currentMonth={currentMonth}
        promotions={promotions}
        onDayClick={onDateClick}
      />
    ))}
  </div>
</div>
    );
};

export default MonthView;