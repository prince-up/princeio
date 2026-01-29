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
    { urls: 'stun:stun.relay.metered.ca:80' },
    {
      urls: 'turn:global.relay.metered.ca:80',
      username: 'a8cdc17c6b6dbe4db7a3f24c',
      credential: 'Ht9CFVE+1i1SY8DF'
    },
    {
      urls: 'turn:global.relay.metered.ca:80?transport=tcp',
      username: 'a8cdc17c6b6dbe4db7a3f24c',
      credential: 'Ht9CFVE+1i1SY8DF'
    },
    {
      urls: 'turn:global.relay.metered.ca:443',
      username: 'a8cdc17c6b6dbe4db7a3f24c',
      credential: 'Ht9CFVE+1i1SY8DF'
    },
    {
      urls: 'turns:global.relay.metered.ca:443?transport=tcp',
      username: 'a8cdc17c6b6dbe4db7a3f24c',
      credential: 'Ht9CFVE+1i1SY8DF'
    }
  ],
  iceCandidatePoolSize: 10,
};

export default function LandingPage() {
  const [view, setView] = useState<'landing' | 'session'>('landing');
  const [sessionCode, setSessionCode] = useState('');
  const [status, setStatus] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);

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
        console.log('Track received:', event.streams[0]);
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          // We rely on 'onPlaying' to clear the status, or the Force Play button
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

    // INPUT HANDLING - IMPROVED PRECISION
    const handleInput = (e: MouseEvent | KeyboardEvent) => {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0) return;

      const rect = video.getBoundingClientRect();
      const vidW = video.videoWidth;
      const vidH = video.videoHeight;
      const eventData: any = { type: e.type };

      // Calculate the actual displayed dimensions of the video content (accounting for object-fit: contain)
      const elementRatio = rect.width / rect.height;
      const videoRatio = vidW / vidH;

      let drawWidth = rect.width;
      let drawHeight = rect.height;
      let startX = 0;
      let startY = 0;

      if (elementRatio > videoRatio) {
        // Container is wider than video -> Pillars on sides
        drawWidth = rect.height * videoRatio;
        startX = (rect.width - drawWidth) / 2;
      } else {
        // Container is taller than video -> Letterbox on top/bottom
        drawHeight = rect.width / videoRatio;
        startY = (rect.height - drawHeight) / 2;
      }

      if (e instanceof MouseEvent) {
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        // Ignore clicks on black bars
        if (clientX < startX || clientX > startX + drawWidth ||
          clientY < startY || clientY > startY + drawHeight) {
          return;
        }

        // Map to video source coordinates
        eventData.x = (clientX - startX) * (vidW / drawWidth);
        eventData.y = (clientY - startY) * (vidH / drawHeight);
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (view === 'session') {
    return (
      <div
        ref={containerRef}
        className="group"
        style={{ position: 'fixed', inset: 0, background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onMouseMove={() => { setShowControls(true); setTimeout(() => setShowControls(false), 3000); }}
      >
        {/* Connection Status Overlay */}
        {status && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 border border-white/10 px-8 py-4 rounded-full text-white backdrop-blur-md z-50 flex items-center gap-3 shadow-2xl">
            <div className={`w-3 h-3 rounded-full ${status === 'Connected' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
            <span className="font-medium">{status}</span>
          </div>
        )}

        {/* Fallback for Black Screen / Buffering */}
        {!status && (!videoRef.current || videoRef.current.paused || videoRef.current.readyState < 3) && (
          <div className="absolute z-40 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-white/80 text-sm bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
              Buffering Stream... <br />
              <span className="text-xs text-white/50">Ensure Host App is running & not minimized</span>
            </div>
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.play().catch(e => alert(e.message));
                  setStatus('');
                }
              }}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs backdrop-blur-md transition-colors"
            >
              Force Play Video
            </button>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={() => {
            setStatus('');
            videoRef.current?.play().catch(() => setStatus('Click to start video'));
          }}
          onPlaying={() => setStatus('')}
          onWaiting={() => setStatus('Buffering...')}
          style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: showControls ? 'default' : 'none' }}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Control Bar */}
        <div
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-6 transition-all duration-300 z-50 shadow-2xl ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        >
          <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors flex flex-col items-center gap-1 group/btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
            <span className="text-[10px] opacity-0 group-hover/btn:opacity-100 transition-opacity absolute -top-6 bg-black px-2 py-1 rounded">Fullscreen</span>
          </button>

          <div className="w-px h-6 bg-white/10"></div>

          <button onClick={() => window.location.reload()} className="text-red-400 hover:text-red-300 transition-colors flex flex-col items-center gap-1 group/btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" x2="12" y1="2" y2="12" /></svg>
            <span className="text-[10px] opacity-0 group-hover/btn:opacity-100 transition-opacity absolute -top-6 bg-black px-2 py-1 rounded text-red-400">Disconnect</span>
          </button>
        </div>
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
