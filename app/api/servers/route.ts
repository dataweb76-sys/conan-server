import { NextResponse } from "next/server";

export async function GET() {
  // Placeholder para deploy rápido.
  // Más adelante: devolver servers desde Supabase / DB
  return NextResponse.json({ ok: true, servers: [] });
}
