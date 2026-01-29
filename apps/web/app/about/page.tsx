'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AboutPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '60vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>About Us</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Our mission is to redefine remote work with speed, security, and simplicity.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Our Story</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
                            PrinceIO started with a simple idea: remote control shouldn't feel remote. We were frustrated with laggy, insecure, and clunky solutions, so we built something better using modern web technologies.
                        </p>
                        <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
                            We are a small, passionate team of engineers and designers dedicated to pushing the boundaries of what's possible in the browser.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
