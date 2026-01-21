"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, ExternalLink, Zap, PlayCircle, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function ServerModal({ open, onClose, server }: any) {
  const [status, setStatus] = useState<any>({ state: "loading", data: null });
  const [tab, setTab] = useState<"info" | "mods" | "media">("info");
  const [showVideo, setShowVideo] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  // RUTAS ACTUALIZADAS A TU CARPETA PUBLIC/CAROUSEL
  const gallery = [
    "/carousel/1.png",
    "/carousel/2.png",
    "/carousel/3.png",
    "/carousel/4.png",
    "/carousel/5.png"
  ];

  const MODS_DATABASE: Record<string, string[]> = {
    "dragones": ["1976970830","1159180273","2050780234","3100719163","2854276803","1977450178","1629644846","3613820339","2584291197","2914309509","2597952237","3073504073","1906158454","3039363313","2939641714","2963680793","3362177073","3248573436","2890891645","2949501637","933782986","3478249812","2271476646","1837807092","2791028919","890509770","1435629448","2305756696","3595865773","3576739923","3452606731","2340032500","1113901982","1734383367","2525703408","2633363028","1125427722","880454836","1444947329","3309160280","3310298622","2581110607","1369743238","3120364390","2885152026","877108545","2957239090","3452167627","3395615136","3522060206","1386174080","2376449518","3039478786","2271476646","3462149838","3598582240","2870019036","3357115923"]
  };

  const currentMods = useMemo(() => MODS_DATABASE[server?.slug] || [], [server]);

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % gallery.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + gallery.length) % gallery.length);

  useEffect(() => {
    if (!open || !server) return;
    const loadStatus = async () => {
      try {
        const res = await fetch(`/api/status?ip=${server.ip}&qport=${server.queryPort}`);
        const data = await res.json();
        data.ok ? setStatus({ state: "ok", data }) : setStatus({ state: "offline", data: null });
      } catch { setStatus({ state: "offline", data: null }); }
    };
    loadStatus();
  }, [open, server]);

  if (!open || !server) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <div className="relative w-full max-w-6xl bg-[#0b0f17] rounded-[3.5rem] border border-white/10 flex flex-col md:flex-row h-[90vh] overflow-hidden shadow-2xl">
        
        <button onClick={onClose} className="absolute top-8 right-10 text-white/50 hover:text-white text-2xl z-50">✕</button>

        <div className="flex-[1.5] p-10 overflow-y-auto custom-scrollbar flex flex-col gap-6 text-left">
          <div>
            <h2 className="text-4xl font-black italic uppercase text-white leading-tight">{server.title}</h2>
            <div className="flex gap-4 mt-6">
               <button onClick={() => setTab("info")} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'info' ? 'bg-orange-500 text-black' : 'bg-white/5 text-white/40'}`}>Info</button>
               <button onClick={() => setTab("mods")} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'mods' ? 'bg-orange-500 text-black' : 'bg-white/5 text-white/40'}`}>Mods ({currentMods.length})</button>
               <button onClick={() => setTab("media")} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'media' ? 'bg-orange-500 text-black' : 'bg-white/5 text-white/40'}`}>Multimedia</button>
            </div>
          </div>

          {tab === "info" && (
            <>
              <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-orange-600/20 flex items-center justify-center border border-orange-500/30">
                  <Zap size={30} className="text-orange-500" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Estado de Red</span>
                  <p className="text-xl font-bold text-white uppercase italic tracking-wide">{server.ip}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 font-black text-center">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <span className="text-[10px] text-white/30 uppercase block mb-1">Status</span>
                  <span className={`uppercase text-sm ${status.state === 'ok' ? 'text-emerald-400' : 'text-red-500'}`}>{status.state === 'ok' ? 'Online' : 'Offline'}</span>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <span className="text-[10px] text-white/30 uppercase block mb-1">Players</span>
                  <span className="text-2xl text-white">{status.state === 'ok' ? `${status.data.playersCount}/40` : '0/40'}</span>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <span className="text-[10px] text-white/30 uppercase block mb-1">Port</span>
                  <span className="text-2xl text-orange-500">{server.port}</span>
                </div>
              </div>

              <a href={`steam://connect/${server.ip}:${server.port}`} className="w-full bg-emerald-600 hover:bg-emerald-500 p-6 rounded-3xl text-center font-black uppercase text-white transition-all shadow-xl tracking-widest">Entrar al Servidor</a>
              
              <div className="flex-1 min-h-[200px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/40">
                <iframe src="https://e.widgetbot.io/channels/1039143521342455918/1058403232445104140?api=1" width="100%" height="100%" className="border-none opacity-80" />
              </div>
            </>
          )}

          {tab === "mods" && (
            <div className="grid grid-cols-1 gap-2 pr-2 overflow-y-auto custom-scrollbar">
              {currentMods.map((id) => (
                <a key={id} href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`} target="_blank" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group">
                  <div className="flex items-center gap-4 text-white">
                    <Box size={20} className="text-orange-500" />
                    <span className="font-bold text-[11px] uppercase tracking-wider text-white/70 italic">Workshop ID: {id}</span>
                  </div>
                  <ExternalLink size={14} className="text-white/20 group-hover:text-white" />
                </a>
              ))}
            </div>
          )}

          {tab === "media" && (
            <div className="space-y-6">
              {/* CARRUSEL DE TUS IMÁGENES */}
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 group bg-black/50">
                <img key={currentImg} src={gallery[currentImg]} className="w-full h-full object-cover animate-in fade-in duration-700" alt={`Server capture ${currentImg + 1}`} />
                
                {/* Controles del carrusel */}
                <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/60 hover:bg-orange-600 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/60 hover:bg-orange-600 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md">
                  <ChevronRight size={24} />
                </button>

                {/* Indicadores */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                  {gallery.map((_, i) => (
                    <button key={i} onClick={() => setCurrentImg(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentImg ? 'bg-orange-500 w-8' : 'bg-white/20'}`} />
                  ))}
                </div>
              </div>

              {/* SECCIÓN DE VIDEO */}
              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase italic tracking-widest text-white/60">Tráiler del Servidor</h3>
                  <button 
                    onClick={() => setShowVideo(!showVideo)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-[10px] font-black uppercase transition-all shadow-lg"
                  >
                    <PlayCircle size={16} /> {showVideo ? "Ocultar" : "Reproducir"}
                  </button>
                </div>

                {showVideo && (
                  <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in duration-300">
                    <iframe className="w-full h-full" src="https://www.youtube.com/embed/fNLbbUVZ52g?autoplay=0&rel=0" frameBorder="0" allowFullScreen></iframe>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* LISTA JUGADORES (DERECHA) */}
        <div className="w-full md:w-80 bg-black/20 border-l border-white/5 p-10 flex flex-col">
          <h3 className="text-[10px] font-black text-white/40 uppercase mb-6 tracking-widest border-b border-white/5 pb-4">Conectados ({status.data?.playersCount || 0})</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {status.state === 'ok' && status.data?.players?.length > 0 ? (
              status.data.players.map((n: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border bg-white/5 border-white/5 hover:border-orange-500/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span className="text-[10px] font-bold uppercase truncate text-white/80">{n}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-20 text-[9px] font-black uppercase tracking-widest italic">Sin Jugadores Activos</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}