import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function tryQuery(host: string, port: number) {
  // Import dinámico para que Next/Vercel no intente resolver los adapters internos en build
  const mod: any = await import("gamedig");

  // Compatibilidad con distintas exportaciones del paquete
  const GameDig =
    mod?.GameDig ?? mod?.default?.GameDig ?? mod?.default ?? mod;

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

  // Tu front usa ip=..., pero por las dudas soportamos host también
  const host = searchParams.get("ip") ?? searchParams.get("host");
  const portStr = searchParams.get("port"); // puerto del juego
  const qportStr = searchParams.get("qport"); // query port (SQ)

  if (!host) {
    return NextResponse.json(
      { ok: false, error: "missing_host" },
      { status: 400 }
    );
  }

  const gamePort = portStr ? Number(portStr) : NaN;
  const qport = qportStr ? Number(qportStr) : NaN;

  // Probamos varios puertos, primero qport si viene
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
      { ok: false, error: "missing_port_and_qport" },
      { status: 400 }
    );
  }

  let lastErr: any = null;

  for (const p of [...new Set(candidates)]) {
    try {
      const state = await tryQuery(host, p);

      const playersRaw = Array.isArray(state?.players) ? state.players : [];
      const players = playersRaw
        .map((pl: any) => String(pl?.name ?? "").trim())
        .filter(Boolean)
        .slice(0, 25);

      return NextResponse.json({
        ok: true,
        usedPort: p,
        name: state?.name ?? null,
        map: state?.map ?? null,
        playersCount: playersRaw.length ?? 0,
        players,
        maxplayers: state?.maxplayers ?? null,
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
    { status: 200 } // devolvemos 200 pero ok:false (así el front no explota con .json)
  );
}
