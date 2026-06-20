import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function MyReservations({ reservations, userName }) {
    const [filter, setFilter] = useState('all');

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

    const filtered = filter === 'all' ? reservations : reservations.filter((r) => r.status === filter);

    const handleCancel = (id) => {
        if (confirm('Are you sure you want to cancel this reservation?')) {
            router.post(`/customer/reservations/${id}/cancel`, {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <CustomerLayout title="My Reservations" active="my-reservations">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">📋 My Reservations</h1>
                    <p className="text-gray-600 mt-1">View and manage your reservations</p>
                </div>
                <a
                    href="/customer/reserve"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + New Reservation
                </a>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'approved', 'declined', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 text-sm rounded-full transition-colors font-medium ${
                                filter === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {status === 'all' ? '📋 All' : `${statusIcons[status]} ${status.charAt(0).toUpperCase() + status.slice(1)}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reservations List */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <span className="text-4xl block mb-4">📅</span>
                    <p className="text-lg font-medium text-gray-700">No reservations found</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {filter !== 'all' ? `You have no ${filter} reservations` : "You haven't made any reservations yet"}
                    </p>
                    <a
                        href="/customer/reserve"
                        className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Make a Reservation
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((res) => (
                        <div key={res.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 rounded-lg p-3 text-center min-w-[70px]">
                                        <p className="text-xs text-blue-600 font-medium">{new Date(res.reservation_date).toLocaleString('default', { month: 'short' })}</p>
                                        <p className="text-2xl font-bold text-blue-900">{new Date(res.reservation_date).getDate()}</p>
                                        <p className="text-xs text-blue-600">{res.reservation_time}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900">{res.guests} Guest{res.guests > 1 ? 's' : ''}</h3>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[res.status]}`}>
                                                {statusIcons[res.status]} {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">📧 {res.email} {res.phone ? `| 📞 ${res.phone}` : ''}</p>
                                        {res.special_requests && (
                                            <p className="text-sm text-gray-500 mt-1">💬 {res.special_requests}</p>
                                        )}
                                        {res.review_note && res.status !== 'pending' && (
                                            <p className="text-sm text-gray-500 mt-1 italic">📝 {res.review_note}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    {(res.status === 'pending' || res.status === 'approved') && (
                                        <button
                                            onClick={() => handleCancel(res.id)}
                                            className="px-4 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                                        >
                                            🚫 Cancel Reservation
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CustomerLayout>
    );
}
