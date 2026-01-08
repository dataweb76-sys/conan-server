"use client";
import React, { useState } from "react";

const MODS_REALES = [
  "Pippi - User & Server Management",
  "Fashionist (v4.4.10)",
  "Improved Quality of Life",
  "DungeonMasterTools",
  "Hosav's Custom UI Mod",
  "High Stack Storage",
  "Unlockable Plus",
  "Grim Productions",
  "Beyond The Sky",
  "No Drop on Death",
  "Emberlight"
];

export default function ServerModal({ open, onClose, server }: any) {
  const [showMods, setShowMods] = useState(false);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1c23] border border-gray-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header con Diseño Sólido (Sin imágenes externas para evitar errores de red) */}
        <div className="relative h-32 bg-gradient-to-br from-[#2a2d37] to-[#1a1c23] flex items-center px-8 border-b border-gray-800">
          <div className="space-y-1">
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-emerald-500/30">
              Servidor Activo
            </span>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              Dragon y Dinosaurio
            </h2>
          </div>

          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-black/40 hover:bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full transition-colors z-10"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Fila Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-black/40 p-5 rounded-xl border border-white/5 space-y-3">
                <p className="text-sm flex justify-between items-center">
                  <span className="text-gray-400">Estado:</span>
                  <span className={server?.online ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                    {server?.online ? "● ONLINE" : "○ OFFLINE"}
                  </span>
                </p>
                <p className="text-sm flex justify-between items-center">
                  <span className="text-gray-400">Mapa:</span>
                  <span className="text-white font-medium">{server?.map || "Exiled Lands"}</span>
                </p>
                <p className="text-sm flex justify-between items-center">
                  <span className="text-gray-400">Jugadores:</span>
                  <span className="text-white font-mono font-bold text-base">
                    {server?.playersCount ?? 0} / {server?.maxPlayers ?? 40}
                  </span>
                </p>
              </div>
            </div>

            {/* Banner de Votación (Enlace corregido) */}
            <div className="flex flex-col justify-center">
              <a 
                href="https://topgameservers.net/conanexiles/server/nrcYSh89KdNehu8g4MS2" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-orange-600 hover:bg-orange-500 p-6 rounded-xl text-center transition-all transform hover:-translate-y-1 shadow-lg shadow-orange-900/40"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] text-orange-200 block mb-1 font-bold">Apoya nuestra comunidad</span>
                <p className="text-2xl font-black text-white italic tracking-tight">VOTAR AHORA</p>
              </a>
            </div>
          </div>

          {/* Botón de Mods */}
          <button 
            onClick={() => setShowMods(true)}
            className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 font-bold transition-all flex items-center justify-center gap-3 group"
          >
            <span>Explorar los 11 mods instalados</span>
            <span className="group-hover:translate-x-1 transition-transform">➔</span>
          </button>
        </div>
      </div>

      {/* Popup de Lista de Mods */}
      {showMods && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-black/95 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#1a1c23] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center justify-between">
              Lista de Mods
              <button onClick={() => setShowMods(false)} className="text-gray-500 hover:text-white p-1">✕</button>
            </h3>
            <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {MODS_REALES.map((mod, i) => (
                <div key={i} className="text-sm text-gray-300 py-3 px-4 bg-white/5 rounded-lg border border-white/5 flex items-center gap-3">
                  <span className="text-emerald-500 font-mono text-xs">{(i+1).toString().padStart(2,'0')}</span>
                  {mod}
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowMods(false)}
              className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors"
            >
              Regresar al menú
            </button>
          </div>
        </div>
      )}
    </div>
  );
}