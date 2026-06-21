import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const renderContent = () => (
        <div className="py-12">
            <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                {user?.role === 'customer' && (
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                )}
            </div>
        </div>
    );

    if (user?.role === 'super_admin' || user?.role === 'sub_admin') {
        return (
            <AdminLayout title="Profile Settings" active="profile">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">👤 Profile Settings</h1>
                    <p className="text-gray-600 mt-1">Update your account's name, email, and password</p>
                </div>
                {renderContent()}
            </AdminLayout>
        );
    }

    if (user?.role === 'customer') {
        return (
            <CustomerLayout title="Profile Settings" active="profile">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">👤 Profile Settings</h1>
                    <p className="text-gray-600 mt-1">Update your account's name, email, and password</p>
                </div>
                {renderContent()}
            </CustomerLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile Settings
                </h2>
            }
        >
            <Head title="Profile Settings" />
            {renderContent()}
        </AuthenticatedLayout>
    );
}

