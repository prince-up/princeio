"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const SIGNALING_URL = process.env.NEXT_PUBLIC_SIGNALING_URL ?? "http://localhost:4100";

type Role = "host" | "viewer" | "";
type IceServer = { urls: string[]; username?: string; credential?: string };
type ChatMessage = { sender: string; message: string; timestamp: number };

export default function Home() {
  const [role, setRole] = useState<Role>("");
  const [sessionCode, setSessionCode] = useState("");
  const [permission, setPermission] = useState<"view" | "control">("view");
  const [status, setStatus] = useState("idle");
  const [iceServers, setIceServers] = useState<IceServer[]>([
    { urls: ["stun:stun.l.google.com:19302"] }
  ]);
  const [log, setLog] = useState<string[]>([]);

  // New feature states
  const [sessionPassword, setSessionPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotationTool, setAnnotationTool] = useState("pen");
  const [annotationColor, setAnnotationColor] = useState("#6366F1");

  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const makingOfferRef = useRef(false);
  const roleRef = useRef<Role>("");
  const sessionCodeRef = useRef("");
  const iceCandidateQueueRef = useRef<RTCIceCandidateInit[]>([]);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const addLog = (message: string) => {
    setLog((prev) => [message, ...prev].slice(0, 8));
  };

  const connectSocket = () => {
    if (socketRef.current) return socketRef.current;
    const socket = io(SIGNALING_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", async () => {
      if (roleRef.current === "host" && pcRef.current && !pcRef.current.localDescription) {
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);
        socket.emit("webrtc:offer", { sessionCode: sessionCodeRef.current, sdp: offer });
      }
    });

    socket.on("webrtc:offer", async ({ sdp }) => {
      if (roleRef.current !== "viewer") return;
      const pc = pcRef.current ?? setupPeerConnection(iceServers);
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));

      while (iceCandidateQueueRef.current.length > 0) {
        const candidate = iceCandidateQueueRef.current.shift();
        if (candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtc:answer", { sessionCode: sessionCodeRef.current, sdp: answer });
    });

    socket.on("webrtc:answer", async ({ sdp }) => {
      if (roleRef.current !== "host") return;
      const pc = pcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));

      while (iceCandidateQueueRef.current.length > 0) {
        const candidate = iceCandidateQueueRef.current.shift();
        if (candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      }
    });

    socket.on("webrtc:ice", async ({ candidate }) => {
      const pc = pcRef.current;
      if (!pc || !candidate) return;

      if (!pc.remoteDescription) {
        iceCandidateQueueRef.current.push(candidate);
        return;
      }

      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        addLog(`ICE candidate error: ${(error as Error).message}`);
      }
    });

    socket.on("viewer:joined", async () => {
      if (roleRef.current !== "host") return;
      const pc = pcRef.current;
      if (!pc) return;

      if (makingOfferRef.current) return;
      try {
        makingOfferRef.current = true;
        const offer = await pc.createOffer({ iceRestart: true });
        await pc.setLocalDescription(offer);
        socket.emit("webrtc:offer", { sessionCode: sessionCodeRef.current, sdp: offer });
      } catch (err) {
        console.error("Error handling viewer join:", err);
      } finally {
        makingOfferRef.current = false;
      }
    });

    socket.on("session:terminated", () => {
      addLog("Session terminated");
      setStatus("terminated");
      cleanup();
    });

    // Chat events
    socket.on("chat:message", ({ message, sender, timestamp }) => {
      setChatMessages(prev => [...prev, { message, sender, timestamp }]);
    });

    // Annotation events
    socket.on("annotation:draw", (data) => {
      drawOnCanvas(data);
    });

    socket.on("annotation:clear", () => {
      clearCanvas();
    });

    return socket;
  };

  const setupPeerConnection = (servers: IceServer[]) => {
    const pc = new RTCPeerConnection({ iceServers: servers });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("webrtc:ice", {
          sessionCode: sessionCodeRef.current,
          candidate: event.candidate
        });
      }
    };

    if (roleRef.current === "host") {
      pc.onnegotiationneeded = async () => {
        if (makingOfferRef.current) return;
        try {
          makingOfferRef.current = true;
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socketRef.current?.emit("webrtc:offer", { sessionCode: sessionCodeRef.current, sdp: offer });
        } catch (err) {
          console.error("Error on negotiation needed:", err);
        } finally {
          makingOfferRef.current = false;
        }
      };
    }

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pcRef.current = pc;
    return pc;
  };

  const startShare = async () => {
    setStatus("sharing");
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const pc = setupPeerConnection(iceServers);
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    const dataChannel = pc.createDataChannel("control");
    dataChannel.onmessage = (event) => {
      addLog(`Control event: ${event.data}`);
    };
    dataChannelRef.current = dataChannel;
    addLog("Host ready. Waiting for viewer...");

    // Note: Manual offer creation removed here to avoid race condition with onnegotiationneeded.
    // Adding tracks/dataChannel above will trigger onnegotiationneeded automatically.
  };

  const joinSession = async () => {
    setStatus("joining");
    try {
      const baseUrl = API_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/sessions/${sessionCode}/join`, {
        method: "POST"
      });
      if (!res.ok) {
        addLog(`Join failed: ${res.status} ${res.statusText}`);
        setStatus("error");
        return;
      }
      const data = await res.json();
      const servers = data.iceServers ?? iceServers;
      setIceServers(servers);
      const pc = setupPeerConnection(servers);
      pc.ondatachannel = (event) => {
        dataChannelRef.current = event.channel;
        event.channel.onopen = () => {
          addLog("Control channel opened");
        };
        event.channel.onclose = () => {
          addLog("Control channel closed");
        };
      };
      connectSocket();
      socketRef.current?.emit("viewer:join", { sessionCode: sessionCodeRef.current });
      setStatus("connected");
      addLog("Viewer connected");
    } catch (error) {
      addLog(`Join error: ${(error as Error).message}`);
      setStatus("error");
    }
  };

  const createSession = async () => {
    setStatus("creating");
    try {
      const baseUrl = API_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permission,
          password: usePassword ? sessionPassword : undefined
        })
      });
      if (!res.ok) {
        addLog(`Create failed: ${res.status} ${res.statusText}`);
        try {
          const errorData = await res.text();
          console.error("Create session error detail:", errorData);
          addLog(`Error details: ${errorData.slice(0, 50)}`);
        } catch (e) {
          console.error("Could not read error body", e);
        }
        setStatus("error");
        return;
      }
      const data = await res.json();
      setSessionCode(data.sessionCode);
      sessionCodeRef.current = data.sessionCode;
      setRole("host");
      roleRef.current = "host";
      connectSocket();
      socketRef.current?.emit("host:register", { sessionCode: data.sessionCode });
      setStatus("ready");
      addLog(`Session created: ${data.sessionCode}`);
    } catch (error) {
      addLog(`Create error: ${(error as Error).message}`);
      setStatus("error");
    }
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const sender = role === "host" ? "Host" : "Viewer";
    socketRef.current?.emit("chat:message", {
      sessionCode: sessionCodeRef.current,
      message: chatInput,
      sender
    });
    setChatInput("");
  };

  const drawOnCanvas = (data: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.tool === "highlighter" ? 20 : 3;
    ctx.lineCap = "round";
    ctx.globalAlpha = data.tool === "highlighter" ? 0.3 : 1;

    ctx.beginPath();
    ctx.moveTo(data.lastX, data.lastY);
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!annotationMode) return;
    isDrawingRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    lastPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!annotationMode || !isDrawingRef.current || !lastPosRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const data = {
      x,
      y,
      lastX: lastPosRef.current.x,
      lastY: lastPosRef.current.y,
      color: annotationColor,
      tool: annotationTool
    };

    drawOnCanvas(data);
    socketRef.current?.emit("annotation:draw", {
      sessionCode: sessionCodeRef.current,
      data
    });

    lastPosRef.current = { x, y };
  };

  const handleCanvasMouseUp = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const cleanup = () => {
    pcRef.current?.close();
    pcRef.current = null;
    socketRef.current?.disconnect();
    socketRef.current = null;
    iceCandidateQueueRef.current = [];
  };

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    sessionCodeRef.current = sessionCode;
  }, [sessionCode]);

  useEffect(() => () => cleanup(), []);

  const canStartShare = useMemo(() => role === "host" && status === "ready", [role, status]);
  const isHost = role === "host";

  return (
    <main>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <svg width="40" height="40" viewBox="0 0 640 640" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M320 160L380 220L440 160L500 220L440 280L500 340L440 400L380 340L320 400L260 340L320 280L260 220L320 160Z" fill="url(#gradient1)" />
            <rect x="160" y="280" width="320" height="240" rx="20" stroke="url(#gradient2)" strokeWidth="20" fill="none" />
            <path d="M280 520L320 560L360 520" stroke="url(#gradient2)" strokeWidth="20" strokeLinecap="round" />
            <defs>
              <linearGradient id="gradient1" x1="260" y1="160" x2="500" y2="400" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="gradient2" x1="160" y1="280" x2="480" y2="560" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          <h1>PrinceIO</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
          Professional Remote Desktop Control
          <span className="feature-badge new">💬 Chat</span>
          <span className="feature-badge new">📁 Files</span>
          <span className="feature-badge new">✏️ Annotate</span>
          <span className="feature-badge new">🔒 Secure</span>
        </p>
        <div className="status-badge">
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: status === 'connected' || status === 'sharing' ? 'var(--success)' : 'var(--text-muted)',
            display: 'inline-block'
          }}></span>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="label">🖥️ Host Control Panel</div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Permission Level
            </label>
            <select value={permission} onChange={(e) => setPermission(e.target.value as "view" | "control")} style={{ marginBottom: '1rem' }}>
              <option value="view">👁️ View Only</option>
              <option value="control">🎮 Full Control</option>
            </select>

            <div className="password-container">
              <label className="password-toggle">
                <input type="checkbox" checked={usePassword} onChange={(e) => setUsePassword(e.target.checked)} />
                <span>🔒 Require Password</span>
              </label>
              {usePassword && (
                <input
                  type="text"
                  className="password-input"
                  placeholder="Enter password"
                  value={sessionPassword}
                  onChange={(e) => setSessionPassword(e.target.value)}
                />
              )}
            </div>

            <button onClick={createSession} style={{ width: '100%', marginTop: '1rem' }}>
              Create Session
            </button>
          </div>

          {sessionCode && isHost && (
            <div>
              <div className="label">Session Code</div>
              <div className="session-code" title="Click to copy">
                {sessionCode}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0.5rem 0 1rem' }}>
                Share this code with your viewer
              </p>
              <button disabled={!canStartShare} onClick={startShare} style={{ width: '100%' }}>
                {status === 'sharing' ? '✓ Sharing Screen' : 'Start Screen Share'}
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <div className="label">👁️ Viewer Access</div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Enter Session Code
            </label>
            <input
              placeholder="Enter code (e.g., ABC12345)"
              value={sessionCode}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                sessionCodeRef.current = value;
                setSessionCode(value);
              }}
              style={{ marginBottom: '1rem' }}
            />
            <button
              disabled={isHost}
              onClick={() => {
                if (isHost) {
                  addLog("Open a second browser tab to join as viewer");
                  return;
                }
                setRole("viewer");
                roleRef.current = "viewer";
                joinSession();
              }}
              style={{ width: '100%' }}
            >
              {isHost ? 'Already Hosting' : 'Join Session'}
            </button>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem', lineHeight: '1.5' }}>
            💡 Open a second browser tab or use a different device to join as a viewer
          </p>
        </div>
      </div>

      {/* Video Streams */}
      {(isHost && status === 'sharing') || (role === 'viewer' && status === 'connected') ? (
        <div className="grid" style={{ marginTop: '2rem' }}>
          {isHost && status === 'sharing' && (
            <div className="card">
              <div className="label">🖥️ Your Screen (Host Preview)</div>
              <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', borderRadius: '8px' }} />
            </div>
          )}

          {role === 'viewer' && status === 'connected' && (
            <div className="card">
              <div className="label">🖥️ Remote Screen</div>
              <div style={{ position: 'relative' }}>
                <div
                  style={{ position: 'relative', cursor: permission === 'control' ? 'crosshair' : 'default' }}
                  onMouseMove={(e) => {
                    if (permission !== 'control' || role !== 'viewer') return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    // Send normalized coordinates (0.0 to 1.0)
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;

                    socketRef.current?.emit('control:event', {
                      sessionCode: sessionCodeRef.current,
                      event: { type: 'mousemove', x, y }
                    });
                  }}
                  onClick={(e) => {
                    if (permission !== 'control' || role !== 'viewer') return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;

                    socketRef.current?.emit('control:event', {
                      sessionCode: sessionCodeRef.current,
                      event: { type: 'click', x, y, button: 'left' }
                    });
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (permission !== 'control' || role !== 'viewer') return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;

                    socketRef.current?.emit('control:event', {
                      sessionCode: sessionCodeRef.current,
                      event: { type: 'click', x, y, button: 'right' }
                    });
                  }}
                  tabIndex={0}
                >
                  <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px' }} />
                  <canvas
                    ref={canvasRef}
                    className={`annotation-canvas ${annotationMode ? 'drawing' : ''}`}
                    width={800}
                    height={600}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  />
                  {permission === 'control' && (
                    <div className="control-active">
                      🎮 CONTROL ACTIVE
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Event Log */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="label">📋 Activity Log</div>
        <div className="event-log">
          <ul>
            {log.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating Action Buttons */}
      {(status === 'sharing' || status === 'connected') && (
        <div className="fab-container">
          <button className="fab" onClick={() => setChatOpen(!chatOpen)} title="Chat">
            💬
          </button>
          <button className="fab secondary" onClick={() => setAnnotationMode(!annotationMode)} title="Annotate">
            ✏️
          </button>
        </div>
      )}

      {/* Chat Window */}
      {chatOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <strong>💬 Chat</strong>
            <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, width: 'auto' }}>
              ✕
            </button>
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender === (role === 'host' ? 'Host' : 'Viewer') ? 'own' : 'other'}`}>
                <div className="chat-sender">{msg.sender}</div>
                <div className="chat-text">{msg.message}</div>
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <input
              className="chat-input"
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            />
            <button className="chat-send-btn" onClick={sendChatMessage}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Annotation Toolbar */}
      {annotationMode && (
        <div className="annotation-toolbar">
          <button
            className={`annotation-tool ${annotationTool === 'pen' ? 'active' : ''}`}
            onClick={() => setAnnotationTool('pen')}
            title="Pen"
          >
            ✏️
          </button>
          <button
            className={`annotation-tool ${annotationTool === 'highlighter' ? 'active' : ''}`}
            onClick={() => setAnnotationTool('highlighter')}
            title="Highlighter"
          >
            🖍️
          </button>
          <input
            type="color"
            value={annotationColor}
            onChange={(e) => setAnnotationColor(e.target.value)}
            style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            title="Color"
          />
          <button
            className="annotation-tool"
            onClick={() => {
              clearCanvas();
              socketRef.current?.emit("annotation:clear", { sessionCode: sessionCodeRef.current });
            }}
            title="Clear"
          >
            🗑️
          </button>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>Powered by PrinceIO • Professional Remote Desktop Control</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          Secure • Fast • Feature-Rich • Free Forever
        </p>
      </div>
    </main>
  );
}
