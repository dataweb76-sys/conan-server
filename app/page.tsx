"use client";

import { useMemo, useState } from "react";
import Carousel from "@/components/Carousel";
import ServerCard from "@/components/ServerCard";
import DiscordWidget from "@/components/DiscordWidget";
import ServerModal from "@/components/ServerModal";
import WelcomePopup from "@/components/WelcomePopup";

export type ServerInfo = {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  ip: string;
  port: number;
  qport?: number;
  image?: string;
  modsCount?: number;
  voteUrl?: string;
  color: "orange" | "blue" | "red" | "emerald";
};

export default function HomePage() {
  const DISCORD_URL = "https://discord.gg/4SmuhXPfMr";
  const FACEBOOK_URL = "https://www.facebook.com/DatawebGames";
  
  const [selected, setSelected] = useState<ServerInfo | null>(null);
  const [open, setOpen] = useState(false);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  const bg = "/carousel/5.png";

  const servers: ServerInfo[] = useMemo(
    () => [
      {
        slug: "dragones-y-dinosaurios",
        title: "DRAGONES Y DINOSAURIOS",
        subtitle: "PVEVP OPEN 24/7",
        description: "Un mundo prehistórico dominado por bestias colosales. ¿Podrás domar a los dragones o serás su cena?",
        ip: "190.174.182.236",
        port: 7779,
        qport: 27017,
        image: "/servers/server1.png",
        modsCount: 46,
        color: "orange",
        voteUrl: "https://topgameservers.net/conanexiles/server/nrcYSh89KdNehu8g4MS2",
      },
      {
        slug: "los-antiguos-siptah",
        title: "LOS ANTIGUOS SIPTAH",
        subtitle: "MAGIA EEWA Y MÁS",
        description: "La tormenta de Siptah trae consigo magias prohibidas. El endgame más completo te espera aquí.",
        ip: "190.174.182.236",
        port: 7781,
        qport: 27015,
        image: "/servers/server2.png",
        modsCount: 25,
        color: "blue",
        voteUrl: "https://topgameservers.net/conanexiles/server/nrcYSh89KdNehu8g4MS2",
      },
      {
        slug: "mods-y-mazmorras",
        title: "LOS ANTIGUOS PvE/PvP",
        subtitle: "CALAMITOUS AGE",
        description: "Facciones en guerra y mazmorras que pondrán a prueba tu cordura. No es para débiles.",
        ip: "190.174.182.236",
        port: 7786,
        qport: 27026,
        image: "/servers/server3.png",
        modsCount: 37,
        color: "red",
        voteUrl: "https://topgameservers.net/conanexiles/server/nrcYSh89KdNehu8g4MS2",
      },
      {
        slug: "exilio-sin-mods",
        title: "EL EXILIO VANILLA",
        subtitle: "PURO Y ESTABLE",
        description: "Sin mods, sin complicaciones. Solo tú, el desierto y la gloria de Crom. Experiencia clásica.",
        ip: "190.174.182.236",
        port: 7777,
        qport: 27018,
        image: "/servers/server4.png",
        modsCount: 0,
        color: "emerald",
        voteUrl: "https://topgameservers.net/conanexiles/server/nrcYSh89KdNehu8g4MS2",
      },
    ],
    []
  );

  function openModal(s: ServerInfo) {
    setSelected(s);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setSelected(null);
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIp(text);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const colorClasses: any = {
    orange: "hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] border-orange-500/20",
    blue: "hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] border-blue-500/20",
    red: "hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] border-red-500/20",
    emerald: "hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] border-emerald-500/20",
  };

  return (
    <main className="relative min-h-screen bg-[#05070a] overflow-x-hidden">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-fixed opacity-40 transition-all duration-1000"
        style={{ backgroundImage: `url(${bg})`, filter: 'brightness(0.3)' }}
      />
      
      <WelcomePopup />

      <div className="relative z-10 shell py-12">
        <div className="panel bg-[#0b0f17]/95 backdrop-blur-3xl rounded-[40px] shadow-2xl border border-white/5 overflow-hidden">
          
          {/* HEADER: LOGO, TÍTULOS Y CAROUSEL */}
          <div className="grid gap-6 p-8 lg:grid-cols-[350px_1fr]">
            <div className="flex flex-col items-center">
              {/* Texto superior */}
              <div className="mb-4 text-center">
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  Los Antiguos
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500/80">
                  Created by Dataweb
                </p>
              </div>

              {/* Contenedor del Logo con animación de titileo */}
              <div className="group relative aspect-square w-full rounded-3xl bg-white/5 flex items-center justify-center p-4 border border-white/10 overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-orange-500/5 animate-pulse opacity-20" />
                <img
                  src="/logo/logo.png" 
                  alt="Logo Los Antiguos"
                  className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,165,0,0.4)] animate-[flicker_3s_infinite]"
                />
              </div>
            </div>

            <div className="h-full min-h-[300px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Carousel />
            </div>
          </div>

          {/* GRID DE SERVIDORES */}
          <div className="grid gap-6 p-8 sm:grid-cols-2 lg:grid-cols-4">
            {servers.map((s) => (
              <div 
                key={s.slug} 
                className={`group relative transition-all duration-500 rounded-[2.5rem] border bg-[#0f141e] overflow-hidden ${colorClasses[s.color]}`}
              >
                <ServerCard
                  title={s.title}
                  subtitle={s.subtitle}
                  ip={s.ip}
                  port={s.port}
                  qport={s.qport}
                  image={s.image ?? "/servers/server-fallback.png"}
                  slug={s.slug}
                  onOpen={() => openModal(s)}
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(s.ip);
                  }}
                  className="absolute top-5 right-5 z-20 h-9 px-4 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all shadow-xl"
                >
                  {copiedIp === s.ip ? "¡COPIADO!" : "COPIAR IP"}
                </button>
              </div>
            ))}
          </div>

          {/* REDES Y DISCORD */}
          <div className="grid gap-6 p-8 lg:grid-cols-4">
            <div className="lg:col-span-3 rounded-[2.5rem] border border-white/5 bg-black/30 p-8 shadow-inner">
              <DiscordWidget />
            </div>

            <div className="flex flex-col gap-4">
              <a href={FACEBOOK_URL} target="_blank" className="flex-1 rounded-[2rem] border border-white/5 bg-blue-600/10 p-6 flex flex-col items-center justify-center hover:bg-blue-600/20 transition-all group active:scale-95">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Facebook</span>
                <span className="mt-2 text-[10px] font-bold opacity-40 text-white uppercase tracking-tighter">Comunidad Activa</span>
              </a>
              <a href={DISCORD_URL} target="_blank" className="flex-1 rounded-[2rem] border border-white/5 bg-indigo-600/10 p-6 flex flex-col items-center justify-center hover:bg-indigo-600/20 transition-all group active:scale-95">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Discord</span>
                <span className="mt-2 text-[10px] font-bold opacity-40 text-white uppercase tracking-tighter">Soporte y Eventos</span>
              </a>
            </div>
          </div>

          {/* VIDEO FINAL */}
          <div className="p-8">
            <div className="relative rounded-[3rem] overflow-hidden border border-white/5 bg-black shadow-2xl">
              <video className="w-full aspect-video object-cover opacity-70 hover:opacity-100 transition-opacity duration-700" controls>
                <source src="/media/server.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

        </div>
      </div>

      <ServerModal
        open={open}
        onClose={closeModal}
        server={selected}
        discordUrl={DISCORD_URL}
        facebookUrl={FACEBOOK_URL}
      />

      {/* Estilos CSS para la animación de titileo */}
      <style jsx global>{`
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 15px rgba(255, 165, 0, 0.4));
          }
          20%, 22%, 24%, 55% {
            opacity: 0.6;
            filter: drop-shadow(0 0 5px rgba(255, 165, 0, 0.1));
          }
        }
      `}</style>
    </main>
  );
}