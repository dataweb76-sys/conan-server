"use client";
import { useEffect, useMemo, useState } from "react";
import { Crown, Box, ExternalLink, Users, ShieldCheck, Timer } from "lucide-react";

export default function ServerModal({ open, onClose, server }: any) {
  const [status, setStatus] = useState<any>({ state: "loading", data: null });
  const [tab, setTab] = useState<"info" | "mods">("info");

  const MODS_DATABASE: Record<string, string[]> = {
    "dragones": ["1976970830","1159180273","2050780234","3100719163","2854276803","1977450178","1629644846","2584291197","2914309509","2597952237","1906158454","3039363313","2939641714","3086070534","3362177073","3248573436","2890891645","2949501637","933782986","3478249812","2271476646","1837807092","2791028919","890509770","1435629448","2305756696","3576739923","3452606731","2340032500","1113901982","1734383367","2525703408","2633363028","1125427722","880454836","1444947329","2581110607","1369743238","3120364390","2885152026","877108545","2957239090","1386174080","2376449518","3598582240","2870019036"],
    "mods": ["880454836","1734383367","2993582399","3598582240","2050780234","933782986","1125427722","1386174080","1369802940","877108545","2279131041","1159180273","890509770","1435629448","2305756696","2850040473","2616195219","3368664134","2241631223","2976383464","2885152026","2949501637","1367404881","2633363028","1837807092","2603072116","2271476646","2870019036","3594438096","3608946367","3576739923","3452606731","2340032500","2508667158","1502970736","1976970830","2854276803"],
    "siptah": ["880454836","3086070534","1734383367","1977450178","2300463941","2854276803","2994141510","1835356127","1326031593","1125427722","2376449518","2050780234","3310298622","877108545","2870019036","2982469779","3248573436","3324113365","3210360389","2597952237","1976970830","2633363028","3039363313","3598582240","2305969565"],
    "vanilla": []
  };

  const currentMods = useMemo(() => MODS_DATABASE[server?.slug] || [], [server]);

  useEffect(() => {
    if (!open || !server) return;
    
    // LIMPIEZA: Cada vez que se abre un server distinto, reseteamos todo
    setStatus({ state: "loading", data: null });
    setTab("info");

    const loadStatus = async () => {
      try {
        // IMPORTANTE: qport tiene que ser el queryPort de tu objeto server
        const res = await fetch(`/api/status?ip=${server.ip}&qport=${server.queryPort}`);
        const data = await res.json();
        if (data.ok) {
          setStatus({ state: "ok", data });
        } else {
          setStatus({ state: "offline", data: null });
        }
      } catch {
        setStatus({ state: "offline", data: null });
      }
    };
    loadStatus();
  }, [open, server?.slug, server?.queryPort]);

  if (!open || !server) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <div className="relative w-full max-w-6xl bg-[#0b0f17] rounded-[3.5rem] border border-white/10 flex flex-col md:flex-row h-[90vh] overflow-hidden shadow-2xl text-left">
        
        <button onClick={onClose} className="absolute top-8 right-10 text-white/50 hover:text-white text-2xl z-50">✕</button>

        {/* PARTE IZQUIERDA */}
        <div className="flex-[1.5] p-10 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          <div>
            <h2 className="text-4xl font-black italic uppercase text-white leading-tight">{server.title}</h2>
            <div className="flex gap-4 mt-6">
               <button onClick={() => setTab("info")} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'info' ? 'bg-orange-500 text-black' : 'bg-white/5 text-white/40 hover:text-white'}`}>Información</button>
               <button onClick={() => setTab("mods")} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'mods' ? 'bg-orange-500 text-black' : 'bg-white/5 text-white/40'}`}>Lista de Mods ({currentMods.length})</button>
            </div>
          </div>

          {tab === "info" ? (
            <>
              {/* DISEÑO DEL REY CORREGIDO */}
              <div className="bg-gradient-to-r from-yellow-600/20 to-transparent border border-yellow-500/30 rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="flex items-center gap-6 relative z-10">
                  <div className="relative">
                    <div className="absolute -top-6 -left-2 -rotate-12 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                      <Crown size={40} fill="currentColor" />
                    </div>
                    <div className="w-20 h-20 rounded-3xl bg-black/50 border-2 border-yellow-500 flex items-center justify-center text-yellow-500/30">
                      <Users size={32} />
                    </div>
                  </div>
                  <div>
                    <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em]">Rey del Servidor</span>
                    <h3 className="text-3xl font-black text-white uppercase italic">{server.topPlayer?.name || "Sin Rey"}</h3>
                    <div className="flex gap-4 mt-1">
                      <span className="text-[11px] font-bold text-white/60 uppercase">{server.topPlayer?.hours}H Jugadas</span>
                      <span className="text-[11px] font-bold text-white/60 uppercase">Nivel {server.topPlayer?.level}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-4 font-black">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <span className="text-[10px] text-white/30 uppercase block mb-1">Status</span>
                  <span className={`uppercase text-sm ${status.state === 'ok' ? 'text-emerald-400' : status.state === 'loading' ? 'text-orange-400' : 'text-red-500'}`}>
                    {status.state === 'ok' ? 'Online' : status.state === 'loading' ? 'Cargando...' : 'Offline'}
                  </span>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                  <span className="text-[10px] text-white/30 uppercase block mb-1">Población</span>
                  <span className="text-2xl text-white">{status.state === 'ok' ? `${status.data.playersCount}/${status.data.maxPlayers}` : '0/40'}</span>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                  <span className="text-[10px] text-white/30 uppercase block mb-1">Puerto</span>
                  <span className="text-2xl text-orange-500">{server.port}</span>
                </div>
              </div>

              <a href={`steam://connect/${server.ip}:${server.port}`} className="w-full bg-emerald-600 hover:bg-emerald-500 p-6 rounded-3xl text-center font-black uppercase text-sm text-white transition-all shadow-lg">Entrar al Servidor</a>
              
              <div className="flex-1 min-h-[250px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/40">
                <iframe src="https://e.widgetbot.io/channels/1039143521342455918/1058403232445104140?api=1" width="100%" height="100%" className="border-none opacity-80" />
              </div>
            </>
          ) : (
            /* LISTADO DE MODS CORREGIDO CON ICONO */
            <div className="grid grid-cols-1 gap-2 pr-2 overflow-y-auto custom-scrollbar">
              {currentMods.length > 0 ? currentMods.map((id) => (
                <a key={id} href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`} target="_blank" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500"><Box size={20} /></div>
                    <span className="text-white font-bold text-[11px] uppercase tracking-wider">Workshop ID: {id}</span>
                  </div>
                  <ExternalLink size={14} className="text-white/20 group-hover:text-white" />
                </a>
              )) : <div className="text-center py-20 text-white/20 uppercase font-black">Servidor 100% Vanilla</div>}
            </div>
          )}
        </div>

        {/* LISTA DE JUGADORES (PUERTO ESPECIFICO) */}
        <div className="w-full md:w-80 bg-black/20 border-l border-white/5 p-10 flex flex-col">
          <h3 className="text-[10px] font-black text-white/40 uppercase mb-6 tracking-widest border-b border-white/5 pb-4">Conectados ({status.data?.playersCount || 0})</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {status.state === 'ok' && status.data?.players?.length > 0 ? (
              status.data.players.map((n: string, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-bold text-white/80 uppercase truncate">{n}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-20 text-[9px] font-black uppercase">{status.state === 'loading' ? 'Consultando...' : 'Tierras Vacías'}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}