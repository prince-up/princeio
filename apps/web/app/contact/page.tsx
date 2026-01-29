'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ContactPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: '#020617', color: 'white' }}>
            <div className="bg-gradient-1"></div>
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto" style={{ minHeight: '60vh' }}>
                <h1 className="hero-title mb-8" style={{ fontSize: '3.5rem' }}>Contact Us</h1>
                <div className="glass-card">
                    <p className="text-gray-400 mb-6 text-lg" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8' }}>
                                <span style={{ width: '20px' }}>📞</span>
                                <span>7986614646</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8' }}>
                                <span style={{ width: '20px' }}>✉️</span>
                                <span>princeyadav76001@gmail.com</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="https://x.com/prince__up" target="_blank" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                Twitter / X
                            </a>
                            <a href="https://www.instagram.com/prince.yadav______/" target="_blank" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                Instagram
                            </a>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', maxWidth: '600px' }}>
                        <form className="space-y-4">
                            <div>
                                <label style={{ display: 'block', color: 'white', marginBottom: '0.5rem' }}>Name</label>
                                <input type="text" className="input-field" style={{ fontSize: '1rem', padding: '1rem', textAlign: 'left', textTransform: 'none' }} placeholder="Your Name" />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'white', marginBottom: '0.5rem' }}>Email</label>
                                <input type="email" className="input-field" style={{ fontSize: '1rem', padding: '1rem', textAlign: 'left', textTransform: 'none' }} placeholder="you@example.com" />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'white', marginBottom: '0.5rem' }}>Message</label>
                                <textarea className="input-field" style={{ fontSize: '1rem', padding: '1rem', textAlign: 'left', textTransform: 'none', minHeight: '150px' }} placeholder="How can we help?"></textarea>
                            </div>
                            <button type="button" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
