import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";
import { Server } from "socket.io";

const port = Number(process.env.PORT || process.env.SIGNALING_PORT || 4100);

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

const io = new Server(app.server, {
  cors: { origin: "*" }
});

type SessionState = {
  hostSocketId?: string;
  viewers: Set<string>;
};

const sessions = new Map<string, SessionState>();

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("host:register", ({ sessionCode }: { sessionCode: string }) => {
    const code = sessionCode.toUpperCase();
    console.log(`Host registering session: ${code} (socket: ${socket.id})`);
    const state = sessions.get(code) ?? { viewers: new Set<string>() };
    state.hostSocketId = socket.id;
    sessions.set(code, state);
    socket.join(code);
    console.log(`Session ${code} registered. Total sessions: ${sessions.size}`);
  });

  socket.on("viewer:join", ({ sessionCode }: { sessionCode: string }) => {
    const code = sessionCode.toUpperCase();
    console.log(`Viewer joining session: ${code}`);
    const state = sessions.get(code);

    if (!state || !state.hostSocketId) {
      console.log(`Session not found or no host: ${code}`);
      socket.emit("session:error", { message: "Session not found or host not connected" });
      return;
    }

    state.viewers.add(socket.id);
    socket.join(code);

    // Notify viewer they joined successfully
    socket.emit("session:joined", { sessionCode: code });

    // Notify host that viewer joined
    console.log(`Notifying host ${state.hostSocketId} that viewer joined`);
    io.to(state.hostSocketId).emit("viewer:joined", { viewerId: socket.id });
  });

  socket.on("webrtc:offer", ({ sessionCode, sdp }) => {
    io.to(sessionCode.toUpperCase()).emit("webrtc:offer", { sdp });
  });

  socket.on("webrtc:answer", ({ sessionCode, sdp }) => {
    io.to(sessionCode.toUpperCase()).emit("webrtc:answer", { sdp });
  });

  socket.on("webrtc:ice", ({ sessionCode, candidate }) => {
    io.to(sessionCode.toUpperCase()).emit("webrtc:ice", { candidate });
  });

  socket.on("control:event", ({ sessionCode, event }) => {
    const code = sessionCode.toUpperCase();
    const state = sessions.get(code);
    if (state?.hostSocketId) {
      io.to(state.hostSocketId).emit("control:event", event);
    }
  });

  // Chat functionality
  socket.on("chat:message", ({ sessionCode, message, sender }) => {
    const code = sessionCode.toUpperCase();
    io.to(code).emit("chat:message", { message, sender, timestamp: Date.now() });
  });

  // File transfer
  socket.on("file:offer", ({ sessionCode, fileName, fileSize, fileId }) => {
    const code = sessionCode.toUpperCase();
    const state = sessions.get(code);
    if (state?.hostSocketId) {
      io.to(state.hostSocketId).emit("file:offer", { fileName, fileSize, fileId, from: socket.id });
    }
  });

  socket.on("file:accept", ({ sessionCode, fileId, to }) => {
    io.to(to).emit("file:accept", { fileId });
  });

  socket.on("file:chunk", ({ sessionCode, fileId, chunk, to }) => {
    io.to(to).emit("file:chunk", { fileId, chunk });
  });

  socket.on("file:complete", ({ sessionCode, fileId, to }) => {
    io.to(to).emit("file:complete", { fileId });
  });

  // Screen annotation
  socket.on("annotation:draw", ({ sessionCode, data }) => {
    const code = sessionCode.toUpperCase();
    io.to(code).emit("annotation:draw", data);
  });

  socket.on("annotation:clear", ({ sessionCode }) => {
    const code = sessionCode.toUpperCase();
    io.to(code).emit("annotation:clear");
  });

  socket.on("session:terminate", ({ sessionCode }) => {
    const code = sessionCode.toUpperCase();
    io.to(code).emit("session:terminated", { reason: "host" });
    sessions.delete(code);
  });

  socket.on("disconnect", () => {
    for (const [code, state] of sessions.entries()) {
      if (state.hostSocketId === socket.id) {
        io.to(code).emit("session:terminated", { reason: "host-disconnect" });
        sessions.delete(code);
      } else if (state.viewers.has(socket.id)) {
        state.viewers.delete(socket.id);
      }
    }
  });
});

app.get("/health", async () => ({ status: "ok" }));

app.listen({ port, host: "0.0.0.0" });
