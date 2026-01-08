"use client";

import { useEffect, useMemo, useState } from "react";
import RewardsPanel from "@/components/RewardsPanel";

export type ServerInfo = {
  slug: string;
  title: string;
  subtitle?: string;

  description?: string;
  rules?: string;

  ip: string;
  port: number;
  qport?: number;

  image?: string;
  modsCount?: number;

  voteUrl?: string;
  gallery?: string[];
  modsUrl?: string;
};

type StatusOk = {
  ok: true;
  usedPort?: number;
  name?: string | null;
  map?: string | null;
  playersCount?: number;
  maxPlayers?: number | null;
  players?: string[];
};

type ServerStatus =
  | { state: "loading" }
  | { state: "offline"; error?: string }
  | { state: "ok"; data: StatusOk };

export default function ServerModal({
  open,
  onClose,
  server,
  discordUrl,
  facebookUrl,
}: {
  open: boolean;
  onClose: () => void;
  server: ServerInfo | null;
  discordUrl: string;
  facebookUrl: string;
}) {
  const [status, setStatus] = useState<ServerStatus>({ state: "loading" });

  const connectString = useMemo(() => {
    if (!server) return "";
    return `${server.ip}:${server.port}`;
  }, [server]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!open || !server) return;

      setStatus({ state: "loading" });

      try {
        const url =
          `/api/status?ip=${encodeURIComponent(server.ip)}` +
          `&port=${encodeURIComponent(String(server.port))}` +
          (server.qport ? `&qport=${encodeURIComponent(String(server.qport))}` : "");

        const res = await fetch(url, { cache: "no-store" });
        const data = (await res.json().catch(() => ({}))) as any;

        if (!alive) return;

        if (!res.ok || data?.ok !== true) {
          setStatus({ state: "offline", error: data?.error || "offline" });
          return;
        }

        setStatus({ state: "ok", data });
      } catch (e: any) {
        if (!alive) return;
        setStatus({ state: "offline", error: e?.message || "error" });
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [open, server]);

  if (!open || !server) return null;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareFacebook = () => {
    const u = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(u, "_blank", "noopener,noreferrer");
  };

  const shareInstagram = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {}
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const copyConnect = async () => {
    try {
      await navigator.clipboard.writeText(connectString);
      alert("✅ Copiado: " + connectString);
    } catch {
      alert("❌ No se pudo copiar. IP: " + connectString);
    }
  };

  const openVote = () => {
    if (!server.voteUrl) return;
    window.open(server.voteUrl, "_blank", "noopener,noreferrer");
  };

  const playersCount = status.state === "ok" ? (status.data.playersCount ?? 0) : 0;
  const maxPlayers = status.state === "ok" ? status.data.maxPlayers : null;
  const players = status.state === "ok" ? (status.data.players ?? []) : [];

  return (
    <div className="fixed inset-0 z-[100]">
      <button aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-black/70" />

      <div className="relative z-[101] mx-auto mt-10 w-[95vw] max-w-5xl rounded-2xl border border-white/10 bg-[#0b0f17] text-white shadow-2xl">
        <div className="relative overflow-hidden rounded-t-2xl border-b border-white/10">
          {server.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={server.image} alt={server.title} className="h-48 w-full object-cover opacity-90" />
          ) : (
            <div className="h-48 w-full bg-gradient-to-r from-white/10 to-white/5" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/60 to-transparent" />

          <div className="absolute left-5 right-5 bottom-4 flex items-end justify-between gap-4">
            <div>
              <div className="text-2xl font-extrabold">{server.title}</div>
              {server.subtitle ? <div className="text-sm text-white/70">{server.subtitle}</div> : null}
            </div>

            <button
              onClick={onClose}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              Cerrar ✕
            </button>
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">Estado del servidor</div>

                {status.state === "loading" ? (
                  <span className="text-xs text-white/70">Cargando…</span>
                ) : status.state === "offline" ? (
                  <span className="text-xs rounded-full bg-red-500/20 px-2 py-1 text-red-200">Offline</span>
                ) : (
                  <span className="text-xs rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-200">Online</span>
                )}
              </div>

              <div className="mt-3 grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">IP</span>
                  <span className="font-mono">{connectString}</span>
                </div>

                {server.qport ? (
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Query</span>
                    <span className="font-mono">{server.qport}</span>
                  </div>
                ) : null}

                {typeof server.modsCount === "number" ? (
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Mods</span>
                    <span className="font-semibold">{server.modsCount}</span>
                  </div>
                ) : null}

                {status.state === "ok" ? (
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Jugadores</span>
                    <span className="font-semibold">
                      {playersCount}
                      {typeof maxPlayers === "number" ? `/${maxPlayers}` : ""}
                    </span>
                  </div>
                ) : status.state === "offline" ? (
                  <div className="mt-2 text-xs text-white/60">No responde ahora mismo (puede estar reiniciando).</div>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={copyConnect}
                    className="rounded-lg bg-white text-black px-3 py-2 text-sm font-semibold hover:opacity-90"
                  >
                    Copiar IP
                  </button>

                  <button
                    onClick={() => alert(`Para entrar: Conan Exiles → Direct Connect → ${connectString}`)}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                  >
                    Cómo entrar
                  </button>

                  {server.voteUrl ? (
                    <button
                      onClick={openVote}
                      className="rounded-lg bg-amber-400 text-black px-3 py-2 text-sm font-semibold hover:opacity-90"
                    >
                      Votar
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Descripción</div>
              <div className="mt-2 text-sm text-white/75 whitespace-pre-line leading-relaxed">
                {server.description ?? "—"}
              </div>
            </div>

            {server.rules ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Reglas</div>
                <div className="mt-2 text-sm text-white/75 whitespace-pre-line leading-relaxed">{server.rules}</div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Quién está jugando</div>

              {status.state === "loading" ? (
                <div className="mt-2 text-sm text-white/70">Cargando…</div>
              ) : status.state === "offline" ? (
                <div className="mt-2 text-sm text-white/70">No disponible (server offline).</div>
              ) : players.length > 0 ? (
                <ul className="mt-2 text-sm max-h-48 overflow-auto space-y-1">
                  {players.map((p) => (
                    <li key={p} className="text-white/80">
                      • {p}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2 text-sm text-white/70">No hay jugadores online ahora.</div>
              )}
            </div>

            <RewardsPanel slug={server.slug} />

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Comunidad</div>

              <div className="mt-3 grid gap-2">
                <a
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 text-center"
                  href={discordUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Discord
                </a>

                <a
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 text-center"
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={shareFacebook}
                    className="rounded-lg bg-blue-600 text-white px-3 py-2 text-sm font-semibold hover:opacity-90"
                  >
                    Compartir FB
                  </button>
                  <button
                    onClick={shareInstagram}
                    className="rounded-lg bg-pink-600 text-white px-3 py-2 text-sm font-semibold hover:opacity-90"
                  >
                    Compartir IG
                  </button>
                </div>

                <div className="mt-1 text-xs text-white/60">
                  Instagram: se copia el link y se abre Instagram (pegalo en historia/post).
                </div>
              </div>
            </div>

            {server.gallery?.length ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Galería</div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {server.gallery.slice(0, 6).map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={src} src={src} alt="" className="h-20 w-full rounded-lg object-cover" />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4 text-xs text-white/60">
          <div>LOS ANTIGUOS • Conan Exiles</div>
          <div className="text-white/50">ESC para cerrar</div>
        </div>
      </div>
    </div>
  );
}
