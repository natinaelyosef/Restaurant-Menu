import { useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { Link, router, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { props } = usePage();

    useEffect(() => {
        const handlePageShow = (event) => {
            if (event.persisted) {
                window.location.reload();
            }
        };

        window.addEventListener('pageshow', handlePageShow);

        return () => {
            window.removeEventListener('pageshow', handlePageShow);
        };
    }, []);

    // Redirect authenticated users away from guest pages (client-side guard)
    useEffect(() => {
        try {
            const user = props?.auth?.user;
            if (user) {
                const dashboard = user.dashboard || '/dashboard';
                router.visit(dashboard, { replace: true });
            }
        } catch (e) {
            // ignore
        }
    }, [props]);

    return (
        <div className="relative flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div className="absolute top-4 right-4 z-20">
                <LanguageSwitcher />
            </div>
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
