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
  Gamepad2
} from "lucide-react";

//////////////////////////////////////////////////////////////////
// REGISTRO GLOBAL LEGIÓN DE REYES (LÍMITE 20)
//////////////////////////////////////////////////////////////////

const LegionRegistroGlobal = () => {
  const [steam, setSteam] = useState("");
  const [faction, setFaction] = useState("Buenos");
  const [players, setPlayers] = useState<any[]>([]);

  const fetchPlayers = async () => {
    const res = await fetch("/api/legion");
    const data = await res.json();
    setPlayers(data);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const buenosCount = players.filter(p => p.faction === "Buenos").length;
  const malosCount = players.filter(p => p.faction === "Malos").length;

  const isFull =
    (faction === "Buenos" && buenosCount >= 20) ||
    (faction === "Malos" && malosCount >= 20);

  const register = async () => {
    if (!steam.trim() || isFull) return;

    const res = await fetch("/api/legion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steam, faction })
    });

    if (res.ok) {
      setSteam("");
      fetchPlayers();
    } else {
      alert("Ya estás registrado o la facción está llena.");
    }
  };

  return (
    <section className="bg-gradient-to-r from-red-900/40 to-black border border-red-600/40 p-14 rounded-[4rem] shadow-2xl space-y-10">
      <div className="text-center space-y-4">
        <h3 className="text-6xl font-black italic uppercase">
          Inauguración <span className="text-red-600">Legión de Reyes</span>
        </h3>
        <p className="text-[11px] font-black uppercase text-white/50 tracking-widest">
          Máximo 20 jugadores por facción
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
        <input
          type="text"
          value={steam}
          onChange={(e) => setSteam(e.target.value)}
          placeholder="Nombre de Steam"
          className="flex-1 px-6 py-5 bg-black/70 border border-white/10 rounded-2xl text-white font-bold uppercase text-[11px]"
        />

        <select
          value={faction}
          onChange={(e) => setFaction(e.target.value)}
          className="px-6 py-5 bg-black/70 border border-white/10 rounded-2xl font-bold uppercase text-[11px]"
        >
          <option>Buenos</option>
          <option>Malos</option>
        </select>

        <button
          onClick={register}
          disabled={isFull}
          className={`px-10 py-5 rounded-2xl font-black uppercase text-[11px] transition-all ${
            isFull
              ? "bg-gray-700 cursor-not-allowed opacity-50"
              : "bg-red-600 hover:scale-105"
          }`}
        >
          {isFull ? "Facción Completa" : "Registrarme"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-blue-900/20 border border-blue-500/20 rounded-3xl p-8">
          <h4 className="text-xl font-black uppercase text-blue-400 mb-6">
            Buenos ⚔ ({buenosCount}/20)
          </h4>
          {players.filter(p => p.faction === "Buenos").map((p, i) => (
            <div key={i} className="text-[10px] font-black uppercase bg-white/5 p-3 rounded-xl mb-2">
              {p.steam}
            </div>
          ))}
        </div>

        <div className="bg-red-900/20 border border-red-500/20 rounded-3xl p-8">
          <h4 className="text-xl font-black uppercase text-red-500 mb-6">
            Malos ☠ ({malosCount}/20)
          </h4>
          {players.filter(p => p.faction === "Malos").map((p, i) => (
            <div key={i} className="text-[10px] font-black uppercase bg-white/5 p-3 rounded-xl mb-2">
              {p.steam}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

//////////////////////////////////////////////////////////////////
// TU HOMEPAGE
//////////////////////////////////////////////////////////////////

export default function HomePage() {
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<any>({ online: 0, max: 40, players: [], state: "loading" });

  const serverData = { 
    slug: "dragones", 
    title: "DRAGONES Y DINOSAURIOS", 
    ip: "190.174.180.74", 
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
      } catch (e) {}
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-orange-600">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-24">

        {/* REGISTRO */}
        <LegionRegistroGlobal />

        {/* ACÁ SIGUE TODO TU CONTENIDO ORIGINAL (HERO, ONLINE, GUÍAS, ETC.) */}

      </div>
    </main>
  );
}
