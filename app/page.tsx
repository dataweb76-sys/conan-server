"use client";
import { useState, useEffect } from "react";
import DiscordWidget from "@/components/DiscordWidget";
import ServerModal from "@/components/ServerModal";
import { 
  MessageCircle, Users, Zap, Shield, Sword, 
  Map, Skull, Gem, Crown, Navigation, HeartPulse, 
  Orbit, Sparkles, Target, Box, Youtube, MousePointer2,
  Gamepad2, Trophy, Medal, Facebook, Download, VideoOff, 
  PlayCircle, Ghost, BookOpen, Diamond, Activity,
  Flame, Sun, Clock, ShoppingCart, User
} from "lucide-react";

// --- COMPONENTE: COUNTDOWN TIMER ---
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, mins: 0, segs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
          horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          segs: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center scale-90 md:scale-100">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-white/5 border border-white/10 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <span className="text-xl md:text-3xl font-black italic text-orange-500">{value}</span>
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest mt-2 opacity-40">{label}</span>
        </div>
      ))}
    </div>
  );
};

// --- COMPONENTE: RANKING DE LEYENDAS ---
const RankingSection = () => {
  const rankings = [
    { name: "Mör", level: 300, kills: 12, faction: "Stormhold", rank: 1, avatar: "👑" },
    { name: "Sheyla", level: 295, kills: 11, faction: "Vanghoul", rank: 2, avatar: "💀" },
    { name: "Chloe", level: 280, kills: 9, faction: "Elvanor", rank: 3, avatar: "🏹" },
    { name: "STORM ", level: 250, kills: 8, faction: "Covenant", rank: 4, avatar: "🔥" },
    { name: "Obara", level: 210, kills: 7, faction: "Felgarth", rank: 5, avatar: "🦖" },
  ];

  return (
    <div className="w-full space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
        <div className="order-2 md:order-1 bg-gradient-to-t from-slate-900/80 to-slate-800/20 border border-slate-500/30 p-8 rounded-[3rem] text-center space-y-4 relative group hover:border-slate-400 transition-all">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-500 p-3 rounded-2xl"><Trophy size={24} className="text-white"/></div>
          <span className="text-5xl block opacity-80">{rankings[1].avatar}</span>
          <h4 className="text-2xl font-black italic uppercase tracking-tighter">{rankings[1].name}</h4>
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-around">
            <div><p className="text-[8px] text-white/40 uppercase font-black">Level</p><p className="font-black text-slate-400">{rankings[1].level}</p></div>
            <div><p className="text-[8px] text-white/40 uppercase font-black">Kills</p><p className="font-black">{rankings[1].kills}</p></div>
          </div>
        </div>
        <div className="order-1 md:order-2 bg-gradient-to-t from-orange-950/40 to-orange-600/30 border-2 border-orange-500 p-10 rounded-[4rem] text-center space-y-6 relative group hover:scale-105 transition-all shadow-[0_0_50px_rgba(234,88,12,0.3)]">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-500 p-4 rounded-3xl animate-bounce shadow-xl shadow-orange-500/50"><Crown size={32} className="text-black"/></div>
          <span className="text-7xl block">{rankings[0].avatar}</span>
          <div>
            <h4 className="text-4xl font-black italic uppercase tracking-tighter text-white">{rankings[0].name}</h4>
            <p className="text-orange-500 font-black text-[10px] tracking-[0.3em] uppercase">{rankings[0].faction}</p>
          </div>
          <div className="bg-orange-500/20 p-5 rounded-3xl border border-orange-500/30 flex justify-around">
            <div><p className="text-[9px] text-orange-200 uppercase font-black">Nivel Máximo</p><p className="text-3xl font-black italic text-orange-500">{rankings[0].level}</p></div>
            <div><p className="text-[9px] text-orange-200 uppercase font-black">Bajas</p><p className="text-3xl font-black italic">{rankings[0].kills}</p></div>
          </div>
        </div>
        <div className="order-3 md:order-3 bg-gradient-to-t from-orange-900/30 to-orange-900/10 border border-orange-800/40 p-8 rounded-[3rem] text-center space-y-4 relative group hover:border-orange-700 transition-all">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-800 p-3 rounded-2xl"><Medal size={24} className="text-white"/></div>
          <span className="text-5xl block opacity-80">{rankings[2].avatar}</span>
          <h4 className="text-2xl font-black italic uppercase tracking-tighter">{rankings[2].name}</h4>
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-around">
            <div><p className="text-[8px] text-white/40 uppercase font-black">Level</p><p className="font-black text-orange-700">{rankings[2].level}</p></div>
            <div><p className="text-[8px] text-white/40 uppercase font-black">Kills</p><p className="font-black">{rankings[2].kills}</p></div>
          </div>
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
          <button key={mod.id} onClick={() => setActiveMod(mod.id)} className={`px-6 py-4 rounded-2xl font-black uppercase italic tracking-[0.15em] transition-all border text-[10px] flex items-center gap-3 ${activeMod === mod.id ? `${mod.color} border-white/40 text-white scale-110 shadow-lg` : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10"}`}>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {["Stormhold", "Felgarth", "Elvanor", "Vanghoul", "Embrace", "Covenant"].map(f => (
                <div key={f} className="p-6 bg-white/5 border border-white/5 rounded-3xl text-center font-black uppercase italic text-[10px] text-orange-400">{f}</div>
              ))}
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

// --- PÁGINA PRINCIPAL ---
export default function HomePage() {
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [steamName, setSteamName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  
  const serverData = { 
    slug: "dragones", 
    title: "DRAGONES Y DINOSAURIOS", 
    ip: "190.174.180.74", 
    port: 7779, 
    queryPort: 27017,
    image: "/servers/server1.png",
  };

  const handleRegister = async (faction: 'ANGELES' | 'DEMONIOS', url: string) => {
    if (!steamName.trim()) {
      alert("Por favor, ingresa tu nombre de Steam para registrarte.");
      return;
    }
    setIsRegistering(true);
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: "👑 NUEVA PRE-INSCRIPCIÓN: LEGIÓN DE REYES",
            color: faction === 'ANGELES' ? 3447003 : 15105570,
            fields: [
              { name: "Guerrero", value: `**${steamName}**`, inline: true },
              { name: "Bando", value: faction, inline: true },
              { name: "Apertura", value: "28/02/2026", inline: true }
            ],
            timestamp: new Date()
          }]
        })
      });
      alert(`¡${steamName}, has sido registrado en el bando ${faction}!`);
      setSteamName("");
    } catch (e) {
      alert("Error al conectar con Discord.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-orange-600 overflow-x-hidden">
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <img src={serverData.image} className="w-full h-full object-cover blur-[100px]" alt="bg"/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-32">
        {/* NAV */}
        <nav className="flex justify-between items-center bg-white/5 backdrop-blur-2xl p-6 rounded-[3rem] border border-white/10 shadow-2xl sticky top-6 z-[100]">
          <div className="flex items-center gap-5">
            <div className="p-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
              <img src="/logo/logo.png" className="w-14 h-14 rounded-xl" alt="logo" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase italic leading-none tracking-tighter">Dragones <span className="text-orange-600">Y Dinos</span></h1>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Survival PvP Server • Legión de Reyes Coming Soon</span>
            </div>
          </div>
          <a href="https://discord.gg/4SmuhXPfMr" target="_blank" className="p-4 bg-orange-600 rounded-2xl hover:scale-110 transition-all shadow-lg shadow-orange-600/20"><MessageCircle size={24}/></a>
        </nav>

        {/* HERO SECTION PRINCIPAL */}
        <header className="flex flex-col items-center text-center space-y-12">
          <div className="space-y-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[300px] bg-orange-600/10 blur-[120px] rounded-full"></div>
            <h2 className="text-8xl md:text-[12rem] font-black italic uppercase tracking-tighter leading-[0.75] relative z-10 drop-shadow-2xl">
              CONAN <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-red-700">EXILES</span>
            </h2>
          </div>

          {/* SECCIÓN PRE-REGISTRO LEGIÓN DE REYES */}
          <div className="w-full max-w-5xl bg-white/5 border border-white/10 rounded-[4rem] p-8 md:p-12 space-y-10 backdrop-blur-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Crown size={120}/></div>
             
             <div className="space-y-4">
                <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Legión de <span className="text-orange-600">REYES</span></h3>
                <div className="flex items-center justify-center gap-3 text-orange-500 font-black uppercase tracking-[0.3em] text-[10px]">
                  <Clock size={14}/> Gran Apertura 28 de Febrero
                </div>
                <CountdownTimer targetDate="2026-02-28T00:00:00" />
             </div>

             <div className="max-w-md mx-auto space-y-6 relative z-10">
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20}/>
                  <input 
                    type="text" 
                    placeholder="TU NOMBRE DE STEAM..." 
                    value={steamName}
                    onChange={(e) => setSteamName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 py-6 pl-16 pr-6 rounded-3xl font-black uppercase italic text-sm focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleRegister('ANGELES', 'https://discord.com/api/webhooks/1475607314106159154/3sbqBR2h5Zr-xUhMARFo57A0j7J1z2ld4CJkHfSrptyzSiz8SRRjX-LvWk9jBPPbSteG')}
                    disabled={isRegistering}
                    className="group bg-blue-600 p-6 rounded-3xl hover:scale-105 transition-all shadow-lg flex flex-col items-center gap-2"
                  >
                    <Sun size={24} className="group-hover:rotate-90 transition-transform"/>
                    <span className="font-black text-[10px] uppercase tracking-widest">ANGELES</span>
                  </button>

                  <button 
                    onClick={() => handleRegister('DEMONIOS', 'https://discord.com/api/webhooks/1475607153585946805/EZNoctYHQ0dhatjGanDpRfRSxxvoUQFmeSE-bamWEGGv-A8S1fPvpXO59hUGv7YD_ago')}
                    disabled={isRegistering}
                    className="group bg-red-600 p-6 rounded-3xl hover:scale-105 transition-all shadow-lg flex flex-col items-center gap-2"
                  >
                    <Flame size={24} className="group-hover:animate-bounce"/>
                    <span className="font-black text-[10px] uppercase tracking-widest">DEMONIOS</span>
                  </button>
                </div>
             </div>
          </div>

          {/* BOTONES ACCIÓN DRAGONES Y DINOS */}
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl relative z-10 pt-10">
            <button onClick={() => { setSelected(serverData); setOpen(true); }} className="flex-[2] bg-white text-black py-8 rounded-[2.5rem] font-black uppercase italic tracking-[0.2em] text-sm hover:bg-orange-600 hover:text-white transition-all shadow-2xl">INFO DEL REINO</button>
            <a href={`steam://run/440900//+connect%20${serverData.ip}:${serverData.port}`} className="flex-1 bg-white/5 border border-white/10 py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/10 transition-all shadow-xl group">
              <Zap size={22} className="text-orange-500 group-hover:animate-pulse" /> Jugar Ahora
            </a>
          </div>

          {/* UTILIDADES */}
          <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 pt-6">
            <a href="https://drive.google.com/file/d/1lrRNi06iCTJejVG6DTBvskxIBW7rYQfj/view?usp=drive_link" target="_blank" className="group flex items-center justify-between p-8 bg-orange-600/10 border border-orange-500/30 rounded-[2.5rem] hover:bg-orange-600/20 transition-all shadow-xl">
              <div className="flex items-center gap-6 text-left">
                <div className="p-5 bg-orange-600 rounded-3xl shadow-lg group-hover:animate-bounce"><PlayCircle size={28} /></div>
                <div><h4 className="text-sm font-black uppercase tracking-widest">Cinemática</h4><p className="text-[10px] text-white/40 font-bold uppercase">Intro Personalizada</p></div>
              </div>
              <Download size={24} className="text-orange-500 opacity-40" />
            </a>

            <a href="https://drive.google.com/file/d/1HcayYUFxtgnleMhn24uyvRhuKS-JAoHY/view?usp=drive_link" target="_blank" className="group flex items-center justify-between p-8 bg-red-600/10 border border-red-500/30 rounded-[2.5rem] hover:bg-red-600/20 transition-all shadow-xl">
              <div className="flex items-center gap-6 text-left">
                <div className="p-5 bg-red-600 rounded-3xl shadow-lg group-hover:animate-pulse"><VideoOff size={28} /></div>
                <div><h4 className="text-sm font-black uppercase tracking-widest">Remover Intro</h4><p className="text-[10px] text-white/40 font-bold uppercase">Parche salto video</p></div>
              </div>
              <Download size={24} className="text-red-500 opacity-40" />
            </a>
          </div>
        </header>

        {/* RANKING SECTION */}
        <section className="space-y-20 py-10">
          <div className="text-center space-y-4">
             <div className="inline-block px-4 py-1 bg-orange-600/20 rounded-lg text-orange-500 font-black uppercase text-[10px] tracking-[0.4em] mb-4">Salón de la Fama</div>
             <h3 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">Hall of <span className="text-orange-600">Warriors</span></h3>
          </div>
          <RankingSection />
        </section>

        {/* MODS SECTION (RESTORED) */}
        <section id="mods" className="space-y-20 py-20 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="text-center space-y-4">
            <h3 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">Guía de <span className="text-orange-600">Poder</span></h3>
            <p className="text-white/30 font-black uppercase tracking-[0.5em] text-[10px]">Domina las mecánicas de nuestro reino</p>
          </div>
          <GuidesMenu />
        </section>

        {/* FOOTER */}
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
