import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "io_dash";

const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

/**
 * The dashboard password. Set `DASHBOARD_PASSWORD` in the Vercel project's
 * environment variables. In development it falls back to the old demo value so
 * `npm run dev` keeps working without a `.env.local`; in production there is no
 * fallback — a missing variable locks writing rather than accepting a password
 * that has been sitting in this repo's history.
 */
function configuredPassword(): string | null {
  const fromEnv = process.env.DASHBOARD_PASSWORD;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return process.env.NODE_ENV === "development" ? "ironoaks" : null;
}

export function isPasswordConfigured(): boolean {
  return configuredPassword() !== null;
}

/**
 * The value we store in the cookie: a hash of the password, never the password
 * itself. There is no session store to check against on serverless, so the
 * token has to be derivable — but it stays useless to anyone who doesn't
 * already know the password.
 */
function sessionToken(password: string): string {
  return createHash("sha256").update(`iron-oaks:${password}`).digest("hex");
}

function equal(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkPassword(candidate: unknown): boolean {
  const password = configuredPassword();
  if (password === null || typeof candidate !== "string") return false;
  return equal(candidate, password);
}

export async function startSession(): Promise<void> {
  const password = configuredPassword();
  if (password === null) return;
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/**
 * Whether the caller may write. Fails closed: no configured password means no
 * valid token exists, so every write is rejected.
 */
export async function hasValidSession(): Promise<boolean> {
  const password = configuredPassword();
  if (password === null) return false;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return equal(token, sessionToken(password));
}
