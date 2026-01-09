"use client";
import { useState } from "react";

export default function ServerChat({ serverName }: { serverName: string }) {
  const [msg, setMsg] = useState("");
  const WEBHOOK_URL = "TU_WEBHOOK_AQUI"; // <-- PEGA TU WEBHOOK DE DISCORD ACÁ

  const sendToDiscord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `**[CHAT WEB - ${serverName}]**: ${msg}`,
      }),
    });
    setMsg("");
    alert("Mensaje enviado al Discord!");
  };

  return (
    <form onSubmit={sendToDiscord} className="mt-4 flex gap-2">
      <input 
        type="text" 
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder={`Mensaje a ${serverName}...`}
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-orange-500/50"
      />
      <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all">
        Enviar
      </button>
    </form>
  );
}