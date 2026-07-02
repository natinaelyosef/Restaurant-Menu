import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { getMenuCategoryOptions, normalizeMenuCategory, formatMenuCategoryLabel } from '../utils/menuCategories';
import useTranslation from '@/i18n/useTranslation';

export default function FoodItemForm({ menuItem }) {
    const { t } = useTranslation();
    const isEditing = !!menuItem;
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'appetizer',
        image: null,
    });
    const categoryOptions = getMenuCategoryOptions().filter((option) => option.value !== 'all');
    
    const [imagePreview, setImagePreview] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getImageUrl = (img) => {
        if (!img) return '';
        if (img.startsWith('http://') || img.startsWith('https://')) return img;
        if (img.startsWith('/')) return img;
        if (img.startsWith('storage/')) return `/${img}`;
        return `/storage/${img}`;
    };

    // Populate form when editing
    useEffect(() => {
        if (menuItem) {
            setFormData({
                name: menuItem.name || '',
                description: menuItem.description || '',
                price: menuItem.price || '',
                category: normalizeMenuCategory(menuItem.category || 'burgers'),
                image: null,
            });
            if (menuItem.image) {
                setImagePreview(getImageUrl(menuItem.image));
            }
        }
    }, [menuItem]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        if (formData.image) {
            data.append('image', formData.image);
        }

        const url = isEditing 
            ? `/dashboard/menu-items/${menuItem.id}`
            : '/dashboard/menu-items';

        router.post(url, data, {
            preserveScroll: true,
            onSuccess: () => {
                // Redirect happens automatically
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            },
        });
    };

    return (
        <>
            <Head title={isEditing ? t('editMenuItem') : t('addMenuItem')} />
            
            <div className="min-h-screen bg-gray-50">
                {/* Top Navigation Bar */}
                <header className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <h1 className="text-2xl font-bold font-['Playfair_Display'] text-[#1a1a1a]">
                                🍔 Dola Admin
                            </h1>
                        </div>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 font-['Playfair_Display']">
                            {isEditing ? t('editMenuItem') : t('addNewMenuItem')}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            {isEditing ? t('editMenuItemDesc') : t('addNewMenuItemDesc')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('itemName')} *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c8102e] focus:border-transparent ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., Classic Burger"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('description')}
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c8102e] focus:border-transparent ${
                                        errors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Describe the item..."
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Price and Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('price')} *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c8102e] focus:border-transparent ${
                                            errors.price ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="0.00"
                                        required
                                    />
                                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('category')} *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c8102e] focus:border-transparent ${
                                            errors.category ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    >
                                        {categoryOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('image')}
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c8102e] focus:border-transparent"
                                />
                                {imagePreview && (
                                    <div className="mt-4">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-32 w-32 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => router.visit('/dashboard/menu-data')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 bg-[#c8102e] text-white rounded-lg hover:bg-[#a00d24] transition-colors ${
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? t('saving') : (isEditing ? t('saveChanges') : t('addMenuItem'))}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}