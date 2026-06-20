// resources/js/Layouts/AppLayout.jsx
import React, { useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { useTheme } from '@/Contexts/ThemeContext';
import { route } from 'ziggy-js';

export default function AppLayout({ children, auth }) {
    useEffect(() => {
        try {
            if (!auth?.user) {
                Inertia.visit('/login', { replace: true });
            }
        } catch (e) {
            // ignore
        }
    }, [auth]);
    const { darkMode, setDarkMode } = useTheme();

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get('/books', { search: e.target.value });
        }
    };

    const handleSearchClick = () => {
        const searchInput = document.getElementById('headerSearch');
        if (searchInput && searchInput.value) {
            router.get('/books', { search: searchInput.value });
        } else {
            router.get('/books');
        }
    };

    const handleLogout = () => {
        router.post(route('logout'), { replace: true });
    };

    return (
        <>
            <header>
                <div className="header-inner">
                    <Link href="/" className="logo">
                        <div className="logo-icon"><i className="bi bi-book-half"></i></div>
                        <span className="logo-text">Book<span>Hub</span></span>
                    </Link>

                    <div className="header-search">
                        <i className="bi bi-search"></i>
                        <input 
                            type="text" 
                            id="headerSearch" 
                            placeholder="Search books, authors, genres…"
                            onKeyPress={handleSearch}
                        />
                        <button 
                            className="search-btn"
                            onClick={handleSearchClick}
                        >Search</button>
                    </div>

                    <nav className="nav-right">
                        <Link href="/" className="nav-btn">
                            <i className="bi bi-house"></i> Home
                        </Link>
                        <Link href="/stores" className="nav-btn">
                            <i className="bi bi-shop"></i> Stores
                        </Link>
                        <Link href={auth?.user ? "/my-books" : "/login"} className="nav-btn">
                            <i className="bi bi-book-open"></i> My Books
                        </Link>
                        <Link href="/contact" className="nav-btn">
                            <i className="bi bi-envelope"></i> Contact
                        </Link>

                        <div style={{width:'1px',height:'22px',background:'var(--border)',margin:'0 0.2rem'}}></div>

                        <Link href="/cart" className="cart-btn nav-btn">
                            <i className="bi bi-bag"></i>
                            <span className="cart-badge"></span>
                        </Link>

                        {auth?.user ? (
                            <>
                                <Link href={auth.user.role === 'store_owner' ? '/store/dashboard' : '/customer/dashboard'} className="nav-pill">
                                    <i className="bi bi-person-circle"></i> Dashboard
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="nav-pill nav-pill-outline"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="bi bi-box-arrow-right"></i> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="nav-pill nav-pill-outline">Login</Link>
                                <Link href="/register" className="nav-pill">
                                    <i className="bi bi-person-plus"></i> Register
                                </Link>
                            </>
                        )}
                        
                        <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
                            <i className={darkMode ? "bi bi-moon-stars-fill" : "bi bi-sun-fill"}></i>
                        </button>
                        <button className="mob-menu-btn"><i className="bi bi-list"></i></button>
                    </nav>
                </div>
            </header>

            {children}
        </>
    );
}