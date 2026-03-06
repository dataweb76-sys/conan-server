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
  Flame, Sun, Clock, ShoppingCart, User, Library, Castle, Mountain
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
    <div className="flex gap-2 justify-center scale-90 md:scale-100">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-white/5 border border-white/10 w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg">
            <span className="text-xl md:text-3xl font-black italic text-blue-500">{value}</span>
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
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
        <div className="order-2 md:order-1 bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] text-center space-y-4 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-500 p-3 rounded-2xl"><Trophy size={24} className="text-white"/></div>
          <span className="text-5xl block opacity-80">{rankings[1].avatar}</span>
          <h4 className="text-2xl font-black italic uppercase tracking-tighter">{rankings[1].name}</h4>
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-around">
            <div><p className="text-[8px] text-white/40 uppercase font-black">Level</p><p className="font-black text-slate-400">{rankings[1].level}</p></div>
            <div><p className="text-[8px] text-white/40 uppercase font-black">Kills</p><p className="font-black">{rankings[1].kills}</p></div>
          </div>
        </div>
        <div className="order-1 md:order-2 bg-gradient-to-t from-blue-950/40 to-blue-600/20 border-2 border-blue-500 p-10 rounded-[4rem] text-center space-y-6 relative shadow-[0_0_50px_rgba(59,130,246,0.2)]">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-500 p-4 rounded-3xl animate-bounce shadow-xl shadow-blue-500/50"><Crown size={32} className="text-white"/></div>
          <span className="text-7xl block">{rankings[0].avatar}</span>
          <div>
            <h4 className="text-4xl font-black italic uppercase tracking-tighter text-white">{rankings[0].name}</h4>
            <p className="text-blue-500 font-black text-[10px] tracking-[0.3em] uppercase">{rankings[0].faction}</p>
          </div>
          <div className="bg-blue-500/20 p-5 rounded-3xl border border-blue-500/30 flex justify-around">
            <div><p className="text-[9px] text-blue-200 uppercase font-black">Nivel Máximo</p><p className="text-3xl font-black italic text-blue-500">{rankings[0].level}</p></div>
            <div><p className="text-[9px] text-blue-200 uppercase font-black">Bajas</p><p className="text-3xl font-black italic">{rankings[0].kills}</p></div>
          </div>
        </div>
        <div className="order-3 md:order-3 bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] text-center space-y-4 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-800 p-3 rounded-2xl"><Medal size={24} className="text-white"/></div>
          <span className="text-5xl block opacity-80">{rankings[2].avatar}</span>
          <h4 className="text-2xl font-black italic uppercase tracking-tighter">{rankings[2].name}</h4>
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-around">
            <div><p className="text-[8px] text-white/40 uppercase font-black">Level</p><p className="font-black text-blue-700">{rankings[2].level}</p></div>
            <div><p className="text-[8px] text-white/40 uppercase font-black">Kills</p><p className="font-black">{rankings[2].kills}</p></div>
          </div>
        </div>
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
  
  // Mantenemos la IP de Dragones y Dinos como pediste
  const serverData = { 
    slug: "legion", 
    title: "LEGIÓN DE REYES", 
    ip: "190.174.176.46", 
    port: 7779, 
    queryPort: 27017,
    image: "/servers/legion_bg.jpg",
  };

  const handleRegister = async (faction: 'ANGELES' | 'DEMONIOS', url: string) => {
    if (!steamName.trim()) {
      alert("Por favor, ingresa tu nombre de Steam.");
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
              { name: "Apertura", value: "07/03/2026", inline: true }
            ],
            timestamp: new Date()
          }]
        })
      });
      alert(`¡${steamName}, registrado en ${faction}!`);
      setSteamName("");
    } catch (e) {
      alert("Error con Discord.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-blue-600 overflow-x-hidden">
      {/* BACKGROUND ÚNICO: LEGIÓN */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="w-full h-full bg-[url('/servers/legion_bg.jpg')] bg-cover bg-center grayscale blur-sm"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-20">
        {/* NAV */}
        <nav className="flex justify-between items-center bg-white/5 backdrop-blur-2xl p-6 rounded-[3rem] border border-white/10 shadow-2xl sticky top-6 z-[100]">
          <div className="flex items-center gap-5">
            <div className="p-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <img src="/logo/logo.png" className="w-14 h-14 rounded-xl" alt="logo" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase italic leading-none tracking-tighter">DATAWEB <span className="text-blue-500">GAMES</span></h1>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">CONAN EXILES: LEGIÓN DE REYES</span>
            </div>
          </div>
          <a href="https://discord.gg/4SmuhXPfMr" target="_blank" className="p-4 bg-blue-600 rounded-2xl hover:scale-110 transition-all shadow-lg shadow-blue-600/20"><MessageCircle size={24}/></a>
        </nav>

        {/* HERO SECTION - SOLO LEGIÓN */}
        <section className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12 py-10">
          <div className="space-y-4">
            <div className="inline-block px-6 py-2 bg-blue-500/20 rounded-full text-blue-400 font-black text-xs tracking-[0.5em] border border-blue-500/30 uppercase">Próximamente</div>
            <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">LEGIÓN DE <br/><span className="text-blue-500">REYES</span></h2>
            <p className="text-sm font-black text-white/40 tracking-[0.5em] uppercase">Roleplay • Misiones de Lore • Profesiones • Guerras de Territorio</p>
          </div>
          
          <div className="max-w-xl w-full bg-white/5 p-10 rounded-[4rem] border border-white/10 space-y-8 backdrop-blur-md">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-blue-400 font-black uppercase tracking-[0.3em] text-xs">
                <Clock size={16}/> APERTURA: 07 DE MARZO @ 18:00HS
              </div>
              <CountdownTimer targetDate="2026-03-07T18:00:00" />
            </div>

            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="ESCRIBE TU NOMBRE DE STEAM..." 
                value={steamName}
                onChange={(e) => setSteamName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 py-5 px-8 rounded-3xl font-black uppercase italic text-center text-sm focus:border-blue-500 outline-none transition-all"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => handleRegister('ANGELES', '...')} className="bg-blue-600 p-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-blue-600/20">Bando Angeles</button>
                <button onClick={() => handleRegister('DEMONIOS', '...')} className="bg-red-600 p-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-red-600/20">Bando Demonios</button>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
                <button onClick={() => { setSelected(serverData); setOpen(true); }} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-600 hover:text-white transition-all">VER INFO SERVIDOR (IP)</button>
                <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3674162555" target="_blank" className="text-[10px] font-black text-white/30 hover:text-white flex items-center justify-center gap-2 uppercase tracking-widest">
                  <Library size={14}/> Colección de Mods Oficial
                </a>
            </div>
          </div>
        </section>

        {/* RANKING SECTION */}
        <section className="space-y-16 py-10">
          <div className="text-center space-y-4">
             <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">Hall of <span className="text-blue-600">Kings</span></h3>
             <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">Los guerreros más temidos del reino</p>
          </div>
          <RankingSection />
        </section>

        {/* FOOTER */}
        <footer className="bg-white/5 border border-white/10 p-16 rounded-[5rem] text-center space-y-12 mb-20 relative overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
            <div className="flex justify-center gap-12">
               <a href="https://www.facebook.com/DatawebGames" target="_blank" className="hover:scale-125 transition-transform text-white/40 hover:text-blue-500"><Facebook size={40} /></a>
               <a href="https://www.youtube.com/@ElViejoGamer1" target="_blank" className="hover:scale-125 transition-transform text-white/40 hover:text-red-600"><Youtube size={40} /></a>
            </div>
            <div className="space-y-4">
              <h4 className="text-4xl font-black uppercase italic tracking-tighter">Dataweb <span className="text-blue-500">Games</span></h4>
              <p className="text-xs text-white/40 font-bold uppercase tracking-[0.5em]">Explora • Sobrevive • Domina</p>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white/10 italic">© 2026 Powered by Dataweb Games</p>
        </footer>
      </div>

      <ServerModal open={open} onClose={() => setOpen(false)} server={serverData} />
    </main>
  );
}
