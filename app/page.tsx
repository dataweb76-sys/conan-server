"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Carousel from "@/components/Carousel";
import ServerCard from "@/components/ServerCard";
import DiscordWidget from "@/components/DiscordWidget";
import ServerModal from "@/components/ServerModal";
import WelcomePopup from "@/components/WelcomePopup";
import LiveViewers from "@/components/LiveViewers";
import { 
  Newspaper, 
  Code2, 
  Flame, 
  Crown, 
  Play, 
  Facebook, 
  MessageCircle, 
  Volume2,
  VolumeX,
  Zap,
  Target,
  Sword,
  Trophy,
  Share2,
  Medal,
  User
} from "lucide-react";

const QUICK_NEWS = [
  "🔥 NUEVO WIPE: ¡El servidor Vanilla ha reiniciado!",
  "⚔️ EVENTO: Domado de Dragones este fin de semana.",
  "🛡️ ACTUALIZACIÓN: Nuevas mazmorras personalizadas.",
  "💎 TIENDA: ¡Items exclusivos de Los Antiguos!"
];

// --- COMPONENTE: RANKING DE JUGADORES (EL REY Y SU CORTE) ---
function KingRanking({ players }: { players: { name: string, rank: number }[] }) {
  return (
    <div className="flex flex-col gap-2 bg-black/40 p-4 rounded-[2rem] border border-white/5 mt-4">
      <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
        <Trophy size={14} className="text-orange-500" />
        <span className="text-[10px] font-black uppercase tracking-tighter">Ranking de Guerreros</span>
      </div>
      {players.map((p, i) => (
        <div key={i} className={`flex items-center justify-between group/p`}>
          <div className="flex items-center gap-2">
            {i === 0 && <Crown size={14} className="text-yellow-500 animate-pulse" />}
            {i === 1 && <Medal size={14} className="text-slate-400" />}
            {i === 2 && <Medal size={14} className="text-amber-700" />}
            <span className={`text-[11px] font-bold ${i === 0 ? 'text-white' : 'text-white/60'}`}>{p.name}</span>
          </div>
          <button className="text-[9px] font-black bg-white/5 hover:bg-orange-600 px-2 py-0.5 rounded-md transition-colors opacity-0 group-hover/p:opacity-100">
            VOTAR
          </button>
        </div>
      ))}
    </div>
  );
}

function PlayerCount({ ip, port, qport }: any) {
  const [count, setCount] = useState<number | string>("...");
  useEffect(() => {
    fetch(`/api/status?ip=${ip}&port=${port}&qport=${qport}`)
      .then(res => res.json())
      .then(data => data.ok ? setCount(data.players.length) : setCount(0))
      .catch(() => setCount(0));
  }, [ip, port, qport]);
  
  return (
    <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[10px] font-black text-emerald-400">{count} ONLINE</span>
    </div>
  );
}

function AshParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let particles: any[] = [];
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const create = () => {
      particles = [];
      for (let i = 0; i < 60; i++) {
        particles.push({ x: Math.random() * w, y: Math.random() * h, size: Math.random() * 1.5, speedY: Math.random() * 0.8 + 0.2, opacity: Math.random() * 0.5 });
      }
    };
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y -= p.speedY; if (p.y < 0) p.y = h;
        ctx.fillStyle = `rgba(255, 120, 0, ${p.opacity})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    create(); animate();
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-20" />;
}

export default function HomePage() {
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const servers = useMemo(() => [
    { 
        slug: "dragones", 
        title: "DRAGONES Y DINOSAURIOS", 
        ip: "190.174.182.236", 
        port: 7779, 
        queryPort: 27017, 
        voteUrl: "https://topgameservers.net/conanexiles/server/dragones-y-dinosaurios-pvevp-open-24-2025", 
        image: "/servers/server1.png", 
        overlay: "/effects/dragon.png",
        topPlayers: [{name: "Crom_Warrior", rank: 1}, {name: "Xena_Rage", rank: 2}, {name: "DinoHunter", rank: 3}] 
    },
    { 
        slug: "siptah", 
        title: "LOS ANTIGUOS SIPTAH", 
        ip: "190.174.182.236", 
        port: 7781, 
        queryPort: 27015, 
        voteUrl: "https://topgameservers.net/conanexiles/server/los-antiguos-siptah-mas-exilio-open-02-2026", 
        image: "/servers/server2.png", 
        overlay: "/effects/npc_siptah.png",
        topPlayers: [{name: "Valeria_S", rank: 1}, {name: "Conan_El_Bárbaro", rank: 2}, {name: "KingSlayer", rank: 3}]
    },
    { 
        slug: "mods", 
        title: "LOS ANTIGUOS PvPvE", 
        ip: "190.174.182.236", 
        port: 7786, 
        queryPort: 27026, 
        voteUrl: "https://topgameservers.net/conanexiles/server/los-antiguos-pvpve-best-mods-y-mazmorras", 
        image: "/servers/server3.png", 
        overlay: "/effects/warrior.png",
        topPlayers: [{name: "Lord_Kael", rank: 1}, {name: "DarkSoul", rank: 2}, {name: "Merciless", rank: 3}]
    },
    { 
        slug: "vanilla", 
        title: "EL EXILIO SIN MODS", 
        ip: "190.174.182.236", 
        port: 7777, 
        queryPort: 27018, 
        voteUrl: "https://topgameservers.net/conanexiles/server/los-antiguos-el-exilio-sin-mods-pve-pvp", 
        image: "/servers/server4.png", 
        overlay: "/effects/nature.png",
        topPlayers: [{name: "Exiliado_01", rank: 1}, {name: "Nómada_Z", rank: 2}, {name: "SurvivorX", rank: 3}]
    }
  ], []);

  return (
    <main className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden cursor-crosshair">
      <AshParticles />
      
      {/* BACKGROUND VIDEO */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-20 blur-2xl">
          <source src="/video/server.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative z-30 max-w-[1400px] mx-auto px-4 py-10">
        
        {/* HEADER */}
        <div className="grid lg:grid-cols-[400px_1fr] gap-6 mb-10">
          <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-10 border border-white/10 flex flex-col items-center text-center shadow-2xl">
            <LiveViewers />
            <img src="/logo/logo.png" className="w-44 h-44 object-contain my-6 drop-shadow-[0_0_30px_rgba(255,100,0,0.5)]" />
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Los Antiguos</h1>
            <div className="flex gap-4 mt-8">
              <a href="https://discord.gg/4SmuhXPfMr" className="p-4 bg-[#5865F2] rounded-2xl hover:scale-110 transition-all shadow-lg shadow-[#5865F2]/20"><MessageCircle size={24} fill="white" /></a>
              <a href="https://facebook.com/DatawebGames" className="p-4 bg-[#1877F2] rounded-2xl hover:scale-110 transition-all shadow-lg shadow-[#1877F2]/20"><Facebook size={24} fill="white" /></a>
            </div>
          </div>

          <div className="relative rounded-[3.5rem] overflow-hidden border-4 border-white/5 bg-black shadow-2xl">
            <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="/video/server.mp4" type="video/mp4" />
            </video>
            <button onClick={toggleMute} className="absolute top-8 right-8 z-40 bg-orange-600 p-4 rounded-full border-2 border-white/20 hover:scale-110 transition-all shadow-xl">
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 flex items-center gap-6">
              <div className="p-4 bg-orange-600 rounded-full animate-pulse shadow-[0_0_20px_orange]"><Sword size={28} /></div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-[0.5em] text-orange-500">Temporada 2026</span>
                <span className="font-black italic text-4xl uppercase tracking-tighter">DOMINA LAS TIERRAS DEL EXILIO</span>
              </div>
            </div>
          </div>
        </div>

        {/* MARQUESINA */}
        <div className="relative bg-black/60 mb-12 py-5 rounded-2xl overflow-hidden border-x-4 border-orange-600 shadow-2xl">
          <div className="flex whitespace-nowrap animate-scroll items-center gap-16 font-black italic text-[13px] uppercase text-white">
            {QUICK_NEWS.map((n, i) => (
              <span key={i} className="flex items-center gap-3 text-orange-500">
                <Target size={18} /> <span className="text-white">{n}</span>
              </span>
            ))}
          </div>
        </div>

        {/* SERVIDORES CON RANKING */}
        <div className="grid gap-10 mb-20 sm:grid-cols-2 lg:grid-cols-4">
          {servers.map((s) => (
            <div key={s.slug} className="group">
              <div 
                className="relative h-[420px] rounded-[3rem] border border-white/10 bg-[#0a0a0a] overflow-hidden transition-all duration-500 hover:border-orange-500 hover:-translate-y-2 cursor-pointer shadow-2xl"
                onClick={() => { setSelected(s); setOpen(true); }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                <img src={s.overlay} className="absolute inset-0 w-full h-full object-contain p-12 z-20 scale-90 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <ServerCard {...s} />
              </div>
              
              {/* RANKING PERSONALIZADO */}
              <KingRanking players={s.topPlayers} />

              <div className="mt-4 space-y-3">
                <a href={s.voteUrl} target="_blank" className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs tracking-tighter hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-xl">
                  <Flame size={16} /> VOTAR SERVIDOR
                </a>
                <div className="flex items-center justify-between px-2">
                   <PlayerCount ip={s.ip} port={s.port} qport={s.queryPort} />
                   <div className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Update 2026</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl h-[500px]">
            <DiscordWidget />
          </div>
          <div className="bg-orange-600 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl group relative overflow-hidden">
             <Code2 size={64} className="text-black mb-4 group-hover:rotate-12 transition-transform" />
             <h2 className="text-6xl font-black text-black tracking-tighter">DATAWEB</h2>
             <div className="flex gap-4 mt-6 text-black/40"><Zap size={24}/><Trophy size={24}/><Share2 size={24}/></div>
          </div>
        </div>
      </div>

      <ServerModal open={open} onClose={() => setOpen(false)} server={selected} />
      <WelcomePopup />

      <style jsx global>{`
        @keyframes scroll-text { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-scroll { animation: scroll-text 45s linear infinite; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #ea580c; border-radius: 10px; }
      `}</style>
    </main>
  );
}