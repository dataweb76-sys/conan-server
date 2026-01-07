import { NextResponse } from "next/server";
import dgram from "dgram";

function queryA2S(host: string, port: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket("udp4");
    const message = Buffer.from([
      0xff, 0xff, 0xff, 0xff,
      0x54,
      ...Buffer.from("Source Engine Query\0"),
    ]);

    const timeout = setTimeout(() => {
      socket.close();
      reject(new Error("timeout"));
    }, 2000);

    socket.on("message", (msg) => {
      clearTimeout(timeout);
      socket.close();

      let offset = 6; // skip header
      const readString = () => {
        const end = msg.indexOf(0x00, offset);
        const str = msg.toString("utf8", offset, end);
        offset = end + 1;
        return str;
      };

      const name = readString();
      const map = readString();
      readString(); // folder
      readString(); // game
      offset += 2; // app id

      const players = msg.readUInt8(offset++);
      const maxPlayers = msg.readUInt8(offset++);

      resolve({
        state: "ok",
        name,
        map,
        players,
        maxPlayers,
        playerNames: [],
      });
    });

    socket.send(message, port, host);
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ip = searchParams.get("ip");
  const port = Number(searchParams.get("port"));

  if (!ip || !port) {
    return NextResponse.json(
      { state: "offline", error: "missing_ip_or_port" },
      { status: 400 }
    );
  }

  try {
    const data = await queryA2S(ip, port);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { state: "offline", error: "no_response" },
      { status: 200 }
    );
  }
}
