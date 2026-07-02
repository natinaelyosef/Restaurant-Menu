import React from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/i18n/useTranslation';

export default function Settings({ userName, userRole }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const user = auth?.user;
    const isSuperAdmin = userRole === 'super_admin';

    return (
        <AdminLayout title="Settings" active="settings">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t('settings')}</h1>
                <p className="text-gray-600 mt-1">{t('manageAccountSettings')}</p>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('profileInformation')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">{t('fullName')}</label>
                        <p className="text-gray-900 font-medium">{user?.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">{t('emailAddress')}</label>
                        <p className="text-gray-900 font-medium">{user?.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">{t('yourRole')}</label>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            isSuperAdmin ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800'
                        }`}>
                            {isSuperAdmin ? t('superAdministrator') : t('subAdministrator')}
                        </span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">{t('accountStatus')}</label>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                            ✅ {user?.status?.toUpperCase() || 'ACTIVE'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('quickLinks')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a
                        href="/profile"
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-2xl mr-3">👤</span>
                        <div>
                            <p className="font-medium text-gray-900">{t('editProfile')}</p>
                            <p className="text-sm text-gray-500">{t('updateNameEmail')}</p>
                        </div>
                    </a>
                    {!isSuperAdmin && (
                        <a
                            href="/sub/change-password"
                            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <span className="text-2xl mr-3">🔑</span>
                            <div>
                                <p className="font-medium text-gray-900">{t('changePassword')}</p>
                                <p className="text-sm text-gray-500">{t('updateLoginPassword')}</p>
                            </div>
                        </a>
                    )}
                </div>
            </div>

            {/* System Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('systemInformation')}</h3>
                <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">{t('application')}</span>
                        <span className="text-sm font-medium text-gray-900">BestBuy Book Restaurant</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">{t('framework')}</span>
                        <span className="text-sm font-medium text-gray-900">Laravel 12 + React 18</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">{t('yourRole')}</span>
                        <span className="text-sm font-medium text-gray-900">{userRole}</span>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
