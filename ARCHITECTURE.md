# 🏗️ PrinceIO Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRINCEIO SYSTEM                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐                              ┌──────────────────┐
│   HOST DEVICE    │                              │  VIEWER BROWSER  │
│                  │                              │                  │
│  ┌────────────┐  │                              │  ┌────────────┐  │
│  │  Desktop   │  │                              │  │   Web App  │  │
│  │    App     │  │                              │  │ (Next.js)  │  │
│  │ (Electron) │  │                              │  └────────────┘  │
│  └────────────┘  │                              │                  │
│        │         │                              │        │         │
│        │ Screen  │                              │        │ View &  │
│        │ Share   │                              │        │ Control │
│        ▼         │                              │        ▼         │
│  ┌────────────┐  │      ┌──────────────┐       │  ┌────────────┐  │
│  │  RobotJS   │◄─┼──────│  Signaling   │◄──────┼──│  Socket.IO │  │
│  │ (Control)  │  │      │    Server    │       │  │   Client   │  │
│  └────────────┘  │      │ (Socket.IO)  │       │  └────────────┘  │
│        ▲         │      └──────────────┘       │                  │
│        │         │              │               │                  │
│        │         │              │               │                  │
│  ┌────────────┐  │      ┌──────▼──────┐       │  ┌────────────┐  │
│  │  WebRTC    │◄─┼──────│  API Server │◄──────┼──│   WebRTC   │  │
│  │   Peer     │  │      │  (Fastify)  │       │  │    Peer    │  │
│  └────────────┘  │      └─────────────┘       │  └────────────┘  │
│                  │                              │                  │
└──────────────────┘                              └──────────────────┘
```

## Data Flow

### 1. Session Creation
```
Desktop App → API Server
    ↓
Creates Session Code
    ↓
Returns to Desktop App
    ↓
User shares code with Viewer
```

### 2. Viewer Joins
```
Viewer enters code → API Server validates
    ↓
Signaling Server connects Host ↔ Viewer
    ↓
WebRTC establishes peer connection
    ↓
Screen sharing begins
```

### 3. Control Events
```
Viewer clicks/types
    ↓
Socket.IO emits 'control:event'
    ↓
Signaling Server relays to Host
    ↓
Desktop App receives event
    ↓
RobotJS executes on OS
    ↓
Action happens on Host's screen
```

## Component Details

### 🌐 Web App (Port 3000)
- **Technology**: Next.js 14, React, TypeScript
- **Purpose**: Viewer interface
- **Features**:
  - Session joining
  - WebRTC video display
  - Control event capture
  - Real-time status updates

### 🔧 API Server (Port 4000)
- **Technology**: Fastify, JWT
- **Purpose**: Session management
- **Endpoints**:
  - `POST /sessions` - Create session
  - `GET /sessions/:code` - Get session info
  - `POST /sessions/:code/join` - Join session
  - `POST /sessions/:code/terminate` - End session

### 📡 Signaling Server (Port 4100)
- **Technology**: Socket.IO
- **Purpose**: Real-time communication
- **Events**:
  - `host:register` - Host connects
  - `viewer:join` - Viewer connects
  - `webrtc:offer/answer/ice` - WebRTC signaling
  - `control:event` - Control commands

### 🖥️ Desktop App
- **Technology**: Electron, RobotJS
- **Purpose**: Host application
- **Features**:
  - Screen capture
  - OS-level control
  - Session management UI
  - Activity logging

## Security Layers

```
┌─────────────────────────────────────┐
│         Security Layers             │
├─────────────────────────────────────┤
│ 1. Session Codes (8 chars)          │
│ 2. JWT Tokens                       │
│ 3. Permission Levels (view/control) │
│ 4. Session Expiration (1 hour)      │
│ 5. WebRTC Encryption (DTLS-SRTP)   │
│ 6. Socket.IO Authentication         │
└─────────────────────────────────────┘
```

## Network Topology

### Development (Current)
```
localhost:3000 ─┐
                ├─► localhost (all services)
localhost:4000 ─┤
                │
localhost:4100 ─┘
```

### Production (Deployed)
```
viewer.yoursite.com ──┐
                      ├─► Cloud Infrastructure
api.yoursite.com ─────┤
                      │
signal.yoursite.com ──┘

Desktop App (User's Computer) ──► Connects to cloud
```

## Technology Stack

```
┌──────────────┬─────────────────┬──────────────────┐
│  Frontend    │    Backend      │    Desktop       │
├──────────────┼─────────────────┼──────────────────┤
│ Next.js 14   │ Fastify         │ Electron         │
│ React 18     │ Socket.IO       │ RobotJS          │
│ TypeScript   │ JWT             │ Node.js          │
│ WebRTC       │ Zod             │ TypeScript       │
│ Socket.IO    │ Nanoid          │ Socket.IO Client │
└──────────────┴─────────────────┴──────────────────┘
```

## Deployment Architecture

### Option 1: Monolithic (Single Server)
```
┌─────────────────────────────────┐
│      VPS (DigitalOcean/AWS)     │
│                                 │
│  ┌──────────────────────────┐  │
│  │  Nginx (Reverse Proxy)   │  │
│  └──────────────────────────┘  │
│              │                  │
│      ┌───────┴───────┐         │
│      ▼               ▼          │
│  ┌──────┐      ┌──────────┐   │
│  │ Web  │      │ API +    │   │
│  │ App  │      │ Signaling│   │
│  └──────┘      └──────────┘   │
│                                 │
└─────────────────────────────────┘
```

### Option 2: Distributed (Microservices)
```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Vercel  │    │  Render  │    │  Render  │
│          │    │          │    │          │
│ Web App  │    │   API    │    │Signaling │
└──────────┘    └──────────┘    └──────────┘
```

## Performance Characteristics

### Latency Breakdown
```
User Action → Browser (5ms)
    ↓
Socket.IO → Server (20-50ms)
    ↓
Server → Desktop App (20-50ms)
    ↓
RobotJS → OS (5-10ms)
    ↓
Total: ~50-115ms (local network)
Total: ~100-300ms (internet)
```

### Bandwidth Usage
```
Video Stream: 1-5 Mbps (adaptive)
Control Events: <1 Kbps
Signaling: <10 Kbps
```

## Scalability

### Current Capacity
- Concurrent Sessions: Limited by server resources
- Viewers per Session: 1 (can be extended)
- Session Duration: 1 hour (configurable)

### Scaling Strategy
```
Load Balancer
    ↓
Multiple API Instances
    ↓
Redis (Session Store)
    ↓
Multiple Signaling Instances
```

## Future Enhancements

### Phase 1 (Easy)
- [ ] Session passwords
- [ ] Custom session duration
- [ ] Activity logging
- [ ] Better error messages

### Phase 2 (Medium)
- [ ] File transfer
- [ ] Chat functionality
- [ ] Multi-viewer support
- [ ] Session recording

### Phase 3 (Advanced)
- [ ] Mobile apps (iOS/Android)
- [ ] Clipboard sync
- [ ] Audio streaming
- [ ] Drawing tools
- [ ] Screen annotation

---

This architecture provides a solid foundation for a production-ready remote control system!
