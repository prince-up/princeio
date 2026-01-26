import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import { nanoid } from "nanoid";
import { z } from "zod";
import "dotenv/config";
import type { PermissionLevel, SessionRecord } from "@princeio/shared";

const port = Number(process.env.API_PORT ?? 4000);
const jwtSecret = process.env.JWT_SECRET ?? "dev-secret";
const ttlSeconds = Number(process.env.SESSION_TTL_SECONDS ?? 3600);

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(helmet);
await app.register(rateLimit, { max: 200, timeWindow: "1 minute" });
await app.register(jwt, { secret: jwtSecret });

const sessionStore = new Map<string, SessionRecord>();

function createSession(permission: PermissionLevel) {
  const code = nanoid(8).toUpperCase();
  const now = Date.now();
  const session: SessionRecord = {
    code,
    hostId: nanoid(),
    permission,
    status: "active",
    createdAt: now,
    expiresAt: now + ttlSeconds * 1000
  };
  sessionStore.set(code, session);
  return session;
}

function getSession(code: string) {
  const session = sessionStore.get(code);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    session.status = "expired";
    sessionStore.delete(code);
    return null;
  }
  return session;
}

app.get("/health", async () => ({ status: "ok" }));

app.post("/auth/guest", async (req, reply) => {
  const token = app.jwt.sign({ sub: nanoid(), role: "guest" }, { expiresIn: "1h" });
  return reply.send({ token });
});

const createSessionSchema = z.object({
  permission: z.enum(["view", "control"]).default("view"),
  password: z.string().optional()
});

app.post("/sessions", async (req, reply) => {
  const body = createSessionSchema.parse(req.body ?? {});
  const session = createSession(body.permission);
  const sessionToken = app.jwt.sign({ sessionCode: session.code, role: "host" }, { expiresIn: "1h" });
  return reply.send({
    sessionCode: session.code,
    sessionToken,
    expiresAt: session.expiresAt,
    permission: session.permission
  });
});

app.get("/sessions/:code", async (req, reply) => {
  const code = (req.params as { code: string }).code.toUpperCase();
  const session = getSession(code);
  if (!session) return reply.code(404).send({ error: "Not found" });
  return reply.send({
    sessionCode: session.code,
    status: session.status,
    permission: session.permission,
    expiresAt: session.expiresAt
  });
});

app.post("/sessions/:code/join", async (req, reply) => {
  const code = (req.params as { code: string }).code.toUpperCase();
  const session = getSession(code);
  if (!session) return reply.code(404).send({ error: "Not found" });

  const joinToken = app.jwt.sign({ sessionCode: code, role: "viewer" }, { expiresIn: "30m" });
  return reply.send({
    joinToken,
    permission: session.permission,
    iceServers: [
      { urls: ["stun:stun.l.google.com:19302"] }
    ]
  });
});

app.post("/sessions/:code/terminate", async (req, reply) => {
  const code = (req.params as { code: string }).code.toUpperCase();
  const session = sessionStore.get(code);
  if (!session) return reply.code(404).send({ error: "Not found" });
  session.status = "terminated";
  sessionStore.delete(code);
  return reply.send({ status: "terminated" });
});

app.listen({ port, host: "0.0.0.0" });
