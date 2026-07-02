import React, { useState, useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import useTranslation from '@/i18n/useTranslation';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            replace: true,
            onFinish: () => reset('password'),
        });
    };

    // Inject Premium CSS
    useEffect(() => {
        const styleId = 'dola-login-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                :root {
                    --primary: #e63946;
                    --primary-dark: #c1121f;
                    --primary-glow: rgba(230, 57, 70, 0.35);
                    --gold: #ffb703;
                    --gold-dark: #fb8500;
                    --dark: #121212;
                    --darker: #0a0a0a;
                    --card-bg: rgba(22, 22, 22, 0.7);
                    --card-border: rgba(255, 255, 255, 0.08);
                    --text-light: #f8f9fa;
                    --text-muted: #9ca3af;
                    --glass-bg: rgba(18, 18, 18, 0.75);
                    --glass-border: rgba(255, 255, 255, 0.08);
                    --radius-md: 16px;
                    --radius-lg: 24px;
                    --radius-full: 9999px;
                    --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                body {
                    font-family: 'Poppins', sans-serif;
                    background: var(--darker);
                    color: var(--text-light);
                    margin: 0;
                    padding: 0;
                    min-height: 100vh;
                    overflow-x: hidden;
                }

                .auth-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    position: relative;
                    background: 
                        radial-gradient(circle at 20% 80%, rgba(230, 57, 70, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 183, 3, 0.08) 0%, transparent 50%),
                        var(--darker);
                }

                .auth-bg-pattern {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 50px 50px;
                    pointer-events: none;
                }

                .auth-card {
                    width: 100%;
                    max-width: 1100px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    position: relative;
                    z-index: 1;
                }

                /* Left Side - Branding */
                .auth-branding {
                    background: linear-gradient(135deg, rgba(230, 57, 70, 0.15) 0%, rgba(10, 10, 10, 0.95) 100%), 
                                url('https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=1000&fit=crop');
                    background-size: cover;
                    background-position: center;
                    padding: 60px 48px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                }

                .auth-branding::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(10,10,10,0.85) 0%, rgba(230, 57, 70, 0.2) 100%);
                    z-index: 1;
                }

                .auth-branding > * {
                    position: relative;
                    z-index: 2;
                }

                .brand-logo {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    text-decoration: none;
                    margin-bottom: auto;
                }

                .brand-logo-icon {
                    font-size: 42px;
                    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
                }

                .brand-logo-text {
                    font-family: 'Playfair Display', serif;
                    font-size: 32px;
                    font-weight: 900;
                    color: var(--gold);
                    letter-spacing: 0.5px;
                }

                .brand-logo-sub {
                    font-size: 10px;
                    color: var(--text-muted);
                    letter-spacing: 4px;
                    text-transform: uppercase;
                    display: block;
                    margin-top: -4px;
                }

                .brand-content {
                    margin: auto 0;
                    padding: 40px 0;
                }

                .brand-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(230, 57, 70, 0.15);
                    border: 1px solid rgba(230, 57, 70, 0.3);
                    padding: 6px 16px;
                    border-radius: var(--radius-full);
                    font-size: 12px;
                    color: #fff;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    margin-bottom: 24px;
                    backdrop-filter: blur(4px);
                }

                .brand-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 48px;
                    font-weight: 900;
                    line-height: 1.1;
                    color: #fff;
                    margin-bottom: 20px;
                    text-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
                }

                .brand-title .accent {
                    font-family: 'Dancing Script', cursive;
                    color: var(--gold);
                    font-size: 0.85em;
                }

                .brand-desc {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 16px;
                    line-height: 1.7;
                    max-width: 380px;
                }

                .brand-stats {
                    display: flex;
                    gap: 32px;
                    padding-top: 40px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .brand-stat-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 32px;
                    font-weight: 900;
                    color: var(--gold);
                    line-height: 1;
                }

                .brand-stat-label {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.6);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-top: 6px;
                }

                /* Right Side - Form */
                .auth-form-wrapper {
                    padding: 60px 56px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    background: rgba(18, 18, 18, 0.95);
                }

                .form-header {
                    margin-bottom: 36px;
                }

                .form-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 36px;
                    font-weight: 900;
                    color: var(--text-light);
                    margin-bottom: 8px;
                }

                .form-subtitle {
                    color: var(--text-muted);
                    font-size: 15px;
                }

                .status-message {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    color: #10b981;
                    padding: 12px 16px;
                    border-radius: var(--radius-md);
                    font-size: 14px;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .input-group {
                    margin-bottom: 20px;
                }

                .input-label {
                    display: block;
                    font-size: 13px;
                    color: var(--text-muted);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 500;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 18px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    font-size: 18px;
                    pointer-events: none;
                    transition: color 0.3s;
                }

                .premium-input {
                    width: 100%;
                    padding: 16px 20px 16px 52px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1.5px solid rgba(255, 255, 255, 0.08);
                    border-radius: var(--radius-md);
                    color: var(--text-light);
                    font-size: 15px;
                    font-family: 'Poppins', sans-serif;
                    transition: var(--transition);
                    outline: none;
                }

                .premium-input::placeholder {
                    color: var(--text-muted);
                    opacity: 0.6;
                }

                .premium-input:focus {
                    border-color: var(--gold);
                    background: rgba(255, 183, 3, 0.03);
                    box-shadow: 0 0 0 4px rgba(255, 183, 3, 0.1);
                }

                .premium-input:focus + .input-icon-right,
                .premium-input:focus ~ .input-icon {
                    color: var(--gold);
                }

                .input-error {
                    color: var(--primary);
                    font-size: 13px;
                    margin-top: 6px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .password-toggle {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    font-size: 18px;
                    padding: 4px;
                    transition: color 0.3s;
                }

                .password-toggle:hover {
                    color: var(--gold);
                }

                .form-options {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 28px;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .checkbox-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                }

                .custom-checkbox {
                    width: 20px;
                    height: 20px;
                    border-radius: 6px;
                    border: 1.5px solid rgba(255, 255, 255, 0.15);
                    background: rgba(255, 255, 255, 0.03);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .custom-checkbox.checked {
                    background: var(--primary);
                    border-color: var(--primary);
                }

                .custom-checkbox svg {
                    width: 12px;
                    height: 12px;
                    color: #fff;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .custom-checkbox.checked svg {
                    opacity: 1;
                }

                .checkbox-label {
                    font-size: 14px;
                    color: var(--text-muted);
                    user-select: none;
                }

                .forgot-link {
                    font-size: 14px;
                    color: var(--gold);
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.3s;
                }

                .forgot-link:hover {
                    color: var(--gold-dark);
                    text-decoration: underline;
                }

                .btn-submit {
                    width: 100%;
                    padding: 18px;
                    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                    color: #fff;
                    border: none;
                    border-radius: var(--radius-md);
                    font-size: 16px;
                    font-weight: 600;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: var(--transition);
                    font-family: 'Poppins', sans-serif;
                    box-shadow: 0 8px 24px var(--primary-glow);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    text-transform: uppercase;
                }

                .btn-submit:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px var(--primary-glow);
                }

                .btn-submit:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .divider {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin: 32px 0;
                    color: var(--text-muted);
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .divider::before, .divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.08);
                }

                .btn-google {
                    width: 100%;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1.5px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-md);
                    color: var(--text-light);
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                    font-family: 'Poppins', sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    text-decoration: none;
                }

                .btn-google:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }

                .register-prompt {
                    text-align: center;
                    margin-top: 32px;
                    font-size: 14px;
                    color: var(--text-muted);
                }

                .register-link {
                    color: var(--gold);
                    text-decoration: none;
                    font-weight: 600;
                    margin-left: 4px;
                    transition: color 0.3s;
                }

                .register-link:hover {
                    color: var(--gold-dark);
                    text-decoration: underline;
                }

                .back-home {
                    position: absolute;
                    top: 24px;
                    left: 24px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--text-muted);
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    padding: 8px 16px;
                    border-radius: var(--radius-full);
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    transition: var(--transition);
                    z-index: 10;
                    backdrop-filter: blur(8px);
                }

                .back-home:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-light);
                    transform: translateX(-4px);
                }

                /* Responsive */
                @media (max-width: 900px) {
                    .auth-card {
                        grid-template-columns: 1fr;
                        max-width: 500px;
                    }
                    .auth-branding {
                        padding: 40px 32px;
                        min-height: 300px;
                    }
                    .brand-title {
                        font-size: 36px;
                    }
                    .brand-stats {
                        gap: 24px;
                    }
                    .auth-form-wrapper {
                        padding: 40px 32px;
                    }
                }

                @media (max-width: 480px) {
                    .auth-container {
                        padding: 0;
                    }
                    .auth-card {
                        border-radius: 0;
                        border: none;
                        min-height: 100vh;
                    }
                    .auth-branding {
                        padding: 32px 24px;
                    }
                    .auth-form-wrapper {
                        padding: 32px 24px;
                    }
                    .form-options {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .back-home {
                        top: 12px;
                        left: 12px;
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .auth-card {
                    animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `;
            document.head.appendChild(style);
        }

        const linkId = 'dola-login-fonts';
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&family=Dancing+Script:wght@700&display=swap';
            document.head.appendChild(link);
        }

        return () => {
            const style = document.getElementById(styleId);
            if (style) document.head.removeChild(style);
            const link = document.getElementById(linkId);
            if (link) document.head.removeChild(link);
        };
    }, []);

    return (
        <>
            <Head title={t('logIn')} />
            
            <div className="auth-container">
                <div className="auth-bg-pattern"></div>
                
                <Link href="/" className="back-home">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    {t('backToHome')}
                </Link>

                <div className="auth-card">
                    {/* Left Side - Branding */}
                    <div className="auth-branding">
                        <Link href="/" className="brand-logo">
                            <span className="brand-logo-icon">🍔</span>
                            <div>
                                <span className="brand-logo-text">{t('signInTitle')}</span>
                              
                            </div>
                        </Link>

                        <div className="brand-content">
                            <div className="brand-badge">{t('premiumDining')}</div>
                            <h1 className="brand-title">{t('welcomeBack')}</h1>
                            <p className="brand-desc">
                                {t('loginDescription')}
                            </p>
                        </div>

                        <div className="brand-stats">
                            <div>
                                <div className="brand-stat-num">50+</div>
                                <div className="brand-stat-label">{t('menuItems')}</div>
                            </div>
                            <div>
                                <div className="brand-stat-num">15</div>
                                <div className="brand-stat-label">{t('yearsExp')}</div>
                            </div>
                            <div>
                                <div className="brand-stat-num">98%</div>
                                <div className="brand-stat-label">Happy Clients</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="auth-form-wrapper">
                        <div className="form-header">
                            <h2 className="form-title">{t('signInTitle')}</h2>
                            <p className="form-subtitle">{t('signInSubtitle')}</p>
                        </div>

                        {status && (
                            <div className="status-message">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="input-group">
                                <label className="input-label" htmlFor="email">{t('emailAddress')}</label>
                                <div className="input-wrapper">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="premium-input"
                                        placeholder="name@example.com"
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <span className="input-icon">✉️</span>
                                </div>
                                {errors.email && <div className="input-error">⚠️ {errors.email}</div>}
                            </div>

                            <div className="input-group">
                                <label className="input-label" htmlFor="password">{t('password')}</label>
                                <div className="input-wrapper">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className="premium-input"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <span className="input-icon">🔒</span>
                                    <button 
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                {errors.password && <div className="input-error">⚠️ {errors.password}</div>}
                            </div>

                            <div className="form-options">
                                <label className="checkbox-wrapper">
                                    <div 
                                        className={`custom-checkbox ${data.remember ? 'checked' : ''}`}
                                        onClick={() => setData('remember', !data.remember)}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    </div>
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        style={{ display: 'none' }}
                                    />
                                    <span className="checkbox-label">{t('rememberMe')}</span>
                                </label>

                                {canResetPassword && (
                                    <Link href={route('password.request')} className="forgot-link">
                                        {t('forgotPassword')}
                                    </Link>
                                )}
                            </div>

                            <button type="submit" className="btn-submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                                        </svg>
                                        {t('signingIn')}
                                    </>
                                ) : (
                                    <>
                                        {t('signIn')}
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="divider">{t('orContinueWith')}</div>

                        <a href={route('auth.google')} className="btn-google">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            {t('continueWithGoogle')}
                        </a>

                        <div className="register-prompt">
                            {t('dontHaveAccount')}
                            <Link href={route('register')} className="register-link">
                                {t('createAccount')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}