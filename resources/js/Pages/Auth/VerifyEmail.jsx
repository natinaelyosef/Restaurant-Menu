import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import useTranslation from '@/i18n/useTranslation';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    const { t } = useTranslation();

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title={t('emailVerificationTitle')} />

            <div className="mb-4 text-sm text-gray-600">
                {t('emailVerificationText')}
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {t('verificationLinkSent')}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        {t('resendVerificationEmail')}
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        replace
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {t('signOut')}
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
