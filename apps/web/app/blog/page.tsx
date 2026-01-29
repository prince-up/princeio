'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function BlogPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '60vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>Blog</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Latest news, updates, and technical deep dives from the PrinceIO team.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>Introducing PrinceIO 2.0</h2>
                            <div style={{ color: '#6366f1', fontSize: '0.9rem', marginBottom: '1rem' }}>January 24, 2026</div>
                            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                                We are thrilled to announce the release of PrinceIO 2.0, featuring a brand new UI, 60fps streaming, and improved security. Read on to learn more about the changes.
                            </p>
                            <div className="mt-4 text-indigo-400 hover:text-white cursor-pointer inline-block">Read more →</div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>How WebRTC Powers Low Latency</h2>
                            <div style={{ color: '#6366f1', fontSize: '0.9rem', marginBottom: '1rem' }}>December 15, 2025</div>
                            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                                A deep dive into the technology stack behind PrinceIO and how we achieve sub-50ms latency over the public internet.
                            </p>
                            <div className="mt-4 text-indigo-400 hover:text-white cursor-pointer inline-block">Read more →</div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
