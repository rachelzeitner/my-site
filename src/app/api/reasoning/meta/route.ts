import { NextResponse } from "next/server";

/**
 * Lane 2 — Challenge 2. The grader calls this first so it knows the
 * service answering is yours. Everything else in this lane still 501s
 * until /api/reasoning/decide is built.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    studentToken: process.env.SITE_TOKEN ?? "SITE_TOKEN-env-var-not-set",
    service: "reasoning",
  });
}
