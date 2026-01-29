'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

// --- CONFIG ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://princeio-api.onrender.com';
const SIGNALING_URL = process.env.NEXT_PUBLIC_SIGNALING_URL || 'https://princeio.onrender.com';

// ROBUST ICE SERVERS
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
};

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
  }, [view]);

  const initSession = () => {
    setStatus('Connecting to Server...');
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
      setStatus('Waiting for Host Stream...');
    });

    let pc: RTCPeerConnection;

    newSocket.on('webrtc:offer', async ({ sdp }) => {
      setStatus('Negotiating Connection...');
      pc = new RTCPeerConnection(ICE_SERVERS);

      pc.onconnectionstatechange = () => {
        console.log('Connection State:', pc.connectionState);
        if (pc.connectionState === 'connected') setStatus('Connected');
        else if (pc.connectionState === 'failed') setStatus('Connection Failed (Try refreshing)');
        else if (pc.connectionState === 'disconnected') setStatus('Host Disconnected');
      };

      pc.ontrack = (event) => {
        console.log('Stream Received:', event.streams[0]);
        setStatus('');
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log('Auto-play blocked:', error);
              setStatus('Click screen to enable video');
            });
          }
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

    // INPUT HANDLING
    const handleInput = (e: MouseEvent | KeyboardEvent) => {
      if (!videoRef.current) return;
      const eventData: any = { type: e.type };

      if (e instanceof MouseEvent) {
        const rect = videoRef.current.getBoundingClientRect();
        const scaleX = videoRef.current.videoWidth / rect.width;
        const scaleY = videoRef.current.videoHeight / rect.height;

        if (videoRef.current.videoWidth === 0) return; // Wait for video

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

      // Rate limit mousemove slightly could be good, but raw for now
      newSocket.emit('control:event', { sessionCode, event: eventData });

      // Prevent default to avoid scrolling/selecting
      if (e.type !== 'mousemove' && e.type !== 'keyup') {
        // e.preventDefault(); 
      }
    };

    window.addEventListener('mousemove', handleInput);
    window.addEventListener('mousedown', handleInput);
    window.addEventListener('mouseup', handleInput);
    window.addEventListener('keydown', handleInput);
    window.addEventListener('keyup', handleInput);
  };

  if (view === 'session') {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
        {status && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-50">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full text-white border border-white/10 shadow-2xl">
              {status}
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain cursor-none"
          onContextMenu={(e) => e.preventDefault()}
        />

        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold backdrop-blur-md transition-all"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  // --- COSMIC LANDING PAGE ---
  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden selection:bg-indigo-500/30">
      <Navbar />

      {/* ANIMATED BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* HERO */}
      <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">

          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-semibold mb-8 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              PrinceIO v2.0 Live
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]">
              CONTROL<br />BEYOND<br />LIMITS.
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              The fastest, most secure way to access your desktop from the web.
              <span className="text-white font-semibold"> 60 FPS. Zero Latency.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a href="https://drive.google.com/file/d/1LZt6c1lblyhxLXoJsv9CTAiUdDlu4Stk/view?usp=sharing" target="_blank" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group">
                <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download Host App
              </a>
              <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-colors backdrop-blur-sm">
                How it works
              </a>
            </div>
          </div>

          {/* Right Card */}
          <div className="relative w-full max-w-md group">
            <div className="absolute -inset-[2px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-tilt"></div>
            <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Connect to Desktop</h3>
                <p className="text-slate-400">Enter the 6-character session code</p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="XYZ-123"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-5 text-center text-3xl font-mono text-white tracking-[0.2em] focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-700 uppercase"
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                    maxLength={8}
                  />
                </div>

                <button
                  onClick={() => { if (sessionCode.length >= 6) setView('session'); }}
                  disabled={sessionCode.length < 6}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 text-lg"
                >
                  <span>Connect Now</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="relative z-10 py-24 bg-black/40 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Ultra Low Latency", desc: "Powered by WebRTC for instant frame delivery.", icon: "⚡", color: "text-yellow-400" },
              { title: "Bank-Grade Security", desc: "End-to-end encryption with ephemeral session keys.", icon: "🛡️", color: "text-emerald-400" },
              { title: "Crystal Clear 4K", desc: "Supports high-DPI displays with adaptive bitrate.", icon: "💎", color: "text-cyan-400" }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-default">
                <div className={`text-4xl mb-4 transform group-hover:scale-110 transition-transform ${f.color}`}>{f.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  );
}
