import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// gamedig NO tiene types oficiales + rompe build si lo importás normal.
// Con require evitás el error de TypeScript ("declaration file") y ayuda al bundling.
const { GameDig } = require("gamedig") as any;

async function tryQuery(host: string, port: number) {
  return await GameDig.query({
    type: "conanexiles",
    host,
    port,
    maxAttempts: 1,
    socketTimeout: 1800,
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Aceptamos ip o host (vos estabas llamando con ip)
  const host = searchParams.get("ip") || searchParams.get("host");

  // port = puerto del juego (7777, 7779, etc.)
  const portStr = searchParams.get("port");
  // qport = query port (270xx)
  const qportStr = searchParams.get("qport");

  if (!host) {
    return NextResponse.json({ state: "offline", error: "missing_host" }, { status: 400 });
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
    return NextResponse.json({ state: "offline", error: "missing_port_and_qport" }, { status: 400 });
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

      // 🔥 IMPORTANTE: devolvemos los nombres EXACTOS que tu ServerModal usa:
      // state:"ok", players, maxPlayers, name, map
      return NextResponse.json({
        state: "ok",
        usedPort: p,
        name: state.name ?? null,
        map: state.map ?? null,
        players: playersRaw.length ?? 0,
        maxPlayers: state.maxplayers ?? state.maxPlayers ?? null,
        playerNames: players,
      });
    } catch (e: any) {
      lastErr = e;
    }
  }

  return NextResponse.json(
    {
      state: "offline",
      error: "no_response_on_ports",
      tried: [...new Set(candidates)],
      message: lastErr?.message || "No responde",
    },
    { status: 200 }
  );
}
