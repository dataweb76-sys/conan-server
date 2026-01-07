"use client";

import { useMemo, useState } from "react";
import Carousel from "@/components/Carousel";
import ServerCard from "@/components/ServerCard";
import DiscordWidget from "@/components/DiscordWidget";
import ServerModal, { ServerInfo } from "@/components/ServerModal";

export default function HomePage() {
  const DISCORD_URL = "https://discord.gg/4SmuhXPfMr";
  const FACEBOOK_URL = "https://www.facebook.com/DatawebGames";

  const bg = "/carousel/5.png";

  const servers: ServerInfo[] = useMemo(
    () => [
      {
        slug: "dragones-y-dinosaurios",
        title: "DRAGONES Y DINOSAURIOS PVEVP",
        subtitle: "OPEN 24/7 - 2025",
        description:
          "Servidor PvPvE con temática Dragones y Dinosaurios.\nEventos, progresión y comunidad activa.\nIdeal para explorar y pelear con contenido épico.",
        rules:
          "• Respeto en chat.\n• No toxicidad.\n• Raid/PvP según reglas del Discord.\n• Reportes por Discord.",
        ip: "190.174.182.236",
        port: 7779,
        qport: 27017,
        image: "/servers/server1.png",
        modsCount: 30,
        // voto que nos pasaste (lo usamos como base)
        voteUrl: "https://topgameservers.net/conanexiles/server/nrcYSh89KdNehu8g4MS2",
        // galería (podés cambiar por imágenes específicas del server)
        gallery: ["/carousel/1.png", "/carousel/2.png", "/carousel/3.png"],
        // si tenés colección de steam, pegala acá
        modsUrl: undefined,
      },
      {
        slug: "los-antiguos-siptah",
        title: "LOS ANTIGUOS SIPTAH + EXILIO",
        subtitle: "OPEN 02/2026",
        description:
          "Servidor con Siptah + Exilio.\nContenido variado, eventos y progresión.\nPerfecto si te gusta explorar y farmear.",
        rules:
          "• Respeto y fair play.\n• Reglas de PvP/raid en Discord.\n• No exploits.\n• Soporte por Discord.",
        ip: "190.174.182.236",
        port: 7781,
        qport: 27015,
        image: "/servers/server2.png",
        modsCount: 24,
        voteUrl: "https://topgameservers.net/conanexiles/server/nrcYSh89KdNehu8g4MS2",
        gallery: ["/carousel/4.png", "/carousel/5.png"],
        modsUrl: undefined,
      },
      {
        slug: "mods-y-mazmorras",
        title: "LOS ANTIGUOS PvPvE (MODS + MAZMORRAS)",
        subtitle: "Best Mods y Mazmorras",
        description:
          "Servidor modded con mazmorras y contenido extra.\nEnfocado en PvPvE, desafíos y progresión.\nRecomendado para jugadores que buscan más dificultad.",
        rules:
          "• No griefing.\n• Raid/PvP según Discord.\n• Respeto.\n• No cheats/exploits.",
        ip: "190.174.182.236",
        port: 7786,
        qport: 27026,
        image: "/servers/server3.png",
        modsCount: 40,
        voteUrl: "https://topgameservers.net/conanexiles/server/nrcYSh89KdNehu8g4MS2",
        gallery: ["/carousel/2.png", "/carousel/3.png", "/carousel/5.png"],
        modsUrl: undefined,
      },
      {
        slug: "exilio-sin-mods",
        title: "LOS ANTIGUOS EXILIO SIN MODS",
        subtitle: "PVE / PVP",
        description:
          "Servidor vanilla (sin mods).\nExperiencia clásica, estable y sin descargas.\nIdeal para empezar o para jugar tranquilo.",
        rules:
          "• Respeto.\n• No exploits.\n• PvP según Discord.\n• Soporte por Discord.",
        ip: "190.174.182.236",
        port: 7777,
        qport: 27018,
        image: "/servers/server4.png",
        modsCount: 0,
        voteUrl: "https://topgameservers.net/conanexiles/server/nrcYSh89KdNehu8g4MS2",
        gallery: ["/carousel/1.png", "/carousel/4.png"],
        modsUrl: undefined,
      },
    ],
    []
  );

  const [selected, setSelected] = useState<ServerInfo | null>(null);
  const [open, setOpen] = useState(false);

  function openModal(s: ServerInfo) {
    setSelected(s);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setSelected(null);
  }

  return (
    <main
      className="min-h-[calc(100vh-120px)] bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="shell pb-10">
        <div className="panel">
          {/* LOGO + CAROUSEL */}
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <div className="h-[220px] rounded-xl border border-black/10 bg-white grid place-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/logo.png"
                alt="Los Antiguos"
                className="max-h-[90%] max-w-[90%] object-contain"
              />
            </div>

            <div className="h-[220px] rounded-xl border border-black/10 overflow-hidden">
              <Carousel />
            </div>
          </div>

          <div className="my-5 h-px bg-black/10" />

          {/* SERVERS */}
          <div className="grid gap-4 lg:grid-cols-4">
            {servers.map((s) => (
              <ServerCard
                key={s.slug}
                title={s.title}
                subtitle={s.subtitle}
                ip={s.ip}
                port={s.port}
                qport={s.qport}
                image={s.image ?? "/servers/server-fallback.png"}
                slug={s.slug}
                onOpen={() => openModal(s)}
              />
            ))}
          </div>

          <div className="my-5 h-px bg-black/10" />

          {/* Discord + Redes */}
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="lg:col-span-3 rounded-xl border border-black/10 bg-white p-4">
              <div className="font-semibold mb-3">Discord</div>
              <DiscordWidget />
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-4">
              <div className="font-semibold">Redes</div>

              <a
                className="mt-3 block text-center text-sm px-3 py-2 rounded-lg border hover:bg-black/5"
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>

              <a
                className="mt-2 block text-center text-sm px-3 py-2 rounded-lg border hover:bg-black/5"
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
              >
                Discord
              </a>

              <div className="mt-3 text-xs text-black/50">
                Tip: elegí un server y usá “Compartir” dentro del popup.
              </div>
            </div>
          </div>

          <div className="my-5 h-px bg-black/10" />

          {/* VIDEO */}
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="font-semibold mb-2">Video del server</div>
            <video className="w-full rounded-lg" controls preload="metadata">
              <source src="/media/server.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <ServerModal
        open={open}
        onClose={closeModal}
        server={selected}
        discordUrl={DISCORD_URL}
        facebookUrl={FACEBOOK_URL}
      />
    </main>
  );
}
