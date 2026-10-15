import { NextResponse } from "next/server";

/**
 * Challenge 3 meta. Same contract as /api/reasoning/meta, except the
 * service name: { service: "simulator", specVersion: "1", studentToken }.
 * SITE_TOKEN is read from the environment so it never lives in the repo.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      service: "simulator",
      specVersion: "1",
      studentToken: process.env.SITE_TOKEN,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
