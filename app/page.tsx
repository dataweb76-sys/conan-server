"use client";
import { useState, useEffect } from "react";
import DiscordWidget from "@/components/DiscordWidget";
import ServerModal from "@/components/ServerModal";
import { 
  MessageCircle, Users, Zap, Shield, Sword, 
  Map, Skull, Gem, Crown, Navigation, HeartPulse, 
  Palette, Replace, ShoppingCart, Diamond, X, Facebook, 
  Activity, Download, VideoOff, PlayCircle, Ghost, 
  BookOpen, Footprints, Shirt, Orbit, Wand, Globe,
  Flame, Sparkles, Target, Box, Youtube, MousePointer2,
  Gamepad2, Trophy, Medal
} from "lucide-react";

// --- NUEVO COMPONENTE: RANKING DE PERSONAJES ---
const RankingSection = () => {
  // Datos de ejemplo (Esto podrías traerlo de tu base de datos o API)
  const rankings = [
    { name: "Kaelthas", level: 300, kills: 1240, faction: "Stormhold", rank: 1 },
    { name: "Arthas_Arg", level: 295, kills: 1100, faction: "Vanghoul", rank: 2 },
    { name: "DinoHunter", level: 280, kills: 950, faction: "Elvanor", rank: 3 },
    { name: "Slayer666", level: 250, kills: 820, faction: "Covenant", rank: 4 },
    { name: "RexMaster", level: 210, kills: 740, faction: "Felgarth", rank: 5 },
  ];

  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rankings.slice(0, 3).map((player, i) => (
          <div key={player.name} className={`relative p-8 rounded-[3rem] border-2 flex flex-col items-center gap-4 transition-all hover:scale-105 ${
            i === 0 ? "border-yellow-500/50 bg-yellow-500/5" : 
            i === 1 ? "border-slate-400/50 bg-slate-400/5" : "border-orange-800/50 bg-orange-800/5"
          }`}>
            <div className={`p-4 rounded-2xl ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-slate-400" : "bg-orange-700"}`}>
              {i === 0 ? <Crown size={32} className="text-black" /> : <Trophy size={32} className="text-black" />}
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-black uppercase italic tracking-tighter">{player.name}</h4>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{player.faction}</p>
            </div>
            <div className="flex gap-4 border-t border-white/10 pt-4 w-full justify-center">
              <div className="text-center">
                <p className="text-[8px] text-white/30 uppercase font-black">Nivel</p>
                <p className="text-xl font-black italic text-orange-500">{player.level}</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] text-white/30 uppercase font-black">Kills</p>
                <p className="text-xl font-black italic text-white">{player.kills}</p>
              </div>
            </div>
            <div className="absolute top-4 right-6 text-4xl font-black italic opacity-20">#{player.rank}</div>
          </div>
        ))}
      </div>
      
      {/* Lista extendida */}
      <div className="bg-black/40 border border-white/10 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 uppercase text-[9px] font-black tracking-widest text-orange-500">
              <th className="p-6">Posición</th>
              <th className="p-6">Nombre del Exiliado</th>
              <th className="p-6">Facción</th>
              <th className="p-6">Nivel</th>
              <th className="p-6">Kills</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-bold uppercase italic">
            {rankings.slice(3).map((player) => (
              <tr key={player.name} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-6 text-white/40 font-black">#{player.rank}</td>
                <td className="p-6">{player.name}</td>
                <td className="p-6 text-orange-400/60">{player.faction}</td>
                <td className="p-6">{player.level}</td>
                <td className="p-6">{player.kills}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
    <div className="w-full space-y-8">
      <div className="flex flex-wrap justify-center gap-3">
        {modButtons.map((mod) => (
          <button 
            key={mod.id} 
            onClick={() => setActiveMod(mod.id)} 
            className={`px-4 py-3 rounded-xl font-black uppercase italic tracking-widest transition-all border text-[9px] flex items-center gap-2 ${activeMod === mod.id ? `${mod.color} border-white/20 text-white scale-105 shadow-lg` : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"}`}
          >
            {mod.icon} {mod.label}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl shadow-2xl p-10 md:p-16">
        {activeMod === "aoc" && (
          <div className="space-y-8 animate-in fade-in duration-500 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-orange-600/10 p-6 rounded-3xl border border-orange-500/20">
                <div>
                  <h4 className="text-2xl font-black italic text-orange-500 uppercase">Age of Calamitous</h4>
                  <p className="text-[10px] text-white/60 font-bold uppercase">Facciones, Magias y Misiones de Lore.</p>
                </div>
                <a href="https://www.worldanvil.com/w/the-age-of-calamitous/map/ee441aeb-e106-4d00-9b00-1faab0fdfb21" target="_blank" className="px-6 py-3 bg-orange-600 rounded-xl text-[10px] font-black uppercase italic flex items-center gap-2 hover:scale-105 transition-transform"><Map size={14}/> Abrir Mapa AoC</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Stormhold", "Felgarth", "Elvanor", "Vanghoul", "Embrace", "Covenant"].map(f => (
                <div key={f} className="p-5 bg-black/40 border border-white/5 rounded-2xl text-center font-black uppercase italic text-[11px] text-orange-400">{f}</div>
              ))}
            </div>
          </div>
        )}
        {/* Los otros mods se mantienen igual por brevedad */}
        {activeMod === "eewa" && (
          <div className="space-y-8 animate-in fade-in duration-500 text-left">
             <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-600/10 p-8 rounded-3xl border border-purple-500/20">
                <h4 className="text-2xl font-black italic text-purple-400 uppercase mb-4">Bosses de Reliquia</h4>
                <div className="space-y-2">
                  {[{n: "Gallaman", c: "D6"}, {n: "Rey Túmulo", c: "C10"}, {n: "Bruja Reina", c: "M6"}].map(b => (
                    <div key={b.n} className="flex justify-between p-3 bg-black/40 rounded-xl border border-white/5 text-[10px] font-black uppercase">
                      <span>{b.n}</span> <span className="text-purple-500 italic">{b.c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center items-center bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                 <Orbit size={48} className="text-purple-400 mb-4 animate-spin-slow" />
                 <h5 className="font-black uppercase italic text-purple-400">Sistema de Ascensión</h5>
                 <p className="text-[9px] text-white/40 font-bold mt-2 uppercase">Desbloquea Constelaciones al nivel 60.</p>
              </div>
            </div>
          </div>
        )}
        {/* Fin bloques mods */}
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 italic">Dataweb Games v4.8</p>
        </div>
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
export default function HomePage() {
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<any>({ online: 0, max: 40, players: [], state: "loading" });
  const [geo, setGeo] = useState({ name: "Caminante", flag: "🌐", slang: "¡Bienvenido al servidor!" });

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
    <main className="min-h-screen bg-[#030303] text-white selection:bg-orange-600">
      <div className="fixed inset-0 z-0 opacity-10"><img src={serverData.image} className="w-full h-full object-cover blur-3xl" alt="bg"/></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-24">
        {/* NAV */}
        <nav className="flex justify-between items-center bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-600 rounded-2xl shadow-lg"><img src="/logo/logo.png" className="w-16 h-16" alt="logo" /></div>
            <div><h1 className="text-xl font-black uppercase italic leading-none">Dragones y Dinos</h1></div>
          </div>
          <div className="hidden md:flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/5">
             <span className="text-xl">{geo.flag}</span>
             <span className="text-[9px] font-black uppercase italic text-white/60 tracking-widest">{geo.name}</span>
          </div>
          <a href="https://discord.gg/4SmuhXPfMr" className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-orange-600/20 transition-all"><MessageCircle size={20}/></a>
        </nav>

        {/* HERO */}
        <header className="flex flex-col items-center text-center space-y-12">
          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-4 px-8 py-3 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4 animate-bounce">
              <span className="text-2xl">{geo.flag}</span>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-500 italic">{geo.slang}</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">DRAGONES <br/> <span className="text-orange-600">Y DINOSAURIOS</span></h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
            <button onClick={() => { setSelected(serverData); setOpen(true); }} className="flex-[2] bg-white text-black py-7 rounded-[2.5rem] font-black uppercase italic tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-2xl">INFO DEL SERVIDOR</button>
            <a href={`steam://run/440900//+connect%20${serverData.ip}:${serverData.port}`} className="flex-1 bg-white/5 border border-white/10 py-7 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/10 transition-all shadow-xl">
              <Zap size={20} className="text-orange-500" /> Jugar
            </a>
          </div>

          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-4 pt-4">
            <a href="https://drive.google.com/file/d/1lrRNi06iCTJejVG6DTBvskxIBW7rYQfj/view?usp=drive_link" target="_blank" className="group flex items-center justify-between p-6 bg-orange-600/10 border border-orange-500/20 rounded-[2rem] hover:bg-orange-600/20 transition-all">
              <div className="flex items-center gap-4 text-left">
                <div className="p-4 bg-orange-600 rounded-2xl group-hover:animate-bounce shadow-lg"><PlayCircle size={24} /></div>
                <div><h4 className="text-xs font-black uppercase tracking-widest">Cinemática Oficial</h4><p className="text-[9px] text-white/40 font-bold uppercase">Descargar Intro</p></div>
              </div>
              <Download size={20} className="text-orange-500 opacity-40 group-hover:opacity-100" />
            </a>
            {/* ... Resto de bloques de descarga (Remover Intro, Conay, Hosting) se mantienen igual ... */}
            <div className="md:col-span-2 bg-gradient-to-r from-orange-600 to-red-600 p-[2px] rounded-[2.5rem] shadow-2xl group hover:scale-[1.01] transition-all">
               <div className="bg-[#0a0a0a] rounded-[2.4rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-5 text-left">
                   <div className="p-4 bg-orange-600/20 rounded-2xl text-orange-500">
                     <Gamepad2 size={32} />
                   </div>
                   <div>
                     <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">¿Querés tu propio servidor?</h4>
                     <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Consultanos por hosting de alta performance</p>
                   </div>
                 </div>
                 <div className="flex gap-3 w-full md:w-auto">
                   <a href="https://wa.me/5492954320639" target="_blank" className="flex-1 md:flex-none px-6 py-4 bg-[#25D366] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2">
                     <MessageCircle size={18} fill="black" /> WhatsApp
                   </a>
                 </div>
               </div>
            </div>
          </div>
        </header>

        {/* RANKING DE PERSONAJES (NUEVA SECCIÓN) */}
        <section className="space-y-16 py-12">
          <div className="text-center space-y-4">
             <h3 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">Hall of <span className="text-orange-600">Fame</span></h3>
             <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">Los guerreros más poderosos del servidor</p>
          </div>
          <RankingSection />
        </section>

        {/* GUÍA DE MODS */}
        <section className="space-y-16 py-12 bg-white/[0.02] rounded-[4rem] border border-white/5 p-8">
          <div className="text-center space-y-4">
            <h3 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">Guía de <span className="text-orange-600">Mods</span></h3>
          </div>
          <GuidesMenu />
        </section>

        {/* DISCORD */}
        <section className="max-w-4xl mx-auto w-full">
            <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 h-[500px] overflow-hidden shadow-2xl">
              <DiscordWidget />
            </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white/5 border border-white/10 p-12 rounded-[4rem] text-center space-y-8 mb-20 shadow-2xl backdrop-blur-md">
            <div className="flex justify-center gap-8">
               <Facebook size={40} className="text-blue-500 hover:scale-110 transition-transform" />
               <Youtube size={40} className="text-red-500 hover:scale-110 transition-transform" />
            </div>
            <h4 className="text-3xl font-black uppercase italic tracking-tighter">Comunidad <span className="text-orange-600">Dataweb Games</span></h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
               <a href="https://www.facebook.com/DatawebGames" target="_blank" className="w-full md:w-auto px-12 py-5 bg-blue-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  <Facebook size={16}/> Facebook
               </a>
               <a href="https://www.youtube.com/@ElViejoGamer1" target="_blank" className="w-full md:w-auto px-12 py-5 bg-red-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                  <Youtube size={16}/> El Viejo Gamer
               </a>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20 italic pt-4">© 2026 Powered by Dataweb Games</p>
        </footer>
      </div>

      <ServerModal open={open} onClose={() => setOpen(false)} server={serverData} />
    </main>
  );
}
