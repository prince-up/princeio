import Link from 'next/link';

export default function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-col">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', fontWeight: 'bold' }}>
                        <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '6px', textAlign: 'center', lineHeight: '24px', fontSize: '14px', color: 'white' }}>P</div>
                        <span style={{ color: 'white' }}>PrinceIO</span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        The next generation of remote desktop control. Fast, secure, and beautiful.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <a href="https://x.com/prince__up" target="_blank" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </a>
                        <a href="https://www.instagram.com/prince.yadav______/" target="_blank" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                        </a>
                    </div>
                </div>

                <div className="footer-col">
                    <h4>Product</h4>
                    <ul>
                        <li><Link href="/features">Features</Link></li>
                        <li><Link href="/security">Security</Link></li>
                        <li><Link href="/download">Download</Link></li>
                        <li><Link href="/pricing">Pricing</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Resources</h4>
                    <ul>
                        <li><Link href="/help-center">Help Center</Link></li>
                        <li><Link href="/api-docs">API Docs</Link></li>
                        <li><Link href="/community">Community</Link></li>
                        <li><Link href="/status">Status</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Company</h4>
                    <ul>
                        <li><Link href="/about">About</Link></li>
                        <li><Link href="/blog">Blog</Link></li>
                        <li><Link href="/careers">Careers</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                    </ul>
                </div>
            </div>

            <div className="copyright">
                &copy; {new Date().getFullYear()} PrinceIO. All rights reserved.
            </div>
        </footer>
    );
}
