import { Role } from "@prisma/client";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "thareea_session";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

function getSessionSecret() {
  return process.env.SESSION_SECRET ?? "dev-only-session-secret";
}

function sign(payload: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
}

function encodeSession(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function decodeSession(value: string): SessionUser | null {
  const [payload, signature] = value.split(".");
  if (!payload || !signature) {
    return null;
  }

  if (sign(payload) !== signature) {
    return null;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as SessionUser;
    return decoded;
  } catch {
    return null;
  }
}

export async function setSession(user: SessionUser) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encodeSession(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) {
    return null;
  }
  return decodeSession(raw);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });
  return user;
}

export async function requireUser(role?: Role) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (role && session.role !== role) {
    redirect(session.role === Role.ARTIST ? "/dashboard/artist" : "/dashboard/buyer");
  }
  return session;
}
