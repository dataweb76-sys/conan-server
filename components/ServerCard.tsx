"use client";

import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  ip: string;
  port: number;
  qport?: number; // ✅ ahora existe
  image: string;
  slug: string;
  onOpen: () => void;
};

export default function ServerCard({
  title,
  subtitle,
  ip,
  port,
  qport,
  image,
  onOpen,
}: Props) {
  const addr = `${ip}:${port}`;

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  }

  return (
    <div
      className="rounded-xl border border-black/10 bg-white overflow-hidden cursor-pointer hover:shadow-sm transition-shadow"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={onKeyDown}
      aria-label={`Abrir información de ${title}`}
    >
      {/* Imagen */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={title} className="w-full h-44 object-cover" />

      <div className="p-3">
        <div className="font-semibold leading-tight">{title}</div>
        {subtitle ? <div className="text-xs text-black/60 mt-1">{subtitle}</div> : null}

        <div className="text-xs mt-3 font-mono">{addr}</div>

        {/* (Opcional) mostrar query port si lo querés ver */}
        {typeof qport === "number" ? (
          <div className="text-[11px] mt-1 text-black/60 font-mono">Query: {qport}</div>
        ) : null}

        <div className="mt-3 flex gap-2">
          {/* Botón Ver (abre modal) */}
          <button
            className="text-sm px-3 py-2 rounded-lg border border-black/10 hover:bg-black/5"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          >
            Ver
          </button>

          {/* Copiar IP */}
          <button
            className="text-sm px-3 py-2 rounded-lg bg-black text-white hover:opacity-90"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(addr);
            }}
          >
            Copiar IP
          </button>
        </div>
      </div>
    </div>
  );
}
