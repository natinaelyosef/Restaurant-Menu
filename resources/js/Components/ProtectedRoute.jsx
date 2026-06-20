import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function ProtectedRoute({ children }) {
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        let mounted = true;

        const checkAuth = async () => {
            try {
                await axios.get('/auth/check');
                if (mounted) setChecking(false);
            } catch (e) {
                router.visit('/login', { replace: true });
            }
        };

        // Prevent back-button from navigating to cached protected pages by
        // pushing a history entry and intercepting popstate to re-check auth.
        window.history.pushState(null, '', window.location.href);
        const onPop = async () => {
            // keep user on the same page until we verify session
            window.history.pushState(null, '', window.location.href);
            try {
                await axios.get('/auth/check');
            } catch (err) {
                router.visit('/login', { replace: true });
            }
        };

        window.addEventListener('popstate', onPop);
        checkAuth();

        return () => {
            mounted = false;
            window.removeEventListener('popstate', onPop);
        };
    }, []);

    if (checking) return null;

    return children;
}
