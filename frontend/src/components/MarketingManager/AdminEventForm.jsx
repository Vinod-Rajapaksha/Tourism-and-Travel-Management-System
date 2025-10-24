import React, { useState, useEffect } from 'react';

const AdminEventForm = ({
    promotion,
    onSave,
    onCancel,
    isEditing = false
}) => {
    const [formData, setFormData] = useState({
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
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (promotion) {
            setFormData(promotion);
        }
    }, [promotion]);

    const handleChange = (e) => {
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

        // clear previous errors on change
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.title) {
            newErrors.title = "Title is required";
        }
        if (!formData.startDate) {
            newErrors.startDate = "Start date is required";
        }
        if (!formData.endDate) {
            newErrors.endDate = "End date is required";
        }

        if (formData.startDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const startDate = new Date(formData.startDate);

            if (startDate < today) {
                newErrors.startDate = "Start date cannot be in the past";
            }

            if (formData.endDate) {
                const endDate = new Date(formData.endDate);
                if (endDate <= startDate) {
                    newErrors.endDate = "End date must be after start date";
                }
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const promotionData = {
            id: promotion?.id || Date.now().toString(),
            title: formData.title,
            startDate: formData.startDate,
            endDate: formData.endDate,
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
        <div className="tw-bg-white tw-rounded-3xl tw-shadow-xl tw-p-6 tw-max-w-2xl tw-mx-auto">
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
                <h2 className="tw-text-2xl tw-font-bold tw-text-gray-900">
                    {isEditing ? 'Edit Tour Promotion' : 'Add New Tour Promotion'}
                </h2>
                <button
                    onClick={onCancel}
                    className="tw-text-gray-500 hover:tw-text-gray-700 tw-transition-colors tw-p-1 tw-rounded-lg hover:tw-bg-gray-100"
                >
                    <svg className="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="tw-space-y-6">
                {/* Title */}
                <div>
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                        Promotion Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#4e73df] focus:tw-border-transparent tw-transition-all"
                        placeholder="Enter promotion title"
                        required
                    />
                    {errors.title && <p className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.title}</p>}
                </div>

                {/* Date Range */}
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <div>
                        <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                            Start Date *
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#4e73df] focus:tw-border-transparent tw-transition-all"
                            required
                        />
                        {errors.startDate && <p className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.startDate}</p>}
                    </div>
                    <div>
                        <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                            End Date *
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#4e73df] focus:tw-border-transparent tw-transition-all"
                            required
                        />
                        {errors.endDate && <p className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.endDate}</p>}
                    </div>
                </div>

                {/* Time */}
                <div>
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                        Time
                    </label>
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#4e73df] focus:tw-border-transparent tw-transition-all"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#4e73df] focus:tw-border-transparent tw-transition-all"
                        placeholder="Enter promotion description"
                    />
                </div>

                {/* Pricing */}
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
                    <div>
                        <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                            Current Price
                        </label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price ? `Rs. ${formData.price}` : ""}
                            onChange={handleChange}
                            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#4e73df] focus:tw-border-transparent tw-transition-all"
                            placeholder="e.g., Rs. 5000"
                        />
                    </div>
                    <div>
                        <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                            Original Price
                        </label>
                        <input
                            type="text"
                            name="originalPrice"
                            value={formData.originalPrice ? `Rs. ${formData.originalPrice}` : ""}
                            onChange={handleChange}
                            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#4e73df] focus:tw-border-transparent tw-transition-all"
                            placeholder="e.g., Rs. 7500"
                        />
                    </div>
                    <div>
                        <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                            Discount
                        </label>
                        <input
                            type="text"
                            name="discount"
                            value={formData.discount ? `${formData.discount}% OFF` : ""}
                            onChange={handleChange}
                            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#4e73df] focus:tw-border-transparent tw-transition-all"
                            placeholder="e.g., 20% OFF"
                        />
                    </div>
                </div>

                {/* Duration and Max Participants */}
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <div>
                        <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                            Duration
                        </label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#4e73df] focus:tw-border-transparent tw-transition-all"
                            placeholder="e.g., 3 hours"
                        />
                    </div>
                    <div>
                        <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                            Maximum Participants
                        </label>
                        <input
                            type="number"
                            name="maxParticipants"
                            value={formData.maxParticipants}
                            onChange={handleChange}
                            min="0"
                            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#4e73df] focus:tw-border-transparent tw-transition-all"
                            placeholder="0 for unlimited"
                        />
                    </div>
                </div>

                {/* Promotion Type */}
                <div>
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                        Promotion Type
                    </label>
                    <select
                        name="promotionType"
                        value={formData.promotionType}
                        onChange={handleChange}
                        className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#4e73df] focus:tw-border-transparent tw-transition-all"
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
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                        Terms & Conditions
                    </label>
                    <textarea
                        name="terms"
                        value={formData.terms}
                        onChange={handleChange}
                        rows={2}
                        className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#4e73df] focus:tw-border-transparent tw-transition-all"
                        placeholder="Enter promotion terms and conditions"
                    />
                </div>

                {/* Color Selection */}
<div>
    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">
        Promotion Color
    </label>
    <div className="tw-grid tw-grid-cols-6 tw-gap-3">
        {colorOptions.map((color) => (
            <label key={color.value} className="tw-relative tw-flex tw-flex-col tw-items-center tw-space-y-1.5 tw-cursor-pointer">
                <input
                    type="radio"
                    name="color"
                    value={color.value}
                    checked={formData.color === color.value}
                    onChange={handleChange}
                    className="tw-sr-only"
                />
                <div className={`tw-w-8 tw-h-8 tw-rounded-full ${color.class} tw-border tw-transition-all tw-relative ${
                    formData.color === color.value 
                        ? 'tw-border-white tw-ring-2 tw-ring-[#4e73df] tw-shadow-md tw-scale-110' 
                        : 'tw-border-gray-300 hover:tw-border-white hover:tw-ring-1 hover:tw-ring-gray-300'
                }`}>
                    {formData.color === color.value && (
                        <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
                            <svg className="tw-w-3.5 tw-h-3.5 tw-text-white tw-drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>
                <span className={`tw-text-xs tw-font-medium tw-transition-colors ${
                    formData.color === color.value ? 'tw-text-[#4e73df]' : 'tw-text-gray-500'
                }`}>
                    {color.label}
                </span>
            </label>
        ))}
    </div>
</div>

                {/* Active Status */}
                <div className="tw-flex tw-items-center tw-space-x-3 tw-p-4 tw-bg-gray-50 tw-rounded-xl">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="tw-w-5 tw-h-5 tw-text-[#4e73df] tw-border-gray-300 tw-rounded focus:tw-ring-[#4e73df]"
                    />
                    <label className="tw-text-sm tw-font-medium tw-text-gray-700">
                        Active (visible to users)
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="tw-flex tw-justify-end tw-space-x-4 tw-pt-6 tw-border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="tw-px-6 tw-py-3 tw-text-gray-700 tw-bg-gray-100 tw-rounded-xl hover:tw-bg-gray-200 tw-transition-colors tw-font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="tw-px-6 tw-py-3 tw-bg-[#4e73df] tw-text-white tw-rounded-xl hover:tw-bg-[#4266c9] tw-transition-colors tw-font-medium tw-shadow-md"
                    >
                        {isEditing ? 'Update Promotion' : 'Add Promotion'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminEventForm;