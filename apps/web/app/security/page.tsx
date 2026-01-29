'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SecurityPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '60vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>Bank-Grade Security</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Your data is safe with us. Learn about our advanced security protocols.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>End-to-End Encryption</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
                            We use WebRTC for peer-to-peer connections, meaning your data goes directly from host to client. All sessions are encrypted with DTLS and SRTP. We do not store any session data on our servers.
                        </p>
                        <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
                            Session keys are ephemeral and generated for each connection, ensuring that even if a key is compromised, past and future sessions remain secure.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
