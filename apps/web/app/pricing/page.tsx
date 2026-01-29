'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PricingPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '60vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>Simple Pricing</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Free for personal use. Affordable for professionals.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Current Plan</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
                            PrinceIO is currently in Beta and completely free to use. We believe in providing access to powerful tools without barriers during our development phase.
                        </p>
                        <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginTop: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Beta Access</h3>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0', color: '#6366f1' }}>$0<span style={{ fontSize: '1rem', color: '#94a3b8' }}>/mo</span></div>
                            <ul style={{ listStyle: 'none', color: '#94a3b8' }}>
                                <li>✓ Unlimited Sessions</li>
                                <li>✓ High Quality Streaming</li>
                                <li>✓ Community Support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
