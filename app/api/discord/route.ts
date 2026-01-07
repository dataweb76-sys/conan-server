import { NextResponse } from "next/server";

export async function GET() {
  const guildId = process.env.DISCORD_GUILD_ID;

  // En vez de tirar 400, devolvemos 200 con ok:false
  // así NO rompe consola con "Failed to load resource"
  if (!guildId) {
    return NextResponse.json({
      ok: false,
      error: "missing_DISCORD_GUILD_ID",
      presence_count: null,
    });
  }

  try {
    const res = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        error: "widget_not_available",
        presence_count: null,
      });
    }

    const data = await res.json();

    return NextResponse.json({
      ok: true,
      presence_count: data?.presence_count ?? null,
      name: data?.name ?? null,
      invite: data?.instant_invite ?? null,
    });
  } catch {
    return NextResponse.json({
      ok: false,
      error: "fetch_failed",
      presence_count: null,
    });
  }
}
