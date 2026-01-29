'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function FeaturesPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '60vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>Powerful Features</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Experience the next level of remote desktop control with our cutting-edge technology.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Overview</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
                            PrinceIO offers ultra-low latency, 60fps streaming, and secure end-to-end encryption. Our platform allows you to access your desktop from anywhere in the world, on any device, right from your browser.
                        </p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#94a3b8' }}>
                            <li style={{ marginBottom: '0.5rem' }}>WebRTC powered streaming</li>
                            <li style={{ marginBottom: '0.5rem' }}>No installation required on client</li>
                            <li style={{ marginBottom: '0.5rem' }}>Support for 4K displays</li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
