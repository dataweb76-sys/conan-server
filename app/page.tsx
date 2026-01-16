"use client";
import { useState, useEffect } from "react";
import DiscordWidget from "@/components/DiscordWidget";
import ServerModal from "@/components/ServerModal";
import { 
  MessageCircle, Users, Zap, Shield, Sword, 
  ChevronRight, ExternalLink, Star, 
  Map, ScrollText, Sparkles, Trophy, Flame, Orbit,
  Gem, Skull, Compass, Info, MapPin, Crown,
  Navigation, Play, Trash2, Clock, HeartPulse, 
  Wind, Facebook, Dumbbell, Palette, Scissors, 
  Box, Settings, Wand2, Layers, Binary, BookOpen,
  Target, Ghost, Hammer, Footprints, X, Swords, ChevronDown,
  Milestone, TrendingUp, Shirt, Wand, Activity
} from "lucide-react";

// --- DATOS EXTENDIDOS DE FACCIONES (World Anvil) ---
const factionDetails = {
  stormhold: {
    name: "The Kingdom of Stormhold",
    location: "Faction Hall (D4 - The Aqueduct)",
    purpose: "Sucesores de los antiguos reyes. Guerreros de honor con acero real.",
    perks: "Defensa pesada y daño por aplastamiento.",
    color: "text-blue-400",
    bg: "border-blue-500/30 bg-blue-500/5"
  },
  felgarth: {
    name: "The Order of Felgarth",
    location: "Faction Hall (D4 - The Aqueduct)",
    purpose: "Protectores del conocimiento arcano. Maestros de la hechicería pura.",
    perks: "Máximo maná y regeneración mágica.",
    color: "text-purple-400",
    bg: "border-purple-500/30 bg-purple-500/5"
  },
  elvanor: {
    name: "The Order of Elvanor",
    location: "Faction Hall (D4 - The Aqueduct)",
    purpose: "Guardianes de la naturaleza. Expertos en arquería de élite.",
    perks: "Agilidad y daño sagrado.",
    color: "text-emerald-400",
    bg: "border-emerald-500/30 bg-emerald-500/5"
  },
  vanghoul: {
    name: "The Vanghoul Clans",
    location: "Faction Hall (D4 - The Aqueduct)",
    purpose: "Tribus salvajes que dominan la fuerza bruta y la sangre.",
    perks: "Robo de vida y daño físico.",
    color: "text-red-500",
    bg: "border-red-500/30 bg-red-500/5"
  },
  embrace: {
    name: "The Cold Embrace",
    location: "Faction Hall (D4 - The Aqueduct)",
    purpose: "Leales a la Reina Bruja. Utilizan el frío glacial.",
    perks: "Resistencia al frío y efectos de escarcha.",
    color: "text-cyan-300",
    bg: "border-cyan-500/30 bg-cyan-500/5"
  },
  covenant: {
    name: "The Elven Covenant",
    location: "Faction Hall (D4 - The Aqueduct)",
    purpose: "Elfos exiliados que mezclan artesanía con magia antigua.",
    perks: "Equipo de élite y versatilidad.",
    color: "text-amber-400",
    bg: "border-amber-500/30 bg-amber-500/5"
  }
};

