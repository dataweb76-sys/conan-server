"use client";

import { useEffect, useMemo, useState } from "react";

// EDITA AQUÍ TU LISTA DE MODS REALES
const MODS_REALES = [
  "Pippi - User & Server Management",
  "Fashionist v4.4.4",
  "Improved Quality of Life",
  "Unlock Plus",
  "Hosav's Custom UI Mod",
  "Level 20 - No Attributes",
  "DungeonMasterTools",
  "Shadows of Skelos",
  "ExilesExtreme",
  "Warrior+Mutant+Chef",
  "Beyond Stations",
];

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
  modsUrl?: string;
};

type Player = { name: string; time: number };
type StatusOk = { ok: true; playersCount?: number; maxPlayers?: number | null; players?: Player[]; map?: string; version?: string; };
type ServerStatus = | { state: "loading" } | { state: "offline" } | { state: "ok"; data: StatusOk };

export default function ServerModal({ open, onClose, server, discordUrl, facebookUrl }: any) {
  const [status, setStatus] = useState<ServerStatus>({ state: "loading" });
  const [showMods, setShowMods] = useState(false);

  const connectString = useMemo(() => (server ? `${server.ip}:${server.port}` : ""), [server]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (showMods ? setShowMods(false) : onClose());
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, showMods]);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!open || !server) return;
      setStatus({ state: "loading" });
      try {
        const url = `/api/status?ip=${encodeURIComponent(server.ip)}&port=${server.port}${server.qport ? `&qport=${server.qport}` : ""}`;
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        if (alive) setStatus(data.ok ? { state: "ok", data } : { state: "offline" });
      } catch { if (alive) setStatus({ state: "offline" }); }
    }
    load();
    return () => { alive = false; };
  }, [open, server]);

  if (!open || !server) return null;

  const players = status.state === "ok" ? (status.data.players ?? []) : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative z-[101] w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d111a] text-white shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
        
        {/* POPUP DE MODS */}
        {showMods && (
          <div className="absolute inset-0 z-[110] bg-[#0d111a] p-8 flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-black italic tracking-tighter uppercase text-emerald-500">Modlist Oficial</h3>
                <p className="text-white/40 text-xs uppercase font-bold tracking-widest mt-1">Total: {MODS_REALES.length} mods instalados</p>
              </div>
              <button onClick={() => setShowMods(false)} className="bg-white/5 hover:bg-white/10 h-12 w-12 rounded-full flex items-center justify-center transition-all border border-white/10">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MODS_REALES.map((mod, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all">
                    <span className="text-white/20 font-black italic text-xl group-hover:text-emerald-500 transition-colors">{(i + 1).toString().padStart(2, '0')}</span>
                    <span className="text-sm font-semibold text-white/80">{mod}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-white/40 text-xs italic">Asegúrate de tener todos los mods actualizados antes de entrar.</p>
                <a href={server.modsUrl} target="_blank" className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-black text-xs uppercase hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">Descargar Colección ↗</a>
            </div>
          </div>
        )}

        {/* VISTA PRINCIPAL */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <div className="relative h-64 w-full">
            {server.image && <img src={server.image} className="h-full w-full object-cover opacity-40" alt="" />}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d111a] via-[#0d111a]/50 to-transparent" />
            <div className="absolute bottom-10 left-10">
              <h2 className="text-6xl font-black uppercase tracking-tighter italic leading-none">{server.title}</h2>
              <p className="text-emerald-400 font-bold tracking-[0.4em] text-xs uppercase mt-2">{server.subtitle}</p>
            </div>
          </div>

          <div className="grid gap-10 p-10 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
              
              {/* Widgets de estado */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-3xl bg-white/5 border border-white/10 p-5 text-center">
                  <p className="text-[10px] text-white/30 font-black uppercase mb-2 tracking-widest">Servidor</p>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500">{status.state === 'ok' ? 'ONLINE' : 'OFFLINE'}</span>
                </div>
                <div className="rounded-3xl bg-white/5 border border-white/10 p-5 text-center">
                  <p className="text-[10px] text-white/30 font-black uppercase mb-1 tracking-widest">Población</p>
                  <span className="text-2xl font-black tracking-tighter">{status.state === 'ok' ? status.data.playersCount : 0}<span className="text-white/20 text-sm">/{status.state === 'ok' ? status.data.maxPlayers : '--'}</span></span>
                </div>
                <div className="rounded-3xl bg-white/5 border border-white/10 p-5 text-center">
                  <p className="text-[10px] text-white/30 font-black uppercase mb-2 tracking-widest">Mapa</p>
                  <span className="text-[10px] font-bold uppercase text-white/80">{status.state === 'ok' ? status.data.map : 'Exiled'}</span>
                </div>
              </div>

              {/* ACCIÓN: VOTAR */}
              <a href="https://topgameservers.net/conanexiles/server/nrcYSh89KdNehu8g4MS2" target="_blank" className="group flex items-center justify-between rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 p-6 transition-all hover:scale-[1.02] shadow-lg shadow-orange-900/20">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl animate-pulse">⭐</div>
                  <div>
                    <p className="font-black text-white text-xl leading-none">VOTA POR EL REINO</p>
                    <p className="text-xs text-white/80 mt-1 font-medium italic">¡Ayúdanos a llegar al Top #1 de Conan Exiles!</p>
                  </div>
                </div>
                <div className="bg-white text-black font-black px-6 py-3 rounded-xl text-xs uppercase group-hover:bg-black group-hover:text-white transition-colors">Votar Ahora</div>
              </a>

              {/* IP DE CONEXIÓN */}
              <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
                <h3 className="text-[10px] font-black text-white/20 uppercase mb-5 tracking-[0.2em]">Conexión Directa</h3>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 p-3 rounded-2xl border border-white/5 shadow-inner">
                  <code className="flex-1 text-emerald-400 font-mono text-base px-4 font-bold">{connectString}</code>
                  <button onClick={() => { navigator.clipboard.writeText(connectString); alert("¡IP Copiada! Pégala en el juego."); }} className="w-full sm:w-auto bg-emerald-500 text-black font-black px-10 py-4 rounded-xl text-xs uppercase hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-900/20">COPIAR IP</button>
                </div>
              </div>

              {/* BOTÓN MODS */}
              <button onClick={() => setShowMods(true)} className="w-full rounded-3xl bg-white/5 border border-white/10 p-6 flex items-center justify-between hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl group-hover:rotate-12 transition-transform">📦</span>
                    <div className="text-left">
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-none mb-1">Contenido de mods</p>
                        <p className="text-sm font-bold">Explorar el listado de {MODS_REALES.length} mods instalados</p>
                    </div>
                  </div>
                  <span className="bg-white/5 px-4 py-2 rounded-lg text-[10px] font-black uppercase">Ver Lista ➔</span>
              </button>

              <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
                <h3 className="text-[10px] font-black text-white/20 uppercase mb-4 tracking-[0.2em]">Historia del Mundo</h3>
                <p className="text-white/60 leading-relaxed text-sm whitespace-pre-line italic font-serif">"{server.description}"</p>
              </div>
            </div>

            {/* BARRA LATERAL */}
            <div className="space-y-8">
              <div className="rounded-3xl bg-white/5 border border-white/10 p-8 shadow-xl">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Jugadores</h3>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-black italic tracking-tighter">ONLINE</span>
                </div>
                <div className="max-h-[450px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {players.length > 0 ? (
                    players.map((p, i) => (
                      <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col group hover:border-emerald-500/40 transition-all">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{p.name}</span>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        </div>
                        <span className="text-[10px] text-white/20 mt-2 font-black italic uppercase tracking-widest">{Math.floor(p.time / 60)} MINS EN EL MUNDO</span>
                      </div>
                    ))
                  ) : <div className="text-center py-16 opacity-10 font-black text-4xl uppercase -rotate-12 select-none tracking-tighter">Vacío</div>}
                </div>
              </div>
              
              <div className="grid gap-3">
                <a href={discordUrl} target="_blank" className="flex items-center justify-center bg-[#5865F2] py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-blue-900/20">Discord Oficial</a>
                <a href={facebookUrl} target="_blank" className="flex items-center justify-center bg-white/5 py-5 rounded-2xl font-black text-[10px] uppercase border border-white/10 transition-all hover:bg-white/10">Facebook</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}