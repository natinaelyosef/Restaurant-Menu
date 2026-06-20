import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Orders({ userName, userRole }) {
    // Placeholder orders data - will be connected to backend later
    const orders = [];

    return (
        <AdminLayout title="Orders" active="orders">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">🛒 Orders</h1>
                <p className="text-gray-600 mt-1">View and manage customer orders</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <span className="text-6xl block mb-4">🛒</span>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Orders Management</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Orders from customers will appear here. You can view, process, and manage all incoming orders from this page.
                </p>

                {orders.length === 0 && (
                    <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-sm text-yellow-700">
                            ℹ️ No orders yet. Orders will appear here once customers start placing them.
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
