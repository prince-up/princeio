'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    // Helper to check active state if we wanted to style active links differently
    const isActive = (path: string) => pathname === path;

    return (
        <nav>
            <div className="nav-glass">
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>
                    <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>P</div>
                    PrinceIO
                </Link>

                {/* Links - Hidden on mobile in the original design, but we can make them visible on larger screens if we had media queries. 
                    For now, following the 'nav-glass' structure which uses flex justify-between. 
                    We'll insert a middle section for links. */}
                <div className="flex gap-4" style={{ display: 'flex', gap: '2rem' }}>
                    <Link href="/features" style={{ color: isActive('/features') ? 'white' : '#94a3b8' }}>Features</Link>
                    <Link href="/pricing" style={{ color: isActive('/pricing') ? 'white' : '#94a3b8' }}>Pricing</Link>
                    <Link href="/download" style={{ color: isActive('/download') ? 'white' : '#94a3b8' }}>Download</Link>
                    <Link href="/about" style={{ color: isActive('/about') ? 'white' : '#94a3b8' }}>About</Link>
                    <Link href="/contact" style={{ color: isActive('/contact') ? 'white' : '#94a3b8' }}>Contact</Link>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <Link href="/help-center" style={{ color: '#94a3b8', fontSize: '0.9rem', marginRight: '1rem' }}>
                        Help
                    </Link>
                    <a href="https://drive.google.com/file/d/1LZt6c1lblyhxLXoJsv9CTAiUdDlu4Stk/view?usp=sharing" target="_blank" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        Get App
                    </a>
                </div>
            </div>
        </nav>
    );
}
