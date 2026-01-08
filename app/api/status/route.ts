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
    maxAttempts: 1,
    socketTimeout: 3000, // Un poco más de tiempo para servidores lentos
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const host = searchParams.get("ip") || searchParams.get("host");
  const portStr = searchParams.get("port");
  const qportStr = searchParams.get("qport");

  if (!host) {
    return NextResponse.json({ ok: false, error: "missing_host" }, { status: 400 });
  }

  const gamePort = portStr ? Number(portStr) : NaN;
  const qport = qportStr ? Number(qportStr) : NaN;

  const candidates: number[] = [];
  if (Number.isFinite(qport)) candidates.push(qport);
  if (Number.isFinite(gamePort)) {
    candidates.push(gamePort, gamePort + 1, gamePort + 2, gamePort + 10, 27015, 27016, 27017);
  }

  const ports = [...new Set(candidates)].filter((p) => Number.isFinite(p));

  let lastErr: any = null;

  for (const p of ports) {
    try {
      const state = await tryQuery(host, p);

      // Extracción robusta de nombres de jugadores
      const rawPlayers = Array.isArray(state?.players) ? state.players : [];
      const playerNames = rawPlayers
        .map((pl: any) => {
          // Gamedig a veces pone el nombre en 'name', otras en 'raw.name'
          const name = pl?.name || pl?.raw?.name || pl?.id;
          return name ? String(name).trim() : "";
        })
        .filter((n: string) => n.length > 0)
        .slice(0, 100);

      return NextResponse.json({
        ok: true,
        usedPort: p,
        name: state?.name ?? null,
        map: state?.map ?? null,
        playersCount: state?.players?.length ?? rawPlayers.length,
        maxPlayers: state?.maxplayers ?? null,
        players: playerNames,
      });
    } catch (e: any) {
      lastErr = e;
    }
  }

  return NextResponse.json({
    ok: false,
    error: "no_response",
    message: lastErr?.message || "Servidor no responde",
  });
}