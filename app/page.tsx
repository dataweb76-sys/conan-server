"use client";
import { useState, useEffect } from "react";
import DiscordWidget from "@/components/DiscordWidget";
import ServerModal from "@/components/ServerModal";
import { 
  MessageCircle, Users, Zap, Shield, Sword, 
  Map, Skull, Gem, Crown, Navigation, HeartPulse, 
  Orbit, Sparkles, Target, Box, Youtube, MousePointer2,
  Gamepad2, Trophy, Medal, Facebook, Download, VideoOff, 
  PlayCircle, Ghost, BookOpen, Diamond, Activity, UserPlus, Lock
} from "lucide-react";

// --- NUEVO COMPONENTE: REGISTRO LEGIÓN DE REYES (REEMPLAZA AL RANKING) ---
const LegionRegistration = () => {
  const [formData, setFormData] = useState({ name: "", discord: "", steam: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Lógica de envío aquí
    setTimeout(() => {
      setStatus("sent");
      setFormData({ name: "", discord: "", steam: "" });
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-0 rounded-[3rem] overflow-hidden border border-white/10 bg-[#080808] shadow-2xl">
        {/* IMAGEN DEL NUEVO SERVER */}
        <div className="relative h-[300px] lg:h-auto">
          <img 
            src="/Gemini_Generated_Image_jm22xyjm22xyjm22.jpg" 
            className="w-full h-full object-cover" 
            alt="Legion de Reyes"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent to-[#080808]"></div>
        </div>

        {/* FORMULARIO DE REGISTRO */}
        <div className="p-10 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-600/20 rounded-full text-orange-500 font-black uppercase text-[9px] tracking-widest">
              <Lock size={12}/> Próximamente: Nuevo Servidor
            </div>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter">LEGIÓN DE REYES</h3>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Regístrate para el lanzamiento</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nombre del Personaje"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-orange-600 transition-all text-sm"
            />
            <div className="grid grid-cols-2 gap-4">
              <input 
                required
                value={formData.discord}
                onChange={(e) => setFormData({...formData, discord: e.target.value})}
                placeholder="Discord ID"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-orange-600 transition-all text-sm"
              />
              <input 
                required
                value={formData.steam}
                onChange={(e) => setFormData({...formData, steam: e.target.value})}
                placeholder="Steam ID"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-orange-600 transition-all text-sm"
              />
            </div>
            <button 
              disabled={status !== "idle"}
              className="w-full py-4 bg-orange-600 rounded-2xl font-black uppercase italic text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
            >
              {status === "idle" ? <><UserPlus size={18}/> Registrarme</> : "Procesando..."}
              {status === "sent" && "¡Listo!"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE DE GUÍAS (IGUAL QUE ANTES) ---
const GuidesMenu = () => {
  const [activeMod, setActiveMod] = useState("aoc");
  const modButtons = [
    { id: "aoc", label: "Age of Calamitous", color: "bg-orange-600", icon: <Shield size={14}/> },
    { id: "eewa", label: "EEWA Wiki", color: "bg-purple-600", icon: <Gem size={14}/> },
    { id: "eaa", label: "Enhanced Armory", color: "bg-blue-600", icon: <Sword size={14}/> },
    { id: "teleports", label: "Teleports", color: "bg-cyan-600", icon: <Navigation size={14}/> },
    { id: "vip", label: "Exiliado VIP", color: "bg-yellow-500", icon: <Diamond size={14}/> }
  ];

  return (
    <div className="w-full space-y-10">
      <div className="flex flex-wrap justify-center gap-4">
        {modButtons.map((mod) => (
          <button 
            key={mod.id} 
            onClick={() => setActiveMod(mod.id)} 
            className={`px-6 py-4 rounded-2xl font-black uppercase italic tracking-[0.15em] transition-all border text-[10px] flex items-center gap-3 ${activeMod === mod.id ? `${mod.color} border-white/40 text-white scale-110 shadow-lg` : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10"}`}
          >
            {mod.icon} {mod.label}
          </button>
        ))}
      </div>
      <div className="bg-[#080808]/80 border border-white/10 rounded-[4rem] backdrop-blur-2xl p-12 md:p-20 relative overflow-hidden shadow-2xl">
        {activeMod === "aoc" && (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-orange-600/10 p-10 rounded-[3rem] border border-orange-500/20">
                <div className="text-center md:text-left">
                  <h4 className="text-4xl font-black italic text-orange-500 uppercase leading-none mb-2">Age of Calamitous</h4>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Facciones, Magias y Misiones de Lore.</p>
                </div>
                <a href="https://www.worldanvil.com/w/the-age-of-calamitous/map/ee441aeb-e106-4d00-9b00-1faab0fdfb21" target="_blank" className="px-10 py-5 bg-orange-600 rounded-2xl text-[11px] font-black uppercase italic flex items-center gap-3 hover:scale-110 transition-transform shadow-xl"><Map size={18}/> Abrir Mapa AoC</a>
            </div>
          </div>
        )}
        {activeMod !== "aoc" && (
          <div className="py-20 text-center opacity-20 font-black uppercase italic tracking-[0.5em]">Cargando Datos de {activeMod}...</div>
        )}
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL (TODO LO ORIGINAL) ---
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
          setStatus({ online: data.playersCount, max: data.maxPlayers, players: data.players || [], state: "online" });
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
    <main className="min-h-screen bg-[#030303] text-white selection:bg-orange-600 overflow-x-hidden">
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <img src={serverData.image} className="w-full h-full object-cover blur-[100px]" alt="bg"/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-32">
        {/* NAV ORIGINAL */}
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
          <a href="https://discord.gg/4SmuhXPfMr" target="_blank" className="p-4 bg-orange-600 rounded-2xl hover:scale-110 transition-all shadow-lg shadow-orange-600/20"><MessageCircle size={24}/></a>
        </nav>

        {/* HERO SECTION ORIGINAL */}
        <header className="flex flex-col items-center text-center space-y-16 py-10">
          <div className="space-y-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[300px] bg-orange-600/10 blur-[120px] rounded-full"></div>
            <h2 className="text-8xl md:text-[12rem] font-black italic uppercase tracking-tighter leading-[0.75] relative z-10 drop-shadow-2xl">
              CONAN <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-red-700">EXILES</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl relative z-10">
            <button onClick={() => { setSelected(serverData); setOpen(true); }} className="flex-[2] bg-white text-black py-8 rounded-[2.5rem] font-black uppercase italic tracking-[0.2em] text-sm hover:bg-orange-600 hover:text-white transition-all shadow-2xl">INFO DEL REINO</button>
            <a href={`steam://run/440900//+connect%20${serverData.ip}:${serverData.port}`} className="flex-1 bg-white/5 border border-white/10 py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/10 transition-all shadow-xl group">
              <Zap size={22} className="text-orange-500 group-hover:animate-pulse" /> Jugar Ahora
            </a>
          </div>

          <div className="w-full max-w-5xl grid md:grid-cols-2 lg:grid-cols-2 gap-6 pt-10">
            <a href="https://drive.google.com/file/d/1lrRNi06iCTJejVG6DTBvskxIBW7rYQfj/view?usp=drive_link" target="_blank" className="group flex items-center justify-between p-8 bg-orange-600/10 border border-orange-500/30 rounded-[2.5rem] hover:bg-orange-600/20 transition-all shadow-xl">
              <div className="flex items-center gap-6 text-left">
                <div className="p-5 bg-orange-600 rounded-3xl shadow-lg group-hover:animate-bounce"><PlayCircle size={28} /></div>
                <div><h4 className="text-sm font-black uppercase tracking-widest">Cinemática Oficial</h4><p className="text-[10px] text-white/40 font-bold uppercase">Descargar Intro Personalizada</p></div>
              </div>
              <Download size={24} className="text-orange-500 opacity-40 group-hover:opacity-100" />
            </a>
            <a href="https://drive.google.com/file/d/1HcayYUFxtgnleMhn24uyvRhuKS-JAoHY/view?usp=drive_link" target="_blank" className="group flex items-center justify-between p-8 bg-red-600/10 border border-red-500/30 rounded-[2.5rem] hover:bg-red-600/20 transition-all shadow-xl">
              <div className="flex items-center gap-6 text-left">
                <div className="p-5 bg-red-600 rounded-3xl shadow-lg group-hover:animate-pulse"><VideoOff size={28} /></div>
                <div><h4 className="text-sm font-black uppercase tracking-widest">Remover Intro</h4><p className="text-[10px] text-white/40 font-bold uppercase">Parche para salto de video</p></div>
              </div>
              <Download size={24} className="text-red-500 opacity-40 group-hover:opacity-100" />
            </a>
            <div className="md:col-span-2 bg-gradient-to-r from-orange-600 to-red-600 p-[2px] rounded-[3rem] shadow-2xl group hover:scale-[1.01] transition-all">
               <a href="https://wa.me/5492954320639" target="_blank" className="bg-[#0a0a0a] rounded-[2.9rem] p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-6 text-left">
                   <div className="p-5 bg-orange-600/20 rounded-3xl text-orange-500"><Gamepad2 size={40} /></div>
                   <div><h4 className="text-2xl font-black uppercase italic tracking-tighter text-white">¿Querés tu propio servidor?</h4><p className="text-xs text-white/50 font-bold uppercase tracking-widest">Consultanos por hosting de alta performance</p></div>
                 </div>
                 <div className="px-10 py-5 bg-[#25D366] text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all flex items-center gap-3"><MessageCircle size={20} fill="black" /> WhatsApp</div>
               </a>
            </div>
          </div>
        </header>

        {/* REEMPLAZO DEL RANKING POR EL NUEVO SERVER LEGIÓN DE REYES */}
        <section id="ranking" className="space-y-20 py-10">
          <div className="text-center space-y-4">
             <div className="inline-block px-4 py-1 bg-orange-600/20 rounded-lg text-orange-500 font-black uppercase text-[10px] tracking-[0.4em] mb-4">Salón de la Fama</div>
             <h3 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white">Próximo <span className="text-orange-600">Reino</span></h3>
          </div>
          <LegionRegistration />
        </section>

        {/* MODS SECTION ORIGINAL */}
        <section id="mods" className="space-y-20 py-20 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="text-center space-y-4">
            <h3 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">Guía de <span className="text-orange-600">Poder</span></h3>
            <p className="text-white/30 font-black uppercase tracking-[0.5em] text-[10px]">Domina las mecánicas de nuestro reino</p>
          </div>
          <GuidesMenu />
        </section>

        {/* FOOTER ORIGINAL */}
        <footer className="bg-white/5 border border-white/10 p-16 rounded-[5rem] text-center space-y-12 mb-20 relative overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent"></div>
            <div className="flex justify-center gap-12">
               <a href="https://www.facebook.com/DatawebGames" target="_blank" className="hover:scale-125 transition-transform text-white/40 hover:text-blue-500"><Facebook size={40} /></a>
               <a href="https://www.youtube.com/@ElViejoGamer1" target="_blank" className="hover:scale-125 transition-transform text-white/40 hover:text-red-600"><Youtube size={40} /></a>
            </div>
            <div className="space-y-4">
              <h4 className="text-4xl font-black uppercase italic tracking-tighter">Dataweb <span className="text-orange-600">Games</span></h4>
              <p className="text-xs text-white/40 font-bold uppercase tracking-[0.5em]">Explora • Sobrevive • Domina</p>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white/10 italic">© 2026 Powered by Dataweb Games</p>
        </footer>
      </div>

      <ServerModal open={open} onClose={() => setOpen(false)} server={serverData} />
    </main>
  );
}
