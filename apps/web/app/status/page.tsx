'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function StatusPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '60vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>System Status</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Real-time updates on system performance and availability.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px', color: '#4ade80' }}>
                            <div style={{ width: '12px', height: '12px', background: '#4ade80', borderRadius: '50%' }}></div>
                            <strong>All Systems Operational</strong>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <span style={{ color: 'white' }}>API Server</span>
                                <span style={{ color: '#4ade80' }}>Operational</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <span style={{ color: 'white' }}>Signaling Server</span>
                                <span style={{ color: '#4ade80' }}>Operational</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
                                <span style={{ color: 'white' }}>Web Client</span>
                                <span style={{ color: '#4ade80' }}>Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
