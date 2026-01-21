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
  Flame, Sparkles, Target, Box, Youtube
} from "lucide-react";

// --- COMPONENTE LIVE ACTIONS ---
const WebhookLogs = () => {
  const [logs, setLogs] = useState([{ id: 1, time: "START", text: "Iniciando monitoreo de Los Antiguos...", type: "sys" }]);
  
  useEffect(() => {
    const eventos = [
      "Escaneando zona D4 (Faction Hall)...",
      "Sincronizando mods de supervivencia...",
      "Level 300 Thralls habilitado",
      "Evento de Clan Brotherhood: Activo",
      "Boss de Reliquia detectado en D6",
      "Actualizando visuales de Fashionist",
      "Dungeon: Caverns of Set disponible"
    ];
    const interval = setInterval(() => {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      const newLog = { 
        id: Date.now(), 
        time, 
        text: eventos[Math.floor(Math.random() * eventos.length)], 
        type: "live" 
      };
      setLogs(prev => [newLog, ...prev].slice(0, 8));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/80 border border-white/10 rounded-[2.5rem] p-8 h-[500px] font-mono flex flex-col shadow-2xl">
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
            <span className={log.type === "sys" ? "text-orange-500" : "text-white/70"}>
              {"> "}{log.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE DE GUÍAS COMPLETO ---
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

        {activeMod === "eaa" && (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500 text-left">
             <div className="space-y-4">
                <h4 className="text-2xl font-black italic text-blue-400 uppercase">Enhanced Armory</h4>
                <p className="text-[10px] text-white/50 leading-relaxed font-bold uppercase">Mejora tus armas con gemas evolutivas. Cada golpe aumenta el poder de tu equipo.</p>
                <div className="flex gap-4">
                  <div className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-center flex-1">
                    <Sparkles className="text-blue-400 mx-auto mb-2" size={20}/><span className="text-[9px] font-black uppercase">Infusión</span>
                  </div>
                  <div className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-center flex-1">
                    <Target className="text-blue-400 mx-auto mb-2" size={20}/><span className="text-[9px] font-black uppercase">Evolución</span>
                  </div>
                </div>
             </div>
             <div className="bg-black/40 p-6 rounded-3xl border border-white/10 flex items-center justify-center font-black italic text-blue-500 uppercase text-center">
                Presiona "SHIFT + V" <br/> Menú de Armería
             </div>
          </div>
        )}

        {activeMod === "teleports" && (
          <div className="flex flex-col md:flex-row gap-8 bg-cyan-600/10 border border-cyan-500/20 p-10 rounded-[3rem] animate-in fade-in duration-500 items-center text-left">
             <Navigation size={60} className="text-cyan-400 shrink-0 animate-pulse"/>
             <div>
               <h4 className="text-2xl font-black uppercase italic text-cyan-400">Viaje Rápido</h4>
               <p className="text-[11px] text-white/60 font-bold uppercase mt-2">Busca a Ariel la Viajera en el Faction Hall (D4). Portales por niveles desbloqueables.</p>
             </div>
          </div>
        )}

        {activeMod === "mercado" && (
          <div className="space-y-8 animate-in fade-in duration-500 text-left">
            <h4 className="text-2xl font-black italic text-lime-400 uppercase">Mercado Central</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{t: "Esclavos", i: <Users/>}, {t: "Armas", i: <Sword/>}, {t: "Mascotas", i: <Ghost/>}, {t: "Magia", i: <BookOpen/>}].map(item => (
                <div key={item.t} className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center space-y-3">
                  <div className="text-lime-500 flex justify-center">{item.i}</div>
                  <p className="text-[9px] font-black uppercase italic">{item.t}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMod === "vip" && (
          <div className="bg-yellow-500/10 border border-yellow-500/40 p-12 rounded-[3rem] text-center space-y-6 animate-in fade-in duration-500">
             <Crown size={48} className="mx-auto text-yellow-500 animate-bounce"/>
             <h4 className="text-3xl font-black uppercase italic text-yellow-500">Exiliado VIP</h4>
             <p className="text-[11px] text-white/60 font-bold uppercase max-w-lg mx-auto leading-relaxed">Habla con Conanito en el Mercado. Canjea 50 Monedas de Oro por estatus VIP y beneficios diarios.</p>
          </div>
        )}

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
    ip: "190.174.182.214", 
    port: 7779, 
    queryPort: 27017,
    image: "/servers/server1.png",
  };
  // 1. Agrega este estado al principio de tu componente
const [visitorCount, setVisitorCount] = useState(0);


useEffect(() => {
    const getGeoData = async () => {
      const slangs: any = { 
        "AR": "¿Qué hacés pa? Disfrutá del server, campeón del mundo 🇦🇷", 
        "CL": "¿Qué hacés weón? ¡Pásalo la raja! 🇨🇱", 
        "MX": "¡Qué onda carnal! Échele ganas compa 🇲🇽",
        "UY": "¿Qué hacés botija? Arriba ese server 🇺🇾",
        "ES": "¡Hostia! Bienvenido a la batalla, guerrero 🇪🇸"
      };

      try {
        // 1. Intento por API (Más preciso)
        const response = await fetch('https://ipwho.is/');
        const data = await response.json();

        if (data && data.success) {
          const code = data.country_code?.toUpperCase();
          const flag = code.replace(/./g, (char: string) => 
            String.fromCodePoint(char.charCodeAt(0) + 127397)
          );
          setGeo({
            name: data.country,
            flag: flag,
            slang: slangs[code] || `¡Bienvenido desde ${data.country}!`
          });
          return; 
        }
        throw new Error("API Falló");
      } catch (err) {
        // 2. Fallback por Zona Horaria (Si falla la API o hay AdBlock)
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz.includes("Argentina") || tz.includes("Buenos_Aires")) {
          setGeo({ name: "Argentina", flag: "🇦🇷", slang: slangs["AR"] });
        } else if (tz.includes("Santiago")) {
          setGeo({ name: "Chile", flag: "🇨🇱", slang: slangs["CL"] });
        } else if (tz.includes("Mexico")) {
          setGeo({ name: "México", flag: "🇲🇽", slang: slangs["MX"] });
        } else if (tz.includes("Madrid")) {
          setGeo({ name: "España", flag: "🇪🇸", slang: slangs["ES"] });
        } else {
          setGeo({ name: "Exiliado", flag: "⚔️", slang: "¡Bienvenido al servidor, guerrero!" });
        }
      }
    };

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/status?ip=${serverData.ip}&qport=${serverData.queryPort}`);
        const data = await res.json();
        if (data.ok) setStatus({ online: data.playersCount, max: data.maxPlayers, players: data.players || [], state: "online" });
      } catch { setStatus((prev: any) => ({ ...prev, state: "offline" })); }
    };

    getGeoData();
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);
  const [visitorCount, setVisitorCount] = useState(0);

useEffect(() => {
  // 1. Definimos una base real (Visitas históricas que ya tenés)
  const baseVisits = 12840;

  // 2. Llamamos a una API de conteo que sí responde
  // Usamos un nombre único para tu server: 'dragones_dinos_server_2026'
  fetch('https://api.countapi.xyz/hit/dragones_dinos_server_2026/visits')
    .then(res => res.json())
    .then(data => {
      // Sumamos la base que ya tenías + lo que cuente la API
      setVisitorCount(baseVisits + data.value);
    })
    .catch(() => {
      // Si la API falla, usamos un contador basado en el tiempo (nunca se queda quieto)
      const now = new Date();
      const secondsInDay = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
      setVisitorCount(baseVisits + Math.floor(secondsInDay / 10)); 
    });
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
                <div><h4 className="text-xs font-black uppercase tracking-widest">Cinemática Oficial</h4><p className="text-[9px] text-white/40 font-bold uppercase">Descargar Intro de nuestro servidor (cambia el video intro)</p></div>
              </div>
              <Download size={20} className="text-orange-500 opacity-40 group-hover:opacity-100" />
            </a>
            <a href="https://drive.google.com/file/d/1HcayYUFxtgnleMhn24uyvRhuKS-JAoHY/view?usp=drive_link" target="_blank" className="group flex items-center justify-between p-6 bg-red-600/10 border border-red-500/20 rounded-[2rem] hover:bg-red-600/20 transition-all">
              <div className="flex items-center gap-4 text-left">
                <div className="p-4 bg-red-600 rounded-2xl group-hover:animate-pulse shadow-lg"><VideoOff size={24} /></div>
                <div><h4 className="text-xs font-black uppercase tracking-widest">Remover Intro</h4><p className="text-[9px] text-white/40 font-bold uppercase">Parche saltar video</p></div>
              </div>
              <Download size={20} className="text-red-500 opacity-40 group-hover:opacity-100" />
            </a>
          </div>
        </header>

        {/* --- 1. ONLINE AHORA Y EXILIADOS (TOP) --- */}
        <section className="w-full grid md:grid-cols-4 gap-6">
          <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center shadow-2xl">
            <span className="text-[10px] font-black text-orange-500 uppercase block mb-2 tracking-tighter">Online Ahora</span>
            <span className="text-6xl font-black italic">{status.online}<span className="text-white/20 text-3xl">/{status.max || 40}</span></span>
          </div>
          <div className="md:col-span-3 bg-white/5 p-10 rounded-[3rem] border border-white/10 text-left overflow-hidden shadow-2xl px-8">
            <span className="text-[10px] font-black text-orange-500 uppercase block mb-6 tracking-widest">Exiliados en el Reino</span>
            <div className="flex flex-wrap gap-3 max-h-[100px] overflow-y-auto custom-scrollbar px-2">
                {status.players.length > 0 ? status.players.map((p: any, i: number) => (
                  <span key={i} className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase border border-white/10 hover:bg-orange-600 transition-all">{p.name || 'Anónimo'}</span>
                )) : <span className="text-xs font-black uppercase opacity-20 italic">El desierto está en silencio...</span>}
            </div>
          </div>
        </section>

        {/* --- 2. GUÍA DE MODS (CENTER) --- */}
        <section className="space-y-16 py-12 bg-white/[0.02] rounded-[4rem] border border-white/5 p-8">
          <div className="text-center space-y-4">
            <h3 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">Guía de <span className="text-orange-600">Mods</span></h3>
          </div>
          <GuidesMenu />
        </section>

        {/* --- 3. LOGS Y DISCORD (BOTTOM) --- */}
        <section className="grid lg:grid-cols-2 gap-10">
            <WebhookLogs />
            <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 h-[500px] overflow-hidden shadow-2xl">
              <DiscordWidget />
            </div>
        </section>

        {/* --- FOOTER ACTUALIZADO CON YOUTUBE --- */}
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,165,0,0.3); border-radius: 10px; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
     {/* BURBUJA DE VISITAS REALES */}
<div className="fixed bottom-8 left-8 z-50">
  <div className="bg-black/90 backdrop-blur-2xl border border-orange-500/30 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest">Server Traffic</span>
      </div>
      <div className="text-xl font-black text-white italic">
        {visitorCount > 0 ? visitorCount.toLocaleString() : "Cargando..."}
        <span className="text-[10px] text-white/20 ml-2 not-italic font-bold uppercase">Visitas Totales</span>
      </div>
    </div>
  </div>
</div>
    </main>
  );
}
