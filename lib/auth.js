import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Host-bitlatch_session"
    : "bitlatch_session";

function digestToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function newSessionCredentials() {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  return {
    token,
    tokenHash: digestToken(token),
    expiresAt,
  };
}

async function setSessionCookie(token, expiresAt) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function createUserSession(userId) {
  const session = newSessionCredentials();
  const sql = getDb();
  const cookieStore = await cookies();
  const previousToken = cookieStore.get(COOKIE_NAME)?.value;

  await sql`
    INSERT INTO auth_sessions (token_hash, user_id, expires_at)
    VALUES (${session.tokenHash}, ${userId}, ${session.expiresAt})
  `;

  if (previousToken) {
    await sql`
      DELETE FROM auth_sessions
      WHERE token_hash = ${digestToken(previousToken)}
    `;
  }

  await setSessionCookie(session.token, session.expiresAt);
}

export async function createUserWithSession(username, passwordHash) {
  const session = newSessionCredentials();
  const sql = getDb();

  const rows = await sql`
    WITH new_user AS (
      INSERT INTO users (username, password_hash)
      VALUES (${username}, ${passwordHash})
      RETURNING id, username
    ),
    new_session AS (
      INSERT INTO auth_sessions (token_hash, user_id, expires_at)
      SELECT ${session.tokenHash}, id, ${session.expiresAt}
      FROM new_user
      RETURNING user_id
    )
    SELECT new_user.id, new_user.username
    FROM new_user
    JOIN new_session ON new_session.user_id = new_user.id
  `;

  const user = rows[0];
  if (!user) {
    throw new Error("Account creation did not return a user.");
  }

  const cookieStore = await cookies();
  const previousToken = cookieStore.get(COOKIE_NAME)?.value;

  if (previousToken) {
    await sql`
      DELETE FROM auth_sessions
      WHERE token_hash = ${digestToken(previousToken)}
    `;
  }

  await setSessionCookie(session.token, session.expiresAt);
  return user;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const sql = getDb();
  const rows = await sql`
    SELECT users.id, users.username
    FROM auth_sessions
    JOIN users ON users.id = auth_sessions.user_id
    WHERE auth_sessions.token_hash = ${digestToken(token)}
      AND auth_sessions.expires_at > now()
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function destroyUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    const sql = getDb();
    await sql`
      DELETE FROM auth_sessions
      WHERE token_hash = ${digestToken(token)}
    `;
  }

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
