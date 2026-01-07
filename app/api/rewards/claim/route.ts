import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function dayKeyUTC(d = new Date()) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function makeCode(prefix: string) {
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  return `${prefix}-${ts}${rnd}`;
}

async function notifyDiscord(content: string) {
  const url = process.env.DISCORD_REWARDS_WEBHOOK;
  if (!url) return;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  // @ts-ignore
  const discordId = session?.discord_id;
  // @ts-ignore
  const discordName = session?.discord_name;

  if (!discordId) {
    return NextResponse.json({ ok: false, error: "not_logged_in" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const action = String(body?.action ?? "");
  const server_slug = String(body?.slug ?? "");

  if (!["enter", "share"].includes(action)) {
    return NextResponse.json({ ok: false, error: "invalid_action" }, { status: 400 });
  }
  if (!server_slug) {
    return NextResponse.json({ ok: false, error: "missing_slug" }, { status: 400 });
  }

  const day_key = dayKeyUTC();
  const prefix = action === "share" ? "LA-SHARE" : "LA-ENTER";
  const code = makeCode(prefix);

  const { error } = await supabaseAdmin.from("reward_claims").insert([
    {
      user_id: String(discordId),
      user_name: String(discordName ?? ""),
      action,
      server_slug,
      day_key,
    },
  ]);

  if (error) {
    return NextResponse.json({ ok: false, error: "already_claimed_today", day_key }, { status: 409 });
  }

  await notifyDiscord(
    `🎁 **REWARD CLAIM**\nUsuario: **${discordName ?? "?"}** (${discordId})\nAcción: **${action}**\nServer: **${server_slug}**\nDía: ${day_key}\nCódigo: **${code}**`
  );

  return NextResponse.json({ ok: true, code, day_key, action, server_slug });
}
