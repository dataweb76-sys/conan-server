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
        
        {/* Header con Imagen (URL Segura) */}
        <div className="relative h-40 bg-gray-800">
          <img 
            src="https://images.webapi.gc.apple.com/v1/assets/images/conan-exiles-banner.jpg" 
            className="w-full h-full object-cover opacity-60"
            alt="Conan Exiles"
            onError={(e: any) => e.target.src = "https://via.placeholder.com/800x400/1a1c23/ffffff?text=Dragon+y+Dinosaurio"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c23] to-transparent" />
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-black/60 hover:bg-red-600 text-white p-2 rounded-lg transition-colors z-10"
          >
            ✕ Cerrar
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Fila Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {server?.name || "Dragon y Dinosaurio PVEVP"}
              </h2>
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2">
                <p className="text-sm flex justify-between">
                  <span className="text-gray-400">Estado:</span>
                  <span className={server?.online ? "text-green-400 font-bold" : "text-red-400"}>
                    {server?.online ? "● Online" : "○ Offline"}
                  </span>
                </p>
                <p className="text-sm flex justify-between">
                  <span className="text-gray-400">Mapa:</span>
                  <span className="text-white">{server?.map || "Exiled Lands"}</span>
                </p>
                <p className="text-sm flex justify-between">
                  <span className="text-gray-400">Jugadores:</span>
                  <span className="text-white font-mono">{server?.playersCount || 0} / {server?.maxPlayers || 40}</span>
                </p>
              </div>
            </div>

            {/* Banner de Votación Mejorado */}
            <div className="flex flex-col justify-center">
              <a 
                href="https://topgameservers.net/conan-exiles/vote/dragon-y-dinosaurio-pvevp-v11" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-orange-600 hover:bg-orange-500 p-5 rounded-xl text-center transition-all transform hover:-translate-y-1 shadow-lg shadow-orange-900/40"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] text-orange-200 block mb-1">Tu voto nos ayuda</span>
                <p className="text-xl font-black text-white italic">¡VOTA POR EL REINO!</p>
              </a>
            </div>
          </div>

          {/* Botón de Mods Esmeralda */}
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
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 animate-in fade-in duration-200">
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
              Cerrar lista
            </button>
          </div>
        </div>
      )}
    </div>
  );
}