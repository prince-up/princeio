'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ApiDocsPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '60vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>API Documentation</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        integrate PrinceIO capabilities into your own applications.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Rest API</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
                            Our API allows you to manage sessions, users, and organization settings programmatically. Full documentation is currently being generated.
                        </p>

                        <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', color: '#e2e8f0', border: '1px solid #334155' }}>
                            GET /api/v1/sessions<br />
                            POST /api/v1/connect
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
