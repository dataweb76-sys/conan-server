import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ✅ sin types y sin archivos extra
// eslint-disable-next-line @typescript-eslint/no-var-requires
const GameDig: any = require("gamedig");

async function tryQuery(host: string, port: number) {
  // GameDig puede venir como { query } o { GameDig: { query } } según build
  const q =
    typeof GameDig?.query === "function"
      ? GameDig.query
      : typeof GameDig?.GameDig?.query === "function"
      ? GameDig.GameDig.query
      : null;

  if (!q) throw new Error("gamedig_query_missing");

  return await q({
    type: "conanexiles",
    host,
    port,
    maxAttempts: 1,
    socketTimeout: 1800,
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // ✅ Acepta host o ip (porque tu front manda ip)
  const host = searchParams.get("host") ?? searchParams.get("ip");
  const portStr = searchParams.get("port"); // puerto del juego
  const qportStr = searchParams.get("qport"); // query port

  if (!host) {
    return NextResponse.json({ ok: false, error: "missing_host" }, { status: 400 });
  }

  const gamePort = portStr ? Number(portStr) : NaN;
  const qport = qportStr ? Number(qportStr) : NaN;

  const candidates: number[] = [];
  if (Number.isFinite(qport)) candidates.push(qport);
  if (Number.isFinite(gamePort)) {
    candidates.push(gamePort);
    candidates.push(gamePort + 1);
    candidates.push(gamePort + 2);
    candidates.push(gamePort + 10);
  }

  if (candidates.length === 0) {
    return NextResponse.json({ ok: false, error: "missing_port_and_qport" }, { status: 400 });
  }

  let lastErr: any = null;

  for (const p of [...new Set(candidates)]) {
    try {
      const state = await tryQuery(host, p);

      const playersRaw = Array.isArray(state.players) ? state.players : [];
      const players = playersRaw
        .map((pl: any) => String(pl?.name ?? "").trim())
        .filter(Boolean)
        .slice(0, 50);

      return NextResponse.json({
        ok: true,
        usedPort: p,
        name: state.name ?? null,
        map: state.map ?? null,

        // ✅ NOMBRES CONSISTENTES con el modal:
        players: playersRaw.length ?? 0,
        maxPlayers: state.maxplayers ?? null,

        // extra (lista de nombres)
        playersList: players,
      });
    } catch (e: any) {
      lastErr = e;
    }
  }

  return NextResponse.json(
    {
      ok: false,
      error: "no_response_on_ports",
      tried: [...new Set(candidates)],
      message: lastErr?.message || "No responde",
    },
    { status: 200 }
  );
}
