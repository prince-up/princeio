                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             "use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const SIGNALING_URL = process.env.NEXT_PUBLIC_SIGNALING_URL ?? "http://localhost:4100";

type Role = "host" | "viewer" | "";

type IceServer = { urls: string[]; username?: string; credential?: string };

export default function Home() {
  const [role, setRole] = useState<Role>("");
  const [sessionCode, setSessionCode] = useState("");
  const [permission, setPermission] = useState<"view" | "control">("view");
  const [status, setStatus] = useState("idle");
  const [iceServers, setIceServers] = useState<IceServer[]>([
    { urls: ["stun:stun.l.google.com:19302"] }
  ]);
  const [log, setLog] = useState<string[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const makingOfferRef = useRef(false);
  const roleRef = useRef<Role>("");
  const sessionCodeRef = useRef("");

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
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtc:answer", { sessionCode: sessionCodeRef.current, sdp: answer });
    });

    socket.on("webrtc:answer", async ({ sdp }) => {
      if (roleRef.current !== "host") return;
      const pc = pcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("webrtc:ice", async ({ candidate }) => {
      const pc = pcRef.current;
      if (!pc || !candidate) return;
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("viewer:joined", async () => {
      if (roleRef.current !== "host") return;
      const pc = pcRef.current;
      if (!pc) return;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("webrtc:offer", { sessionCode: sessionCodeRef.current, sdp: offer });
    });

    socket.on("session:terminated", () => {
      addLog("Session terminated");
      setStatus("terminated");
      cleanup();
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

    if (socketRef.current?.connected) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current.emit("webrtc:offer", { sessionCode: sessionCodeRef.current, sdp: offer });
    }
  };

  const joinSession = async () => {
    setStatus("joining");
    try {
      const res = await fetch(`${API_URL}/sessions/${sessionCode}/join`, {
        method: "POST"
      });
      if (!res.ok) {
        addLog(`Join failed: ${res.status}`);
        setStatus("error");
        return;
      }
      const data = await res.json();
      const servers = data.iceServers ?? iceServers;
      setIceServers(servers);
      const pc = setupPeerConnection(servers);
      pc.ondatachannel = (event) => {
        dataChannelRef.current = event.channel;
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
      const res = await fetch(`${API_URL}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission })
      });
      if (!res.ok) {
        addLog(`Create failed: ${res.status}`);
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

  const sendControlEvent = (payload: Record<string, unknown>) => {
    if (permission !== "control") return;
    if (role !== "viewer") return;
    dataChannelRef.current?.send(JSON.stringify(payload));
  };

  const cleanup = () => {
    pcRef.current?.close();
    pcRef.current = null;
    socketRef.current?.disconnect();
    socketRef.current = null;
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
      <h1>PrinceIO Remote Control</h1>
      <p>Status: {status}</p>

      <div className="grid">
        <div className="card">
          <div className="label">Host</div>
          <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
            <select value={permission} onChange={(e) => setPermission(e.target.value as "view" | "control") }>
              <option value="view">View only</option>
              <option value="control">Full control</option>
            </select>
            <button onClick={createSession}>Create Session</button>
          </div>
          <div>Session Code: <strong>{sessionCode || "-"}</strong></div>
          <div style={{ marginTop: 12 }}>
            <button disabled={!canStartShare} onClick={startShare}>Start Share</button>
          </div>
        </div>

        <div className="card">
          <div className="label">Viewer</div>
          <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
            <input
              placeholder="Session Code"
              value={sessionCode}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                sessionCodeRef.current = value;
                setSessionCode(value);
              }}
            />
            <button
              disabled={isHost}
              onClick={() => {
                if (isHost) {
                  addLog("Open a second tab or browser to join as viewer.");
                  return;
                }
                setRole("viewer");
                roleRef.current = "viewer";
                joinSession();
              }}
            >
              Join
            </button>
          </div>
          <div style={{ fontSize: 12, color: "#97a0b0" }}>
            Open a second browser/tab to join as viewer. Control is enabled only if host grants full control.
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="label">Host Preview</div>
          <video ref={localVideoRef} autoPlay muted playsInline />
        </div>
        <div className="card">
          <div className="label">Viewer Stream</div>
          <div
            onMouseMove={(e) => sendControlEvent({ type: "mousemove", x: e.clientX, y: e.clientY })}
            onClick={(e) => sendControlEvent({ type: "click", x: e.clientX, y: e.clientY })}
            onKeyDown={(e) => sendControlEvent({ type: "keydown", key: e.key })}
            tabIndex={0}
          >
            <video ref={remoteVideoRef} autoPlay playsInline />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="label">Event Log</div>
        <ul>
          {log.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