const GuidesMenu = () => {
  const [activeMod, setActiveMod] = useState("aoc");
  const [activeFaction, setActiveFaction] = useState<string | null>(null);

  return (
    <div className="w-full space-y-8">
      {/* SELECTOR DE MODS */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { id: "aoc", label: "Age of Calamitous", color: "bg-orange-600", icon: <Shield size={14}/> },
          { id: "eewa", label: "EEWA Wiki", color: "bg-purple-600", icon: <Gem size={14}/> },
          { id: "eaa", label: "Enhanced Armory", color: "bg-blue-600", icon: <Sword size={14}/> },
          { id: "warriors", label: "Warriors & Imm.", color: "bg-red-600", icon: <HeartPulse size={14}/> },
          { id: "grim", label: "Grim Prod.", color: "bg-pink-600", icon: <Palette size={14}/> },
          { id: "rutinas", label: "Routines", color: "bg-emerald-600", icon: <Footprints size={14}/> }
        ].map((mod) => (
          <button 
            key={mod.id}
            onClick={() => setActiveMod(mod.id)}
            className={`px-6 py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all border text-[10px] flex items-center gap-2 ${activeMod === mod.id ? `${mod.color} border-white/20 text-white shadow-lg scale-105` : "bg-white/5 border-white/10 text-white/40 hover:text-white"}`}
          >
            {mod.icon} {mod.label}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="p-10 md:p-16">
          
          {/* CONTENIDO: AOC */}
          {activeMod === "aoc" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start bg-orange-600/10 border border-orange-500/20 p-10 rounded-[3rem]">
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-2xl font-black uppercase italic text-orange-500 flex items-center gap-3"><Play size={24}/> Guía de Inicio</h3>
                  <p className="text-xs text-white/60 font-bold uppercase leading-relaxed">
                    Para elegir facción, ve al **Faction Hall** en **The Dregs (D4)**. Note que solo puedes elegir una Facción y una Sub-facción. La elección es permanente.
                  </p>
                </div>
                {/* BOTÓN MAPA AOC COMPACTO */}
                <a 
                  href="https://www.worldanvil.com/w/the-age-of-calamitous/map/ee441aeb-e106-4d00-9b00-1faab0fdfb21" 
                  target="_blank" 
                  className="p-5 bg-orange-600 text-white rounded-3xl hover:scale-110 transition-transform shadow-xl flex items-center gap-2 font-black uppercase italic text-[10px]"
                >
                  <Map size={24} /> Mapa AoC
                </a>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(factionDetails).map(([id, faction]) => (
                  <button key={id} onClick={() => setActiveFaction(id)} className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-orange-500/40 transition-all text-left group">
                    <h4 className={`text-xl font-black italic uppercase ${faction.color} mb-2`}>{faction.name}</h4>
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-4 line-clamp-2">{faction.purpose}</p>
                    <div className="space-y-2 mb-6">
                       <p className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2"><Star size={10}/> {faction.perks}</p>
                       <p className="text-[8px] font-bold text-white/20 uppercase flex items-center gap-2"><MapPin size={10}/> {faction.location}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black text-white/40 group-hover:text-orange-500 uppercase transition-colors italic">Ver más detalles <ChevronDown size={14} /></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CONTENIDO: EEWA */}
          {activeMod === "eewa" && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xl font-black uppercase italic text-purple-400 flex items-center gap-2"><Gem size={24}/> Bosses de Reliquia</h4>
                      {/* BOTÓN MAPA EEWA COMPACTO */}
                      <a 
                        href="https://www.worldanvil.com/w/endgame-extended-weapon-arsenal-hosav/map/7f563073-0b55-4a9f-bb62-f8a4451f48b3" 
                        target="_blank" 
                        className="p-3 bg-purple-600 text-white rounded-2xl hover:bg-white hover:text-purple-600 transition-all shadow-lg flex items-center gap-2 font-black uppercase italic text-[9px]"
                      >
                        <Map size={18} /> Mapa EEWA
                      </a>
                    </div>
                    <div className="grid gap-3">
                      {[
                        { n: "Gallaman el Rey", l: "D6", r: "Corazón de Arenas" },
                        { n: "Campeón de la Arena", l: "H6", r: "Estrella Campeón" },
                        { n: "Rey Túmulo", l: "C10", r: "Diadema Reyes" },
                        { n: "Bruja Reina", l: "M6", r: "Máscara Bruja" },
                        { n: "Tyros el Silencioso", l: "G11", r: "Lágrima" },
                        { n: "Sacerdote Serpiente", l: "H14", r: "Trapezoedro" }
                      ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                           <div><p className="text-[10px] font-black uppercase text-white">{r.n} <span className="text-purple-500 ml-2">[{r.l}]</span></p><p className="text-[8px] font-bold uppercase text-white/40">Drop: {r.r}</p></div>
                           <Skull size={16} className="text-purple-500/30" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-600/10 border border-purple-500/20 p-12 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group">
                    <Orbit size={160} className="absolute text-purple-500/5 animate-spin-slow" />
                    <TrendingUp size={48} className="text-purple-400 relative z-10" />
                    <h4 className="text-3xl font-black uppercase italic text-purple-400 relative z-10">Sistema de Ascensión</h4>
                    <p className="text-xs text-white/60 font-bold uppercase max-w-xs relative z-10 leading-relaxed">Al nivel 60, reinicia tu nivel para ganar puntos de Constelación y habilidades divinas.</p>
                  </div>
               </div>
            </div>
          )}

          {/* CONTENIDO: EAA */}
          {activeMod === "eaa" && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
              <div className="bg-blue-600/10 border border-blue-500/20 p-10 rounded-[3rem] space-y-6">
                <h4 className="text-2xl font-black uppercase italic text-blue-400 flex items-center gap-3"><Sword size={28}/> Arsenal Mejorado</h4>
                <p className="text-[11px] text-white/60 font-bold uppercase leading-relaxed">
                  Expande masivamente el equipamiento disponible. Introduce un sistema de **clases dinámicas** y gemas evolutivas que permiten mejorar tus armas favoritas a niveles legendarios.
                </p>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-[10px] font-black uppercase text-blue-400 italic">Comando de Menú: SHIFT + V</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center text-center">
                  <Wand size={24} className="text-blue-400 mb-2"/>
                  <p className="text-[9px] font-black uppercase">Gemas de Infusión</p>
                </div>
                <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center text-center">
                  <Shield size={24} className="text-blue-400 mb-2"/>
                  <p className="text-[9px] font-black uppercase">Armaduras de Élite</p>
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO: WARRIORS */}
          {activeMod === "warriors" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-red-600/10 border border-red-500/20 p-10 rounded-[3rem] flex flex-col md:flex-row gap-8 items-center">
                <div className="p-6 bg-red-600 rounded-full shadow-lg shadow-red-600/20"><Users size={40}/></div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black uppercase italic text-red-500">Warriors & Immortals</h4>
                  <p className="text-[11px] text-white/60 font-bold uppercase leading-relaxed">
                    Transforma la IA de tus esclavos. Ahora poseen comportamientos avanzados, pueden subir de rango y especializarse en roles específicos de combate o defensa de base.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['IA Mejorada', 'Nuevas Monturas', 'Esclavos Élite'].map((t, i) => (
                  <div key={i} className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center text-[9px] font-black uppercase text-white/40">{t}</div>
                ))}
              </div>
            </div>
          )}

          {/* CONTENIDO: GRIM */}
          {activeMod === "grim" && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
              <div className="bg-pink-600/10 border border-pink-500/20 p-10 rounded-[3rem] space-y-6">
                <h4 className="text-2xl font-black uppercase italic text-pink-500 flex items-center gap-3"><Palette size={28}/> Grim Productions</h4>
                <p className="text-[11px] text-white/60 font-bold uppercase leading-relaxed">
                  El mod definitivo de personalización visual. Añade cientos de accesorios, capas, sombreros y efectos visuales para que tu personaje sea único en el reino.
                </p>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-[10px] font-black uppercase text-pink-500 italic">Editor Visual: SHIFT + I</div>
              </div>
              <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-4"><Shirt className="text-pink-500" size={20}/><span className="text-[10px] font-black uppercase">Capas Dinámicas</span></div>
                <div className="flex items-center gap-4"><Activity className="text-pink-500" size={20}/><span className="text-[10px] font-black uppercase">Efectos de Partículas</span></div>
              </div>
            </div>
          )}

          {/* CONTENIDO: RUTINAS */}
          {activeMod === "rutinas" && (
            <div className="bg-emerald-600/10 border border-emerald-500/20 p-10 rounded-[3rem] animate-in fade-in duration-500 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-600 rounded-2xl"><Footprints size={32}/></div>
                <h4 className="text-2xl font-black uppercase italic text-emerald-500">Sistemas de Rutinas</h4>
              </div>
              <p className="text-[11px] text-white/60 font-bold uppercase leading-relaxed max-w-3xl">
                Dale vida a tu ciudad o fortaleza. Permite programar rutas de movimiento, patrullas complejas y ciclos de trabajo para tus NPCs, creando un ambiente orgánico y dinámico.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 bg-black/40 rounded-2xl border-l-4 border-emerald-500 font-black uppercase text-[10px]">Patrullas de Guardia</div>
                <div className="p-5 bg-black/40 rounded-2xl border-l-4 border-emerald-500 font-black uppercase text-[10px]">Ciclos de Día y Noche</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL FACCION */}
      {activeFaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`relative w-full max-w-2xl p-12 rounded-[3.5rem] border shadow-2xl ${factionDetails[activeFaction as keyof typeof factionDetails].bg}`}>
            <button onClick={() => setActiveFaction(null)} className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"><X size={32}/></button>
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Expediente de Facción</span>
                <h2 className={`text-5xl font-black italic uppercase ${factionDetails[activeFaction as keyof typeof factionDetails].color}`}>{factionDetails[activeFaction as keyof typeof factionDetails].name}</h2>
              </div>
              <p className="text-white/70 text-sm font-bold uppercase italic leading-relaxed">{factionDetails[activeFaction as keyof typeof factionDetails].purpose}</p>
              <div className="grid gap-4">
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-1">
                  <p className="text-orange-500 text-[10px] font-black uppercase italic">Bonificaciones Principales</p>
                  <p className="text-white text-lg font-black italic uppercase">{factionDetails[activeFaction as keyof typeof factionDetails].perks}</p>
                </div>
                <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl">
                  <div className="p-3 bg-orange-600 rounded-xl"><MapPin size={20}/></div>
                  <div><p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Ubicación del Hall</p><p className="text-sm font-black text-white uppercase italic">{factionDetails[activeFaction as keyof typeof factionDetails].location}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function HomePage() {
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<any>({ online: 0, max: 40, players: [], state: "loading" });

  const serverData = { 
    slug: "dragones", 
    title: "DRAGONES Y DINOSAURIOS", 
    ip: "190.174.183.166", 
    port: 7779, 
    queryPort: 27017,
    image: "/servers/server1.png",
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/status?ip=${serverData.ip}&qport=${serverData.queryPort}`);
        const data = await res.json();
        if (data.ok) setStatus({ online: data.playersCount, max: data.maxPlayers, players: data.players || [], state: "online" });
      } catch { setStatus({ ...status, state: "offline" }); }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#030303] text-white font-sans selection:bg-orange-600">
      <div className="fixed inset-0 z-0">
        <img src={serverData.image} className="w-full h-full object-cover opacity-10 scale-110 blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-24">
        {/* NAV */}
        <nav className="flex justify-between items-center bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-600 rounded-2xl shadow-lg shadow-orange-600/40"><img src="/logo/logo.png" className="w-8 h-8" alt="Logo" /></div>
            <div><h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">Los Antiguos</h1><span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">Survival RPG Medieval</span></div>
          </div>
          <a href="https://discord.gg/4SmuhXPfMr" target="_blank" className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all"><MessageCircle size={20}/></a>
        </nav>

        {/* HERO */}
        <section className="flex flex-col items-center text-center space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${status.state === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Servidor en Línea</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">{serverData.title.split(' ')[0]} <br/> <span className="text-orange-600">Y DINOSAURIOS</span></h2>
          </div>

          <div className="w-full max-w-5xl grid md:grid-cols-4 gap-6">
             <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-md flex flex-col items-center justify-center">
                <span className="text-[10px] font-black text-orange-500 uppercase block mb-2">Online</span>
                <span className="text-6xl font-black italic">{status.online}<span className="text-white/20 text-3xl">/{status.max || 40}</span></span>
             </div>
             <div className="md:col-span-3 bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-md text-left overflow-hidden">
                <span className="text-[10px] font-black text-orange-500 uppercase block mb-6 tracking-widest">Exiliados en el Mundo</span>
                <div className="flex flex-wrap gap-3 max-h-[100px] overflow-y-auto pr-4 custom-scrollbar">
                   {status.players.length > 0 ? status.players.map((p: any, i: number) => (
                     <span key={i} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase border border-white/5">{p.name || 'Anónimo'}</span>
                   )) : <span className="text-xs font-black uppercase opacity-20 italic">El desierto está en silencio...</span>}
                </div>
             </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
            <button onClick={() => { setSelected(serverData); setOpen(true); }} className="flex-[2] bg-white text-black py-7 rounded-[2.5rem] font-black uppercase italic tracking-widest hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-2xl">Directorio Técnico <ChevronRight size={22} /></button>
            <a href={`steam://connect/${serverData.ip}:${serverData.port}`} className="flex-1 bg-white/5 border border-white/10 py-7 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3"><Zap size={20} className="text-orange-500" /> Jugar</a>
          </div>
        </section>

        {/* WIKI */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h3 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">Guía de <span className="text-orange-600">Mods</span></h3>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">Toda la información estratégica en un solo lugar</p>
          </div>
          <GuidesMenu />
        </section>

        {/* SOCIAL */}
        <div className="grid lg:grid-cols-2 gap-10 pb-32">
           <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 h-[600px] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden group">
              <Facebook size={64} className="text-blue-500 mb-8" />
              <h4 className="text-4xl font-black uppercase italic tracking-tighter">Dataweb Games</h4>
              <p className="text-white/40 text-sm uppercase font-bold mt-4 mb-10">Eventos semanales y soporte de la comunidad.</p>
              <a href="https://www.facebook.com/DatawebGames" target="_blank" className="bg-white text-black px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl">Seguir Página</a>
           </div>
           <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 h-[600px] overflow-hidden">
             <DiscordWidget />
           </div>
        </div>
      </div>

      <ServerModal open={open} onClose={() => setOpen(false)} server={selected} />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
