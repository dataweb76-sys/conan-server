import { NextResponse } from "next/server";
const Gamedig = require("gamedig");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get("ip") || "190.174.182.236";
  const port = parseInt(searchParams.get("port") || "27017");

  try {
    const state = await Gamedig.query({
      type: "conanexiles",
      host: ip,
      port: port,
      attemptTimeout: 10000,
    });

    return NextResponse.json({
      online: true,
      name: state.name,
      map: state.map,
      playersCount: state.players ? state.players.length : 0,
      maxPlayers: state.maxplayers,
    });
  } catch (error) {
    return NextResponse.json({
      online: false,
      playersCount: 0,
      maxPlayers: 40,
    });
  }
}