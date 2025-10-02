import React, { useState } from 'react';
import { CalendarSettings } from '../types/Event';

interface BackgroundImageManagerProps {
  settings: CalendarSettings;
  onSettingsChange: (settings: CalendarSettings) => void;
}

const BackgroundImageManager: React.FC<BackgroundImageManagerProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  // Calendar
  const [calImageUrl, setCalImageUrl] = useState(settings.backgroundImage || '');
  const [calOpacity, setCalOpacity] = useState(settings.backgroundOpacity ?? 0.3);
  const [calBlur, setCalBlur] = useState(settings.backgroundBlur ?? 0);
  // Site
  const [siteImageUrl, setSiteImageUrl] = useState(settings.siteBackgroundImage || '');
  const [siteOpacity, setSiteOpacity] = useState(settings.siteBackgroundOpacity ?? 0.2);
  const [siteBlur, setSiteBlur] = useState(settings.siteBackgroundBlur ?? 0);

  const [isCalPreview, setIsCalPreview] = useState(false);
  const [isSitePreview, setIsSitePreview] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const showMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000); // Hide after 3 seconds
  };

  const handleSave = () => {
    onSettingsChange({
      ...settings,
      backgroundImage: calImageUrl,
      backgroundOpacity: calOpacity,
      backgroundBlur: calBlur,
      siteBackgroundImage: siteImageUrl,
      siteBackgroundOpacity: siteOpacity,
      siteBackgroundBlur: siteBlur
    });
    showMessage('All settings saved successfully!');
  };

  const handleResetCalendar = () => {
    setCalImageUrl('');
    setCalOpacity(0.3);
    setCalBlur(0);
    onSettingsChange({
      ...settings,
      backgroundImage: '',
      backgroundOpacity: 0.3,
      backgroundBlur: 0
    });
  };

  const handleResetSite = () => {
    setSiteImageUrl('');
    setSiteOpacity(0.2);
    setSiteBlur(0);
    onSettingsChange({
      ...settings,
      siteBackgroundImage: '',
      siteBackgroundOpacity: 0.2,
      siteBackgroundBlur: 0
    });
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    target: 'calendar' | 'site'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (target === 'calendar') {
          setCalImageUrl(result);
          // Auto-save calendar background image
          onSettingsChange({
            ...settings,
            backgroundImage: result,
            backgroundOpacity: calOpacity,
            backgroundBlur: calBlur
          });
          showMessage('Calendar background image uploaded and saved successfully!');
        } else {
          setSiteImageUrl(result);
          // Auto-save site background image
          onSettingsChange({
            ...settings,
            siteBackgroundImage: result,
            siteBackgroundOpacity: siteOpacity,
            siteBackgroundBlur: siteBlur
          });
          showMessage('Site background image uploaded and saved successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Message Notification */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-right duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">{successMessage}</span>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="ml-2 hover:bg-emerald-600 rounded-full p-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {/* Site Background Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <svg className="w-6 h-6 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M5 11h14M7 15h10M9 19h6" />
            </svg>
            Site Background
          </h3>
          <button
            onClick={() => setIsSitePreview(!isSitePreview)}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {isSitePreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {isSitePreview && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Preview:</h4>
            <div 
              className="w-full h-32 rounded-lg relative overflow-hidden"
              style={{
                backgroundImage: siteImageUrl ? `url(${siteImageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  backgroundColor: `rgba(255,255,255,${1 - siteOpacity})`,
                  backdropFilter: siteBlur ? `blur(${siteBlur}px)` : 'none'
                }}
              />
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={siteImageUrl}
              onChange={(e) => {
                setSiteImageUrl(e.target.value);
                // Auto-save when URL is entered
                onSettingsChange({
                  ...settings,
                  siteBackgroundImage: e.target.value,
                  siteBackgroundOpacity: siteOpacity,
                  siteBackgroundBlur: siteBlur
                });
                if (e.target.value) {
                  showMessage('Site background URL updated successfully!');
                }
              }}
              placeholder="https://example.com/site-bg.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <label className="cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e,'site')} className="hidden" />
              Upload
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">Upload or paste a URL. Large images recommended.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opacity: {siteOpacity}</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={siteOpacity} 
              onChange={(e) => {
                const newOpacity = parseFloat(e.target.value);
                setSiteOpacity(newOpacity);
                onSettingsChange({
                  ...settings,
                  siteBackgroundImage: siteImageUrl,
                  siteBackgroundOpacity: newOpacity,
                  siteBackgroundBlur: siteBlur
                });
              }} 
              className="w-full slider" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blur: {siteBlur}px</label>
            <input 
              type="range" 
              min="0" 
              max="20" 
              step="1" 
              value={siteBlur} 
              onChange={(e) => {
                const newBlur = parseInt(e.target.value);
                setSiteBlur(newBlur);
                onSettingsChange({
                  ...settings,
                  siteBackgroundImage: siteImageUrl,
                  siteBackgroundOpacity: siteOpacity,
                  siteBackgroundBlur: newBlur
                });
              }} 
              className="w-full slider" 
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button onClick={handleResetSite} className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">Reset</button>
        </div>
      </div>

      {/* Calendar Background Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <svg className="w-6 h-6 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendar Background
          </h3>
          <button
            onClick={() => setIsCalPreview(!isCalPreview)}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {isCalPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {isCalPreview && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Preview:</h4>
            <div 
              className="w-full h-32 rounded-lg relative overflow-hidden"
              style={{
                backgroundImage: calImageUrl ? `url(${calImageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  backgroundColor: `rgba(255,255,255,${1 - calOpacity})`,
                  backdropFilter: calBlur ? `blur(${calBlur}px)` : 'none'
                }}
              />
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={calImageUrl}
              onChange={(e) => {
                setCalImageUrl(e.target.value);
                // Auto-save when URL is entered
                onSettingsChange({
                  ...settings,
                  backgroundImage: e.target.value,
                  backgroundOpacity: calOpacity,
                  backgroundBlur: calBlur
                });
                if (e.target.value) {
                  showMessage('Calendar background URL updated successfully!');
                }
              }}
              placeholder="https://example.com/calendar-bg.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <label className="cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              <input type="file" accept="image/*" onChange={(e)=>handleImageUpload(e,'calendar')} className="hidden" />
              Upload
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opacity: {calOpacity}</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={calOpacity} 
              onChange={(e) => {
                const newOpacity = parseFloat(e.target.value);
                setCalOpacity(newOpacity);
                onSettingsChange({
                  ...settings,
                  backgroundImage: calImageUrl,
                  backgroundOpacity: newOpacity,
                  backgroundBlur: calBlur
                });
              }} 
              className="w-full slider" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blur: {calBlur}px</label>
            <input 
              type="range" 
              min="0" 
              max="20" 
              step="1" 
              value={calBlur} 
              onChange={(e) => {
                const newBlur = parseInt(e.target.value);
                setCalBlur(newBlur);
                onSettingsChange({
                  ...settings,
                  backgroundImage: calImageUrl,
                  backgroundOpacity: calOpacity,
                  backgroundBlur: newBlur
                });
              }} 
              className="w-full slider" 
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button onClick={handleSave} className="flex-1 bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">Save All</button>
          <button onClick={handleResetCalendar} className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">Reset Calendar</button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundImageManager;
