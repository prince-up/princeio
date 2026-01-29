'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CareersPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '60vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>Careers</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Join us in building the next generation of remote collaboration tools.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Open Positions</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: '1.6' }}>
                            We are always looking for talented individuals to join our team. If you are passionate about WebRTC, React, or distributed systems, we want to hear from you.
                        </p>

                        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Senior Full Stack Engineer</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.5rem 0' }}>Remote • Full Time</p>
                            <button className="btn btn-secondary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Apply Now</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
