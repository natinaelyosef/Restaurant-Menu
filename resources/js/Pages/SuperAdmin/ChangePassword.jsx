import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ChangePassword() {
    const { flash } = usePage().props;
    const [formData, setFormData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSuccess('');

        router.post('/super/change-password', formData, {
            onSuccess: () => {
                setSuccess('Password updated successfully!');
                setFormData({ current_password: '', password: '', password_confirmation: '' });
                setProcessing(false);
            },
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
        });
    };

    return (
        <AdminLayout title="Change Password" active="change-password">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
                    <p className="text-gray-600 mt-1">Update your login password to keep your account secure.</p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                        <span>✅</span>
                        <span>{success}</span>
                    </div>
                )}

                {flash?.status && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                        <span>✅</span>
                        <span>{flash.status}</span>
                    </div>
                )}

                {/* Password Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={formData.current_password}
                                onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                required
                            />
                            {errors.current_password && (
                                <p className="text-red-500 text-sm mt-1">{errors.current_password}</p>
                            )}
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">New Password</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        required
                                        minLength="8"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                    )}
                                    <p className="text-gray-500 text-xs mt-1">Minimum 8 characters</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        required
                                        minLength="8"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 shadow-sm"
                            >
                                {processing ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Help Notice */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <span className="text-lg">💡</span>
                        <div>
                            <p className="text-sm text-yellow-800">
                                <strong>Security Tip:</strong> Choose a strong password that you don't use on other websites.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}