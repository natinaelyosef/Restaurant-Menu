import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import useTranslation from '@/i18n/useTranslation';

export default function SubAdminLayout({ title = 'Sub Admin Dashboard', active = 'dashboard', children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user ?? { name: 'Sub Admin', email: '' };
    const { t } = useTranslation();
    useEffect(() => {
        try {
            if (!auth?.user) {
                router.visit('/login', { replace: true });
            }
        } catch (e) {
            // ignore
        }
    }, [auth]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // All navigation links visible immediately upon login
    const navLinks = [
        { key: 'dashboard', name: t('dashboard'), href: '/sub/dashboard', icon: '🏠' },
        { key: 'change-password', name: t('changePassword'), href: '/sub/change-password', icon: '🔑' },
        { key: 'manage-menu', name: t('manageMenu'), href: '/admin/manage-menu', icon: '🍽️' },
        { key: 'menu-data', name: t('menuData'), href: '/admin/menu-data', icon: '📋' },
        { key: 'orders', name: t('orders'), href: '/admin/orders', icon: '🛒' },
        { key: 'reservations', name: t('reservations'), href: '/admin/reservations', icon: '📅' },
        { key: 'settings', name: t('settings'), href: '/admin/settings', icon: '⚙️' },
    ];

    const handleLogout = () => {
        router.post('/logout', { replace: true });
    };

    return (
        <>
            <Head title={title} />

            {/* Flash Messages */}
            {flash?.success && (
                <div className="fixed top-4 right-4 z-[100] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
                    <span>✅</span>
                    <span>{flash.success}</span>
                    <button onClick={() => router.reload()} className="ml-2 text-white/80 hover:text-white">✕</button>
                </div>
            )}
            {flash?.error && (
                <div className="fixed top-4 right-4 z-[100] bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                    <span>❌</span>
                    <span>{flash.error}</span>
                </div>
            )}

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-teal-700 to-emerald-700 text-white z-50 flex items-center justify-between px-4 shadow-lg">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 text-white rounded-md hover:bg-white/10 lg:hidden focus:outline-none"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">⚡</span>
                        <span className="text-xl font-bold hidden sm:block">Sub Admin Panel</span>
                    </div>
                </div>

                <div className="flex items-center md:me-4">
                    <LanguageSwitcher />
                </div>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <span className="text-sm font-medium hidden md:block">{user.name}</span>
                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-teal-700 font-bold shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </button>

                    {userMenuOpen && (
                        <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1">
                                <div className="px-4 py-2 border-b">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <Link
                                    href="/sub/change-password"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setUserMenuOpen(false)}
                                >
                                    Change Password
                                </Link>
                                <button
                                    onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Sidebar */}
            <aside
                className={`fixed top-16 left-0 bottom-0 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <nav className="mt-6 px-4 space-y-2 overflow-y-auto max-h-[calc(100vh-10rem)]">
                    <div className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Navigation
                    </div>
                    {navLinks.map((link) => (
                        <Link
                            key={link.key}
                            href={link.href}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                active === link.key
                                    ? 'bg-teal-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="mr-3 text-lg">{link.icon}</span>
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-700 bg-gray-950">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-teal-700 font-bold flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-teal-400 truncate">Sub Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pt-16 lg:ml-64 min-h-screen bg-gray-100 transition-all duration-300">
                {sidebarOpen && (
                    <button
                        type="button"
                        className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close sidebar"
                    />
                )}

                <div className="p-6 max-w-7xl mx-auto">{children}</div>
            </main>
        </>
    );
}
