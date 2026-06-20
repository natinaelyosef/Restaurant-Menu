import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function DashboardLayout({ title = 'Dashboard', active = 'dashboard', children }) {
    const { auth } = usePage().props;
    const user = auth?.user ?? { name: 'User', email: '' };
    useEffect(() => {
        try {
            if (!auth?.user) {
                Inertia.visit('/login', { replace: true });
            }
        } catch (e) {
            // ignore
        }
    }, [auth]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navLinks = [
        { key: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: 'Home' },
        { key: 'menu-items', name: 'Manage Menu', href: '/dashboard/menu-items', icon: 'Menu' },
        { key: 'menu-data', name: 'Menu Data', href: '/dashboard/menu-data', icon: 'Data' },
        { key: 'orders', name: 'Orders', href: '/dashboard/orders', icon: 'Orders' },
        { key: 'reservations', name: 'Reservations', href: '/dashboard/reservations', icon: 'Calendar' },
        { key: 'settings', name: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
    ];

    return (
        <>
            <Head title={title} />

            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 text-gray-600 rounded-md hover:bg-gray-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-[#c8102e]"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="text-xl font-bold font-['Playfair_Display'] text-[#1a1a1a] hidden sm:block">
                        Dola Admin
                    </span>
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <span className="text-sm font-medium text-gray-700 hidden md:block">{user.name}</span>
                        <div className="w-9 h-9 rounded-full bg-[#c8102e] flex items-center justify-center text-white font-bold shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </button>

                    {userMenuOpen && (
                        <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-gray-100">
                            <div className="py-1">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setUserMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    method="post"
                                    href="/logout"
                                    replace
                                    as="button"
                                    className="block w-full text-left px-4 py-2 text-sm text-[#c8102e] hover:bg-gray-100"
                                    onClick={() => setUserMenuOpen(false)}
                                >
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <aside
                className={`fixed top-16 left-0 bottom-0 w-64 bg-[#1a1a1a] text-white transform transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <nav className="mt-6 px-4 space-y-2">
                    <div className="px-4 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Menu
                    </div>
                    {navLinks.map((link) => (
                        <Link
                            key={link.key}
                            href={link.href}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                active === link.key
                                    ? 'bg-[#c8102e] text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="mr-3 text-xs font-semibold uppercase tracking-wide text-inherit opacity-70">
                                {link.icon}
                            </span>
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-700 bg-[#151515]">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#d4a017] flex items-center justify-center text-[#1a1a1a] font-bold flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">Owner</p>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="pt-16 lg:ml-64 min-h-screen bg-gray-50 transition-all duration-300">
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
