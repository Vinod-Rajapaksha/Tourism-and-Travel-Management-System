import React from 'react';
import { Promotion } from '../types/Event';
import { getMonthDays, getWeekDays } from '../utils/dateUtils';
import DayCell from './DayCell';

interface MonthViewProps {
  currentMonth: Date;
  promotions: Promotion[];
  onDateClick: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ currentMonth, promotions, onDateClick }) => {
  const monthDays = getMonthDays(currentMonth);
  const weekDays = getWeekDays();

  return (
    <div className="calendar-grid">
      {/* Week day headers */}
      <div className="grid grid-cols-7 week-header">
        {weekDays.map((day) => (
          <div
            key={day}
            className="week-header-cell"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
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
