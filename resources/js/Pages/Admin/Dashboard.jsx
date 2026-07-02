import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/i18n/useTranslation';

export default function AdminDashboard({
    userName,
    userRole,
    totalReservations,
    pendingReservations,
    approvedReservations,
    todayReservations,
    totalSubAdmins,
    activeSubAdmins,
    suspendedSubAdmins,
}) {
    const { t } = useTranslation();
    const isSuperAdmin = userRole === 'super_admin';

    const stats = [
        { label: t('totalReservations'), value: totalReservations, icon: '📅', color: 'bg-blue-500', lightColor: 'bg-blue-50' },
        { label: t('pending'), value: pendingReservations, icon: '⏳', color: 'bg-yellow-500', lightColor: 'bg-yellow-50' },
        { label: t('approved'), value: approvedReservations, icon: '✅', color: 'bg-green-500', lightColor: 'bg-green-50' },
        { label: t('today'), value: todayReservations, icon: '📆', color: 'bg-purple-500', lightColor: 'bg-purple-50' },
    ];

    const quickActions = [
        { name: t('manageMenu'), href: '/admin/manage-menu', icon: '🍽️', desc: t('addEditRemoveItems') },
        { name: t('menuData'), href: '/admin/menu-data', icon: '📋', desc: t('viewAllItemsData') },
        { name: t('orders'), href: '/admin/orders', icon: '🛒', desc: t('viewManageOrders') },
        { name: t('reservations'), href: '/admin/reservations', icon: '📅', desc: t('approveDeclineReservations') },
        { name: t('settings'), href: '/admin/settings', icon: '⚙️', desc: t('systemSettings') },
    ];

    if (isSuperAdmin) {
        quickActions.push({ name: t('manageSubAdmins'), href: '/super/sub-admins', icon: '👥', desc: t('createManageSubAdmins') });
    }

    return (
        <AdminLayout title="Admin Dashboard" active="dashboard">
            {/* Welcome Banner */}
            <div className={`mb-8 bg-gradient-to-r ${isSuperAdmin ? 'from-purple-700 to-indigo-600' : 'from-teal-700 to-emerald-600'} rounded-2xl p-6 text-white shadow-lg`}>
                <h2 className="text-2xl font-bold mb-2">{t('welcomeBack')}, {userName}!</h2>
                <p className={isSuperAdmin ? 'text-purple-100' : 'text-teal-100'}>
                    {t('youAreLoggedInAs')} {isSuperAdmin ? t('superAdministrator') : t('subAdministrator')}.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${stat.lightColor} rounded-full flex items-center justify-center text-xl`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Super Admin Sub-Admin Stats */}
            {isSuperAdmin && (
                <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">👥 {t('subAdminOverview')}</h3>
                        <Link href="/super/sub-admins" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                            {t('manageSubAdmins')} →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-blue-600">{totalSubAdmins}</p>
                            <p className="text-sm text-blue-700 font-medium">{t('totalSubAdmins')}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-green-600">{activeSubAdmins}</p>
                            <p className="text-sm text-green-700 font-medium">{t('active')}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-red-600">{suspendedSubAdmins}</p>
                            <p className="text-sm text-red-700 font-medium">{t('suspended')}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('quickActions')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action, i) => (
                        <Link
                            key={i}
                            href={action.href}
                            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                            <span className="text-2xl mr-3">{action.icon}</span>
                            <div>
                                <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{action.name}</p>
                                <p className="text-sm text-gray-500">{action.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
