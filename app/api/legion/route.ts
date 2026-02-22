import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "legion.json");

function readData() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeData(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { steam, faction } = body;

  if (!steam || !faction) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const data = readData();

  // Ya registrado
  if (data.find((p: any) => p.steam.toLowerCase() === steam.toLowerCase())) {
    return NextResponse.json({ error: "Ya registrado" }, { status: 400 });
  }

  // Límite por facción (20)
  const factionCount = data.filter((p: any) => p.faction === faction).length;
  if (factionCount >= 20) {
    return NextResponse.json({ error: "Facción llena" }, { status: 400 });
  }

  data.push({
    steam,
    faction,
    date: new Date().toISOString()
  });

  writeData(data);

  return NextResponse.json({ success: true });
}