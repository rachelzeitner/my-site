import { NextResponse } from "next/server";

/**
 * Lane 2 — Challenge 2. The grader calls this first so it knows the
 * service answering is yours. Wire contract:
 * { service: "reasoning", specVersion: "1", studentToken }
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "reasoning",
    specVersion: "1",
    studentToken: process.env.SITE_TOKEN ?? "SITE_TOKEN-env-var-not-set",
  });
}
