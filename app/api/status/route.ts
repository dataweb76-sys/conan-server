import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const gamedig: any = require("gamedig");

function getQueryFn() {
  if (typeof gamedig?.query === "function") return gamedig.query;
  if (typeof gamedig?.GameDig?.query === "function") return gamedig.GameDig.query;
  return null;
}

async function tryQuery(host: string, port: number) {
  const queryFn = getQueryFn();
  if (!queryFn) throw new Error("gamedig_query_missing");

  return await queryFn({
    type: "conanexiles",
    host,
    port,
    maxAttempts: 2,
    socketTimeout: 5000,
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get("ip") || searchParams.get("host");
  const qportStr = searchParams.get("qport");

  if (!host || !qportStr) {
    return NextResponse.json({ ok: false, error: "missing_params" }, { status: 400 });
  }

  const qport = Number(qportStr);

  try {
    const state = await tryQuery(host, qport);
    const rawPlayers = Array.isArray(state?.players) ? state.players : [];
    const playerNames = rawPlayers
      .map((pl: any) => (pl?.name || pl?.raw?.name || "").trim())
      .filter((n: string) => n.length > 0);

    return NextResponse.json({
      ok: true,
      name: state?.name,
      playersCount: playerNames.length,
      maxPlayers: state?.maxplayers || 40,
      players: playerNames,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}