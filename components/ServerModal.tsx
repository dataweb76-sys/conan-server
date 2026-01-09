"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, ExternalLink, Users, Play, Activity } from "lucide-react";

export default function ServerModal({ open, onClose, server }: any) {
  const [status, setStatus] = useState<any>({ state: "loading", data: null });
  const [tab, setTab] = useState<"info" | "mods">("info");

  const MODS_DATABASE: Record<string, string[]> = {
    "dragones": ["1976970830","1159180273","2050780234","3100719163","2854276803","1977450178","1629644846","2584291197","2914309509","2597952237","1906158454","3039363313","2939641714","3086070534","3362177073","3248573436","2890891645","2949501637","933782986","3478249812","2271476646","1837807092","2791028919","890509770","1435629448","2305756696","3576739923","3452606731","2340032500","1113901982","1734383367","2525703408","2633363028","1125427722","880454836","1444947329","2581110607","1369743238","3120364390","2885152026","877108545","2957239090","1386174080","2376449518","3598582240","2870019036"],
    "mods": ["880454836","1734383367","2993582399","3598582240","2050780234","933782986","1125427722","1386174080","1369802940","877108545","2279131041","1159180273","890509770","1435629448","2305756696","2850040473","2616195219","3368664134","2241631223","2976383464","2885152026","2949501637","1367404881","2633363028","1837807092","2603072116","2271476646","2870019036","3594438096","3608946367","3576739923","3452606731","2340032500","2508667158","1502970736","1976970830","2854276803"],
    "siptah": ["880454836","3086070534","1734383367","1977450178","2300463941","2854276803","2994141510","1835356127","1326031593","1125427722","2376449518","2050780234","3310298622","877108545","2870019036","2982469779","3248573436","3324113365","3210360389","2597952237","1976970830","2633363028","3039363313","3598582240","2305969565"]
  };

  const currentMods = useMemo(() => MODS_DATABASE[server?.slug] || [], [server]);

  useEffect(() => {
    if (!open || !server) return;
    setStatus({ state: "loading", data: null });
    const loadStatus = async () => {
      try {
        // Usamos la IP y el Query Port (7779) que definiste
        const res = await fetch(`/api/status?ip=${server.ip}&qport=${server.queryPort}`);
        const data = await res.json();
        data.ok ? setStatus({ state: "ok", data }) : setStatus({ state: "offline", data: null });
      } catch { setStatus({ state: "offline", data: null }); }
    };
    loadStatus();
  }, [open, server?.slug, server?.queryPort]);

  if (!open || !server) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <div className="relative w-full max-w-6xl bg-[#0b0f17] rounded-[3.5rem] border border-white/10 flex flex-col md:flex-row h-[90vh] overflow-hidden shadow-2xl">
        
        <button onClick={onClose} className="absolute top-8 right-10 text-white/50 hover:text-white text-2xl z-50">✕</button>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-[1.5] p-10 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          <div>
            <h2 className="text-4xl font-black italic uppercase text-white leading-tight">{server.title}</h2>
            <div className="flex gap-4 mt-6">
               <button onClick={() => setTab("info")} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'info' ? 'bg-orange-500 text-black' : 'bg-white/5 text-white/40'}`}>Estadísticas</button>
               <button onClick={() => setTab("mods")} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'mods' ? 'bg-orange-500 text-black' : 'bg-white/5 text-white/40'}`}>Lista de Mods ({currentMods.length})</button>
            </div>
          </div>

          {tab === "info" ? (
            <>
              {/* STATUS CARDS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex flex-col justify-center">
                  <span className="text-[10px] text-white/30 uppercase font-black mb-1">Población Actual</span>
                  <div className="flex items-center gap-3">
                    <Users size={24} className="text-orange-500" />
                    <span className="text-3xl font-black text-white">{status.state === 'ok' ? `${status.data.playersCount}/${status.data.maxPlayers || 40}` : '0/40'}</span>
                  </div>
                </div>
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex flex-col justify-center">
                  <span className="text-[10px] text-white/30 uppercase font-black mb-1">Estado del Server</span>
                  <div className="flex items-center gap-3">
                    <Activity size={24} className={status.state === 'ok' ? 'text-emerald-500' : 'text-red-500'} />
                    <span className={`text-xl font-black uppercase ${status.state === 'ok' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {status.state === 'ok' ? 'En Línea' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACCESO DIRECTO */}
              <a href={`steam://connect/${server.ip}:${server.port}`} className="w-full bg-emerald-600 hover:bg-emerald-500 p-7 rounded-[2rem] text-center font-black uppercase text-xl italic transition-all shadow-xl">
                Entrar al Servidor
              </a>
              
              {/* DISCORD WIDGET */}
              <div className="flex-1 min-h-[300px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/40">
                <iframe src="https://e.widgetbot.io/channels/1039143521342455918/1058403232445104140?api=1" width="100%" height="100%" className="border-none opacity-80" />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-2 pr-2 overflow-y-auto custom-scrollbar">
              {currentMods.map((id) => (
                <a key={id} href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`} target="_blank" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group">
                  <div className="flex items-center gap-4 text-white/60 group-hover:text-white">
                    <Box size={20} className="text-orange-500" />
                    <span className="font-bold text-[11px] uppercase tracking-wider">Workshop ID: {id}</span>
                  </div>
                  <ExternalLink size={14} className="text-white/20" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR: LISTADO DE JUGADORES REALES */}
        <div className="w-full md:w-80 bg-black/20 border-l border-white/5 p-10 flex flex-col overflow-hidden">
          <h3 className="text-[10px] font-black text-white/40 uppercase mb-6 tracking-widest border-b border-white/5 pb-4">Conectados</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {status.state === 'ok' && status.data?.players?.length > 0 ? (
              status.data.players.map((name: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase text-white/90 truncate">{name}</span>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                <Users size={32} className="mb-2" />
                <span className="text-[10px] uppercase font-black">Nadie Online</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}