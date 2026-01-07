import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "rewards_disabled" },
    { status: 503 }
  );
}
