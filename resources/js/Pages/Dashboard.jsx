import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Navigation links matching your web.php routes
    const navLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊', active: true },
        { name: 'Menu Data', href: '/dashboard/menu-data', icon: '📋', active: false },
        { name: 'Manage Menu', href: '/dashboard/menu-items', icon: '', active: false },
        { name: 'Reservations', href: '/admin/reservations', icon: '📅', active: false },
        { name: 'Settings', href: '/admin/settings', icon: '⚙️', active: false },
    ];

    return (
        <>
            <Head title="Dashboard" />

            {/* ================= TOP NAVBAR (Full Width) ================= */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 shadow-sm">
                {/* Left: Hamburger Icon (Mobile) & Logo */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 text-gray-600 rounded-md hover:bg-gray-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-[#c8102e]"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="text-xl font-bold font-['Playfair_Display'] text-[#1a1a1a] hidden sm:block">
                        🍔 Dola Admin
                    </span>
                </div>

                {/* Right: Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                        aria-label="User menu"
                    >
                        <span className="text-sm font-medium text-gray-700 hidden md:block">
                            {auth?.user?.name || 'Admin'}
                        </span>
                        <div className="w-9 h-9 rounded-full bg-[#c8102e] flex items-center justify-center text-white font-bold shadow-md">
                            {(auth?.user?.name || 'A').charAt(0).toUpperCase()}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {userMenuOpen && (
                        <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-100">
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

            {/* ================= SIDEBAR (Below Navbar) ================= */}
            <aside 
                className={`fixed top-16 left-0 bottom-0 w-64 bg-[#1a1a1a] text-white transform transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Sidebar Navigation */}
                <nav className="mt-6 px-4 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                link.active 
                                    ? 'bg-[#c8102e] text-white' 
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="mr-3 text-lg">{link.icon}</span>
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer User Info */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-700 bg-[#151515]">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#d4a017] flex items-center justify-center text-[#1a1a1a] font-bold flex-shrink-0">
                            {(auth?.user?.name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">
                                {auth?.user?.name || 'Admin'}
                            </p>
                            <p className="text-xs text-gray-400 truncate">Owner</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ================= MAIN CONTENT AREA ================= */}
            <main className="pt-16 lg:ml-64 min-h-screen bg-gray-50 transition-all duration-300">
                
                {/* Mobile Overlay for Sidebar */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                <div className="p-6 max-w-7xl mx-auto">
                    
                    {/* Welcome Banner */}
                    <div className="mb-8 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] rounded-2xl p-6 text-white shadow-lg">
                        <h2 className="text-2xl font-bold font-['Playfair_Display'] mb-2">
                            Welcome back, {auth?.user?.name || 'Admin'}! 👋
                        </h2>
                        <p className="text-gray-300">
                            Here's what's happening at Dola Grill House today.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {[
                            { label: 'Total Orders', value: '142', icon: '📦', color: 'bg-blue-500' },
                            { label: "Today's Revenue", value: '$1,240', icon: '💰', color: 'bg-green-500' },
                            { label: 'Active Reservations', value: '18', icon: '📅', color: 'bg-[#d4a017]' },
                            { label: 'Menu Items', value: '24', icon: '🍔', color: 'bg-[#c8102e]' },
                        ].map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-2xl shadow-sm`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity Placeholder */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                        <div className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                            <p className="text-lg">📊 Your dashboard content will go here.</p>
                            <p className="text-sm mt-2">
                                Use the sidebar to navigate to <strong>Menu Data</strong> or <strong>Manage Menu</strong>.
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}