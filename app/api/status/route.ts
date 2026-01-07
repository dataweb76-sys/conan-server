import { NextResponse } from "next/server";
import dgram from "dgram";

const A2S_INFO = Buffer.from([
  0xff, 0xff, 0xff, 0xff,
  0x54,
  ...Buffer.from("Source Engine Query\0")
]);

const A2S_PLAYER = Buffer.from([
  0xff, 0xff, 0xff, 0xff,
  0x55,
  0xff, 0xff, 0xff, 0xff
]);

function udpQuery(host: string, port: number, payload: Buffer, timeout = 2000) {
  return new Promise<Buffer>((resolve, reject) => {
    const socket = dgram.createSocket("udp4");

    const timer = setTimeout(() => {
      socket.close();
      reject(new Error("timeout"));
    }, timeout);

    socket.on("message", (msg) => {
      clearTimeout(timer);
      socket.close();
      resolve(msg);
    });

    socket.send(payload, port, host);
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ip = searchParams.get("ip");
  const port = Number(searchParams.get("qport") || searchParams.get("port"));

  if (!ip || !port) {
    return NextResponse.json({ ok: false, error: "missing_ip_or_port" }, { status: 400 });
  }

  try {
    // INFO
    const info = await udpQuery(ip, port, A2S_INFO);

    const players = info.readUInt8(6);
    const maxPlayers = info.readUInt8(7);

    // PLAYERS (opcional, muchos servers NO lo permiten)
    let playerNames: string[] = [];

    try {
      const challenge = await udpQuery(ip, port, A2S_PLAYER);
      const realQuery = Buffer.from(A2S_PLAYER);
      challenge.copy(realQuery, 5, 5, 9);

      const playersRes = await udpQuery(ip, port, realQuery);

      let offset = 6;
      const count = playersRes.readUInt8(offset++);
      for (let i = 0; i < count; i++) {
        offset++; // index
        let name = "";
        while (playersRes[offset] !== 0x00) {
          name += String.fromCharCode(playersRes[offset++]);
        }
        offset++; // null byte
        offset += 8; // score + duration
        if (name) playerNames.push(name);
      }
    } catch {
      // server no expone jugadores → normal
    }

    return NextResponse.json({
      ok: true,
      players,
      maxPlayers,
      playerNames,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "offline" }, { status: 200 });
  }
}
