"use client";
import { useEffect, useState } from "react";

export default function GeoMapPopup() {
  const [show, setShow] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    // Generamos puntos aleatorios sobre el mapa
    const initialPoints = Array.from({ length: 8 }).map(() => ({
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 60) + 20,
    }));
    setPoints(initialPoints);

    // Aparece a los 10 segundos de entrar a la web
    const timer = setTimeout(() => setShow(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[150] w-64 animate-in slide-in-from-left-full duration-700">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f17]/90 p-4 backdrop-blur-xl shadow-2xl">
        <button 
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 text-white/20 hover:text-white text-xs"
        >✕</button>
        
        <div className="mb-3 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Actividad Global</span>
        </div>

        {/* Mapa Estilizado */}
        <div className="relative h-32 w-full rounded-xl bg-white/5 border border-white/5 overflow-hidden">
          {/* Imagen de mapa de bits o puntos (placeholder visual) */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] bg-contain bg-no-repeat bg-center" />
          
          {/* Puntos de conexión */}
          {points.map((p, i) => (
            <div 
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316] animate-pulse"
              style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </div>

        <p className="mt-3 text-center text-[8px] font-bold uppercase tracking-tighter text-white/50 leading-tight">
          Supervivientes explorando la web desde <br/> 
          <span className="text-white">Argentina, España, México y más.</span>
        </p>
      </div>
    </div>
  );
}