'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Guidelines() {
    return (
        <main className="bg-[#0F172A] min-h-screen text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">User Guidelines</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Everything you need to know about setting up and using PrinceIO for seamless remote control.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 pb-20">
                <div className="space-y-12">

                    {/* Section 1 */}
                    <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 font-bold shrink-0">1</div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Installation & Setup</h2>
                                <p className="mb-4">
                                    To host a session, you must install the PrinceIO Desktop App on the computer you wish to control.
                                </p>
                                <ul className="space-y-3 list-disc pl-5 text-slate-400">
                                    <li>Download the installer from the homepage ("Get App").</li>
                                    <li>Run <code>princeio.exe</code> (Windows) or the appropriate package for your OS.</li>
                                    <li>If prompted by Windows Defender/SmartScreen, click <strong>"More info"</strong> and then <strong>"Run anyway"</strong> (until we sign our certificate).</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-400 font-bold shrink-0">2</div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Starting a Session</h2>
                                <p className="mb-4">
                                    Once installed, follow these steps to start sharing your screen:
                                </p>
                                <ol className="space-y-4 text-slate-400">
                                    <li className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                                        <strong className="text-white block mb-1">Step 1: Log In</strong>
                                        Create a free account using your email. You only need to do this once.
                                    </li>
                                    <li className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                                        <strong className="text-white block mb-1">Step 2: Choose Permissions</strong>
                                        Select <strong>"Full Control"</strong> if you want the remote user to control your mouse/keyboard, or "View Only" for presentation mode.
                                    </li>
                                    <li className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                                        <strong className="text-white block mb-1">Step 3: Share Code</strong>
                                        Copy the generated <strong>6-digit Session Code</strong> and send it to your partner.
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center text-cyan-400 font-bold shrink-0">3</div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Connecting as a Viewer</h2>
                                <p className="mb-4">
                                    To control a computer, you don't need to install anything! Just use our web app.
                                </p>
                                <ul className="space-y-3 list-disc pl-5 text-slate-400">
                                    <li>Go to the PrinceIO Homepage.</li>
                                    <li>Enter the <strong>Session Code</strong> in the "Join Session" box.</li>
                                    <li>Click "Connect".</li>
                                    <li>Use your mouse and keyboard normally to control the remote device.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Troubleshooting */}
                    <section className="p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Troubleshooting</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-800/30 p-6 rounded-xl border border-white/5">
                                <h3 className="font-bold text-white mb-2">Mouse not moving?</h3>
                                <p className="text-sm">Ensure the Host selected "Full Control" when creating the session. Also, ensure PrinceIO is running as Administrator on Windows.</p>
                            </div>
                            <div className="bg-slate-800/30 p-6 rounded-xl border border-white/5">
                                <h3 className="font-bold text-white mb-2">Connection failed?</h3>
                                <p className="text-sm">Check internet connection on both ends. Refresh the page and generate a new code if necessary.</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>

            <Footer />
        </main>
    );
}
