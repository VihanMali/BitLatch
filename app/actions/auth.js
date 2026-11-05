"use server";

import { createHash, randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import {
  createUserSession,
  createUserWithSession,
  destroyUserSession,
  requireUser,
} from "@/lib/auth";
import { createProjectForUserId } from "@/lib/projects";
import { hashPassword, verifyPassword } from "@/lib/password";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,24}$/;
const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "bitlatch",
  "help",
  "root",
  "security",
  "support",
  "system",
]);
const MAX_LOGIN_ATTEMPTS = 5;
const MAX_SIGNUP_ATTEMPTS = 10;

function getText(formData, name) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function isValidPassword(password) {
  const length = Array.from(password).length;
  return length >= 12 && length <= 128;
}

async function getRateLimitKey(scope, identity) {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const clientAddress =
    requestHeaders.get("x-real-ip")?.trim() ||
    forwardedFor?.split(",")[0]?.trim();

  if (!clientAddress && process.env.NODE_ENV === "production") {
    throw new Error("Configure a trusted client IP header for auth rate limiting.");
  }

  const addressForKey = clientAddress || "127.0.0.1";

  return createHash("sha256")
    .update(`${scope}\0${addressForKey}\0${identity}`)
    .digest("hex");
}

function getDummyPasswordHash() {
  if (!globalThis.__bitLatchDummyPasswordHash) {
    globalThis.__bitLatchDummyPasswordHash = hashPassword(
      randomBytes(32).toString("hex"),
    );
  }

  return globalThis.__bitLatchDummyPasswordHash;
}

async function isLoginRateLimited(bucketKey) {
  const sql = getDb();
  const rows = await sql`
    SELECT failed_attempts,
           window_started_at > now() - interval '15 minutes' AS window_active
    FROM auth_login_attempts
    WHERE bucket_key = ${bucketKey}
    LIMIT 1
  `;

  return Boolean(
    rows[0]?.window_active &&
      rows[0].failed_attempts >= MAX_LOGIN_ATTEMPTS,
  );
}

async function recordFailedLogin(bucketKey) {
  const sql = getDb();
  await sql`
    INSERT INTO auth_login_attempts (
      bucket_key,
      failed_attempts,
      window_started_at
    )
    VALUES (${bucketKey}, 1, now())
    ON CONFLICT (bucket_key) DO UPDATE
    SET
      failed_attempts = CASE
        WHEN auth_login_attempts.window_started_at
          <= now() - interval '15 minutes' THEN 1
        ELSE auth_login_attempts.failed_attempts + 1
      END,
      window_started_at = CASE
        WHEN auth_login_attempts.window_started_at
          <= now() - interval '15 minutes' THEN now()
        ELSE auth_login_attempts.window_started_at
      END
  `;
}

async function consumeSignupAttempt(bucketKey) {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO auth_signup_attempts (
      bucket_key,
      failed_attempts,
      window_started_at
    )
    VALUES (${bucketKey}, 1, now())
    ON CONFLICT (bucket_key) DO UPDATE
    SET
      failed_attempts = CASE
        WHEN auth_signup_attempts.window_started_at
          <= now() - interval '1 hour' THEN 1
        ELSE auth_signup_attempts.failed_attempts + 1
      END,
      window_started_at = CASE
        WHEN auth_signup_attempts.window_started_at
          <= now() - interval '1 hour' THEN now()
        ELSE auth_signup_attempts.window_started_at
      END
    RETURNING failed_attempts,
      window_started_at > now() - interval '1 hour' AS window_active
  `;

  return Boolean(
    rows[0]?.window_active &&
      rows[0].failed_attempts <= MAX_SIGNUP_ATTEMPTS,
  );
}

export async function signUpAction(_previousState, formData) {
  const username = getText(formData, "username").trim();
  const password = getText(formData, "password");
  const usernameNormalized = username.toLowerCase();

  if (!USERNAME_PATTERN.test(username)) {
    return { error: "Use 3–24 letters, numbers, or underscores for your username." };
  }

  if (RESERVED_USERNAMES.has(usernameNormalized)) {
    return { error: "That username can’t be used. Choose another one." };
  }

  if (!isValidPassword(password)) {
    return { error: "Use a password between 12 and 128 characters." };
  }

  let signupStep = "rate-limit-key";

  try {
    const signupBucket = await getRateLimitKey("signup", "accounts");
    signupStep = "rate-limit-check";
    if (!(await consumeSignupAttempt(signupBucket))) {
      return { error: "Too many signup attempts. Try again in an hour." };
    }

    signupStep = "password-hash";
    const passwordHash = await hashPassword(password);
    signupStep = "create-account-and-session";
    await createUserWithSession(username, passwordHash);
  } catch (error) {
    console.error("BitLatch signup failed", {
      step: signupStep,
      name: error?.name ?? "Error",
      code: error?.code ?? "unknown",
    });

    if (error?.code === "23505") {
      return { error: "That username is unavailable. Try another one." };
    }

    return { error: "We couldn’t create your account right now. Please try again." };
  }

  redirect("/dashboard");
}

export async function logInAction(_previousState, formData) {
  const username = getText(formData, "username").trim();
  const password = getText(formData, "password");

  if (!USERNAME_PATTERN.test(username) || !isValidPassword(password)) {
    return { error: "Username or password is incorrect." };
  }

  const usernameNormalized = username.toLowerCase();

  try {
    const loginBucket = await getRateLimitKey("login", usernameNormalized);
    if (await isLoginRateLimited(loginBucket)) {
      return { error: "Too many failed attempts. Wait 15 minutes and try again." };
    }

    const sql = getDb();
    const rows = await sql`
      SELECT id, username, password_hash
      FROM users
      WHERE username_normalized = ${usernameNormalized}
      LIMIT 1
    `;
    const user = rows[0];
    const hashToCheck = user?.password_hash ?? (await getDummyPasswordHash());
    const passwordMatches = await verifyPassword(hashToCheck, password);

    if (!user || !passwordMatches) {
      await recordFailedLogin(loginBucket);
      return { error: "Username or password is incorrect." };
    }

    await sql`
      DELETE FROM auth_login_attempts
      WHERE bucket_key = ${loginBucket}
    `;
    await createUserSession(user.id);
  } catch {
    return { error: "We couldn’t sign you in right now. Please try again." };
  }

  redirect("/dashboard");
}

export async function logOutAction() {
  await destroyUserSession();
  redirect("/");
}

export async function createProjectAction(formData) {
  const user = await requireUser();
  const name = getText(formData, "name").trim();

  if (name.length < 2 || name.length > 100) {
    redirect("/dashboard?projectError=invalid");
  }

  await createProjectForUserId(user.id, name);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
