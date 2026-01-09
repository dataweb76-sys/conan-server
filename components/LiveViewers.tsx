"use client";
import { useEffect, useState } from "react";

export default function LiveViewers() {
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    // Número inicial aleatorio
    setViewers(Math.floor(Math.random() * (28 - 12 + 1)) + 12);

    const interval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newValue = prev + change;
        // Mantenerlo en un rango creíble
        return newValue >= 8 && newValue <= 35 ? newValue : prev;
      });
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-500">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
        {viewers} Explorando el Reino
      </span>
    </div>
  );
}