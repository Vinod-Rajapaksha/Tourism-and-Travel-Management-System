import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Promotion, CalendarSettings, Payment } from '../types/Event';
import AdminEventForm from './AdminEventForm';
import AdminEventList from './AdminEventList';
import BackgroundImageManager from './BackgroundImageManager';
import Reports from './Reports';
import apiService from '../services/api';

interface AdminPanelProps {
  promotions: Promotion[];
  onPromotionsChange: (promotions: Promotion[]) => void;
  calendarSettings: CalendarSettings;
  onCalendarSettingsChange: (settings: CalendarSettings) => void;
  payments?: Payment[];
  onRefreshPromotions?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  promotions, 
  onPromotionsChange,
  calendarSettings,
  onCalendarSettingsChange,
  payments,
  onRefreshPromotions
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [activeTab, setActiveTab] = useState<'promotions' | 'reports'>('promotions');

  const handleAddPromotion = () => {
    setEditingPromotion(null);
    setShowForm(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setShowForm(true);
  };

  const handleSavePromotion = async (promotion: Promotion) => {
    try {
      if (editingPromotion) {
        // Update existing promotion
        const response = await apiService.updatePromotion(promotion.id, {
          ...promotion,
          updatedAt: new Date().toISOString()
        });
        
        if (response.data) {
          // Refresh the promotions list from the backend
          if (onRefreshPromotions) {
            onRefreshPromotions();
          } else {
            const updatedPromotions = promotions.map(p => 
              p.id === promotion.id ? response.data! : p
            );
            onPromotionsChange(updatedPromotions);
          }
        } else {
          console.error('Failed to update promotion:', response.error);
          alert('Failed to update promotion. Please try again.');
          return;
        }
      } else {
        // Create new promotion
        const newPromotionData = {
          ...promotion,
          isActive: true
        };
        delete (newPromotionData as any).id; // Remove id for creation
        delete (newPromotionData as any).createdAt;
        delete (newPromotionData as any).updatedAt;
        
        const response = await apiService.createPromotion(newPromotionData);
        
        if (response.data) {
          // Refresh the promotions list from the backend
          if (onRefreshPromotions) {
            onRefreshPromotions();
          } else {
            onPromotionsChange([...promotions, response.data]);
          }
        } else {
          console.error('Failed to create promotion:', response.error);
          alert('Failed to create promotion. Please try again.');
          return;
        }
      }
      
      setShowForm(false);
      setEditingPromotion(null);
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert('An error occurred while saving the promotion. Please try again.');
    }
  };

  const handleDeletePromotion = async (promotionId: string) => {
    try {
      const response = await apiService.deletePromotion(promotionId);
      
      if (response.error) {
        console.error('Failed to delete promotion:', response.error);
        alert('Failed to delete promotion. Please try again.');
        return;
      }
      
      // Refresh the promotions list from the backend
      if (onRefreshPromotions) {
        onRefreshPromotions();
      } else {
        const updatedPromotions = promotions.filter(p => p.id !== promotionId);
        onPromotionsChange(updatedPromotions);
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      alert('An error occurred while deleting the promotion. Please try again.');
    }
  };

  const handleToggleActive = async (promotionId: string) => {
    try {
      const promotion = promotions.find(p => p.id === promotionId);
      if (!promotion) return;
      
      const response = await apiService.updatePromotion(promotionId, {
        ...promotion,
        isActive: !promotion.isActive,
        updatedAt: new Date().toISOString()
      });
      
      if (response.data) {
        // Refresh the promotions list from the backend
        if (onRefreshPromotions) {
          onRefreshPromotions();
        } else {
          const updatedPromotions = promotions.map(p => 
            p.id === promotionId ? response.data! : p
          );
          onPromotionsChange(updatedPromotions);
        }
      } else {
        console.error('Failed to toggle promotion status:', response.error);
        alert('Failed to update promotion status. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      alert('An error occurred while updating the promotion status. Please try again.');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPromotion(null);
  };

  const activePromotions = promotions.filter(promotion => promotion.isActive);
  const inactivePromotions = promotions.filter(promotion => !promotion.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Sidebar (left nav) */}
          <aside className="hidden md:block w-60 shrink-0">
            <div className="sticky top-4">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-white/80">Admin</div>
                      <div className="font-bold">Tour Manager</div>
                    </div>
                  </div>
                </div>
                <nav className="p-2">
                  <button
                    onClick={() => setActiveTab('promotions')}
                    className={`w-full flex items-center px-3 py-2 rounded-xl text-sm font-medium mb-1 transition-colors ${
                      activeTab === 'promotions'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className={`w-4 h-4 mr-3 ${activeTab === 'promotions' ? 'text-emerald-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Promotions
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`w-full flex items-center px-3 py-2 rounded-xl text-sm font-medium mb-1 transition-colors ${
                      activeTab === 'reports'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className={`w-4 h-4 mr-3 ${activeTab === 'reports' ? 'text-emerald-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Reports
                  </button>
                  <Link
                    to="/"
                    className="w-full flex items-center px-3 py-2 rounded-xl text-sm font-medium mb-1 transition-colors text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                  >
                    <svg className="w-4 h-4 mr-3 text-gray-400 hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    View Calendar
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main column */}
          <div className="flex-1">
            {/* Header for content */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />
              <div className="relative p-6 md:p-8">
                                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
                      <p className="text-emerald-100 mt-1">Manage tour promotions and view analytics</p>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                      <div className="glass rounded-2xl px-4 py-3 text-center">
                        <div className="text-xs text-white/80">Total</div>
                        <div className="text-2xl font-bold text-white">{promotions.length}</div>
                      </div>
                      <div className="glass rounded-2xl px-4 py-3 text-center">
                        <div className="text-xs text-white/80">Active</div>
                        <div className="text-2xl font-bold text-white">{activePromotions.length}</div>
                      </div>
                      <div className="glass rounded-2xl px-4 py-3 text-center">
                        <div className="text-xs text-white/80">Inactive</div>
                        <div className="text-2xl font-bold text-white">{inactivePromotions.length}</div>
                      </div>
                      <Link
                        to="/"
                        className="glass rounded-2xl px-6 py-3 text-center hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-white font-semibold">View Calendar</span>
                      </Link>
                    </div>
                  </div>

                {/* Mobile tabs remain */}
                <div className="mt-6 bg-white/10 rounded-2xl p-1 inline-flex md:hidden">
                  <button
                    onClick={() => setActiveTab('promotions')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      activeTab === 'promotions' ? 'bg-white text-emerald-700 shadow-sm' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    Promotions
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      activeTab === 'reports' ? 'bg-white text-emerald-700 shadow-sm' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    Reports
                  </button>
                  <Link
                    to="/"
                    className="px-4 py-2 rounded-xl font-medium transition-all text-white/90 hover:text-white hover:bg-white/10"
                  >
                    Calendar
                  </Link>
                </div>
              </div>
            </div>

            {/* Content */}
            {activeTab === 'promotions' ? (
              <div>
                {showForm ? (
                  <AdminEventForm
                    promotion={editingPromotion}
                    onSave={handleSavePromotion}
                    onCancel={handleCancelForm}
                    isEditing={!!editingPromotion}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Tour Promotions</h2>
                        <p className="text-gray-500">Create and manage promotions for your tours</p>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center space-x-3">
                        <button
                          onClick={handleAddPromotion}
                          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center shadow-md"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Promotion
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-2">
                      <AdminEventList
                        promotions={promotions}
                        onEdit={handleEditPromotion}
                        onDelete={handleDeletePromotion}
                        onToggleActive={handleToggleActive}
                      />
                    </div>

                    {promotions.length === 0 && (
                      <div className="text-center py-16 bg-white rounded-3xl shadow-xl">
                        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No promotions yet</h3>
                        <p className="text-gray-500 mb-6">Click the button above to add your first promotion.</p>
                        <button
                          onClick={handleAddPromotion}
                          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          Add Your First Promotion
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Reports promotions={promotions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
