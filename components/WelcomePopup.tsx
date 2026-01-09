"use client";
import { useState, useEffect } from "react";
import { X, Sword, Zap, Map, Shield, Flame, Compass } from "lucide-react";

export default function WelcomePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Retraso de 1 segundo para que cargue la web primero
    const timer = setTimeout(() => {
      // COMENTA ESTA LÍNEA si quieres que aparezca CADA VEZ que refresques (para pruebas)
      const hasVisited = sessionStorage.getItem("welcome_viewed");
      if (!hasVisited) {
        setShow(true);
      }
      
      // DESCOMENTA esta línea para forzarlo siempre mientras pruebas:
      // setShow(true); 
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShow(false);
    sessionStorage.setItem("welcome_viewed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-3xl bg-[#0b0f17] rounded-[3.5rem] border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(234,88,12,0.25)] animate-in zoom-in-95 duration-500">
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-orange-600 to-transparent animate-pulse" />

        <button onClick={closePopup} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors z-50">
          <X size={32} />
        </button>

        <div className="p-12 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 bg-orange-600/10 px-4 py-1.5 rounded-full border border-orange-600/20">
            <Flame size={14} className="text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Temporada 2026</span>
          </div>

          <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-[0.9]">
            DOMINA MUNDOS <br />
            <span className="text-orange-600">INEXPLORADOS</span>
          </h2>
          
          <p className="mt-6 text-white/50 font-bold text-sm max-w-lg leading-relaxed">
            Elegí el reino que más te guste y viví una vida única. Desde la brutalidad del <span className="text-white">PvP</span> hasta la estrategia del <span className="text-white">PvE</span>.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full mt-10">
            {[
              { icon: <Sword size={18}/>, t: "PVP & PVE", c: "Equilibrio total" },
              { icon: <Flame size={18}/>, t: "DRAGONES", c: "Bestias míticas" },
              { icon: <Zap size={18}/>, t: "TELEPORT", c: "Mapa liberado" },
              { icon: <Shield size={18}/>, t: "DINOSAURIOS", c: "Extinción activa" },
              { icon: <Map size={18}/>, t: "MUNDOS NUEVOS", c: "Mapas custom" },
              { icon: <Compass size={18}/>, t: "NPC ÚNICOS", c: "Mercado negro" },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 p-4 rounded-[1.5rem] border border-white/5 flex flex-col items-center group hover:bg-orange-600/10 transition-colors">
                <div className="text-orange-500 mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">{item.t}</span>
                <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">{item.c}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 w-full group relative">
            <button onClick={closePopup} className="relative w-full overflow-hidden bg-orange-600 hover:bg-orange-500 py-7 rounded-[2rem] shadow-[0_20px_40px_rgba(234,88,12,0.3)] transition-all duration-300">
              <span className="relative z-10 text-white font-black uppercase italic tracking-tighter text-2xl">
                ¡ELEGIR MI DESTINO AHORA!
              </span>
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 group-hover:animate-shine" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine { 0% { left: -100%; } 100% { left: 150%; } }
        .animate-shine { animation: shine 0.75s forwards; }
      `}</style>
    </div>
  );
}