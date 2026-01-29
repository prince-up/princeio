export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand */}
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-xs">P</span>
                        </div>
                        <span className="text-lg font-bold text-white">PrinceIO</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        The next generation of remote desktop control. Fast, secure, and easy to use.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-indigo-400">Features</a></li>
                        <li><a href="#" className="hover:text-indigo-400">Pricing</a></li>
                        <li><a href="#" className="hover:text-indigo-400">Download</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-4">Support</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><a href="/guidelines" className="hover:text-indigo-400">Guidelines</a></li>
                        <li><a href="#" className="hover:text-indigo-400">Status</a></li>
                        <li><a href="#" className="hover:text-indigo-400">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-indigo-400">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-indigo-400">Terms of Service</a></li>
                    </ul>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} PrinceIO. All rights reserved.
            </div>
        </footer>
    );
}
