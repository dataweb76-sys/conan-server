"use client";
import { useState, useEffect } from "react";
import DiscordWidget from "@/components/DiscordWidget";
import ServerModal from "@/components/ServerModal";
import { 
  MessageCircle, Users, Zap, Shield, Sword, 
  Map, Skull, Gem, Crown, Navigation, HeartPulse, 
  Orbit, Sparkles, Target, Box, Youtube, MousePointer2,
  Gamepad2, Trophy, Medal, Facebook, Download, VideoOff, 
  PlayCircle, Ghost, BookOpen, Diamond
} from "lucide-react";

// --- COMPONENTE: RANKING DE ÉLITE ---
const RankingSection = () => {
  const rankings = [
    { name: "Kaelthas", level: 300, kills: 1240, faction: "Stormhold", rank: 1, avatar: "👑" },
    { name: "Arthas_Arg", level: 295, kills: 1100, faction: "Vanghoul", rank: 2, avatar: "💀" },
    { name: "DinoHunter", level: 280, kills: 950, faction: "Elvanor", rank: 3, avatar: "🏹" },
    { name: "Slayer666", level: 250, kills: 820, faction: "Covenant", rank: 4, avatar: "🔥" },
    { name: "RexMaster", level: 210, kills: 740, faction: "Felgarth", rank: 5, avatar: "🦖" },
  ];

  return (
    <div className="w-full space-y-12">
      {/* PODIO TOP 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
        {/* Segundo Lugar */}
        <div className="order-2 md:order-1 bg-gradient-to-t from-slate-900 to-slate-800/40 border border-slate-500/30 p-8 rounded-[3rem] text-center space-y-4 relative group hover:border-slate-400 transition-all">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-500 p-3 rounded-2xl shadow-lg shadow-slate-500/20"><Trophy size={24} className="text-white"/></div>
          <span className="text-5xl block opacity-80">{rankings[1].avatar}</span>
          <h4 className="text-2xl font-black italic uppercase tracking-tighter">{rankings[1].name}</h4>
          <div className="flex justify-around bg-black/40 p-4 rounded-2xl border border-white/5">
            <div><p className="text-[8px] text-white/40 uppercase font-black">Nivel</p><p className="font-black text-slate-400">{rankings[1].level}</p></div>
            <div><p className="text-[8px] text-white/40 uppercase font-black">Kills</p><p className="font-black">{rankings[1].kills}</p></div>
          </div>
        </div>

        {/* Primero Lugar - EL REY */}
        <div className="order-1 md:order-2 bg-gradient-to-t from-orange-950/40 to-orange-600/20 border-2 border-orange-500 p-10 rounded-[4rem] text-center space-y-6 relative group hover:scale-105 transition-all shadow-[0_0_50px_rgba(234,88,12,0.2)]">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-500 p-4 rounded-3xl shadow-xl shadow-orange-500/40 animate-bounce"><Crown size={32} className="text-black"/></div>
          <span className="text-7xl block animate-pulse">{rankings[0].avatar}</span>
          <div>
            <h4 className="text-4xl font-black italic uppercase tracking-tighter text-white">{rankings[0].name}</h4>
            <p className="text-orange-500 font-black text-[10px] tracking-[0.3em] uppercase">{rankings[0].faction}</p>
          </div>
          <div className="flex justify-around bg-orange-500/10 p-5 rounded-3xl border border-orange-500/20">
            <div><p className="text-[9px] text-orange-200 uppercase font-black">Máximo Nivel</p><p className="text-3xl font-black italic text-orange-500">{rankings[0].level}</p></div>
            <div><p className="text-[9px] text-orange-200 uppercase font-black">Bajas</p><p className="text-3xl font-black italic">{rankings[0].kills}</p></div>
          </div>
        </div>

        {/* Tercer Lugar */}
        <div className="order-3 md:order-3 bg-gradient-to-t from-orange-900/40 to-orange-900/10 border border-orange-800/40 p-8 rounded-[3rem] text-center space-y-4 relative group hover:border-orange-700 transition-all">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-800 p-3 rounded-2xl shadow-lg shadow-orange-900/20"><Medal size={24} className="text-white"/></div>
          <span className="text-5xl block opacity-80">{rankings[2].avatar}</span>
          <h4 className="text-2xl font-black italic uppercase tracking-tighter">{rankings[2].name}</h4>
          <div className="flex justify-around bg-black/40 p-4 rounded-2xl border border-white/5">
            <div><p className="text-[8px] text-white/40 uppercase font-black">Nivel</p><p className="font-black text-orange-700">{rankings[2].level}</p></div>
            <div><p className="text-[8px] text-white/40 uppercase font-black">Kills</p><p className="font-black">{rankings[2].kills}</p></div>
          </div>
        </div>
      </div>
      
      {/* Tabla Pro */}
      <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-md">
        <div className="p-8 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h5 className="font-black uppercase italic tracking-widest flex items-center gap-3"><Users size={18} className="text-orange-500"/> Clasificación General</h5>
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest underline decoration-orange-500/50">Actualizado cada 5 min</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">
                <th className="px-10 py-6">Rango</th>
                <th className="px-10 py-6">Jugador</th>
                <th className="px-10 py-6">Facción</th>
                <th className="px-10 py-6 text-right">Nivel</th>
              </tr>
            </thead>
            <tbody className="text-xs font-black uppercase italic">
              {rankings.slice(3).map((p) => (
                <tr key={p.name} className="border-t border-white/5 hover:bg-orange-600/5 transition-all group">
                  <td className="px-10 py-6 text-white/20 group-hover:text-orange-500 transition-colors">#{p.rank}</td>
                  <td className="px-10 py-6 flex items-center gap-3">
                    <span className="p-2 bg-white/5 rounded-lg group-hover:bg-orange-500/20 transition-all">{p.avatar}</span>
                    {p.name}
                  </td>
                  <td className="px-10 py-6 text-white/40">{p.faction}</td>
                  <td className="px-10 py-6 text-right text-orange-500 text-lg">{p.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE DE GUÍAS ---
const GuidesMenu = () => {
  const [activeMod, setActiveMod] = useState("aoc");
  const modButtons = [
    { id: "aoc", label: "Age of Calamitous", color: "bg-orange-600", icon: <Shield size={14}/> },
    { id: "eewa", label: "EEWA Wiki", color: "bg-purple-600", icon: <Gem size={14}/> },
    { id: "eaa", label: "Enhanced Armory", color: "bg-blue-600", icon: <Sword size={14}/> },
    { id: "teleports", label: "Teleports", color: "bg-cyan-600", icon: <Navigation size={14}/> },
    { id: "mercado", label: "Mercado", color: "bg-lime-600", icon: <ShoppingCart size={14}/> },
    { id: "vip", label: "Exiliado VIP", color: "bg-yellow-500", icon: <Diamond size={14}/> }
  ];

  return (
    <div className="w-full space-y-10">
      <div className="flex flex-wrap justify-center gap-4">
        {modButtons.map((mod) => (
          <button 
            key={mod.id} 
            onClick={() => setActiveMod(mod.id)} 
            className={`px-6 py-4 rounded-2xl font-black uppercase italic tracking-[0.15em] transition-all border text-[10px] flex items-center gap-3 ${activeMod === mod.id ? `${mod.color} border-white/40 text-white scale-110 shadow-[0_0_30px_rgba(255,255,255,0.1)]` : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-white"}`}
          >
            {mod.icon} {mod.label}
          </button>
        ))}
      </div>

      <div className="bg-[#080808]/80 border border-white/10 rounded-[4rem] backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] p-12 md:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full"></div>
        {activeMod === "aoc" && (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-orange-600/10 p-10 rounded-[3rem] border border-orange-500/20">
                <div className="text-center md:text-left">
                  <h4 className="text-4xl font-black italic text-orange-500 uppercase leading-none mb-2">Age of Calamitous</h4>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest">El mod de lore más grande de Conan Exiles.</p>
                </div>
                <a href="https://www.worldanvil.com/w/the-age-of-calamitous/map/ee441aeb-e106-4d00-9b00-1faab0fdfb21" target="_blank" className="px-10 py-5 bg-orange-600 rounded-2xl text-[11px] font-black uppercase italic flex items-center gap-3 hover:scale-110 transition-transform active:scale-95 shadow-xl"><Map size={18}/> Ver Mapa Interactivo</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {["Stormhold", "Felgarth", "Elvanor", "Vanghoul", "Embrace", "Covenant"].map(f => (
                <div key={f} className="p-6 bg-white/5 border border-white/5 rounded-3xl text-center font-black uppercase italic text-[10px] text-orange-400 hover:bg-orange-600 hover:text-white transition-all cursor-default">{f}</div>
              ))}
            </div>
          </div>
        )}
        {/* Agregando EEWA por ser importante */}
        {activeMod === "eewa" && (
          <div className="grid md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-5 duration-500">
             <div className="bg-purple-600/10 p-10 rounded-[3rem] border border-purple-500/20">
                <h4 className="text-3xl font-black italic text-purple-400 uppercase mb-6 flex items-center gap-3"><Skull/> Bosses de Reliquia</h4>
                <div className="space-y-4">
                  {[{n: "Gallaman", c: "D6"}, {n: "Rey Túmulo", c: "C10"}, {n: "Bruja Reina", c: "M6"}].map(b => (
                    <div key={b.n} className="flex justify-between p-4 bg-black/60 rounded-2xl border border-white/5 text-[11px] font-black uppercase">
                      <span className="text-white/80">{b.n}</span> <span className="text-purple-500 italic tracking-widest font-black">{b.c}</span>
                    </div>
                  ))}
                </div>
             </div>
             <div className="flex flex-col justify-center items-center bg-white/5 p-10 rounded-[3rem] border border-white/10 text-center space-y-4">
                <div className="p-6 bg-purple-500/20 rounded-full animate-spin-slow border-2 border-purple-500/20"><Orbit size={50} className="text-purple-400" /></div>
                <h5 className="text-2xl font-black uppercase italic text-purple-400">Sistema de Ascensión</h5>
                <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed">Supera el nivel 60 y desbloquea el poder de las constelaciones para stats infinitos.</p>
             </div>
          </div>
        )}
        {/* Placeholder para los demás (se mantienen vivos internamente) */}
        {activeMod !== "aoc" && activeMod !== "eewa" && (
          <div className="py-20 text-center opacity-20 font-black uppercase italic tracking-[0.5em]">Cargando Datos de {activeMod}...</div>
        )}
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
export default function HomePage() {
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<any>({ online: 0, max: 40, players: [], state: "loading" });
  
  const serverData = { 
    slug: "dragones", 
    title: "DRAGONES Y DINOSAURIOS", 
    ip: "190.174.182.114", 
    port: 7779, 
    queryPort: 27017,
    image: "/servers/server1.png",
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/status?ip=${serverData.ip}&qport=${serverData.queryPort}`);
        const data = await res.json();
        if (data.ok) {
          setStatus({
            online: data.playersCount,
            max: data.maxPlayers,
            players: data.players || [],
            state: "online"
          });
        }
      } catch (e) {
        setStatus((prev: any) => ({ ...prev, state: "offline" }));
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-orange-600 selection:text-white overflow-x-hidden">
      {/* Fondos Ambientales */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <img src={serverData.image} className="w-full h-full object-cover blur-[100px]" alt="bg"/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-32">
        {/* NAV PREMIUM */}
        <nav className="flex justify-between items-center bg-white/5 backdrop-blur-2xl p-6 rounded-[3rem] border border-white/10 shadow-2xl sticky top-6 z-[100]">
          <div className="flex items-center gap-5">
            <div className="p-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
              <img src="/logo/logo.png" className="w-14 h-14 rounded-xl" alt="logo" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase italic leading-none tracking-tighter">Dragones <span className="text-orange-600">Y Dinos</span></h1>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Survival PvP Server</span>
            </div>
          </div>
          <div className="hidden lg:flex gap-8 items-center font-black uppercase italic text-[10px] tracking-widest text-white/50">
            <a href="#" className="hover:text-orange-500 transition-colors">Inicio</a>
            <a href="#ranking" className="hover:text-orange-500 transition-colors">Ranking</a>
            <a href="#mods" className="hover:text-orange-500 transition-colors">Guías</a>
          </div>
          <a href="https://discord.gg/4SmuhXPfMr" target="_blank" className="p-4 bg-orange-600 rounded-2xl hover:scale-110 transition-all shadow-lg shadow-orange-600/20"><MessageCircle size={24}/></a>
        </nav>

        {/* HERO SECTION GIGANTE */}
        <header className="flex flex-col items-center text-center space-y-16 py-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none"></div>
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full mb-4">
              <Sparkles size={14} className="text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Temporada 2026 Activa</span>
            </div>
            <h2 className="text-8xl md:text-[11rem] font-black italic uppercase tracking-tighter leading-[0.75] drop-shadow-2xl">
              CONAN <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-red-700">EXILES</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl relative z-10">
            <button onClick={() => { setSelected(serverData); setOpen(true); }} className="flex-[2] bg-white text-black py-8 rounded-[2.5rem] font-black uppercase italic tracking-[0.2em] text-sm hover:bg-orange-600 hover:text-white transition-all shadow-2xl active:scale-95">INFO DEL REINO</button>
            <a href={`steam://run/440900//+connect%20${serverData.ip}:${serverData.port}`} className="flex-1 bg-white/5 border border-white/10 py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/10 transition-all shadow-xl group">
              <Zap size={22} className="text-orange-500 group-hover:animate-pulse" /> Jugar Ahora
            </a>
          </div>

          <div className="w-full max-w-5xl grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-10">
            {/* Botones de Descarga */}
            <a href="https://drive.google.com/file/d/1lrRNi06iCTJejVG6DTBvskxIBW7rYQfj/view?usp=drive_link" target="_blank" className="group p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-orange-600/10 transition-all text-left">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-600 rounded-xl group-hover:scale-110 transition-transform"><PlayCircle size={20} /></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest leading-tight">Intro <br/> Oficial</h4>
              </div>
              <Download size={16} className="text-white/20 group-hover:text-orange-500" />
            </a>
            
            <a href="https://drive.google.com/file/d/1HcayYUFxtgnleMhn24uyvRhuKS-JAoHY/view?usp=drive_link" target="_blank" className="group p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-red-600/10 transition-all text-left">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-600 rounded-xl group-hover:scale-110 transition-transform"><VideoOff size={20} /></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest leading-tight">Remover <br/> Intro</h4>
              </div>
              <Download size={16} className="text-white/20 group-hover:text-red-500" />
            </a>

            {/* Hosting Promo */}
            <div className="md:col-span-2 bg-gradient-to-r from-orange-600 to-red-600 p-[2px] rounded-[2.5rem] group hover:scale-[1.02] transition-all cursor-pointer">
               <a href="https://wa.me/5492954320639" target="_blank" className="bg-[#0a0a0a] rounded-[2.4rem] p-6 flex items-center justify-between h-full">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-orange-600/20 rounded-xl text-orange-500"><Gamepad2 size={24} /></div>
                   <div className="text-left">
                     <h4 className="text-sm font-black uppercase italic text-white tracking-tighter">¿Buscas Hosting?</h4>
                     <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Servidores de alta gama</p>
                   </div>
                 </div>
                 <MessageCircle size={20} className="text-[#25D366]" />
               </a>
            </div>
          </div>
        </header>

        {/* SECCIÓN RANKING */}
        <section id="ranking" className="space-y-20 py-10">
          <div className="text-center space-y-4">
             <div className="inline-block px-4 py-1 bg-orange-600/20 rounded-lg text-orange-500 font-black uppercase text-[10px] tracking-[0.4em] mb-4">The Top Players</div>
             <h3 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">Hall of <span className="text-orange-600">Warriors</span></h3>
          </div>
          <RankingSection />
        </section>

        {/* SECCIÓN MODS */}
        <section id="mods" className="space-y-20 py-20 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="text-center space-y-4">
            <h3 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">Guía de <span className="text-orange-600">Poder</span></h3>
            <p className="text-white/30 font-black uppercase tracking-[0.5em] text-[10px]">Domina las mecánicas de nuestro reino</p>
          </div>
          <GuidesMenu />
        </section>

        {/* STATUS & SOCIAL */}
        <section className="grid lg:grid-cols-2 gap-10">
          <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 flex flex-col justify-between space-y-10">
            <div>
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em]">Estado del Reino</span>
              <h4 className="text-4xl font-black italic uppercase mt-4">Servidor Online</h4>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-9xl font-black italic leading-none">{status.online}</span>
              <span className="text-3xl font-black text-white/20 mb-3 tracking-tighter">/{status.max || 40} EXILIADOS</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {status.players.length > 0 ? status.players.map((p: any, i: number) => (
                  <span key={i} className="px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase border border-white/10">{p.name || 'Jugador'}</span>
                )) : <p className="text-xs text-white/20 font-black uppercase italic italic">El desierto aguarda por tu espada...</p>}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 h-[500px] overflow-hidden shadow-2xl">
            <DiscordWidget />
          </div>
        </section>

        {/* FOOTER ELITE */}
        <footer className="bg-white/5 border border-white/10 p-16 rounded-[5rem] text-center space-y-12 mb-20 relative overflow-hidden shadow-2xl">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent"></div>
            <div className="flex justify-center gap-12">
               <a href="https://www.facebook.com/DatawebGames" target="_blank" className="hover:scale-125 transition-transform text-white/40 hover:text-blue-500"><Facebook size={40} /></a>
               <a href="https://www.youtube.com/@ElViejoGamer1" target="_blank" className="hover:scale-125 transition-transform text-white/40 hover:text-red-600"><Youtube size={40} /></a>
            </div>
            <div className="space-y-4">
              <h4 className="text-4xl font-black uppercase italic tracking-tighter">Dataweb <span className="text-orange-600">Games</span></h4>
              <p className="text-xs text-white/40 font-bold uppercase tracking-[0.5em]">Explora • Sobrevive • Domina</p>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white/10 italic">© 2026 Powered by Dataweb Games Elite Systems</p>
        </footer>
      </div>

      <ServerModal open={open} onClose={() => setOpen(false)} server={serverData} />

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
