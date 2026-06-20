import axios from 'axios';
import { router } from '@inertiajs/react';

export async function logout() {
    try {
        // Call Laravel logout route; axios is configured to send cookies
        await axios.post('/logout');
    } catch (e) {
        // ignore errors: still clear client state
    }

    // Clear any client-side stored data
    try { localStorage.clear(); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}

    // Ensure history is replaced so Back cannot return to a protected page
    router.visit('/login', { replace: true });
}

export default { logout };
