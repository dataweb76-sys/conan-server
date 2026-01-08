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
      <div className="bg-[#1a1c23] border border-gray-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header con Imagen */}
        <div className="relative h-40 bg-gray-800">
          <img 
            src="https://images8.alphacoders.com/812/812328.jpg" 
            className="w-full h-full object-cover opacity-50"
            alt="Conan Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c23] to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-lg hover:bg-red-500 transition">
            ✕ Cerrar
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Fila Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">{server?.name || "Cargando..."}</h2>
              <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                <p className="text-sm text-gray-400">Estado: <span className="text-green-400">Online</span></p>
                <p className="text-sm text-gray-400">Mapa: <span className="text-white">{server?.map || "Exiled Lands"}</span></p>
                <p className="text-sm text-gray-400">Jugadores: <span className="text-white font-mono">{server?.playersCount || 0}/{server?.maxPlayers || 40}</span></p>
              </div>
            </div>

            {/* Banner de Votación */}
            <div className="flex flex-col justify-center">
              <a 
                href="https://topgameservers.net/conan-exiles/vote/dragon-y-dinosaurio-pvevp-v11" 
                target="_blank"
                className="group relative bg-orange-600 hover:bg-orange-500 p-4 rounded-xl text-center transition-all transform hover:scale-105 shadow-lg shadow-orange-900/20"
              >
                <span className="text-xs uppercase tracking-widest text-orange-200">¡Ayúdanos a crecer!</span>
                <p className="text-lg font-black text-white">VOTA POR EL REINO</p>
              </a>
            </div>
          </div>

          {/* Botón de Mods Esmeralda */}
          <button 
            onClick={() => setShowMods(true)}
            className="w-full py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 rounded-xl text-emerald-400 font-bold transition-colors"
          >
            Explorar el listado de 11 mods instalados ➔
          </button>
        </div>
      </div>

      {/* Popup Interno de Mods */}
      {showMods && (
        <div className="absolute inset-0 z-60 flex items-center justify-center p-6 bg-[#1a1c23]/95">
          <div className="w-full max-w-md bg-gray-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-emerald-400 mb-4 flex justify-between">
              Lista de Mods
              <button onClick={() => setShowMods(false)} className="text-gray-500 hover:text-white">✕</button>
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {MODS_REALES.map((mod, i) => (
                <div key={i} className="text-sm text-gray-300 py-2 border-b border-gray-800">
                  <span className="text-emerald-500 mr-2">#{(i+1).toString().padStart(2,'0')}</span> {mod}
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowMods(false)}
              className="mt-6 w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white"
            >
              Volver al servidor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}