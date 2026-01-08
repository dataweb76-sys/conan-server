"use client";

import { useEffect, useMemo, useState } from "react";

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
        const url = `/api/status?ip=${encodeURIComponent(server.ip)}&port=${server.port}${server.qport ? `&qport=${server.qport}` : ""}`;
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        if (!alive) return;
        if (!res.ok || data?.ok !== true) {
          setStatus({ state: "offline", error: data?.error });
          return;
        }
        setStatus({ state: "ok", data });
      } catch (e: any) {
        if (!alive) return;
        setStatus({ state: "offline", error: e?.message });
      }
    }
    load();
    return () => { alive = false; };
  }, [open, server]);

  if (!open || !server) return null;

  const players = status.state === "ok" ? (status.data.players ?? []) : [];
  const playersCount = status.state === "ok" ? (status.data.playersCount ?? 0) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-[101] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0f17] text-white shadow-2xl custom-scrollbar">
        {/* Header con Imagen */}
        <div className="relative h-48 w-full overflow-hidden">
          {server.image ? (
            <img src={server.image} alt="" className="h-full w-full object-cover opacity-60" />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h2 className="text-3xl font-black uppercase tracking-tight">{server.title}</h2>
            <p className="text-white/60">{server.subtitle}</p>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 rounded-full bg-black/50 p-2 hover:bg-white/10 transition-colors">✕</button>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-3">
          {/* Columna Izquierda: Info Principal */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <span className="text-[10px] uppercase text-white/40 font-bold">Estado</span>
                <div className="mt-1 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${status.state === 'ok' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`} />
                  <span className="font-bold">{status.state === 'ok' ? 'ONLINE' : status.state === 'loading' ? 'CARGANDO...' : 'OFFLINE'}</span>
                </div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <span className="text-[10px] uppercase text-white/40 font-bold">Jugadores</span>
                <div className="mt-1 font-bold text-xl">
                  {playersCount} <span className="text-white/30 text-sm">/ {status.state === 'ok' ? status.data.maxPlayers : '--'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-5">
              <h3 className="text-sm font-bold uppercase text-white/40 mb-3">Dirección de Conexión</h3>
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5">
                <code className="text-emerald-400 font-mono">{connectString}</code>
                <button 
                  onClick={() => { navigator.clipboard.writeText(connectString); alert("IP Copiada"); }}
                  className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors"
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white/40 mb-2">Descripción</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-line bg-white/5 p-4 rounded-xl border border-white/10">
                  {server.description || "Sin descripción disponible."}
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Jugadores y RRSS */}
          <div className="space-y-6">
            <div className="rounded-xl bg-white/5 border border-white/10 p-5">
              <h3 className="text-sm font-bold uppercase text-white/40 mb-4 flex items-center justify-between">
                En Línea
                <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[10px]">{players.length} conectados</span>
              </h3>
              
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {players.length > 0 ? (
                  players.map((name, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 p-2.5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium text-white/90">{name}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/20 text-sm border border-dashed border-white/10 rounded-lg">
                    {status.state === 'loading' ? 'Buscando supervivientes...' : 'No hay jugadores ahora'}
                  </div>
                )}
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="grid grid-cols-2 gap-2">
              <a href={discordUrl} target="_blank" className="flex items-center justify-center gap-2 bg-[#5865F2] hover:opacity-90 py-3 rounded-xl font-bold text-sm transition-opacity">
                Discord
              </a>
              <a href={facebookUrl} target="_blank" className="flex items-center justify-center gap-2 bg-[#1877F2] hover:opacity-90 py-3 rounded-xl font-bold text-sm transition-opacity">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}