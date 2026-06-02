import { NextResponse } from "next/server";
import { getSiteState, patchSiteState } from "@/lib/state";
import type { SiteState } from "@/types";

export async function GET() {
  const state = await getSiteState();
  return NextResponse.json(state);
}

export async function POST(request: Request) {
  const patch = (await request.json()) as Partial<SiteState>;
  const next = await patchSiteState(patch);
  return NextResponse.json(next);
}
