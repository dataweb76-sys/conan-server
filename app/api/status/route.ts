import { NextResponse } from "next/server";
import dgram from "node:dgram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InfoResult = {
  name: string | null;
  map: string | null;
  players: number | null;
  maxPlayers: number | null;
};

function readNullTerminated(buf: Buffer, offset: number) {
  const end = buf.indexOf(0x00, offset);
  if (end === -1) return { value: "", next: buf.length };
  return { value: buf.slice(offset, end).toString("utf8"), next: end + 1 };
}

async function udpRequest(host: string, port: number, payload: Buffer, timeoutMs = 1800): Promise<Buffer> {
  return await new Promise((resolve, reject) => {
    const socket = dgram.createSocket("udp4");

    const timer = setTimeout(() => {
      socket.close();
      reject(new Error("timeout"));
    }, timeoutMs);

    socket.once("error", (err) => {
      clearTimeout(timer);
      socket.close();
      reject(err);
    });

    socket.once("message", (msg) => {
      clearTimeout(timer);
      socket.close();
      resolve(msg);
    });

    socket.send(payload, port, host, (err) => {
      if (err) {
        clearTimeout(timer);
        socket.close();
        reject(err);
      }
    });
  });
}

const HEADER = Buffer.from([0xff, 0xff, 0xff, 0xff]);

async function a2sInfo(host: string, port: number): Promise<InfoResult> {
  // A2S_INFO request: 0xFFFFFFFF + "TSource Engine Query\0"
  const req = Buffer.concat([HEADER, Buffer.from("TSource Engine Query\0", "utf8")]);
  const res = await udpRequest(host, port, req);

  if (res.length < 6 || res.readInt32LE(0) !== -1) throw new Error("bad_header");
  const type = res.readUInt8(4);
  if (type !== 0x49) throw new Error("bad_type");

  let off = 5;
  // protocol byte
  off += 1;

  const nameR = readNullTerminated(res, off);
  off = nameR.next;

  const mapR = readNullTerminated(res, off);
  off = mapR.next;

  // folder + game (skip content)
  const folderR = readNullTerminated(res, off);
  off = folderR.next;

  const gameR = readNullTerminated(res, off);
  off = gameR.next;

  // AppID (2 bytes)
  off += 2;

  const players = res.readUInt8(off);
  off += 1;

  const maxPlayers = res.readUInt8(off);
  off += 1;

  return {
    name: nameR.value || null,
    map: mapR.value || null,
    players: Number.isFinite(players) ? players : null,
    maxPlayers: Number.isFinite(maxPlayers) ? maxPlayers : null,
  };
}

async function a2sPlayers(host: string, port: number): Promise<string[]> {
  // A2S_PLAYER requires challenge
  const CHALLENGE = Buffer.from([0xff, 0xff, 0xff, 0xff, 0x55, 0xff, 0xff, 0xff, 0xff]);
  const chalRes = await udpRequest(host, port, CHALLENGE);

  // Some servers block this; return empty list in that case.
  if (chalRes.length < 9 || chalRes.readInt32LE(0) !== -1 || chalRes.readUInt8(4) !== 0x41) return [];

  const challenge = chalRes.slice(5, 9); // 4 bytes

  const req = Buffer.concat([HEADER, Buffer.from([0x55]), challenge]);
  const res = await udpRequest(host, port, req);

  if (res.length < 6 || res.readInt32LE(0) !== -1 || res.readUInt8(4) !== 0x44) return [];

  let off = 5;
  const num = res.readUInt8(off);
  off += 1;

  const names: string[] = [];
  for (let i = 0; i < num && off < res.length; i++) {
    // index byte
    off += 1;

    const n = readNullTerminated(res, off);
    off = n.next;

    // score (int32) + duration (float32)
    off += 4 + 4;

    const clean = (n.value || "").trim();
    if (clean) names.push(clean);
  }

  return names.slice(0, 25);
}

async function queryServer(host: string, port: number) {
  const info = await a2sInfo(host, port);

  let playersList: string[] = [];
  try {
    playersList = await a2sPlayers(host, port);
  } catch {
    playersList = [];
  }

  return {
    ok: true,
    usedPort: port,
    name: info.name,
    map: info.map,
    playersCount: info.players ?? (playersList.length || 0),
    maxPlayers: info.maxPlayers,
    players: playersList,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Support both naming styles:
  // frontend: ip, port, qport
  // alt: host, port, queryPort
  const host = searchParams.get("ip") || searchParams.get("host");
  const portStr = searchParams.get("port");
  const qportStr = searchParams.get("qport") || searchParams.get("queryPort");

  if (!host) return NextResponse.json({ ok: false, error: "missing_host" }, { status: 400 });

  const gamePort = portStr ? Number(portStr) : NaN;
  const qport = qportStr ? Number(qportStr) : NaN;

  const candidates: number[] = [];
  if (Number.isFinite(qport)) candidates.push(qport);
  if (Number.isFinite(gamePort)) candidates.push(gamePort, gamePort + 1, gamePort + 2, gamePort + 10);

  if (candidates.length === 0) {
    return NextResponse.json({ ok: false, error: "missing_port_and_qport" }, { status: 400 });
  }

  let lastErr: any = null;

  for (const p of [...new Set(candidates)]) {
    try {
      const data = await queryServer(host, p);
      return NextResponse.json(data, { status: 200 });
    } catch (e: any) {
      lastErr = e;
    }
  }

  // Devolvemos 200 con ok:false para que tu UI lo trate como "offline" sin romper
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
