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
      attemptTimeout: 10000, // Aumentado a 10s para mayor estabilidad
    });

    return NextResponse.json({
      online: true,
      name: state.name || "Dragon y Dinosaurio PVEVP",
      map: state.map || "Exiled Lands",
      version: state.raw?.version || "N/A",
      playersCount: state.players ? state.players.length : 0,
      maxPlayers: state.maxplayers || 40,
      players: (state.players || [])
        .map((pl: any) => ({
          name: pl.name || "Jugador",
          time: Math.floor(pl?.raw?.time || pl?.time || 0)
        }))
        .filter((p: any) => p.name && p.name !== "Superviviente" && p.name !== "")
        .slice(0, 50),
    });
  } catch (error) {
    return NextResponse.json({
      online: false,
      name: "Dragon y Dinosaurio (Offline)",
      playersCount: 0,
      maxPlayers: 40,
      players: []
    });
  }
}