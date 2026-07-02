import React, { useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { getMenuCategoryOptions, normalizeMenuCategory } from '../../utils/menuCategories';
import useTranslation from '@/i18n/useTranslation';

export default function ManageMenu({ userName, userRole }) {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);
    const [imageSource, setImageSource] = useState('upload'); // 'upload' or 'url'
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'appetizer',
        image_url: '',
        is_available: true,
    });

    const categories = getMenuCategoryOptions().filter((option) => option.value !== 'all');

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUrlChange = (url) => {
        setFormData({ ...formData, image_url: url });
        setImagePreview(url);
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', category: 'appetizer', image_url: '', is_available: true });
        setImageSource('upload');
        setImageFile(null);
        setImagePreview('');
        setShowForm(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            desc: formData.description,
            price: formData.price,
            category: normalizeMenuCategory(formData.category),
            image_source: imageSource,
            rating: 5.0,
        };

        if (imageSource === 'url') {
            payload.image_url = formData.image_url;
        }

        // Use FormData to support file upload
        const formDataPayload = new FormData();
        formDataPayload.append('name', formData.name);
        formDataPayload.append('desc', formData.description);
        formDataPayload.append('price', formData.price);
        // Map legacy category names to backend categories when needed
        formDataPayload.append('category', normalizeMenuCategory(formData.category));
        formDataPayload.append('image_source', imageSource);
        formDataPayload.append('rating', '5.0');

        if (imageSource === 'upload' && imageFile) {
            formDataPayload.append('image', imageFile);
        } else if (imageSource === 'url') {
            formDataPayload.append('image_url', formData.image_url);
        }

        router.post('/admin/menu-items', formDataPayload, {
            onSuccess: () => {
                resetForm();
            },
        });
    };

    return (
        <AdminLayout title="Manage Menu" active="manage-menu">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('menuManagement')}</h1>
                    <p className="text-gray-600 mt-1">{t('addMenuItems')}</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {showForm ? t('cancel') : t('addMenuItem')}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">{t('addNewMenuItem')}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('itemName')}</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g. Grilled Salmon"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('price')}</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('rating')}</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="5"
                                    value="5.0"
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows="3"
                                placeholder="Describe this menu item..."
                            />
                        </div>

                        {/* Image Source Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('image')}</label>
                            <div className="flex gap-4 mb-3">
                                <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors ${imageSource === 'upload' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="imageSource"
                                        value="upload"
                                        checked={imageSource === 'upload'}
                                        onChange={() => { setImageSource('upload'); setImagePreview(''); }}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium">{t('uploadFromDevice')}</span>
                                </label>
                                <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors ${imageSource === 'url' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="imageSource"
                                        value="url"
                                        checked={imageSource === 'url'}
                                        onChange={() => { setImageSource('url'); setImagePreview(''); }}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium">{t('useUrlFromInternet')}</span>
                                </label>
                            </div>

                            {imageSource === 'upload' ? (
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleImageFileChange}
                                        required
                                        className="block w-full rounded-lg border border-gray-300 text-sm text-gray-700 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">{t('maxSize2mb')}</p>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => handleUrlChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="https://example.com/image.jpg"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">{t('pasteImageLink')}</p>
                                </div>
                            )}

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mt-3">
                                        <p className="text-xs font-medium text-gray-600 mb-1">{t('preview')}:</p>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_available"
                                checked={formData.is_available}
                                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="is_available" className="text-sm text-gray-700">{t('availableForOrdering')}</label>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                {t('saveMenuItem')}
                            </button>
                            <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                                {t('cancel')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <span className="text-xl">ℹ️</span>
                    <div>
                        <h4 className="font-medium text-blue-900 mb-1">{t('menuManagement')}</h4>
                        <p className="text-sm text-blue-700">
                            {t('menuManagementInfo')}
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}