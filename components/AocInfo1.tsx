"use client";
import { useState } from "react";
import { Shield, Sword, Star, Map, ScrollText, Zap, ChevronRight } from "lucide-react";

const factions = [
  {
    id: "stormhold",
    name: "Stormhold",
    color: "text-blue-400",
    desc: "Guerreros tradicionales y defensores del reino. Expertos en combate físico y justicia.",
    bonus: "Bonificación en Armadura y Fuerza."
  },
  {
    id: "felgarth",
    name: "Felgarth",
    color: "text-purple-400",
    desc: "Antiguos maestros de las artes arcanas. Si buscas dominar la magia pura, este es tu lugar.",
    bonus: "Bonificación en Hechicería y Maná."
  },
  {
    id: "elvanor",
    name: "Elvanor",
    color: "text-emerald-400",
    desc: "Aliados de la naturaleza y los elfos. Maestros del arco y la agilidad.",
    bonus: "Bonificación en Puntería y Resistencia."
  },
  {
    id: "vanghoul",
    name: "Vanghoul",
    color: "text-red-500",
    desc: "Tribus salvajes que abrazan la brutalidad. Solo los más fuertes sobreviven aquí.",
    bonus: "Bonificación en Daño Vital y Salud."
  }
];

export default function AocInfo() {
  const [activeTab, setActiveTab] = useState("facciones");

  const tabs = [
    { id: "facciones", label: "Facciones", icon: <Shield size={16} /> },
    { id: "sistemas", label: "Atributos & Skills", icon: <Zap size={16} /> },
    { id: "progreso", label: "Quests & Lore", icon: <ScrollText size={16} /> },
    { id: "mapa", label: "Mapa Interactivo", icon: <Map size={16} /> },
  ];

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-md">
      {/* MENU TABS */}
      <div className="flex flex-wrap border-b border-white/10 bg-black/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? "bg-orange-600 text-white" : "hover:bg-white/5 text-white/50"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      <div className="p-8 md:p-12">
        {activeTab === "facciones" && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
            {factions.map((f) => (
              <div key={f.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 group hover:border-orange-500/50 transition-all">
                <h4 className={`text-2xl font-black italic uppercase ${f.color} mb-2`}>{f.name}</h4>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{f.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase">
                  <Star size={12} /> {f.bonus}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "sistemas" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-3xl font-black italic uppercase text-orange-500">Nuevos Atributos</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  AoC expande el sistema original. Ahora podrás especializarte en **Magia, Constitución Divina y Poder de Facción**. Cada punto invertido desbloquea habilidades pasivas únicas que te permitirán enfrentar a los bosses de EEWA.
                </p>
              </div>
              <div className="bg-black/40 p-6 rounded-3xl border border-white/10">
                <ul className="space-y-3">
                  {["Nuevas magias elementales", "Skills de combate avanzado", "Transformaciones", "Auras de equipo"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-tighter">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "progreso" && (
          <div className="text-center max-w-2xl mx-auto space-y-6 animate-in fade-in">
            <Sword className="mx-auto text-orange-500" size={48} />
            <h3 className="text-3xl font-black italic uppercase">Cientos de Quests</h3>
            <p className="text-white/60">
              No es solo sobrevivir, es avanzar. Habla con los NPCs en la **Ciudad Mercado** y en los campamentos de facción para iniciar cadenas de misiones que te otorgarán armas legendarias y monturas exclusivas.
            </p>
          </div>
        )}

        {activeTab === "mapa" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group">
              <img 
                src="https://images.worldanvil.com/uploads/maps/ee441aeb-e106-4d00-9b00-1faab0fdfb21.jpg" 
                alt="AoC Map" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <a 
                  href="https://www.worldanvil.com/w/the-age-of-calamitous/map/ee441aeb-e106-4d00-9b00-1faab0fdfb21" 
                  target="_blank"
                  className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all shadow-2xl"
                >
                  Abrir Mapa Interactivo <ExternalLink size={16} />
                </a>
              </div>
            </div>
            <p className="text-center text-[10px] text-white/40 uppercase font-bold tracking-widest">
              Explora nuevas regiones: Foscari, Elvanor y las Tierras de Stormhold.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ExternalLink({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
  );
}