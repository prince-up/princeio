'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function HelpCenterPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '60vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>Help Center</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Find answers to your questions and get the most out of PrinceIO.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Popular Topics</h2>
                        <ul className="space-y-4" style={{ color: '#94a3b8' }}>
                            <li style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem' }}>
                                <h4 style={{ color: 'white', fontWeight: 'bold' }}>How to connect?</h4>
                                <p>Download the host app, get your Session ID, and enter it on the website.</p>
                            </li>
                            <li style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem' }}>
                                <h4 style={{ color: 'white', fontWeight: 'bold' }}>Troubleshooting Connection</h4>
                                <p>Check your firewall settings and ensure you have a stable internet connection.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
