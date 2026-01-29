'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function FeaturesPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '80vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>Powerful Features</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Experience the next level of remote desktop control with our cutting-edge technology.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Core Technologies</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6366f1', marginBottom: '0.5rem' }}>WebRTC Streaming</h3>
                                    <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                                        Built on standard WebRTC protocols, PrinceIO delivers peer-to-peer streaming with sub-50ms latency. No intermediate relays means faster response times and better privacy.
                                    </p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#a855f7', marginBottom: '0.5rem' }}>Adaptive Bitrate</h3>
                                    <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                                        Our intelligent streaming engine dynamically adjusts quality based on your network conditions, ensuring a smooth connection even on unstable cellular networks.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>For Professionals</h2>
                            <ul className="space-y-4">
                                <li style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                                    <span style={{ color: '#4ade80', fontSize: '1.2rem' }}>✓</span>
                                    <div>
                                        <strong style={{ color: 'white', display: 'block', marginBottom: '0.2rem' }}>4K & Multi-Monitor Support</strong>
                                        <p style={{ color: '#94a3b8' }}>Stream up to 4K resolution at 60fps. Seamlessly switch between multiple monitors on the host machine.</p>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                                    <span style={{ color: '#4ade80', fontSize: '1.2rem' }}>✓</span>
                                    <div>
                                        <strong style={{ color: 'white', display: 'block', marginBottom: '0.2rem' }}>File Transfer (Beta)</strong>
                                        <p style={{ color: '#94a3b8' }}>Drag and drop files directly between your local and remote machine. Secure, fast, and resume-supported.</p>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                                    <span style={{ color: '#4ade80', fontSize: '1.2rem' }}>✓</span>
                                    <div>
                                        <strong style={{ color: 'white', display: 'block', marginBottom: '0.2rem' }}>Wake-on-LAN</strong>
                                        <p style={{ color: '#94a3b8' }}>Turn on your remote computer from anywhere using our Wake-on-LAN magic packet service.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
