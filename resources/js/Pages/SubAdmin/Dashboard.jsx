import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ userName, userEmail, userStatus }) {
    const stats = [
        { label: 'My Status', value: userStatus?.toUpperCase() || 'ACTIVE', color: userStatus === 'active' ? 'text-green-600' : 'text-red-600', icon: userStatus === 'active' ? '✅' : '⏸️' },
    ];

    return (
        <AdminLayout title="Sub Admin Dashboard" active="dashboard">
            {/* Welcome Banner */}
            <div className="mb-8 bg-gradient-to-r from-teal-700 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">
                    Welcome back, {userName}!
                </h2>
                <p className="text-teal-100">
                    You are logged in as a Sub-Administrator.
                </p>
            </div>

            {/* Status Card */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">
                            {stats[0].icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Account Status</p>
                            <p className={`text-xl font-bold ${stats[0].color}`}>{stats[0].value}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                            👤
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Your Role</p>
                            <p className="text-xl font-bold text-gray-900">Sub-Admin</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                            📧
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{userEmail}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/sub/change-password"
                        className="flex items-center p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                    >
                        <span className="text-2xl mr-3">🔑</span>
                        <div>
                            <p className="font-medium text-teal-900">Change Password</p>
                            <p className="text-sm text-teal-600">Update your login password</p>
                        </div>
                    </Link>
                    <Link
                        href="/profile"
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-2xl mr-3">⚙️</span>
                        <div>
                            <p className="font-medium text-gray-900">Profile Settings</p>
                            <p className="text-sm text-gray-600">Update your profile info</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Info Notice */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <span className="text-xl">ℹ️</span>
                    <div>
                        <h4 className="font-medium text-blue-900 mb-1">Need Help?</h4>
                        <p className="text-sm text-blue-700">
                            If you forget your password, please contact the Super Admin who can reset it for you.
                            You can also change your password anytime using the "Change Password" option above.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
