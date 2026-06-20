import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function MenuData({ userName, userRole }) {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        desc: '',
        price: '',
        category: 'appetizer',
        image: null,
        image_url: '',
    });
    const [imageSource, setImageSource] = useState('upload'); // 'upload' or 'url'
    const [imagePreview, setImagePreview] = useState('');

    const loadMenuItems = () => {
        setLoading(true);
        fetch('/admin/menu-items', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        })
        .then((res) => res.json())
        .then((data) => {
            setMenuItems(data.menuItems || data || []);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    React.useEffect(() => {
        loadMenuItems();
    }, []);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this menu item?')) {
            router.delete(`/admin/menu-items/${id}`, {
                preserveScroll: true,
                onSuccess: () => loadMenuItems(),
            });
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        const isUrl = item.image && (item.image.startsWith('http://') || item.image.startsWith('https://'));
        setEditForm({
            name: item.name,
            desc: item.desc || '',
            price: item.price,
            category: item.category,
            image: null,
            image_url: isUrl ? item.image : '',
        });
        setImageSource(isUrl ? 'url' : 'upload');
        setImagePreview(item.image ? (isUrl || item.image.startsWith('/') ? item.image : `/storage/${item.image}`) : '');
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingItem(null);
        setImagePreview('');
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditForm(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editForm.name);
        formData.append('desc', editForm.desc);
        formData.append('price', editForm.price);
        formData.append('category', editForm.category);
        
        if (imageSource === 'upload') {
            if (editForm.image instanceof File) {
                formData.append('image', editForm.image);
            }
        } else if (imageSource === 'url') {
            formData.append('image_url', editForm.image_url);
        }

        router.post(`/admin/menu-items/${editingItem.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                loadMenuItems();
            },
        });
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
            return imagePath;
        }
        return `/storage/${imagePath}`;
    };

    const categories = ['all', 'appetizer', 'main_course', 'burgers', 'dessert', 'beverage', 'salad', 'soup'];
    const filtered = filter === 'all' ? menuItems : menuItems.filter((item) => item.category === filter);

    return (
        <AdminLayout title="Menu Data" active="menu-data">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">📋 Menu Data</h1>
                <p className="text-gray-600 mt-1">View and manage all menu items</p>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                                filter === cat
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {cat === 'all' ? 'All' : cat.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Items Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        Loading menu items...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="text-4xl block mb-4">🍽️</span>
                        <p className="text-lg font-medium">No menu items found</p>
                        <p className="text-sm mt-1">Add items from the Manage Menu page</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filtered.map((item, idx) => (
                                    <tr key={item.id || idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.image ? (
                                                    <img 
                                                        src={getImageUrl(item.image)} 
                                                        alt={item.name} 
                                                        className="w-10 h-10 rounded-lg object-cover border border-gray-100 shadow-sm" 
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=No+Img'; }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs border border-gray-100 shadow-sm">
                                                        No Img
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{item.desc}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                {(item.category || 'N/A').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">${parseFloat(item.price).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                item.is_active || item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {item.is_active || item.is_available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <span className="text-gray-200">|</span>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">✏️ Edit Menu Item</h3>
                            <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 text-2xl transition-colors">&times;</button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={editForm.price}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={editForm.category}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="appetizer">Appetizer</option>
                                        <option value="main_course">Main Course</option>
                                        <option value="burgers">Burgers</option>
                                        <option value="dessert">Dessert</option>
                                        <option value="beverage">Beverage</option>
                                        <option value="salad">Salad</option>
                                        <option value="soup">Soup</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="desc"
                                    value={editForm.desc}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    placeholder="Describe this menu item..."
                                />
                            </div>

                            {/* Image Source Toggle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                                <div className="flex gap-4 mb-3">
                                    <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors ${imageSource === 'upload' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="imageSource"
                                            value="upload"
                                            checked={imageSource === 'upload'}
                                            onChange={() => setImageSource('upload')}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium">Upload File</span>
                                    </label>
                                    <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors ${imageSource === 'url' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="imageSource"
                                            value="url"
                                            checked={imageSource === 'url'}
                                            onChange={() => setImageSource('url')}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium">Use URL</span>
                                    </label>
                                </div>

                                {imageSource === 'upload' ? (
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="block w-full rounded-lg border border-gray-300 text-sm text-gray-700 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Leave empty to keep existing image</p>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="url"
                                            name="image_url"
                                            value={editForm.image_url}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Paste direct image link</p>
                                    </div>
                                )}

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mt-3">
                                        <p className="text-xs font-medium text-gray-600 mb-1">Preview:</p>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Save Changes
                                </button>
                                <button type="button" onClick={closeEditModal} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
