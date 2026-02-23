"use client";

//////////////////////////////////////////////////////////////////
// IMPORTS
//////////////////////////////////////////////////////////////////

import { useState, useEffect } from "react";
import DiscordWidget from "@/components/DiscordWidget";
import ServerModal from "@/components/ServerModal";

import {
  Activity,
  BookOpen,
  Box,
  Crown,
  Diamond,
  Download,
  Facebook,
  Gamepad2,
  Gem,
  Ghost,
  Map,
  MessageCircle,
  MousePointer2,
  Navigation,
  Orbit,
  PlayCircle,
  Shield,
  ShoppingCart,
  Sparkles,
  Sword,
  Target,
  Users,
  VideoOff,
  Wand,
  Youtube,
  Zap
} from "lucide-react";

//////////////////////////////////////////////////////////////////
// COMPONENTE LIVE ACTIONS
//////////////////////////////////////////////////////////////////

const WebhookLogs = () => {
  const [logs, setLogs] = useState([
    { id: 1, time: "START", text: "Iniciando monitoreo de Los Antiguos...", type: "sys" }
  ]);

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
      const time = `${now.getHours()}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      const newLog = {
        id: Date.now(),
        time,
        text: eventos[Math.floor(Math.random() * eventos.length)],
        type: "live"
      };

      setLogs((prev) => [newLog, ...prev].slice(0, 8));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/80 border border-white/10 rounded-[2.5rem] p-8 h-[500px] font-mono flex flex-col shadow-2xl">
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <Activity size={18} className="text-orange-500 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
          Live Server Actions
        </span>
      </div>

      <div className="space-y-4 flex-1 overflow-hidden">
        {logs.map((log) => (
          <div key={log.id} className="text-[10px] flex gap-3">
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

//////////////////////////////////////////////////////////////////
// COMPONENTE GUÍAS
//////////////////////////////////////////////////////////////////

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
            className={`px-4 py-3 rounded-xl font-black uppercase italic tracking-widest transition-all border text-[9px] flex items-center gap-2 ${
              activeMod === mod.id
                ? `${mod.color} border-white/20 text-white scale-105 shadow-lg`
                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
            }`}
          >
            {mod.icon}
            {mod.label}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 md:p-16">
        <h4 className="text-2xl font-black italic text-orange-500 uppercase mb-4">
          Sistema de Guías Activo
        </h4>
        <p className="text-[10px] text-white/60 font-bold uppercase">
          Seleccioná un módulo arriba para ver su información.
        </p>
      </div>
    </div>
  );
};

//////////////////////////////////////////////////////////////////
// HOMEPAGE
//////////////////////////////////////////////////////////////////

export default function HomePage() {
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<any>({
    online: 0,
    max: 40,
    players: [],
    state: "loading"
  });

  const [geo, setGeo] = useState({
    name: "Caminante",
    flag: "🌐",
    slang: "¡Bienvenido al servidor!"
  });

  const serverData = {
    slug: "dragones",
    title: "DRAGONES Y DINOSAURIOS",
    ip: "190.174.182.114",
    port: 7779,
    queryPort: 27017,
    image: "/servers/server1.png"
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `/api/status?ip=${serverData.ip}&qport=${serverData.queryPort}`
        );
        const data = await res.json();

        if (data.ok) {
          setStatus({
            online: data.playersCount,
            max: data.maxPlayers,
            players: data.players || [],
            state: "online"
          });
        }
      } catch {
        setStatus((prev: any) => ({ ...prev, state: "offline" }));
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-orange-600">

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-24">

        {/* NAV */}
        <nav className="flex justify-between items-center bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-600 rounded-2xl">
              <img src="/logo/logo.png" className="w-16 h-16" alt="logo" />
            </div>
            <h1 className="text-xl font-black uppercase italic">
              Dragones y Dinos
            </h1>
          </div>

          <a
            href="https://discord.gg/4SmuhXPfMr"
            className="p-4 bg-white/5 rounded-2xl border border-white/10"
          >
            <MessageCircle size={20} />
          </a>
        </nav>

        {/* HERO */}
        <header className="text-center space-y-8">
          <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tight">
            DRAGONES <br />
            <span className="text-orange-600">Y DINOSAURIOS</span>
          </h2>

          <a
            href={`steam://run/440900//+connect%20${serverData.ip}:${serverData.port}`}
            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 py-5 px-10 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em]"
          >
            <Zap size={20} className="text-orange-500" />
            Jugar
          </a>
        </header>

        {/* ONLINE */}
        <section className="bg-white/5 p-10 rounded-[3rem] border border-white/10 text-center">
          <span className="text-6xl font-black italic">
            {status.online}
            <span className="text-white/20 text-3xl">/{status.max}</span>
          </span>
        </section>

        {/* GUIAS */}
        <section>
          <GuidesMenu />
        </section>

        {/* LOGS + DISCORD */}
        <section className="grid lg:grid-cols-2 gap-10">
          <WebhookLogs />
          <div className="bg-white/5 rounded-[3rem] border border-white/10 h-[500px]">
            <DiscordWidget />
          </div>
        </section>

      </div>

      <ServerModal open={open} onClose={() => setOpen(false)} server={serverData} />

    </main>
  );
}
