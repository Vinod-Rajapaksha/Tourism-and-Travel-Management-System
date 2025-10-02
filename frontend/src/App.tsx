import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Promotion, CalendarSettings, Payment } from './types/Event';
import Calendar from './components/Calendar';
import AdminPanel from './components/AdminPanel';
import PaymentGateway from './components/PaymentGateway';
import BootstrapExample from './components/BootstrapExample';
import apiService from './services/api';

function App() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettings>({
    backgroundImage: '',
    backgroundOpacity: 0.3,
    backgroundBlur: 0,
    siteBackgroundImage: '',
    siteBackgroundOpacity: 0.2,
    siteBackgroundBlur: 0,
    theme: 'light'
  });

  const [payments] = useState<Payment[]>([]);

  // Fetch promotions from backend
  const fetchPromotions = async () => {
    try {
      const response = await apiService.getPromotions(); // Get all promotions, not just active ones
      if (response.data) {
        setPromotions(response.data);
      }
    } catch (err) {
      console.error('Error fetching promotions:', err);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handlePromotionsChange = (newPromotions: Promotion[]) => {
    setPromotions(newPromotions);
  };

  const handleCalendarSettingsChange = (newSettings: CalendarSettings) => {
    setCalendarSettings(newSettings);
  };

  const activePromotions = promotions.filter(promotion => promotion.isActive);

  // Site background style
  const siteBgStyle: React.CSSProperties = calendarSettings.siteBackgroundImage ? {
    backgroundImage: `url(${calendarSettings.siteBackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {};

  const siteOverlayStyle: React.CSSProperties = {
    backgroundColor: `rgba(255, 255, 255, ${1 - (calendarSettings.siteBackgroundOpacity ?? 0.2)})`,
    backdropFilter: calendarSettings.siteBackgroundBlur ? `blur(${calendarSettings.siteBackgroundBlur}px)` : 'none'
  };

  return (
    <div className="min-h-screen relative" style={siteBgStyle}>
      {calendarSettings.siteBackgroundImage && (
        <div className="absolute inset-0" style={siteOverlayStyle} />
      )}

      {/* Main Content */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={
            <Calendar 
              promotions={activePromotions} 
              calendarSettings={calendarSettings}
            />
          } />
          <Route path="/admin" element={
            <AdminPanel
              promotions={promotions}
              onPromotionsChange={handlePromotionsChange}
              calendarSettings={calendarSettings}
              onCalendarSettingsChange={handleCalendarSettingsChange}
              payments={payments}
              onRefreshPromotions={fetchPromotions}
            />
          } />
          <Route path="/payment" element={
            <PaymentGateway
              promotions={promotions}
            />
          } />
          <Route path="/bootstrap" element={<BootstrapExample />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
