import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  isSameDay,
  startOfWeek,
  endOfWeek
} from 'date-fns';

export const getMonthDays = (date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

export const formatDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

export const formatMonthYear = (date) => {
  return format(date, 'MMMM yyyy');
};

export const formatDay = (date) => {
  return format(date, 'd');
};

export const isCurrentMonth = (date, currentMonth) => {
  return isSameMonth(date, currentMonth);
};

export const isCurrentDay = (date) => {
  return isToday(date);
};

export const isSameDate = (date1, date2) => {
  return isSameDay(date1, date2);
};

export const getNextMonth = (date) => {
  return addMonths(date, 1);
};

export const getPreviousMonth = (date) => {
  return subMonths(date, 1);
};

export const getWeekDays = () => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

export const getEventColor = (color) => {
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

export const getPromotionDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return eachDayOfInterval({ start, end });
};

export const isDateInPromotionRange = (date, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return date >= start && date <= end;
};

export const formatPromotionDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isSameDay(start, end)) {
    return format(start, 'MMM dd, yyyy');
  }

  return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
};

export const getPromotionDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end dates
};