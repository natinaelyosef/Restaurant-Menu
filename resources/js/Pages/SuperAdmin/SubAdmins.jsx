import React, { useState } from 'react';
import useTranslation from '@/i18n/useTranslation';
import { usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function SubAdmins({ subAdmins }) {
    const { t } = useTranslation();
    const { flash } = usePage().props;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [passwordData, setPasswordData] = useState({ password: '', password_confirmation: '' });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-800 border-green-200',
            suspended: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            banned: 'bg-red-100 text-red-800 border-red-200',
        };
        return styles[status] || styles.active;
    };

    const openCreateModal = () => {
        setFormData({ name: '', email: '', password: '' });
        setErrors({});
        setShowCreateModal(true);
    };

    const openEditModal = (admin) => {
        setSelectedAdmin(admin);
        setFormData({ name: admin.name, email: admin.email, password: '' });
        setErrors({});
        setShowEditModal(true);
    };

    const openPasswordModal = (admin) => {
        setSelectedAdmin(admin);
        setPasswordData({ password: '', password_confirmation: '' });
        setErrors({});
        setShowPasswordModal(true);
    };

    const openDeleteModal = (admin) => {
        setSelectedAdmin(admin);
        setShowDeleteModal(true);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post('/super/sub-admins', formData, {
            onSuccess: () => {
                setShowCreateModal(false);
                setProcessing(false);
            },
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.put(`/super/sub-admins/${selectedAdmin.id}`, {
            name: formData.name,
            email: formData.email,
        }, {
            onSuccess: () => {
                setShowEditModal(false);
                setProcessing(false);
            },
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
        });
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        if (passwordData.password !== passwordData.password_confirmation) {
            setErrors({ password: t('passwordsDoNotMatch') });
            setProcessing(false);
            return;
        }

        router.post(`/super/sub-admins/${selectedAdmin.id}/reset-password`, {
            password: passwordData.password,
        }, {
            onSuccess: () => {
                setShowPasswordModal(false);
                setProcessing(false);
            },
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
        });
    };

    const handleSuspend = (admin) => {
        if (confirm(`Are you sure you want to suspend ${admin.name}?`)) {
            router.post(`/super/sub-admins/${admin.id}/suspend`);
        }
    };

    const handleBan = (admin) => {
        if (confirm(`Are you sure you want to ban ${admin.name}? This will permanently restrict their access.`)) {
            router.post(`/super/sub-admins/${admin.id}/ban`);
        }
    };

    const handleActivate = (admin) => {
        router.post(`/super/sub-admins/${admin.id}/activate`);
    };

    const handleDelete = () => {
        setProcessing(true);
        router.delete(`/super/sub-admins/${selectedAdmin.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setProcessing(false);
            },
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
        });
    };

    return (
        <AdminLayout title="Manage Sub-Admins" active="sub-admins">
            {/* Success Message */}
            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between">
                    <span>{flash.success}</span>
                    <button onClick={() => router.reload()} className="text-green-600 hover:text-green-800">✕</button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('subAdminManagement')}</h1>
                    <p className="text-gray-600 mt-1">{t('createManageControl')}</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="mt-4 sm:mt-0 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm flex items-center gap-2"
                >
                    <span>➕</span> {t('addNewSubAdmin')}
                </button>
            </div>

            {/* Sub-Admins Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {subAdmins && subAdmins.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{t('name')}</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{t('emailAddress')}</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{t('status')}</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{t('created')}</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subAdmins.map((admin) => (
                                    <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                                                    {admin.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900">{admin.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{admin.email}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(admin.status)}`}>
                                                {admin.status?.toUpperCase() || 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500 text-sm">
                                            {new Date(admin.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                {admin.status === 'active' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleSuspend(admin)}
                                                            className="px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100 transition-colors"
                                                            title="Suspend account"
                                                        >
                                                            {t('suspend')}
                                                        </button>
                                                        <button
                                                            onClick={() => handleBan(admin)}
                                                            className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                                                            title="Ban account"
                                                        >
                                                            {t('banned')}
                                                        </button>
                                                    </>
                                                )}
                                                {(admin.status === 'suspended' || admin.status === 'banned') && (
                                                    <button
                                                        onClick={() => handleActivate(admin)}
                                                        className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                                                        title="Activate account"
                                                    >
                                                        {t('activate')}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openPasswordModal(admin)}
                                                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                                                    title="Reset password"
                                                >
                                                    {t('resetPW')}
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(admin)}
                                                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                                                    title="Edit details"
                                                >
                                                    {t('edit')}
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(admin)}
                                                    className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                                                    title="Delete account"
                                                >
                                                    {t('delete')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-4xl mb-4">👥</p>
                        <p className="text-lg font-medium text-gray-900 mb-2">{t('noSubAdminsYet')}</p>
                        <p className="text-gray-500 mb-4">{t('createFirstSubAdmin')}</p>
                        <button
                            onClick={openCreateModal}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            {t('addSubAdmin')}
                        </button>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <Modal title={t('createSubAdminAccount')} onClose={() => setShowCreateModal(false)}>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('emailLoginName')}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                                minLength="8"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">{t('cancel')}</button>
                            <button type="submit" disabled={processing} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
                                {processing ? t('creating') : t('createSubAdmin')}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <Modal title={t('editSubAdmin')} onClose={() => setShowEditModal(false)}>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('emailAddress')}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">{t('cancel')}</button>
                            <button type="submit" disabled={processing} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
                                {processing ? t('saving') : t('saveChanges')}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Reset Password Modal */}
            {showPasswordModal && (
                <Modal title={`${t('resetPasswordFor')} ${selectedAdmin?.name}`} onClose={() => setShowPasswordModal(false)}>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
                            ⚠️ This will set a new password for {selectedAdmin?.email}. Share the new password with them securely.
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('newPassword')}</label>
                            <input
                                type="password"
                                value={passwordData.password}
                                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                                minLength="8"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('confirmNewPassword')}</label>
                            <input
                                type="password"
                                value={passwordData.password_confirmation}
                                onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                                minLength="8"
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">{t('cancel')}</button>
                            <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                {processing ? t('resetting') : t('resetPassword')}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <Modal title={t('deleteSubAdmin')} onClose={() => setShowDeleteModal(false)}>
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                            {t('warningCannotUndo')} <strong>{selectedAdmin?.name}</strong>{t('willBePermanentlyDeleted')}
                        </div>
                        <p className="text-gray-600">{t('suspendConfirm')}</p>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">{t('cancel')}</button>
                            <button onClick={handleDelete} disabled={processing} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                                {processing ? t('deleting') : t('yesDelete')}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </AdminLayout>
    );
}

// Reusable Modal Component
function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}
