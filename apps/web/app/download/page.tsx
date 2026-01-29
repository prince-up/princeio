'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function DownloadPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '60vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>Download PrinceIO</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Get the host application for your desktop.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Available Platforms</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
                            PrinceIO Host App is available for Windows, macOS, and Linux. Download the lightweight installer and start accessing your computer remotely in seconds.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <a href="https://drive.google.com/file/d/1LZt6c1lblyhxLXoJsv9CTAiUdDlu4Stk/view?usp=sharing" target="_blank" className="btn btn-primary">
                                Download for Windows
                            </a>
                            <button className="btn btn-secondary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                macOS (Coming Soon)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
