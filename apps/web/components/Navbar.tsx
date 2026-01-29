'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path ? 'text-white font-bold' : 'text-gray-400 hover:text-white';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="bg-[#1E293B]/80 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl pointer-events-auto">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            PrinceIO
                        </span>
                    </div>

                    {/* Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className={`transition-colors text-sm ${isActive('/')}`}>
                            Product
                        </Link>
                        <Link href="/guidelines" className={`transition-colors text-sm ${isActive('/guidelines')}`}>
                            Guidelines
                        </Link>
                        <a href="#features" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Features
                        </a>
                        <a href="#download" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Download
                        </a>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-4">
                        <Link href="/guidelines" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Help Center
                        </Link>
                        <a href="https://drive.google.com/file/d/1LZt6c1lblyhxLXoJsv9CTAiUdDlu4Stk/view?usp=sharing" target="_blank"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20">
                            Get App
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
