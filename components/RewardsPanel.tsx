"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { SERVERS } from "@/lib/servers";

async function claim(action: "enter" | "share", slug: string) {
  const res = await fetch("/api/rewards/claim", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, slug }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export default function RewardsPanel({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const [msg, setMsg] = useState<string>("");

  // ✅ fallback para que no crashee si el slug no existe
  const s =
    // @ts-ignore
    (SERVERS as any)[slug] ??
    {
      title: slug,
      modsCount: 0,
      rewardEnter: "Recompensa por entrar",
      rewardShare: "Recompensa por compartir",
    };

  const ensureLogin = async () => {
    if (!session) {
      await signIn("discord");
      return false;
    }
    return true;
  };

  const onEnter = async () => {
    setMsg("");
    if (!(await ensureLogin())) return;

    const r = await claim("enter", slug);
    if (!r.ok && r.data?.error === "already_claimed_today") {
      setMsg("✅ Ya reclamaste el premio de HOY por entrar.");
      return;
    }
    if (!r.ok) {
      setMsg("❌ Error reclamando premio.");
      return;
    }
    setMsg(`🎁 Premio generado: ${r.data.code} — ${s.rewardEnter}`);
  };

  const onShare = async (platform: "facebook" | "instagram") => {
    setMsg("");
    if (!(await ensureLogin())) return;

    const url = window.location.href;

    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else {
      try {
        await navigator.clipboard?.writeText(url);
      } catch {}
      window.open("https://www.instagram.com/", "_blank");
    }

    const r = await claim("share", slug);
    if (!r.ok && r.data?.error === "already_claimed_today") {
      setMsg("✅ Ya reclamaste el premio de HOY por compartir.");
      return;
    }
    if (!r.ok) {
      setMsg("❌ Error reclamando premio.");
      return;
    }
    setMsg(`🎁 Premio generado: ${r.data.code} — ${s.rewardShare}`);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold">🎁 Premios</div>
      <div className="text-xs text-white/70 mt-1">
        Mods: <b>{s.modsCount === 0 ? "Sin mods" : s.modsCount}</b>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <button
          onClick={onEnter}
          className="rounded-lg bg-white text-black px-3 py-2 text-sm font-semibold hover:opacity-90"
        >
          Entrar al server (premio)
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onShare("facebook")}
            className="flex-1 rounded-lg bg-blue-600 text-white px-3 py-2 text-sm font-semibold hover:opacity-90"
          >
            Compartir Facebook (premio)
          </button>
          <button
            onClick={() => onShare("instagram")}
            className="flex-1 rounded-lg bg-pink-600 text-white px-3 py-2 text-sm font-semibold hover:opacity-90"
          >
            Compartir Instagram (premio)
          </button>
        </div>

        {msg && <div className="text-xs mt-2 text-white/80">{msg}</div>}
      </div>
    </div>
  );
}
