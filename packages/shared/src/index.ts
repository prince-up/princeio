export type Role = "host" | "viewer";
export type PermissionLevel = "view" | "control";

export type SessionStatus = "active" | "terminated" | "expired";

export interface SessionRecord {
  code: string;
  hostId: string;
  permission: PermissionLevel;
  status: SessionStatus;
  createdAt: number;
  expiresAt: number;
}

export interface JoinTicket {
  code: string;
  viewerId: string;
  permission: PermissionLevel;
  expiresAt: number;
}
