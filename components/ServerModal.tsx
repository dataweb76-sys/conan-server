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
  image?: string;
  voteUrl?: string;
};

type Status =
  | { state: "loading" }
  | { state: "offline" }
  | {
      state: "ok";
      players: number;
      maxPlayers: number;
      playerNames: string[];
    };

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
  const [status, setStatus] = useState<Status>({ state: "loading" });

  const connectString = useMemo(
    () => (server ? `${server.ip}:${server.port}` : ""),
    [server]
  );

  useEffect(() => {
    if (!open || !server) return;

    setStatus({ state: "loading" });

    fetch(`/api/status?ip=${server.ip}&port=${server.port}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.state === "ok") setStatus(d);
        else setStatus({ state: "offline" });
      })
      .catch(() => setStatus({ state: "offline" }));
  }, [open, server]);

  if (!open || !server) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70">
      <div className="mx-auto mt-10 w-[95vw] max-w-4xl rounded-xl bg-[#0b0f17] text-white p-5">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-xl font-bold">{server.title}</h2>
            <div className="text-sm text-white/60">{server.subtitle}</div>
          </div>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="mb-4">
          {status.state === "loading" && <div>Cargando estado…</div>}
          {status.state === "offline" && (
            <div className="text-red-400">Servidor offline</div>
          )}
          {status.state === "ok" && (
            <>
              <div className="font-semibold">
                Jugadores: {status.players}/{status.maxPlayers}
              </div>

              {status.playerNames.length > 0 && (
                <ul className="mt-2 text-sm max-h-32 overflow-auto">
                  {status.playerNames.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => navigator.clipboard.writeText(connectString)}
            className="bg-white text-black px-3 py-2 rounded"
          >
            Copiar IP
          </button>

          {server.voteUrl && (
            <button
              onClick={() => window.open(server.voteUrl, "_blank")}
              className="bg-amber-400 text-black px-3 py-2 rounded"
            >
              Votar
            </button>
          )}
        </div>

        <RewardsPanel slug={server.slug} />

        <div className="mt-4 flex gap-2">
          <a href={discordUrl} target="_blank" className="underline">
            Discord
          </a>
          <a href={facebookUrl} target="_blank" className="underline">
            Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
