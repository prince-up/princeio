'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

// --- CONFIG ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://princeio-api.onrender.com';
const SIGNALING_URL = process.env.NEXT_PUBLIC_SIGNALING_URL || 'https://princeio.onrender.com';

export default function LandingPage() {
  const [view, setView] = useState<'landing' | 'session'>('landing');
  const [sessionCode, setSessionCode] = useState('');
  const [status, setStatus] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- SESSION LOGIC ---
  useEffect(() => {
    if (view === 'session' && !socket) {
      initSession();
    }
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [view]);

  const initSession = () => {
    setStatus('Connecting to Signaling Server...');
    const newSocket = io(SIGNALING_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setStatus('Joining session...');
      newSocket.emit('viewer:join', { sessionCode });
    });

    newSocket.on('session:error', ({ message }) => {
      alert('Error: ' + message);
      setView('landing');
      newSocket.disconnect();
    });

    newSocket.on('session:joined', () => {
      setStatus('Waiting for host stream...');
    });

    // WebRTC
    let pc: RTCPeerConnection;

    newSocket.on('webrtc:offer', async ({ sdp }) => {
      setStatus('Received Stream Offer...');
      pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

      pc.onconnectionstatechange = () => {
        const s = pc.connectionState;
        console.log('Connection State:', s);
        if (s === 'connected') setStatus('Connected (P2P Secured)');
        else if (s === 'utils') setStatus('Negotiating connection...');
        else if (s === 'failed') setStatus('P2P Connection Failed. Check Firewalls.');
      };

      pc.ontrack = (event) => {
        console.log('Track received:', event.streams[0]);
        setStatus(''); // Clear buffer status
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          // FORCE PLAY
          videoRef.current.play().catch(e => {
            console.error('Autoplay blocked:', e);
            setStatus('Click screen to play video');
          });
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          newSocket.emit('webrtc:ice', { sessionCode, candidate: event.candidate });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      newSocket.emit('webrtc:answer', { sessionCode, sdp: answer });
    });

    newSocket.on('webrtc:ice', async (candidate) => {
      if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    // INPUT HANDLING (Mouse/Keyboard)
    const handleInput = (e: MouseEvent | KeyboardEvent) => {
      // Only send input if we are in the session view
      const eventData: any = { type: e.type };

      if (e instanceof MouseEvent && videoRef.current) {
        const rect = videoRef.current.getBoundingClientRect();
        const scaleX = videoRef.current.videoWidth / rect.width;
        const scaleY = videoRef.current.videoHeight / rect.height;

        // If video isn't playing yet, ignore
        if (!videoRef.current.videoWidth) return;

        eventData.x = (e.clientX - rect.left) * scaleX;
        eventData.y = (e.clientY - rect.top) * scaleY;
        eventData.button = e.button === 0 ? 'left' : e.button === 2 ? 'right' : 'middle';
      }

      if (e instanceof KeyboardEvent) {
        eventData.key = e.key;
        eventData.keyCode = e.keyCode;
        eventData.modifiers = [];
        if (e.ctrlKey) eventData.modifiers.push('control');
        if (e.shiftKey) eventData.modifiers.push('shift');
        if (e.altKey) eventData.modifiers.push('alt');
      }

      newSocket.emit('control:event', { sessionCode, event: eventData });

      // Prevent default behavior for some keys/clicks to avoid browser actions
      if (e.type !== 'mousemove' && e.type !== 'keyup') {
        // e.preventDefault(); // Optional: careful not to block ESC
      }
    };

    // Attach listeners to window for broad capture
    window.addEventListener('mousemove', handleInput);
    window.addEventListener('mousedown', handleInput);
    window.addEventListener('mouseup', handleInput);
    window.addEventListener('keydown', handleInput);
    window.addEventListener('keyup', handleInput);

    return () => {
      // Cleanup if needed
    };
  };

  if (view === 'session') {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
        {/* Status Overlay */}
        {status && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 backdrop-blur-md">
            <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_#facc15]" />
            <span className="font-mono text-sm tracking-wide">{status}</span>
          </div>
        )}

        {/* Remote Video Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain cursor-none pointer-events-none"
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Instructions */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-mono pointer-events-none">
          Click to interact • ESC to exit
        </div>

        <button
          onClick={() => window.location.reload()}
          className="absolute top-6 right-6 bg-red-600/80 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold z-50 backdrop-blur-sm transition-all shadow-lg hover:shadow-red-600/20"
        >
          Exit Session
        </button>
      </div>
    );
  }

  // --- LANDING PAGE ---
  return (
    <main className="min-h-screen bg-[#0F172A] selection:bg-indigo-500/30 selection:text-indigo-200 font-sans overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none opacity-50" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Now available for Windows
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              Instant Remote <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Desktop Control</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Access your computer from anywhere using just a web browser. No installation required for the viewer.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a href="#download" className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10 w-full sm:w-auto">
                Download Host App
              </a>
              <a href="#features" className="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold hover:bg-slate-700 transition-colors w-full sm:w-auto">
                Learn More
              </a>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Join a Session</h3>
                <p className="text-slate-400 text-sm">Enter the code provided by the host</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Session Code</label>
                  <input
                    type="text"
                    placeholder="123-456"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-center text-2xl font-mono text-white tracking-widest focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  />
                </div>
                <button
                  onClick={() => { if (sessionCode.length >= 6) setView('session'); }}
                  disabled={sessionCode.length < 6}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>Connect Now</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Zero Install Viewer", desc: "Access from any browser immediately.", icon: "⚡" },
              { title: "High Performance", desc: "Low latency WebRTC streaming.", icon: "🚀" },
              { title: "Secure Access", desc: "End-to-End Encrypted sessions.", icon: "🔒" }
            ].map((f, i) => (
              <div key={i} className="bg-slate-800/50 border border-white/5 p-8 rounded-2xl hover:bg-slate-800 transition-colors">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD */}
      <section id="download" className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to start hosting?</h2>
            <a
              href="https://drive.google.com/file/d/1LZt6c1lblyhxLXoJsv9CTAiUdDlu4Stk/view?usp=sharing"
              target="_blank"
              className="inline-flex items-center gap-3 bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-transform hover:scale-105 shadow-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4 4m4 4V4" /></svg>
              Download for Windows (x64)
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  );
}
