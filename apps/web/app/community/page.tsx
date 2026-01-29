'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CommunityPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '60vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>Community</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Join the conversation with other PrinceIO users.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Discord & Forums</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
                            We have an active community on Discord where you can ask questions, share feedback, and chat with other users.
                        </p>
                        <button className="btn btn-primary">Join Discord</button>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
