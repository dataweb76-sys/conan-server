import { NextResponse } from "next/server";
import dgram from "node:dgram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type A2SInfo = {
  name: string | null;
  map: string | null;
  players: number | null;
  maxPlayers: number | null;
};

function readCString(buf: Buffer, offset: number) {
  let end = offset;
  while (end < buf.length && buf[end] !== 0x00) end++;
  const str = buf.toString("utf8", offset, end);
  return { str, next: end + 1 };
}

function withTimeout<T>(p: Promise<T>, ms: number, label = "timeout") {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(label)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

async function udpRequest(host: string, port: number, payload: Buffer, timeoutMs = 1800) {
  const sock = dgram.createSocket("udp4");

  return await withTimeout(
    new Promise<Buffer>((resolve, reject) => {
      sock.once("error", (err) => {
        try {
          sock.close();
        } catch {}
        reject(err);
      });

      sock.once("message", (msg) => {
        try {
          sock.close();
        } catch {}
        resolve(msg);
      });

      sock.send(payload, port, host, (err) => {
        if (err) {
          try {
            sock.close();
          } catch {}
          reject(err);
        }
      });
    }),
    timeoutMs
  );
}

// A2S: 0xFFFFFFFF + 'TSource Engine Query\0'
const A2S_INFO = Buffer.concat([Buffer.from([0xff, 0xff, 0xff, 0xff, 0x54]), Buffer.from("Source Engine Query\0")]);

// A2S_PLAYER: 0xFFFFFFFF + 0x55 + challenge(4 bytes)
// si mandás challenge = 0xFFFFFFFF, te responde con 0x41 challenge
function a2sPlayer(challenge: Buffer) {
  return Buffer.concat([Buffer.from([0xff, 0xff, 0xff, 0xff, 0x55]), challenge]);
}

async function queryInfo(host: string, qport: number): Promise<A2SInfo> {
  // 1) INFO
  let res = await udpRequest(host, qport, A2S_INFO);

  // Challenge para INFO (algunos servers la piden)
  // Si header = 0x41 => challenge response
  if (res.length >= 9 && res.readInt32LE(0) === -1 && res[4] === 0x41) {
    const challenge = res.subarray(5, 9); // 4 bytes
    const infoWithChallenge = Buffer.concat([A2S_INFO, challenge]);
    res = await udpRequest(host, qport, infoWithChallenge);
  }

  // Parse INFO
  // formato esperado: -1 (int32), header 0x49
  if (!(res.length >= 6 && res.readInt32LE(0) === -1 && res[4] === 0x49)) {
    return { name: null, map: null, players: null, maxPlayers: null };
  }

  let off = 5; // header 0x49 ya consumido
  off += 1; // protocol byte

  const nameR = readCString(res, off);
  off = nameR.next;

  const mapR = readCString(res, off);
  off = mapR.next;

  // folder, game (no los usamos)
  const folderR = readCString(res, off);
  off = folderR.next;

  const gameR = readCString(res, off);
  off = gameR.next;

  // id (short)
  if (off + 2 <= res.length) off += 2;

  const players = off < res.length ? res.readUInt8(off) : null;
  off += 1;

  const maxPlayers = off < res.length ? res.readUInt8(off) : null;

  return {
    name: nameR.str || null,
    map: mapR.str || null,
    players: typeof players === "number" ? players : null,
    maxPlayers: typeof maxPlayers === "number" ? maxPlayers : null,
  };
}

async function queryPlayers(host: string, qport: number): Promise<string[]> {
  // 1) pedir challenge
  let res = await udpRequest(host, qport, a2sPlayer(Buffer.from([0xff, 0xff, 0xff, 0xff])));
  if (!(res.length >= 9 && res.readInt32LE(0) === -1 && res[4] === 0x41)) {
    return [];
  }
  const challenge = res.subarray(5, 9);

  // 2) pedir players con challenge
  res = await udpRequest(host, qport, a2sPlayer(challenge));

  // response: -1, header 0x44, numPlayers, ...
  if (!(res.length >= 6 && res.readInt32LE(0) === -1 && res[4] === 0x44)) {
    return [];
  }

  let off = 5;
  const num = res.readUInt8(off);
  off += 1;

  const names: string[] = [];
  for (let i = 0; i < num && off < res.length; i++) {
    // index byte
    off += 1;
    const n = readCString(res, off);
    off = n.next;

    // score int32
    if (off + 4 <= res.length) off += 4;
    // duration float32
    if (off + 4 <= res.length) off += 4;

    const clean = (n.str || "").trim();
    if (clean) names.push(clean);
  }

  return names.slice(0, 50);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // tu front llama con ip y port y qport
  const host = searchParams.get("ip") || searchParams.get("host");
  const qportStr = searchParams.get("qport") || "";

  if (!host) {
    return NextResponse.json({ state: "offline", error: "missing_host" }, { status: 400 });
  }

  const qport = Number(qportStr);

  if (!Number.isFinite(qport)) {
    return NextResponse.json({ state: "offline", error: "missing_qport" }, { status: 400 });
  }

  try {
    const info = await queryInfo(host, qport);

    // players list (si falla, igual devolvemos info)
    let playerNames: string[] = [];
    try {
      playerNames = await queryPlayers(host, qport);
    } catch {}

    // devolvemos EXACTO lo que tu modal espera
    return NextResponse.json({
      state: "ok",
      name: info.name,
      map: info.map,
      players: info.players ?? 0,
      maxPlayers: info.maxPlayers ?? null,
      playerNames,
    });
  } catch (e: any) {
    return NextResponse.json(
      { state: "offline", error: "query_failed", message: e?.message || "No responde" },
      { status: 200 }
    );
  }
}
