import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Promotion, CalendarSettings } from '../types/Event';
import MonthView from './MonthView';
import EventModal from './EventModal';
import PopularPackage from './PopularPackage';

interface CalendarProps {
  promotions: Promotion[];
  calendarSettings?: CalendarSettings;
}

const Calendar: React.FC<CalendarProps> = ({ promotions, calendarSettings = {} }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const activePromotions = promotions.filter(promotion => promotion.isActive);

  // Background image styles (apply only to calendar area)
  const backgroundStyle = calendarSettings.backgroundImage ? {
    backgroundImage: `url(${calendarSettings.backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } as React.CSSProperties : {} as React.CSSProperties;

  const overlayStyle: React.CSSProperties = {
    backgroundColor: `rgba(255, 255, 255, ${1 - (calendarSettings.backgroundOpacity || 0.3)})`,
    backdropFilter: calendarSettings.backgroundBlur ? `blur(${calendarSettings.backgroundBlur}px)` : 'none'
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-3">Tour Promotions</h1>
          <p className="text-gray-600 text-lg">Discover amazing deals and special offers for your next adventure</p>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
              <span>Active Promotions</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Special Events</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span>Limited Time</span>
            </div>
          </div>
        </div>

        {/* Main Content - Calendar and Popular Package */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section - Takes 2/3 of the space */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar Container with Background */}
            <div 
              className="calendar-container rounded-3xl overflow-hidden relative"
              style={calendarSettings.backgroundImage ? {
                backgroundImage: `url(${calendarSettings.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              } : undefined}
            >
              {/* Background Overlay */}
              {calendarSettings.backgroundImage && (
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundColor: `rgba(255, 255, 255, ${1 - (calendarSettings.backgroundOpacity || 0.3)})`,
                    backdropFilter: calendarSettings.backgroundBlur ? `blur(${calendarSettings.backgroundBlur}px)` : 'none'
                  }}
                />
              )}
                {/* Calendar Header */}
                <div className="calendar-header p-6">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-6">
                      <button onClick={handlePrevMonth} className="nav-button">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-1">
                          {format(currentMonth, 'MMMM yyyy')}
                        </h2>
                        <p className="text-white/80 text-sm">
                          {activePromotions.length} active promotion{activePromotions.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <button onClick={handleNextMonth} className="nav-button">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    <button onClick={handleToday} className="today-button">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Today
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <MonthView
                  currentMonth={currentMonth}
                  promotions={activePromotions}
                  onDateClick={handleDateClick}
                />
              </div>

            {/* Active Promotions Summary */}
            <div className="bg-white rounded-3xl shadow-xl p-6 hover-lift">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Active Promotions ({activePromotions.length})
              </h3>
              {activePromotions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activePromotions.slice(0, 4).map((promotion) => (
                    <div key={promotion.id} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className={`w-4 h-4 rounded-full mr-4 ${
                        promotion.color === 'blue' ? 'bg-blue-500' :
                        promotion.color === 'green' ? 'bg-green-500' :
                        promotion.color === 'purple' ? 'bg-purple-500' :
                        promotion.color === 'orange' ? 'bg-orange-500' :
                        promotion.color === 'red' ? 'bg-red-500' :
                        promotion.color === 'pink' ? 'bg-pink-500' : 'bg-emerald-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {promotion.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {promotion.startDate} - {promotion.endDate}
                        </p>
                        {promotion.description && (
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {promotion.description}
                          </p>
                        )}
                      </div>
                      {promotion.price && (
                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-600">
                            Rs{promotion.price}
                          </span>
                          {promotion.originalPrice && (
                            <div className="text-xs text-gray-500 line-through">
                              Rs {promotion.originalPrice}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No active promotions
                  </h3>
                  <p className="text-gray-500">
                    Check back soon for exciting tour offers!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Popular Package Section - Takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <PopularPackage className="popular-package" />
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        promotions={activePromotions}
      />
    </div>
  );
};

export default Calendar;
