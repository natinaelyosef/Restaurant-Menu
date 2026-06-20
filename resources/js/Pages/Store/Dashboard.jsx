// resources/js/Pages/Store/Dashboard.jsx
import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function StoreDashboard({ auth }) {
    
    const handleLogout = () => {
        router.post(route('logout'), { replace: true });
    };

    return (
        <AppLayout auth={auth}>
            <Head title="Store Owner Dashboard" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold">Welcome, {auth.user.name}!</h2>
                                    <p className="text-gray-600">You are logged in as a Store Owner</p>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                    Logout
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-indigo-50 p-6 rounded-lg">
                                    <i className="fas fa-store text-3xl text-indigo-600 mb-4"></i>
                                    <h3 className="text-lg font-semibold mb-2">Manage Store</h3>
                                    <p className="text-gray-600">Update your store information and settings</p>
                                    <button className="mt-4 text-indigo-600 hover:underline">Manage →</button>
                                </div>
                                
                                <div className="bg-yellow-50 p-6 rounded-lg">
                                    <i className="fas fa-book text-3xl text-yellow-600 mb-4"></i>
                                    <h3 className="text-lg font-semibold mb-2">Inventory</h3>
                                    <p className="text-gray-600">Add, edit, or remove books from your inventory</p>
                                    <button className="mt-4 text-yellow-600 hover:underline">Manage Inventory →</button>
                                </div>
                                
                                <div className="bg-red-50 p-6 rounded-lg">
                                    <i className="fas fa-chart-line text-3xl text-red-600 mb-4"></i>
                                    <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                                    <p className="text-gray-600">View sales reports and customer insights</p>
                                    <button className="mt-4 text-red-600 hover:underline">View Analytics →</button>
                                </div>
                                
                                <div className="bg-teal-50 p-6 rounded-lg">
                                    <i className="fas fa-truck text-3xl text-teal-600 mb-4"></i>
                                    <h3 className="text-lg font-semibold mb-2">Orders</h3>
                                    <p className="text-gray-600">Manage incoming orders and shipping</p>
                                    <button className="mt-4 text-teal-600 hover:underline">View Orders →</button>
                                </div>
                                
                                <div className="bg-pink-50 p-6 rounded-lg">
                                    <i className="fas fa-tags text-3xl text-pink-600 mb-4"></i>
                                    <h3 className="text-lg font-semibold mb-2">Promotions</h3>
                                    <p className="text-gray-600">Create discounts and special offers</p>
                                    <button className="mt-4 text-pink-600 hover:underline">Create Offer →</button>
                                </div>
                                
                                <div className="bg-orange-50 p-6 rounded-lg">
                                    <i className="fas fa-star text-3xl text-orange-600 mb-4"></i>
                                    <h3 className="text-lg font-semibold mb-2">Reviews</h3>
                                    <p className="text-gray-600">Respond to customer reviews and ratings</p>
                                    <button className="mt-4 text-orange-600 hover:underline">View Reviews →</button>
                                </div>
                            </div>
                        </div>
                    </div>
    </div>
            </div>
        </AppLayout>
    );
}