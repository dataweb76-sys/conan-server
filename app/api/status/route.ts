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
      attemptTimeout: 5000,
    });

    return NextResponse.json({
      online: true,
      name: state.name,
      map: state.map || "Exiled Lands",
      version: state.raw?.version || "N/A",
      playersCount: state.players.length,
      maxPlayers: state.maxplayers,
      players: state.players
        .map((pl: any) => ({
          name: pl.name,
          time: Math.floor(pl?.raw?.time || pl?.time || 0)
        }))
        .filter((p: any) => p.name !== "Superviviente" && p.name !== "")
        .slice(0, 50),
    });
  } catch (error) {
    return NextResponse.json({
      online: false,
      playersCount: 0,
      maxPlayers: 40,
      players: []
    });
  }
}