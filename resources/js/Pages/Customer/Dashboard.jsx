// resources/js/Pages/Customer/Dashboard.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function CustomerDashboard({ userName, myReservations, activeCount }) {
    const recentReservations = (myReservations || []).slice(0, 5);

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        declined: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800',
    };

    const statusIcons = {
        pending: '⏳',
        approved: '✅',
        declined: '❌',
        cancelled: '🚫',
    };

    return (
        <CustomerLayout title="Customer Dashboard" active="dashboard">
            {/* Welcome Banner */}
            <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Welcome, {userName}!</h2>
                <p className="text-blue-100">Manage your reservations and enjoy our restaurant.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-xl">📅</div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Reservations</p>
                            <p className="text-2xl font-bold text-gray-900">{(myReservations || []).length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-xl">✅</div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active</p>
                            <p className="text-2xl font-bold text-green-600">{activeCount || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-xl">🍽️</div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Quick Action</p>
                            <Link href="/customer/reserve" className="text-sm font-bold text-blue-600 hover:text-blue-800">
                                Book Now →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <Link
                    href="/customer/reserve"
                    className="flex items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow"
                >
                    <span className="text-3xl mr-4">📅</span>
                    <div>
                        <p className="text-lg font-semibold text-blue-900">Make a Reservation</p>
                        <p className="text-sm text-blue-600">Book a table for your next visit</p>
                    </div>
                </Link>
                <Link
                    href="/customer/my-reservations"
                    className="flex items-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow"
                >
                    <span className="text-3xl mr-4">📋</span>
                    <div>
                        <p className="text-lg font-semibold text-green-900">My Reservations</p>
                        <p className="text-sm text-green-600">View and manage your bookings</p>
                    </div>
                </Link>
            </div>

            {/* Recent Reservations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Reservations</h3>
                    <Link href="/customer/my-reservations" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View All →
                    </Link>
                </div>
                {recentReservations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl block mb-3">📅</span>
                        <p className="font-medium">No reservations yet</p>
                        <Link href="/customer/reserve" className="text-blue-600 hover:underline text-sm mt-1 inline-block">
                            Make your first reservation →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentReservations.map((res) => (
                            <div key={res.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-gray-900">{res.reservation_date}</p>
                                        <p className="text-xs text-gray-500">{res.reservation_time}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{res.guests} guest{res.guests > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[res.status]}`}>
                                    {statusIcons[res.status]} {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}