import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QueryResult = {
  name?: string;
  map?: string;
  players?: any[];
  maxplayers?: number;
};

async function tryQuery(host: string, port: number): Promise<QueryResult> {
  // OJO:
  // Usamos eval("require") para que Next/Turbopack NO intente resolver imports internos
  // (esto evita el error: Can't resolve '@keyv/redis' ... etc)
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const req = (0, eval)("require") as NodeRequire;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { GameDig } = req("gamedig") as any;

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

  // Aceptamos ambos nombres porque en tu front usaste ip y antes habíamos puesto host
  const host = searchParams.get("host") || searchParams.get("ip");
  const portStr = searchParams.get("port"); // puerto del juego
  const qportStr = searchParams.get("qport"); // query port

  if (!host) {
    return NextResponse.json(
      { state: "offline", ok: false, error: "missing_host_or_ip" },
      { status: 400 }
    );
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
    return NextResponse.json(
      { state: "offline", ok: false, error: "missing_port_and_qport" },
      { status: 400 }
    );
  }

  let lastErr: any = null;

  for (const p of [...new Set(candidates)]) {
    try {
      const state = await tryQuery(host, p);

      const playersRaw = Array.isArray(state.players) ? state.players : [];
      const playerNames = playersRaw
        .map((pl: any) => String(pl?.name ?? "").trim())
        .filter(Boolean)
        .slice(0, 30);

      const playersCount = playersRaw.length ?? 0;
      const maxPlayers = typeof state.maxplayers === "number" ? state.maxplayers : 0;

      // IMPORTANTE: devolvemos players y maxPlayers como lo espera el ServerModal
      return NextResponse.json(
        {
          state: "ok",
          ok: true,
          online: true,
          usedPort: p,
          name: state.name ?? null,
          map: state.map ?? null,
          players: playersCount,
          maxPlayers,
          playerNames,
        },
        { status: 200 }
      );
    } catch (e: any) {
      lastErr = e;
    }
  }

  // No devolvemos 500, devolvemos 200 offline (para que tu UI no se rompa)
  return NextResponse.json(
    {
      state: "offline",
      ok: false,
      online: false,
      error: "no_response_on_ports",
      tried: [...new Set(candidates)],
      message: lastErr?.message || "No responde",
    },
    { status: 200 }
  );
}
