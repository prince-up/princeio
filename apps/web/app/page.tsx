'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Chatbot from '../components/Chatbot';
import Footer from '../components/Footer';

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
        if (pc.connectionState === 'connected') setStatus('Connected');
        else if (pc.connectionState === 'failed') setStatus('Connection Failed (Try refreshing)');
        else if (pc.connectionState === 'disconnected') setStatus('Host Disconnected');
      };

      pc.ontrack = (event) => {
        setStatus('');
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          videoRef.current.play().catch(() => setStatus('Click screen to enable video'));
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) newSocket.emit('webrtc:ice', { sessionCode, candidate: event.candidate });
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
      if (!videoRef.current || videoRef.current.videoWidth === 0) return;
      const eventData: any = { type: e.type };

      if (e instanceof MouseEvent) {
        const rect = videoRef.current.getBoundingClientRect();
        const scaleX = videoRef.current.videoWidth / rect.width;
        const scaleY = videoRef.current.videoHeight / rect.height;
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
    };

    window.addEventListener('mousemove', handleInput);
    window.addEventListener('mousedown', handleInput);
    window.addEventListener('mouseup', handleInput);
    window.addEventListener('keydown', handleInput);
    window.addEventListener('keyup', handleInput);
  };

  if (view === 'session') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {status && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '50px', color: 'white', zIndex: 100 }}>
            {status}
          </div>
        )}
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'contain' }} onContextMenu={(e) => e.preventDefault()} />
        <button onClick={() => window.location.reload()} className="btn btn-secondary" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>Exit</button>
      </div>
    );
  }

  // --- COSMIC LANDING PAGE (Pure CSS Classes) ---
  return (
    <main>
      {/* Backgrounds */}
      <div className="bg-gradient-1"></div>
      <div className="bg-gradient-2"></div>

      {/* Navbar */}
      <nav>
        <div className="nav-glass">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>P</div>
            PrinceIO
          </div>
          <div className="flex gap-4" style={{ display: 'none' }}> {/* Hidden on mobile */}
            <a href="#" style={{ color: '#94a3b8' }}>Features</a>
            <a href="#" style={{ color: '#94a3b8' }}>Download</a>
          </div>
          <a href="https://drive.google.com/file/d/1LZt6c1lblyhxLXoJsv9CTAiUdDlu4Stk/view?usp=sharing" target="_blank" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Get App</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl px-6 py-20 flex flex-col-mobile items-center justify-between" style={{ minHeight: '80vh', display: 'flex', paddingTop: '150px' }}>

        <div style={{ flex: 1, maxWidth: '600px' }}>
          <div style={{ display: 'inline-block', padding: '5px 15px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', color: '#818cf8', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px' }}>
            ✨ PrinceIO v2.0 Live
          </div>
          <h1 className="hero-title">CONTROL<br />BEYOND<br />LIMITS.</h1>
          <p className="hero-subtitle">
            The fastest, most secure way to access your desktop from the web.
            <span style={{ color: 'white', fontWeight: 'bold' }}> 60 FPS. Zero Latency.</span>
          </p>
          <div className="flex gap-4 flex-col-mobile">
            <a href="https://drive.google.com/file/d/1LZt6c1lblyhxLXoJsv9CTAiUdDlu4Stk/view?usp=sharing" target="_blank" className="btn btn-primary">Download Host App</a>
            <a href="#features" className="btn btn-secondary">Learn More</a>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', width: '100%', marginTop: '50px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>Connect to Desktop</h3>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Enter the 6-character session code</p>

            <input
              type="text"
              className="input-field"
              placeholder="XYZ-123"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
              maxLength={8}
            />

            <button
              onClick={() => { if (sessionCode.length >= 6) setView('session'); }}
              disabled={sessionCode.length < 6}
              className="btn btn-primary w-full"
              style={{ width: '100%', opacity: sessionCode.length < 6 ? 0.5 : 1 }}
            >
              Connect Now
            </button>
          </div>
        </div>

      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl px-6 py-20">
        <div className="grid grid-cols-3">
          <div className="glass-card">
            <div className="icon-box">⚡</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Ultra Low Latency</h3>
            <p style={{ color: '#94a3b8' }}>Powered by WebRTC for instant frame delivery.</p>
          </div>
          <div className="glass-card">
            <div className="icon-box">🛡️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Bank-Grade Security</h3>
            <p style={{ color: '#94a3b8' }}>End-to-end encryption with ephemeral session keys.</p>
          </div>
          <div className="glass-card">
            <div className="icon-box">💎</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Crystal Clear 4K</h3>
            <p style={{ color: '#94a3b8' }}>Supports high-DPI displays with adaptive bitrate.</p>
          </div>
        </div>
      </section>

      <Footer />

      <Chatbot />
    </main>
  );
}
