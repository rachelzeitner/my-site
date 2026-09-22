import { NextResponse } from "next/server";

/**
 * Challenge 2 meta. The grader requires:
 * { service: "reasoning", specVersion: "1", studentToken }
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      service: "reasoning",
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
