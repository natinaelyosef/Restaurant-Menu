import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Reservations({ reservations, userName, userRole }) {
    const [filter, setFilter] = useState('all');
    const [declineModal, setDeclineModal] = useState(null);
    const [declineNote, setDeclineNote] = useState('');

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

    const handleApprove = (id) => {
        if (confirm('Approve this reservation?')) {
            router.post(`/admin/reservations/${id}/approve`, { note: 'Reservation approved.' }, {
                preserveScroll: true,
            });
        }
    };

    const handleDecline = (id) => {
        if (!declineNote.trim()) return;
        router.post(`/admin/reservations/${id}/decline`, { note: declineNote }, {
            preserveScroll: true,
            onSuccess: () => {
                setDeclineModal(null);
                setDeclineNote('');
            },
        });
    };

    return (
        <AdminLayout title="Reservations" active="reservations">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">📅 Reservations</h1>
                <p className="text-gray-600 mt-1">Approve or decline customer reservations</p>
            </div>

            {/* Filter Tabs */}
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
                            {status !== 'all' && (
                                <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                                    {reservations.filter((r) => r.status === status).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reservations List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="text-4xl block mb-4">📅</span>
                        <p className="text-lg font-medium">No reservations found</p>
                        <p className="text-sm mt-1">
                            {filter !== 'all' ? `No ${filter} reservations` : 'No reservations have been made yet'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filtered.map((res) => (
                                    <tr key={res.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-medium text-gray-900">{res.name}</p>
                                            <p className="text-xs text-gray-500">{res.customer_name}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-medium text-gray-900">{res.reservation_date}</p>
                                            <p className="text-xs text-gray-500">{res.reservation_time}</p>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">{res.guests}</td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm text-gray-900">{res.email}</p>
                                            <p className="text-xs text-gray-500">{res.phone || 'N/A'}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[res.status]}`}>
                                                {statusIcons[res.status]} {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                                            </span>
                                            {res.review_note && (
                                                <p className="text-xs text-gray-500 mt-1 max-w-[150px] truncate" title={res.review_note}>
                                                    {res.review_note}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {res.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(res.id)}
                                                        className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        ✅ Approve
                                                    </button>
                                                    <button
                                                        onClick={() => { setDeclineModal(res.id); setDeclineNote(''); }}
                                                        className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        ❌ Decline
                                                    </button>
                                                </div>
                                            )}
                                            {res.status !== 'pending' && (
                                                <span className="text-xs text-gray-400">
                                                    {res.reviewer_name ? `By ${res.reviewer_name}` : '—'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Decline Modal */}
            {declineModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">❌ Decline Reservation</h3>
                        <p className="text-sm text-gray-600 mb-4">Please provide a reason for declining this reservation.</p>
                        <textarea
                            value={declineNote}
                            onChange={(e) => setDeclineNote(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
                            rows="3"
                            placeholder="Reason for declining..."
                            required
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeclineModal(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDecline(declineModal)}
                                disabled={!declineNote.trim()}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                Confirm Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
