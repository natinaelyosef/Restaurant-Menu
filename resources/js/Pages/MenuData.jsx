import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function MenuData({ auth, menuItems = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    
    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        desc: '',             // ✅ CHANGED: matches backend field 'desc'
        price: '',
        category: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState('');

    // Filter logic (unchanged)
    const filteredItems = menuItems.filter(item => {
        const name = item.name || '';
        const desc = item.description || '';   // keep using 'description' from the model (backend sends 'description')
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            desc.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...new Set(menuItems.map(item => item.category))];

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
        if (imagePath.startsWith('/')) return imagePath;
        if (imagePath.startsWith('storage/')) return `/${imagePath}`;
        return `/storage/${imagePath}`;
    };

    // Delete Handler: use fetch to delete and refresh without navigating
    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        const token = csrfMeta ? csrfMeta.getAttribute('content') : '';

        fetch(`/admin/menu-items/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': token || '',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
        .then((res) => {
            if (res.ok || res.status === 204) {
                // reload the page data via a full visit to keep Inertia state
                router.reload();
            } else {
                router.delete(`/admin/menu-items/${id}`, { preserveScroll: true });
            }
        })
        .catch((err) => {
            console.error('Delete failed', err);
            alert('Failed to delete menu item. See console for details.');
        });
    };

    // --- Edit Modal Handlers ---
    const openEditModal = (item) => {
        setEditingItem(item);
        setEditForm({
            name: item.name,
            desc: item.description || '',   // ✅ Use item.description to populate 'desc'
            price: item.price,
            category: item.category,
            image: null,
        });
        setImagePreview(item.image ? getImageUrl(item.image) : '');
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
        formData.append('desc', editForm.desc);   // ✅ send 'desc' to match backend validation
        formData.append('price', editForm.price);
        formData.append('category', editForm.category);
        
        if (editForm.image instanceof File) {
            formData.append('image', editForm.image);
        }

        // ✅ CRITICAL FIX: use router.put instead of router.post
        router.put(`/admin/menu-items/${editingItem.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
        });
    };

    return (
        <>
            <Head title="Menu Data" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">📋 Menu Data</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{auth?.user?.name}</span>
                            <Link href="/logout" method="post" replace as="button" className="text-red-600 text-sm hover:underline">
                                Logout
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Filters & Add Button (unchanged) */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                            <button 
                                onClick={() => setCategoryFilter('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium ${categoryFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
                            >
                                All
                            </button>
                            {categories.filter(c => c !== 'all').map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${categoryFilter === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        
                        <Link 
                            href="/admin/manage-menu" 
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                            <span>+</span> Add New Item
                        </Link>
                    </div>

                    {/* Table (unchanged) */}
                    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredItems.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {item.image ? (
                                                            <img 
                                                                className="h-10 w-10 rounded-lg object-cover border border-gray-200" 
                                                                src={getImageUrl(item.image)} 
                                                                alt={item.name}
                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=No+Img'; }}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                                                No Img
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                                ${parseFloat(item.price).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {item.is_active ? 'Available' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => openEditModal(item)} 
                                                    className="text-blue-600 hover:text-blue-900 mr-4 font-bold"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)} 
                                                    className="text-red-600 hover:text-red-900 font-bold"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                {/* ================= EDIT MODAL ================= */}
                {isEditModalOpen && editingItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center p-4 border-b">
                                <h3 className="text-lg font-bold text-gray-800">Edit Menu Item</h3>
                                <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                            </div>
                            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={editForm.name} 
                                        onChange={handleEditChange} 
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea 
                                        name="desc"   // ✅ now correctly binds to editForm.desc
                                        value={editForm.desc} 
                                        onChange={handleEditChange} 
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                        <input 
                                            type="number" 
                                            name="price" 
                                            value={editForm.price} 
                                            onChange={handleEditChange} 
                                            step="0.01"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <input 
                                            type="text" 
                                            name="category" 
                                            value={editForm.category} 
                                            onChange={handleEditChange} 
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                    <input 
                                        type="file" 
                                        name="image" 
                                        onChange={handleImageChange} 
                                        accept="image/*"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-md" />
                                    )}
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button 
                                        type="button" 
                                        onClick={closeEditModal} 
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}