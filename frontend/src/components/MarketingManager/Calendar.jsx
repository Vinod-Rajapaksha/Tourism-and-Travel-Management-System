import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { Link } from 'react-router-dom';
import MonthView from './MonthView';
import EventModal from './EventModal';
import PopularPackage from './PopularPackage';

const Calendar = ({ promotions, calendarSettings = {} }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = (date) => {
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

  return (
      <div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-blue-50 tw-via-indigo-50 tw-to-purple-50 tw-p-4">
  <div className="tw-max-w-7xl tw-mx-auto">

    {/* Header */}
    <div className="tw-text-center tw-mb-8">
      <div className="tw-flex tw-justify-center tw-items-center tw-mb-4">
        <h1 className="tw-text-4xl tw-font-bold tw-bg-gradient-to-r tw-from-[#4e73df] tw-to-[#6a8ae3] tw-bg-clip-text tw-text-transparent">
          Tour Promotions
        </h1>
      </div>
      <p className="tw-text-gray-600 tw-text-lg">Discover amazing deals and special offers for your next adventure</p>
      <div className="tw-flex tw-items-center tw-justify-center tw-mt-4 tw-space-x-4">
        <div className="tw-flex tw-items-center tw-text-sm tw-text-gray-500">
          <div className="tw-w-3 tw-h-3 tw-bg-[#4e73df] tw-rounded-full tw-mr-2"></div>
          <span>Active Promotions</span>
        </div>
        <div className="tw-flex tw-items-center tw-text-sm tw-text-gray-500">
          <div className="tw-w-3 tw-h-3 tw-bg-[#1cc88a] tw-rounded-full tw-mr-2"></div>
          <span>Special Events</span>
        </div>
        <div className="tw-flex tw-items-center tw-text-sm tw-text-gray-500">
          <div className="tw-w-3 tw-h-3 tw-bg-[#36b9cc] tw-rounded-full tw-mr-2"></div>
          <span>Limited Time</span>
        </div>
      </div>
    </div>

    {/* Main Content - Calendar and Popular Package */}
    <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-8">
      {/* Calendar Section - Takes 2/3 of the space */}
      <div className="lg:tw-col-span-2 tw-space-y-6">
        {/* Calendar Container with Background */}
        <div
          className="tw-calendar-container tw-rounded-3xl tw-overflow-hidden tw-relative tw-shadow-xl"
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
              className="tw-absolute tw-inset-0"
              style={{
                backgroundColor: `rgba(255, 255, 255, ${1 - (calendarSettings.backgroundOpacity || 0.3)})`,
                backdropFilter: calendarSettings.backgroundBlur ? `blur(${calendarSettings.backgroundBlur}px)` : 'none'
              }}
            />
          )}
          
          {/* Calendar Header */}
          <div className="tw-calendar-header tw-p-6 tw-bg-gradient-to-r tw-from-[#4e73df] tw-to-[#6a8ae3]">
            <div className="tw-flex tw-items-center tw-justify-between tw-relative tw-z-10">
              <div className="tw-flex tw-items-center tw-space-x-6">
                <button 
                  onClick={handlePrevMonth} 
                  className="tw-p-2 tw-rounded-xl tw-bg-white/20 tw-text-white hover:tw-bg-white/30 tw-transition-colors tw-backdrop-blur-sm"
                >
                  <svg className="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="tw-text-center">
                  <h2 className="tw-text-2xl tw-font-bold tw-text-white tw-mb-1">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  <p className="tw-text-white/80 tw-text-sm">
                    {activePromotions.length} active promotion{activePromotions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button 
                  onClick={handleNextMonth} 
                  className="tw-p-2 tw-rounded-xl tw-bg-white/20 tw-text-white hover:tw-bg-white/30 tw-transition-colors tw-backdrop-blur-sm"
                >
                  <svg className="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <button 
                onClick={handleToday} 
                className="tw-px-4 tw-py-2 tw-bg-white/20 tw-backdrop-blur-sm tw-text-white tw-rounded-xl tw-font-semibold hover:tw-bg-white/30 tw-transition-colors tw-border tw-border-white/20 tw-flex tw-items-center"
              >
                <svg className="tw-w-4 tw-h-4 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="tw-bg-white tw-rounded-3xl tw-shadow-xl tw-p-6 hover:tw-shadow-2xl tw-transition-all tw-duration-300">
          <h3 className="tw-text-xl tw-font-semibold tw-text-gray-900 tw-mb-6 tw-flex tw-items-center">
            <div className="tw-w-8 tw-h-8 tw-bg-blue-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-mr-3">
              <svg className="tw-w-5 tw-h-5 tw-text-[#4e73df]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Active Promotions ({activePromotions.length})
          </h3>
          {activePromotions.length > 0 ? (
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
              {activePromotions.slice(0, 4).map((promotion) => (
                <div key={promotion.id} className="tw-flex tw-items-center tw-p-4 tw-bg-gradient-to-r tw-from-gray-50 tw-to-gray-100 tw-rounded-xl tw-border tw-border-gray-200 hover:tw-shadow-md tw-transition-all tw-duration-200">
                  <div className={`tw-w-4 tw-h-4 tw-rounded-full tw-mr-4 ${
                    promotion.color === 'blue' ? 'tw-bg-[#4e73df]' :
                    promotion.color === 'green' ? 'tw-bg-[#1cc88a]' :
                    promotion.color === 'purple' ? 'tw-bg-[#6f42c1]' :
                    promotion.color === 'orange' ? 'tw-bg-[#fd7e14]' :
                    promotion.color === 'red' ? 'tw-bg-[#e74a3b]' :
                    promotion.color === 'pink' ? 'tw-bg-[#e83e8c]' : 'tw-bg-[#4e73df]'
                  }`} />
                  <div className="tw-flex-1 tw-min-w-0">
                    <p className="tw-text-sm tw-font-semibold tw-text-gray-900 tw-truncate">
                      {promotion.title}
                    </p>
                    <p className="tw-text-xs tw-text-gray-500 tw-mt-1">
                      {promotion.startDate} - {promotion.endDate}
                    </p>
                    {promotion.description && (
                      <p className="tw-text-xs tw-text-gray-600 tw-mt-1 tw-truncate">
                        {promotion.description}
                      </p>
                    )}
                  </div>
                  {promotion.price && (
                    <div className="tw-text-right">
                      <span className="tw-text-sm tw-font-bold tw-text-[#4e73df]">
                        Rs {promotion.price}
                      </span>
                      {promotion.originalPrice && (
                        <div className="tw-text-xs tw-text-gray-500 tw-line-through">
                          Rs {promotion.originalPrice}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="tw-text-center tw-py-8">
              <div className="tw-w-16 tw-h-16 tw-mx-auto tw-mb-4 tw-bg-blue-50 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                <svg className="tw-w-8 tw-h-8 tw-text-[#4e73df]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="tw-text-lg tw-font-medium tw-text-gray-900 tw-mb-2">
                No active promotions
              </h3>
              <p className="tw-text-gray-500">
                Check back soon for exciting tour offers!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Popular Package Section - Takes 1/3 of the space */}
      <div className="lg:tw-col-span-1">
        <div className="tw-sticky tw-top-4">
          <PopularPackage className="tw-popular-package" />
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