import React from 'react';
import useTranslation from '@/i18n/useTranslation';
import { usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ totalSubAdmins, active, suspended, banned, recentSubAdmins }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const user = auth?.user ?? { name: 'Super Admin' };

    const stats = [
        { label: t('totalSubAdmins'), value: totalSubAdmins || 0, color: 'bg-blue-500', icon: '👥' },
        { label: t('active'), value: active || 0, color: 'bg-green-500', icon: '✅' },
        { label: t('suspended'), value: suspended || 0, color: 'bg-yellow-500', icon: '⏸️' },
        { label: t('banned'), value: banned || 0, color: 'bg-red-500', icon: '🚫' },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-800',
            suspended: 'bg-yellow-100 text-yellow-800',
            banned: 'bg-red-100 text-red-800',
        };
        return styles[status] || styles.active;
    };

    return (
        <AdminLayout title="Super Admin Dashboard" active="dashboard">
            {/* Welcome Banner */}
            <div className="mb-8 bg-gradient-to-r from-purple-900 to-indigo-800 rounded-2xl p-6 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">
                    {t('welcomeBack')}, {user.name}!
                </h2>
                <p className="text-purple-200">
                    {t('subAdminOverviewDesc')}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-xl`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('quickActions')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                        href="/super/sub-admins"
                        className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        <span className="text-2xl mr-3">➕</span>
                        <div>
                            <p className="font-medium text-purple-900">{t('addSubAdmin')}</p>
                            <p className="text-sm text-purple-600">{t('createSubAdminAccount')}</p>
                        </div>
                    </Link>
                    <Link
                        href="/super/sub-admins"
                        className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <span className="text-2xl mr-3">👥</span>
                        <div>
                            <p className="font-medium text-blue-900">{t('manageSubAdmins')}</p>
                            <p className="text-sm text-blue-600">{t('viewManageAllAccounts')}</p>
                        </div>
                    </Link>
                    <Link
                        href="/profile"
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-2xl mr-3">⚙️</span>
                        <div>
                            <p className="font-medium text-gray-900">{t('profileSettings')}</p>
                            <p className="text-sm text-gray-600">{t('updateYourProfile')}</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Sub-Admins */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{t('recentSubAdmins')}</h3>
                    <Link href="/super/sub-admins" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                        {t('viewAll')} →
                    </Link>
                </div>
                {recentSubAdmins && recentSubAdmins.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('name')}</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('emailAddress')}</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('status')}</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('created')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSubAdmins.map((admin) => (
                                    <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-900">{admin.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{admin.email}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(admin.status)}`}>
                                                {admin.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {new Date(admin.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-lg mb-2">{t('noSubAdminsYet')}</p>
                        <p className="text-sm">{t('createFirstSubAdmin')}</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
