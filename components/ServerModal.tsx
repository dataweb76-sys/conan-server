"use client";

import { useEffect, useMemo, useState } from "react";

// Base de datos de Mods por Servidor
const MODS_DATABASE: Record<string, string[]> = {
  "dragones-y-dinosaurios": [
    "1976970830","1159180273","2050780234","3100719163","2854276803","1977450178","1629644846","2584291197","2914309509","2597952237","1906158454","3039363313","2939641714","3086070534","3362177073","3248573436","2890891645","2949501637","933782986","3478249812","2271476646","1837807092","2791028919","890509770","1435629448","2305756696","3576739923","3452606731","2340032500","1113901982","1734383367","2525703408","2633363028","1125427722","880454836","1444947329","2581110607","1369743238","3120364390","2885152026","877108545","2957239090","1386174080","2376449518","3598582240","2870019036"
  ],
  "mods-y-mazmorras": [
    "880454836","1734383367","2993582399","3598582240","2050780234","933782986","1125427722","1386174080","1369802940","877108545","2279131041","1159180273","890509770","1435629448","2305756696","2850040473","2616195219","3368664134","2241631223","2976383464","2885152026","2949501637","1367404881","2633363028","1837807092","2603072116","2271476646","2870019036","3594438096","3608946367","3576739923","3452606731","2340032500","2508667158","1502970736","1976970830","2854276803"
  ],
  "los-antiguos-siptah": [
    "880454836","3086070534","1734383367","1977450178","2300463941","2854276803","2994141510","1835356127","1326031593","1125427722","2376449518","2050780234","3310298622","877108545","2870019036","2982469779","3248573436","3324113365","3210360389","2597952237","1976970830","2633363028","3039363313","3598582240","2305969565"
  ],
  "exilio-sin-mods": []
};

export default function ServerModal({ open, onClose, server, discordUrl, facebookUrl }: any) {
  const [status, setStatus] = useState<any>({ state: "loading" });
  const [showModsPopup, setShowModsPopup] = useState(false);

  const currentMods = useMemo(() => {
    return MODS_DATABASE[server?.slug] || [];
  }, [server]);

  const theme = useMemo(() => {
    const colors: any = {
      orange: { text: "text-orange-500", border: "border-orange-500/30", bg: "bg-orange-500/10", btn: "bg-orange-600 hover:bg-orange-500" },
      emerald: { text: "text-emerald-500", border: "border-emerald-500/30", bg: "bg-emerald-500/10", btn: "bg-emerald-600 hover:bg-emerald-500" },
      blue: { text: "text-blue-500", border: "border-blue-500/30", bg: "bg-blue-500/10", btn: "bg-blue-600 hover:bg-blue-500" },
      red: { text: "text-red-500", border: "border-red-500/30", bg: "bg-red-500/10", btn: "bg-red-600 hover:bg-red-500" },
    };
    return colors[server?.color || "orange"];
  }, [server]);

  useEffect(() => {
    if (!open || !server) return;
    async function load() {
      setStatus({ state: "loading" });
      try {
        const res = await fetch(`/api/status?ip=${server.ip}&port=${server.port}&qport=${server.qport}`);
        const data = await res.json();
        data.ok ? setStatus({ state: "ok", data }) : setStatus({ state: "offline" });
      } catch { setStatus({ state: "offline" }); }
    }
    load();
  }, [open, server]);

  if (!open || !server) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative z-[101] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0f17] text-white shadow-2xl custom-scrollbar">
        
        {/* Header */}
        <div className="relative h-48 w-full overflow-hidden">
          <img src={server.image} alt="" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] to-transparent" />
          <div className="absolute bottom-6 left-8">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">{server.title}</h2>
            <p className={`${theme.text} font-bold text-xs uppercase tracking-[0.3em]`}>{server.subtitle}</p>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 text-white/50 text-2xl">✕</button>
        </div>

        <div className="grid gap-6 p-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className={`rounded-2xl border ${theme.border} ${theme.bg} p-4 text-center`}>
                <span className="text-[10px] font-bold text-white/40 uppercase block mb-1 tracking-widest">Status</span>
                <span className={`font-black uppercase text-sm ${status.state === 'ok' ? 'text-emerald-400' : 'text-red-500'}`}>
                  {status.state === 'ok' ? 'Online' : status.state === 'loading' ? 'Cargando' : 'Offline'}
                </span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <span className="text-[10px] font-bold text-white/40 uppercase block mb-1 tracking-widest">Players</span>
                <span className="font-black text-xl">{status.state === 'ok' ? status.data.playersCount : '0'} / 40</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <span className="text-[10px] font-bold text-white/40 uppercase block mb-1 tracking-widest">Mods</span>
                <span className={`font-black text-xl ${theme.text}`}>{currentMods.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href={server.voteUrl} target="_blank" className={`flex flex-col justify-center rounded-2xl p-5 shadow-lg transition-transform active:scale-95 ${theme.btn}`}>
                <span className="text-[10px] font-black uppercase text-white/70 mb-1">TopGameServers</span>
                <span className="text-xs font-bold text-white leading-tight uppercase">Votar Servidor</span>
              </a>

              <a href={`steam://connect/${server.ip}:${server.port}`} className="flex items-center justify-between rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-5 hover:bg-emerald-500/20 active:scale-95 transition-all">
                <div>
                  <span className="text-[10px] font-black text-emerald-500/60 uppercase block mb-1">Entrar Directo</span>
                  <span className="text-lg font-black italic uppercase text-emerald-400">¡Conectarse!</span>
                </div>
                <span className="text-2xl">▶</span>
              </a>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
              <h3 className="text-xs font-black uppercase text-white/40 tracking-widest text-left">Información del Servidor</h3>
              <p className="text-white/70 text-sm leading-relaxed text-left whitespace-pre-line">{server.description}</p>
              
              {currentMods.length > 0 && (
                <button onClick={() => setShowModsPopup(true)} className={`${theme.text} text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2`}>
                  Ver lista de IDs de mods ➔
                </button>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-black/40 border border-white/10 p-6">
            <h3 className="text-[10px] font-black uppercase text-white/40 mb-4 tracking-widest flex items-center justify-between italic">
              Supervivientes <span className="text-emerald-500">{status.state === 'ok' ? status.data.players?.length : 0}</span>
            </h3>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {status.state === 'ok' && status.data.players?.map((name: string, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold text-white/80 uppercase">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* POPUP DE MODS ACTUALIZADO */}
      {showModsPopup && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0b0f17] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <h3 className={`text-2xl font-black ${theme.text} mb-6 flex justify-between items-center uppercase italic tracking-tighter`}>
              Mods del Reino ({currentMods.length})
              <button onClick={() => setShowModsPopup(false)} className="text-white/20 hover:text-white transition-colors">✕</button>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[50vh] overflow-y-auto pr-3 custom-scrollbar">
              {currentMods.map((id, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 text-[10px] text-white/70 font-mono flex items-center justify-between group hover:border-white/20">
                  <span className="text-white/20 mr-1">{i+1}</span>
                  <a href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`} target="_blank" className="hover:text-orange-400 transition-colors">
                    ID: {id}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button onClick={() => setShowModsPopup(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Volver
              </button>
              <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2870019036" target="_blank" className={`flex-1 py-4 ${theme.btn} rounded-2xl text-[10px] font-black text-center text-white uppercase tracking-widest transition-all`}>
                Ver Colección Steam
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}