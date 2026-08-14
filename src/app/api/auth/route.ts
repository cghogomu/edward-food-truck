import { NextResponse } from "next/server";
import {
  checkPassword,
  endSession,
  hasValidSession,
  isPasswordConfigured,
  startSession,
} from "@/lib/auth";

/** Does the caller already hold a valid session? Drives the dashboard's login gate. */
export async function GET() {
  return NextResponse.json({
    authed: await hasValidSession(),
    configured: isPasswordConfigured(),
  });
}

/** Log in. On success the session lands in an httpOnly cookie, not in the page. */
export async function POST(request: Request) {
  if (!isPasswordConfigured()) {
    return NextResponse.json(
      { error: "The dashboard password is not configured on the server." },
      { status: 503 },
    );
  }

  let password: unknown;
  try {
    ({ password } = (await request.json()) as { password?: unknown });
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  await startSession();
  return NextResponse.json({ authed: true });
}

/** Sign out. */
export async function DELETE() {
  await endSession();
  return NextResponse.json({ authed: false });
}
