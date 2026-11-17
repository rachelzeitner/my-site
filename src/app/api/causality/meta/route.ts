import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      service: "causality",
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
