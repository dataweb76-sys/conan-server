"use client";

import { useState, useEffect } from "react";

export default function WelcomePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Se muestra después de un pequeño delay para el efecto visual
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-700">
      {/* Overlay oscuro con desenfoque fuerte */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      <div className="relative w-full max-w-4xl overflow-hidden rounded-[40px] border border-white/10 bg-[#0b0f17] shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        
        {/* Imagen de Fondo Épica */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2069&auto=format&fit=crop" 
            alt="Fondo Épico" 
            className="h-full w-full object-cover opacity-30 scale-110 animate-pulse"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/60 to-transparent" />
        </div>

        {/* Contenido */}
        <div className="relative z-10 p-8 md:p-16 text-center">
          <div className="mb-6 inline-block rounded-full bg-orange-500/20 px-6 py-2 border border-orange-500/30">
            <span className="text-xs font-black uppercase tracking-[0.5em] text-orange-400">Bienvenido Superviviente</span>
          </div>

          <h1 className="mb-6 text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-none">
            HAS LLEGADO A UN <span className="text-orange-500">LUGAR DIFERENTE</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-white/70 leading-relaxed font-medium">
            Elige tu destino entre nuestros <span className="text-white font-bold">4 mundos únicos</span>. 
            Desde la magia de <span className="text-blue-400 italic">EEWA</span> y el desafío de <span className="text-red-400 italic">Calamitous</span>, 
            hasta la pureza del <span className="text-emerald-400 italic">Exilio sin Mods</span>. 
            Combates PvE y PvP te esperan.
          </p>

          {/* Grid de características rápidas */}
          <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { t: "EEWA", c: "text-blue-400" },
              { t: "Calamitous", c: "text-red-400" },
              { t: "PvE / PvP", c: "text-orange-400" },
              { t: "Sin Mods", c: "text-emerald-400" }
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 py-4 backdrop-blur-md">
                <span className={`text-xs font-black uppercase tracking-widest ${item.c}`}>{item.t}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setShow(false)}
            className="group relative inline-flex items-center gap-4 rounded-full bg-orange-600 px-12 py-5 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-orange-500 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(234,88,12,0.4)]"
          >
            Comenzar mi Aventura
            <span className="text-xl group-hover:translate-x-2 transition-transform">➔</span>
          </button>
        </div>

        {/* Decoración en esquinas */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 blur-[80px]" />
      </div>
    </div>
  );
}