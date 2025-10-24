import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminEventForm from './AdminEventForm';
import AdminEventList from './AdminEventList';
import Reports from './Reports';
import PaymentHistory from './PaymentHistory';
import apiService from '../../api/Promotion';

const AdminPanel = ({
  promotions,
  onPromotionsChange,
  calendarSettings,
  onCalendarSettingsChange,
  payments,
  onRefreshPromotions
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [activeTab, setActiveTab] = useState('promotions');

  const handleAddPromotion = () => {
    setEditingPromotion(null);
    setShowForm(true);
  };

  const handleEditPromotion = (promotion) => {
    setEditingPromotion(promotion);
    setShowForm(true);
  };

  const handleSavePromotion = async (promotion) => {
    try {
      let result;

      if (editingPromotion) {
        // Update existing promotion
        result = await apiService.updatePromotion(promotion.id, {
          ...promotion,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Create new promotion
        const newPromotionData = {
          ...promotion,
          isActive: true
        };
        delete newPromotionData.id;
        delete newPromotionData.createdAt;
        delete newPromotionData.updatedAt;

        result = await apiService.createPromotion(newPromotionData);
      }

      if (!result) {
        alert('No data returned from server.');
        return;
      }

      if (onRefreshPromotions) {
        onRefreshPromotions();
      } else {
        const updatedPromotions = editingPromotion
          ? promotions.map((p) => (p.id === promotion.id ? result : p))
          : [...promotions, result];
        onPromotionsChange(updatedPromotions);
      }

      setShowForm(false);
      setEditingPromotion(null);
    } catch (error) {
      console.error('Error saving promotion:', error);
      const message =
        error.response?.data?.error || 'An error occurred while saving the promotion.';
      alert(message);
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    try {
      await apiService.deletePromotion(promotionId);
      const updatedPromotions = promotions.filter((p) => p.id !== promotionId);
      onPromotionsChange(updatedPromotions);
    } catch (error) {
      console.error('Error deleting promotion:', error);
      const message =
        error.response?.data?.error || 'An error occurred while deleting the promotion.';
      alert(message);
    }
  };

  const handleToggleActive = async (promotionId) => {
    try {
      const promotion = promotions.find((p) => p.id === promotionId);
      if (!promotion) return;

      const result = await apiService.updatePromotion(promotionId, {
        ...promotion,
        isActive: !promotion.isActive,
        updatedAt: new Date().toISOString()
      });

      if (onRefreshPromotions) {
        onRefreshPromotions();
      } else {
        const updatedPromotions = promotions.map((p) =>
          p.id === promotionId ? result : p
        );
        onPromotionsChange(updatedPromotions);
      }
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      const message =
        error.response?.data?.error || 'An error occurred while updating the promotion.';
      alert(message);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPromotion(null);
  };

  const activePromotions = promotions.filter((p) => p.isActive);
  const inactivePromotions = promotions.filter((p) => !p.isActive);

  return (
    <div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-blue-50 tw-via-indigo-50 tw-to-purple-50 tw-p-4">
      <div className="tw-max-w-7xl tw-mx-auto">
        <div className="tw-flex tw-gap-6">
          {/* Sidebar (left nav) */}
          <aside className="tw-hidden md:tw-block tw-w-60 tw-shrink-0">
            <div className="tw-sticky tw-top-4">
              <div className="tw-bg-white tw-rounded-2xl tw-shadow-xl tw-overflow-hidden">
                <div className="tw-bg-[#4e73df] tw-p-4 tw-text-white">
                  <div className="tw-flex tw-items-center">
                    <div className="tw-w-9 tw-h-9 tw-rounded-xl tw-bg-white/20 tw-flex tw-items-center tw-justify-center tw-mr-3">
                      <svg className="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <div className="tw-text-xs tw-text-white/80">Admin</div>
                      <div className="tw-font-bold">Tour Manager</div>
                    </div>
                  </div>
                </div>
                <nav className="tw-p-2">
                  <button
                    onClick={() => setActiveTab('promotions')}
                    className={`tw-w-full tw-flex tw-items-center tw-px-3 tw-py-2 tw-rounded-xl tw-text-sm tw-font-medium tw-mb-1 tw-transition-colors ${
                      activeTab === 'promotions'
                        ? 'tw-bg-blue-50 tw-text-[#4e73df] tw-border tw-border-blue-200'
                        : 'tw-text-gray-700 hover:tw-bg-gray-50'
                    }`}
                  >
                    <svg className={`tw-w-4 tw-h-4 tw-mr-3 ${activeTab === 'promotions' ? 'tw-text-[#4e73df]' : 'tw-text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Promotions
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`tw-w-full tw-flex tw-items-center tw-px-3 tw-py-2 tw-rounded-xl tw-text-sm tw-font-medium tw-mb-1 tw-transition-colors ${
                      activeTab === 'reports'
                        ? 'tw-bg-blue-50 tw-text-[#4e73df] tw-border tw-border-blue-200'
                        : 'tw-text-gray-700 hover:tw-bg-gray-50'
                    }`}
                  >
                    <svg className={`tw-w-4 tw-h-4 tw-mr-3 ${activeTab === 'reports' ? 'tw-text-[#4e73df]' : 'tw-text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Reports
                  </button>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className={`tw-w-full tw-flex tw-items-center tw-px-3 tw-py-2 tw-rounded-xl tw-text-sm tw-font-medium tw-mb-1 tw-transition-colors ${
                      activeTab === 'payments'
                        ? 'tw-bg-blue-50 tw-text-[#4e73df] tw-border tw-border-blue-200'
                        : 'tw-text-gray-700 hover:tw-bg-gray-50'
                    }`}
                  >
                    <svg className={`tw-w-4 tw-h-4 tw-mr-3 ${activeTab === 'payments' ? 'tw-text-[#4e73df]' : 'tw-text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payment History
                  </button>
                  <Link
                    to="/calendar"
                    className="tw-w-full tw-flex tw-items-center tw-px-3 tw-py-2 tw-rounded-xl tw-text-sm tw-font-medium tw-mb-1 tw-transition-colors tw-text-gray-700 hover:tw-bg-gray-50 hover:tw-text-[#4e73df]"
                  >
                    <svg className="tw-w-4 tw-h-4 tw-mr-3 tw-text-gray-400 hover:tw-text-[#4e73df]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    View Calendar
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main column */}
          <div className="tw-flex-1">
            {/* Header for content */}
            <div className="tw-relative tw-rounded-3xl tw-overflow-hidden tw-shadow-xl tw-mb-8">
              <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-r tw-from-[#4e73df] tw-via-[#5a7cdf] tw-to-[#6a8ae3]" />
              <div className="tw-relative tw-p-6 md:tw-p-8">
                <div className="tw-flex tw-items-center tw-justify-between">
                  <div>
                    <h1 className="tw-text-3xl md:tw-text-4xl tw-font-extrabold tw-text-white tw-tracking-tight">Admin Dashboard</h1>
                    <p className="tw-text-blue-100 tw-mt-1">Manage tour promotions and view analytics</p>
                  </div>
                  <div className="tw-hidden md:tw-flex tw-items-center tw-space-x-4">
                    <div className="tw-bg-white/20 tw-backdrop-blur-sm tw-rounded-2xl tw-px-4 tw-py-3 tw-text-center tw-border tw-border-white/30">
                      <div className="tw-text-xs tw-text-white/80">Total</div>
                      <div className="tw-text-2xl tw-font-bold tw-text-white">{promotions.length}</div>
                    </div>
                    <div className="tw-bg-white/20 tw-backdrop-blur-sm tw-rounded-2xl tw-px-4 tw-py-3 tw-text-center tw-border tw-border-white/30">
                      <div className="tw-text-xs tw-text-white/80">Active</div>
                      <div className="tw-text-2xl tw-font-bold tw-text-white">{activePromotions.length}</div>
                    </div>
                    <div className="tw-bg-white/20 tw-backdrop-blur-sm tw-rounded-2xl tw-px-4 tw-py-3 tw-text-center tw-border tw-border-white/30">
                      <div className="tw-text-xs tw-text-white/80">Inactive</div>
                      <div className="tw-text-2xl tw-font-bold tw-text-white">{inactivePromotions.length}</div>
                    </div>
                    <Link
                      to="/calendar"
                      className="tw-bg-white/20 tw-backdrop-blur-sm tw-rounded-2xl tw-px-6 tw-py-3 tw-text-center hover:tw-bg-white/30 tw-transition-all tw-duration-300 tw-border tw-border-white/30 tw-flex tw-items-center tw-space-x-2"
                    >
                      <svg className="tw-w-5 tw-h-5 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="tw-text-white tw-font-semibold">View Calendar</span>
                    </Link>
                  </div>
                </div>

                {/* Mobile tabs */}
                <div className="tw-mt-6 tw-bg-white/10 tw-rounded-2xl tw-p-1 tw-inline-flex md:tw-hidden">
                  <button
                    onClick={() => setActiveTab('promotions')}
                    className={`tw-px-4 tw-py-2 tw-rounded-xl tw-font-medium tw-transition-all ${
                      activeTab === 'promotions' ? 'tw-bg-white tw-text-[#4e73df] tw-shadow-sm' : 'tw-text-white/90 hover:tw-text-white'
                    }`}
                  >
                    Promotions
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`tw-px-4 tw-py-2 tw-rounded-xl tw-font-medium tw-transition-all ${
                      activeTab === 'reports' ? 'tw-bg-white tw-text-[#4e73df] tw-shadow-sm' : 'tw-text-white/90 hover:tw-text-white'
                    }`}
                  >
                    Reports
                  </button>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className={`tw-px-4 tw-py-2 tw-rounded-xl tw-font-medium tw-transition-all ${
                      activeTab === 'payments' ? 'tw-bg-white tw-text-[#4e73df] tw-shadow-sm' : 'tw-text-white/90 hover:tw-text-white'
                    }`}
                  >
                    Payments
                  </button>
                  <Link
                    to="/calendar"
                    className="tw-px-4 tw-py-2 tw-rounded-xl tw-font-medium tw-transition-all tw-text-white/90 hover:tw-text-white hover:tw-bg-white/10"
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
                  <div className="tw-space-y-6">
                    <div className="tw-bg-white tw-rounded-3xl tw-shadow-xl tw-p-6 tw-flex tw-flex-col md:tw-flex-row md:tw-items-center md:tw-justify-between">
                      <div>
                        <h2 className="tw-text-2xl tw-font-bold tw-text-gray-900">Tour Promotions</h2>
                        <p className="tw-text-gray-500">Create and manage promotions for your tours</p>
                      </div>
                      <div className="tw-mt-4 md:tw-mt-0 tw-flex tw-items-center tw-space-x-3">
                        <button
                          onClick={handleAddPromotion}
                          className="tw-bg-[#4e73df] tw-text-white tw-px-6 tw-py-3 tw-rounded-xl tw-font-semibold hover:tw-bg-[#4266c9] tw-transition-colors tw-flex tw-items-center tw-shadow-md"
                        >
                          <svg className="tw-w-5 tw-h-5 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Promotion
                        </button>
                      </div>
                    </div>

                    <div className="tw-bg-white tw-rounded-3xl tw-shadow-xl tw-p-2">
                      <AdminEventList
                        promotions={promotions}
                        onEdit={handleEditPromotion}
                        onDelete={handleDeletePromotion}
                        onToggleActive={handleToggleActive}
                      />
                    </div>

                    {promotions.length === 0 && (
                      <div className="tw-text-center tw-py-16 tw-bg-white tw-rounded-3xl tw-shadow-xl">
                        <div className="tw-w-16 tw-h-16 tw-mx-auto tw-mb-4 tw-bg-blue-50 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                          <svg className="tw-w-8 tw-h-8 tw-text-[#4e73df]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="tw-text-xl tw-font-semibold tw-text-gray-900 tw-mb-2">No promotions yet</h3>
                        <p className="tw-text-gray-500 tw-mb-6">Click the button above to add your first promotion.</p>
                        <button
                          onClick={handleAddPromotion}
                          className="tw-bg-[#4e73df] tw-text-white tw-px-6 tw-py-3 tw-rounded-xl tw-font-semibold hover:tw-bg-[#4266c9] tw-transition-colors"
                        >
                          Add Your First Promotion
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : activeTab === 'reports' ? (
              <Reports promotions={promotions} />
            ) : activeTab === 'payments' ? (
              <PaymentHistory />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;