import { NextResponse } from "next/server";
import dgram from "node:dgram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readCString(buf: Buffer, offset: number) {
  let end = offset;
  while (end < buf.length && buf[end] !== 0x00) end++;
  const str = buf.toString("utf8", offset, end);
  return { str, next: end + 1 };
}

function withTimeout<T>(p: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
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

async function udpRequest(host: string, port: number, payload: Buffer, timeoutMs = 2000) {
  const sock = dgram.createSocket("udp4");

  return await withTimeout(
    new Promise<Buffer>((resolve, reject) => {
      sock.once("error", (err) => {
        try { sock.close(); } catch {}
        reject(err);
      });

      sock.once("message", (msg) => {
        try { sock.close(); } catch {}
        resolve(msg);
      });

      sock.send(payload, port, host, (err) => {
        if (err) {
          try { sock.close(); } catch {}
          reject(err);
        }
      });
    }),
    timeoutMs
  );
}

// A2S_INFO: 0xFFFFFFFF + 'TSource Engine Query\0'
const A2S_INFO = Buffer.concat([
  Buffer.from([0xff, 0xff, 0xff, 0xff, 0x54]),
  Buffer.from("Source Engine Query\0"),
]);

async function queryA2SInfo(host: string, qport: number) {
  let res = await udpRequest(host, qport, A2S_INFO);

  // Algunos servers responden challenge (0x41)
  if (res.length >= 9 && res.readInt32LE(0) === -1 && res[4] === 0x41) {
    const challenge = res.subarray(5, 9);
    const infoWithChallenge = Buffer.concat([A2S_INFO, challenge]);
    res = await udpRequest(host, qport, infoWithChallenge);
  }

  // Esperamos: -1 + 0x49
  if (!(res.length >= 6 && res.readInt32LE(0) === -1 && res[4] === 0x49)) {
    return { name: null as string | null, map: null as string | null, players: null as number | null, maxPlayers: null as number | null };
  }

  let off = 5; // header 0x49
  off += 1; // protocol

  const nameR = readCString(res, off); off = nameR.next;
  const mapR = readCString(res, off);  off = mapR.next;

  // folder, game
  const folderR = readCString(res, off); off = folderR.next;
  const gameR = readCString(res, off);   off = gameR.next;

  // id short
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const host = searchParams.get("ip") || searchParams.get("host");
  const qportStr = searchParams.get("qport");

  if (!host) {
    return NextResponse.json({ state: "offline", error: "missing_host" }, { status: 400 });
  }

  const qport = Number(qportStr);
  if (!Number.isFinite(qport)) {
    return NextResponse.json({ state: "offline", error: "missing_qport" }, { status: 400 });
  }

  try {
    const info = await queryA2SInfo(host, qport);

    return NextResponse.json({
      state: "ok",
      name: info.name,
      map: info.map,
      players: info.players ?? 0,
      maxPlayers: info.maxPlayers ?? null,
    });
  } catch (e: any) {
    return NextResponse.json(
      { state: "offline", error: "query_failed", message: e?.message || "No responde" },
      { status: 200 }
    );
  }
}
