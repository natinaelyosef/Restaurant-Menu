import React from 'react';
import { Head } from '@inertiajs/react';

export default function Test() {
    return (
        <>
            <Head title="Test Page" />
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1 style={{ color: '#5b4cff' }}>React is Working! 🎉</h1>
                <p>If you can see this, React is rendering properly.</p>
            </div>
        </>
    );
}