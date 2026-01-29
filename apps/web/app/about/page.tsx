'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AboutPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '80vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>About Us</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Our mission is to redefine remote work with speed, security, and simplicity.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <section className="mb-12">
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>Our Story</h2>
                            <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.8' }}>
                                PrinceIO was born out of frustration. As developers working remotely, we were tired of existing remote desktop solutions that were either clunky, insecure, or prohibitively expensive. We asked ourselves: "Why can't remote desktop be as smooth as streaming a YouTube video?"
                            </p>
                            <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.8' }}>
                                Utilizing the power of modern WebRTC standards, we built PrinceIO from the ground up to minimize overhead and maximize performance. What started as a weekend project has now evolved into a robust platform used by professionals worldwide.
                            </p>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Our Core Values</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-slate-800/50 rounded-xl border border-white/5">
                                    <div className="text-2xl mb-2">🚀</div>
                                    <h3 className="text-white font-bold mb-2">Speed First</h3>
                                    <p className="text-slate-400 text-sm">We obsess over milliseconds. If it adds latency, we remove it.</p>
                                </div>
                                <div className="p-6 bg-slate-800/50 rounded-xl border border-white/5">
                                    <div className="text-2xl mb-2">🛡️</div>
                                    <h3 className="text-white font-bold mb-2">Privacy by Design</h3>
                                    <p className="text-slate-400 text-sm">Your screen is yours. We build architecture that guarantees we can't see it.</p>
                                </div>
                                <div className="p-6 bg-slate-800/50 rounded-xl border border-white/5">
                                    <div className="text-2xl mb-2">🤝</div>
                                    <h3 className="text-white font-bold mb-2">Community Driven</h3>
                                    <p className="text-slate-400 text-sm">We build what our users need, not what looks good in a pitch deck.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
