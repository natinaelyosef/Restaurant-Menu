import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            replace: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    useEffect(() => {
        const styleId = 'dola-auth-styles';
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
                        radial-gradient(circle at 80% 80%, rgba(230, 57, 70, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 20% 20%, rgba(255, 183, 3, 0.08) 0%, transparent 50%),
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
                    max-width: 480px;
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

                .auth-form-wrapper {
                    padding: 48px 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    background: rgba(18, 18, 18, 0.95);
                }

                .form-brand {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    text-decoration: none;
                    margin-bottom: 32px;
                }

                .form-brand-icon { font-size: 36px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4)); }

                .form-brand-text {
                    font-family: 'Playfair Display', serif;
                    font-size: 28px;
                    font-weight: 900;
                    color: var(--gold);
                    letter-spacing: 0.5px;
                }

                .form-brand-sub {
                    font-size: 9px;
                    color: var(--text-muted);
                    letter-spacing: 4px;
                    text-transform: uppercase;
                    display: block;
                    margin-top: -2px;
                }

                .form-header { margin-bottom: 28px; text-align: center; }

                .form-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 30px;
                    font-weight: 900;
                    color: var(--text-light);
                    margin-bottom: 8px;
                }

                .form-subtitle { color: var(--text-muted); font-size: 14px; }

                .input-group { margin-bottom: 16px; }

                .input-label {
                    display: block;
                    font-size: 12px;
                    color: var(--text-muted);
                    margin-bottom: 6px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 500;
                }

                .input-wrapper { position: relative; }

                .input-icon {
                    position: absolute;
                    left: 18px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    font-size: 16px;
                    pointer-events: none;
                    transition: color 0.3s;
                }

                .premium-input {
                    width: 100%;
                    padding: 14px 20px 14px 48px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1.5px solid rgba(255, 255, 255, 0.08);
                    border-radius: var(--radius-md);
                    color: var(--text-light);
                    font-size: 14px;
                    font-family: 'Poppins', sans-serif;
                    transition: var(--transition);
                    outline: none;
                }

                .premium-input::placeholder { color: var(--text-muted); opacity: 0.6; }

                .premium-input:focus {
                    border-color: var(--gold);
                    background: rgba(255, 183, 3, 0.03);
                    box-shadow: 0 0 0 4px rgba(255, 183, 3, 0.1);
                }

                .premium-input:focus ~ .input-icon { color: var(--gold); }

                .input-error {
                    color: var(--primary);
                    font-size: 12px;
                    margin-top: 4px;
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
                    font-size: 16px;
                    padding: 4px;
                    transition: color 0.3s;
                }

                .password-toggle:hover { color: var(--gold); }

                .btn-submit {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                    color: #fff;
                    border: none;
                    border-radius: var(--radius-md);
                    font-size: 15px;
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
                    margin-top: 8px;
                }

                .btn-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px var(--primary-glow);
                }

                .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

                .divider {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin: 24px 0;
                    color: var(--text-muted);
                    font-size: 12px;
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
                    padding: 14px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1.5px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-md);
                    color: var(--text-light);
                    font-size: 14px;
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

                .login-prompt {
                    text-align: center;
                    margin-top: 24px;
                    font-size: 13px;
                    color: var(--text-muted);
                }

                .login-link {
                    color: var(--gold);
                    text-decoration: none;
                    font-weight: 600;
                    margin-left: 4px;
                    transition: color 0.3s;
                }

                .login-link:hover { color: var(--gold-dark); text-decoration: underline; }

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

                @media (max-width: 520px) {
                    .auth-container { padding: 0; }
                    .auth-card { border-radius: 0; border: none; min-height: 100vh; }
                    .auth-form-wrapper { padding: 32px 24px; }
                    .back-home { top: 12px; left: 12px; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .auth-card { animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
            `;
            document.head.appendChild(style);
        }

        const linkId = 'dola-auth-fonts';
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
            <Head title="Register" />
            
            <div className="auth-container">
                <div className="auth-bg-pattern"></div>
                
                <Link href="/" className="back-home">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Home
                </Link>

                <div className="auth-card">
                    <div className="auth-form-wrapper">
                        <Link href="/" className="form-brand">
                            <span className="form-brand-icon">🍔</span>
                            
                        </Link>

                        <div className="form-header">
                            <h2 className="form-title">Create Account</h2>
                            <p className="form-subtitle">Fill in your details to get started</p>
                        </div>

                        <form onSubmit={submit}>
                            <div className="input-group">
                                <label className="input-label" htmlFor="name">Full Name</label>
                                <div className="input-wrapper">
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="premium-input"
                                        placeholder="John Doe"
                                        autoComplete="name"
                                        autoFocus
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <span className="input-icon">👤</span>
                                </div>
                                {errors.name && <div className="input-error">⚠️ {errors.name}</div>}
                            </div>

                            <div className="input-group">
                                <label className="input-label" htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="premium-input"
                                        placeholder="name@example.com"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <span className="input-icon">✉️</span>
                                </div>
                                {errors.email && <div className="input-error">⚠️ {errors.email}</div>}
                            </div>

                            <div className="input-group">
                                <label className="input-label" htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className="premium-input"
                                        placeholder="Create a strong password"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
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

                            <div className="input-group">
                                <label className="input-label" htmlFor="password_confirmation">Confirm Password</label>
                                <div className="input-wrapper">
                                    <input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="premium-input"
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <span className="input-icon">🔒</span>
                                    <button 
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                {errors.password_confirmation && <div className="input-error">⚠️ {errors.password_confirmation}</div>}
                            </div>

                            <button type="submit" className="btn-submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="divider">Or register with</div>

                        <a href={route('auth.google')} className="btn-google">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </a>

                        <div className="login-prompt">
                            Already have an account?
                            <Link href={route('login')} className="login-link">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}