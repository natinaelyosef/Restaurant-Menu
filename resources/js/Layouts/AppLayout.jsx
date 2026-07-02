// resources/js/Layouts/AppLayout.jsx
import React, { useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeContext';
import { route } from 'ziggy-js';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import useTranslation from '@/i18n/useTranslation';

export default function AppLayout({ children, auth }) {
    useEffect(() => {
        try {
            if (!auth?.user) {
                router.visit('/login', { replace: true });
            }
        } catch (e) {
            // ignore
        }
    }, [auth]);
    const { darkMode, setDarkMode } = useTheme();

    const { t } = useTranslation();

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
                            placeholder={t('searchPlaceholder')}
                            onKeyPress={handleSearch}
                        />
                        <button 
                            className="search-btn"
                            onClick={handleSearchClick}
                        >{t('search')}</button>
                    </div>

                    <nav className="nav-right">
                        <Link href="/" className="nav-btn">
                            <i className="bi bi-house"></i> {t('home')}
                        </Link>
                        <Link href="/stores" className="nav-btn">
                            <i className="bi bi-shop"></i> {t('stores')}
                        </Link>
                        <Link href={auth?.user ? "/my-books" : "/login"} className="nav-btn">
                            <i className="bi bi-book-open"></i> {t('myBooks')}
                        </Link>
                        <Link href="/contact" className="nav-btn">
                            <i className="bi bi-envelope"></i> {t('contact')}
                        </Link>

                        <div style={{width:'1px',height:'22px',background:'var(--border)',margin:'0 0.2rem'}}></div>

                        <Link href="/cart" className="cart-btn nav-btn">
                            <i className="bi bi-bag"></i>
                            <span className="cart-badge"></span>
                        </Link>

                        {auth?.user ? (
                            <>
                                <Link href={auth.user.role === 'store_owner' ? '/store/dashboard' : '/customer/dashboard'} className="nav-pill">
                                    <i className="bi bi-person-circle"></i> {t('dashboard')}
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="nav-pill nav-pill-outline"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="bi bi-box-arrow-right"></i> {t('logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="nav-pill nav-pill-outline">{t('login')}</Link>
                                <Link href="/register" className="nav-pill">
                                    <i className="bi bi-person-plus"></i> {t('register')}
                                </Link>
                            </>
                        )}
                        
                        <LanguageSwitcher />
                        <button className="theme-btn" onClick={toggleTheme} aria-label={t('toggleTheme')}>
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