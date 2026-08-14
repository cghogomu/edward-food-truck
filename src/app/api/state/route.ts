import { NextResponse } from "next/server";
import { getSiteState, patchSiteState } from "@/lib/state";
import { hasValidSession } from "@/lib/auth";
import type { SiteState } from "@/types";

/** Public: the site itself reads this to render hours, stock and closures. */
export async function GET() {
  const state = await getSiteState();
  return NextResponse.json(state);
}

/**
 * Writing is dashboard-only. The password used to be checked in the browser,
 * which decided what to render and guarded nothing — this route accepted any
 * unauthenticated POST, so anyone who found the address could change the
 * truck's hours or mark it sold out mid-service.
 */
export async function POST(request: Request) {
  if (!(await hasValidSession())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const patch = (await request.json()) as Partial<SiteState>;
  const next = await patchSiteState(patch);
  return NextResponse.json(next);
}
