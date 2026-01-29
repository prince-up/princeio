'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SecurityPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '80vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>Bank-Grade Security</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Your data is safe with us. Learn about our advanced security protocols.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">End-to-End Encryption</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Every frame and input event is encrypted using DTLS-SRTP with AES-256 keys. The keys are negotiated directly between peers and are never known to our signaling servers.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">Zero Knowledge Architecture</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    We don't store your passwords or session data. Our servers only facilitate the initial handshake (signaling). Once connected, the data flows directly between devices.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/10">
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Security Protocol Stack</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                    <span className="text-white font-medium">Session Handshake</span>
                                    <span className="text-indigo-400 font-mono text-sm">TLS 1.3 / WSS</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                    <span className="text-white font-medium">Video Encryption</span>
                                    <span className="text-indigo-400 font-mono text-sm">SRTP (AES-256)</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                    <span className="text-white font-medium">Key Exchange</span>
                                    <span className="text-indigo-400 font-mono text-sm">ECDH (P-256)</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                    <span className="text-white font-medium">Authentication</span>
                                    <span className="text-indigo-400 font-mono text-sm">HMAC-SHA256</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center text-slate-500 text-sm">
                            <p>For security whitepapers or audit reports, please contact security@princeio.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
