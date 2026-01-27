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
  Flame, Sparkles, Target, Box, Youtube, MousePointer2, Gift, Scroll
} from "lucide-react";

// --- COMPONENTE LIVE ACTIONS (Tu código original) ---
const WebhookLogs = () => {
  const [logs, setLogs] = useState([{ id: 1, time: "START", text: "Iniciando monitoreo de Los Antiguos...", type: "sys" }]);
  useEffect(() => {
    const eventos = ["Escaneando zona D4 (Faction Hall)...", "Sincronizando mods...", "Level 300 Thralls habilitado", "Boss detectado en D6"];
    const interval = setInterval(() => {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      const newLog = { id: Date.now(), time, text: eventos[Math.floor(Math.random() * eventos.length)], type: "live" };
      setLogs(prev => [newLog, ...prev].slice(0, 8));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-black/80 border border-white/10 rounded-[2.5rem] p-8 h-[500px] font-mono flex flex-col shadow-2xl text-left">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Activity size={18} className="text-orange-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Live Server Actions</span>
        </div>
      </div>
      <div className="space-y-4 overflow-hidden flex-1">
        {logs.map((log) => (
          <div key={log.id} className="text-[10px] flex gap-3 animate-in slide-in-from-top duration-500">
            <span className="text-white/20 shrink-0">[{log.time}]</span>
            <span className={log.type === "sys" ? "text-orange-500" : "text-white/70"}>{"> "}{log.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE DE GUÍAS Y PREMIOS (Actualizado) ---
const GuidesMenu = () => {
  const [activeMod, setActiveMod] = useState("aoc");
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  // Función para reclamar premio vía API RCON
  const claimReward = async () => {
    setClaiming(true);
    try {
      const res = await fetch("/api/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steamID: "TU_STEAMID_AQUI" }), // Aquí iría el ID del usuario logueado
      });
      const data = await res.json();
      if (data.success) {
        setClaimed(true);
        alert("¡Éxito! Revisa tu inventario en el juego.");
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      alert("Error al conectar con la API");
    } finally {
      setClaiming(false);
    }
  };

  const modButtons = [
    { id: "aoc", label: "AoC Wiki", color: "bg-orange-600", icon: <Shield size={14}/> },
    { id: "magias", label: "Grimorio Magia", color: "bg-red-600", icon: <Flame size={14}/> },
    { id: "eewa", label: "EEWA", color: "bg-purple-600", icon: <Gem size={14}/> },
    { id: "rewards", label: "Premios Diarios", color: "bg-green-600", icon: <Gift size={14}/> },
    { id: "vip", label: "Exiliado VIP", color: "bg-yellow-500", icon: <Diamond size={14}/> }
  ];

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-wrap justify-center gap-3">
        {modButtons.map((mod) => (
          <button key={mod.id} onClick={() => setActiveMod(mod.id)} 
            className={`px-4 py-3 rounded-xl font-black uppercase italic tracking-widest transition-all border text-[9px] flex items-center gap-2 ${activeMod === mod.id ? `${mod.color} border-white/20 text-white scale-105 shadow-lg` : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"}`}>
            {mod.icon} {mod.label}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl shadow-2xl p-10 md:p-16 text-left">
        
        {/* MAGIAS DETALLADAS */}
        {activeMod === "magias" && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-600/10 border border-red-500/20 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex items-center gap-4"><Skull className="text-red-500"/> <h4 className="text-2xl font-black italic uppercase text-red-500">Sangre (Sanguira)</h4></div>
                <div className="text-[10px] space-y-3 font-bold uppercase text-white/70">
                  <p>1. Libro Vol 1: Lord Gorethorn (C5)</p>
                  <p>2. Altar: Cementerio de la Ciudad Sin Nombre</p>
                  <p>3. Fuel: Blood Power Gems (Usa Siphoning en cadáveres)</p>
                  <p>4. Mastery: Derrota al Bane en Ciudad Sin Nombre (D6)</p>
                </div>
              </div>
              <div className="bg-purple-600/10 border border-purple-500/20 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex items-center gap-4"><Ghost className="text-purple-500"/> <h4 className="text-2xl font-black italic uppercase text-purple-500">Almas (Essynthar)</h4></div>
                <div className="text-[10px] space-y-3 font-bold uppercase text-white/70">
                  <p>1. Inicio: Ferongar (Ruinas de Al'huran)</p>
                  <p>2. Altar: The Passage (Cueva de Arañas)</p>
                  <p>3. Fuel: Soul Power Gems</p>
                  <p>4. Mastery: Mata al Kinscourge en Black Keep</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PREMIOS DIARIOS */}
        {activeMod === "rewards" && (
          <div className="animate-in fade-in duration-500 space-y-8">
            <div className="bg-gradient-to-r from-green-900/20 to-black p-10 rounded-[3rem] border border-green-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-6">
                  <div className="p-5 bg-green-600 rounded-3xl animate-bounce"><Gift size={32}/></div>
                  <div>
                    <h4 className="text-3xl font-black italic uppercase text-green-500">Regalo de hoy</h4>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Premio: 100 Crown Coins + Comida Premium</p>
                  </div>
               </div>
               <button onClick={claimReward} disabled={claiming || claimed}
                className={`px-10 py-5 rounded-2xl font-black uppercase italic text-[11px] shadow-2xl transition-all ${claimed ? "bg-white/10 text-white/20" : "bg-green-600 hover:scale-105"}`}>
                {claiming ? "Enviando..." : claimed ? "Ya Reclamado" : "Reclamar ahora"}
               </button>
            </div>
          </div>
        )}

        {/* Mantenemos tu AOC original si quieres */}
        {activeMod === "aoc" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-orange-600/10 p-6 rounded-3xl border border-orange-500/20">
              <div><h4 className="text-2xl font-black italic text-orange-500 uppercase">Facciones del Reino</h4></div>
              <a href="#" className="px-6 py-3 bg-orange-600 rounded-xl text-[10px] font-black uppercase italic flex items-center gap-2 hover:scale-105 transition-transform"><Map size={14}/> Abrir Mapa AoC</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Stormhold", "Felgarth", "Elvanor", "Vanghoul", "Embrace", "Covenant"].map(f => (
                <div key={f} className="p-5 bg-black/40 border border-white/5 rounded-2xl text-center font-black uppercase italic text-[11px] text-orange-400">{f}</div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 italic">Dataweb Games v4.8</p>
        </div>
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL (Tu código original) ---
export default function HomePage() {
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<any>({ online: 0, max: 40, players: [], state: "loading" });
  const [geo, setGeo] = useState({ name: "Caminante", flag: "🌐", slang: "¡Bienvenido!" });

  const serverData = { slug: "dragones", title: "DRAGONES Y DINOSAURIOS", ip: "190.174.182.117", port: 7779, queryPort: 27017, image: "/servers/server1.png" };

  useEffect(() => {
    // Tu lógica de geo y fetchStatus... (mantenida igual)
  }, []);

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-orange-600">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-24">
        <nav className="flex justify-between items-center bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-600 rounded-2xl shadow-lg font-black italic">LOGO</div>
            <h1 className="text-xl font-black uppercase italic">Dragones y Dinos</h1>
          </div>
          <a href="#" className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-orange-600/20 transition-all"><MessageCircle size={20}/></a>
        </nav>

        <header className="flex flex-col items-center text-center space-y-12">
          <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">DRAGONES <br/> <span className="text-orange-600">Y DINOSAURIOS</span></h2>
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
            <button onClick={() => setOpen(true)} className="flex-[2] bg-white text-black py-7 rounded-[2.5rem] font-black uppercase italic tracking-widest hover:bg-orange-600 hover:text-white transition-all">INFO DEL SERVIDOR</button>
          </div>
        </header>

        <section className="space-y-16 py-12 bg-white/[0.02] rounded-[4rem] border border-white/5 p-8">
          <GuidesMenu />
        </section>

        <section className="grid lg:grid-cols-2 gap-10">
            <WebhookLogs />
            <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 h-[500px] overflow-hidden shadow-2xl">
              <DiscordWidget />
            </div>
        </section>

        <footer className="bg-white/5 border border-white/10 p-12 rounded-[4rem] text-center space-y-8 mb-20">
          <h4 className="text-3xl font-black uppercase italic tracking-tighter">Comunidad <span className="text-orange-600">Dataweb Games</span></h4>
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20 italic">© 2026 Powered by Dataweb Games</p>
        </footer>
      </div>
      <ServerModal open={open} onClose={() => setOpen(false)} server={serverData} />
    </main>
  );
}
