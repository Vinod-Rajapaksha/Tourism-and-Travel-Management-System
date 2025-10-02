import React, { useState, useEffect } from 'react';
import { Promotion } from '../types/Event';

interface AdminEventFormProps {
  promotion?: Promotion | null;
  onSave: (promotion: Promotion) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const AdminEventForm: React.FC<AdminEventFormProps> = ({ 
  promotion, 
  onSave, 
  onCancel, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState<Partial<Promotion>>({
    title: '',
    startDate: '',
    endDate: '',
    time: '',
    description: '',
    color: 'blue',
    price: '',
    originalPrice: '',
    discount: '',
    duration: '',
    maxParticipants: 0,
    isActive: true,
    promotionType: 'percentage',
    terms: ''
  });

  useEffect(() => {
    if (promotion) {
      setFormData(promotion);
    }
  }, [promotion]);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;

  if (name === "price" || name === "originalPrice") {
    // keep only digits for prices
    const numericValue = value.replace(/\D/g, "");
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  } else if (name === "discount") {
    // keep only digits for discount
    const numericValue = value.replace(/\D/g, "");
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  } else {
    // default behavior
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value
    }));
  }
};



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const promotionData: Promotion = {
      id: promotion?.id || Date.now().toString(),
      title: formData.title!,
      startDate: formData.startDate!,
      endDate: formData.endDate!,
      time: formData.time || '',
      description: formData.description || '',
      color: formData.color || 'blue',
      price: formData.price || '',
      originalPrice: formData.originalPrice || '',
      discount: formData.discount || '',
      duration: formData.duration || '',
      maxParticipants: formData.maxParticipants || 0,
      isActive: formData.isActive !== false,
      promotionType: formData.promotionType || 'percentage',
      terms: formData.terms || '',
      createdAt: promotion?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(promotionData);
  };

  const colorOptions = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' }
  ];

  const promotionTypeOptions = [
    { value: 'percentage', label: 'Percentage Discount' },
    { value: 'fixed', label: 'Fixed Amount Off' },
    { value: 'free', label: 'Free Offer' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Tour Promotion' : 'Add New Tour Promotion'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Promotion Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Enter promotion title"
            required
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Enter promotion description"
          />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Price
            </label>
              
              
            <input
              type="text"
              name="price"
              value={formData.price? `Rs. ${formData.price}` : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., $50 per person"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Original Price
            </label>
            <input
              type="text"
              name="originalPrice"
              value={formData.originalPrice? `Rs. ${formData.originalPrice}` : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., $75 per person"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount
            </label>
            <input
              type="text"
              name="discount"
              value={formData.discount? `${formData.discount}%OFF` : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., 20% OFF"
            />
          </div>
        </div>

        {/* Duration and Max Participants */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., 3 hours"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Participants
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="0 for unlimited"
            />
          </div>
        </div>

        {/* Promotion Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Promotion Type
          </label>
          <select
            name="promotionType"
            value={formData.promotionType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {promotionTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Terms and Conditions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Terms & Conditions
          </label>
          <textarea
            name="terms"
            value={formData.terms}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Enter promotion terms and conditions"
          />
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Promotion Color
          </label>
          <div className="grid grid-cols-6 gap-2">
            {colorOptions.map((color) => (
              <label key={color.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="color"
                  value={color.value}
                  checked={formData.color === color.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-full ${color.class} border-2 ${
                  formData.color === color.value ? 'border-gray-800' : 'border-gray-300'
                }`} />
                <span className="text-xs text-gray-600">{color.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <label className="text-sm font-medium text-gray-700">
            Active (visible to users)
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            {isEditing ? 'Update Promotion' : 'Add Promotion'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEventForm;
