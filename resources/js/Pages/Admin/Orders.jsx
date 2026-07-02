import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/i18n/useTranslation';

export default function Orders({ userName, userRole }) {
    const { t } = useTranslation();
    // Placeholder orders data - will be connected to backend later
    const orders = [];

    return (
        <AdminLayout title="Orders" active="orders">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t('orders')}</h1>
                <p className="text-gray-600 mt-1">{t('viewManageOrders')}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <span className="text-6xl block mb-4">🛒</span>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('ordersManagement')}</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    {t('ordersInfo')}
                </p>

                {orders.length === 0 && (
                    <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-sm text-yellow-700">
                            {t('noOrdersYet')}
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
