"use client";
import { useState, useEffect } from "react";
import DiscordWidget from "@/components/DiscordWidget";
import ServerModal from "@/components/ServerModal";
import { 
  MessageCircle, Zap, Shield, Sword, 
  Map, Crown, UserPlus, Lock, 
  Youtube, Download, VideoOff, 
  PlayCircle, Facebook, Gamepad2, Send
} from "lucide-react";

// --- COMPONENTE: SECCIÓN DE REGISTRO CON IMAGEN ---
const HeroRegistration = () => {
  const [formData, setFormData] = useState({ name: "", discord: "", steam: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    // Simulación de envío (Aquí conectarías tu Webhook de Discord)
    setTimeout(() => {
      setStatus("sent");
      setFormData({ name: "", discord: "", steam: "" });
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto py-20 px-4">
      {/* Título de la Sección */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-orange-600/20 rounded-lg text-orange-500 font-black uppercase text-[10px] tracking-[0.3em]">
          <Lock size={12} /> Ranking: Próximamente
        </div>
        <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
          REGISTRA TU <span className="text-orange-600">LEYENDA</span>
        </h3>
      </div>

      <div className="grid lg:grid-cols-5 gap-0 rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl bg-[#080808]">
        {/* LADO IZQUIERDO: LA IMAGEN DEL SERVIDOR */}
        <div className="lg:col-span-3 relative h-[400px] lg:h-auto group">
          <img 
            src="/Gemini_Generated_Image_jm22xyjm22xyjm22.jpg" 
            alt="Legion de Reyes" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080808]"></div>
          
          {/* Badge flotante sobre la imagen */}
          <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-md p-6 rounded-3xl border border-white/10">
            <h4 className="text-xl font-black italic uppercase text-orange-500">Legión de Reyes</h4>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Servidor RP - PVP 24hs</p>
          </div>
        </div>

        {/* LADO DERECHO: FORMULARIO */}
        <div className="lg:col-span-2 p-10 md:p-14 flex flex-col justify-center space-y-8">
          <div className="space-y-2">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">
              Inscríbete para aparecer en el salón de la fama y recibir notificaciones de misiones épicas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-orange-500 ml-2 tracking-widest">Nombre del Personaje</label>
              <input 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-orange-600 transition-all text-sm placeholder:text-white/10" 
                placeholder="Ej: Artorius"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-white/30 ml-2 tracking-widest">Discord User</label>
              <input 
                required
                value={formData.discord}
                onChange={(e) => setFormData({...formData, discord: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-orange-600 transition-all text-sm placeholder:text-white/10" 
                placeholder="usuario#0000"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-white/30 ml-2 tracking-widest">Steam ID / Perfil</label>
              <input 
                required
                value={formData.steam}
                onChange={(e) => setFormData({...formData, steam: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-orange-600 transition-all text-sm placeholder:text-white/10" 
                placeholder="https://steamcommunity.com/..."
              />
            </div>

            <button 
              disabled={status !== "idle"}
              type="submit"
              className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all ${
                status === 'sent' ? 'bg-green-600' : 'bg-orange-600 hover:bg-orange-500 active:scale-95 shadow-lg shadow-orange-900/20'
              }`}
            >
              {status === "idle" && <><UserPlus size={18}/> Unirse a la Legión</>}
              {status === "sending" && <span className="animate-pulse">Enviando a los Dioses...</span>}
              {status === "sent" && <>¡Registro Recibido!</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const serverData = { 
    slug: "legion-de-reyes", 
    title: "LEGIÓN DE REYES", 
    ip: "190.174.182.114", 
    port: 7779, 
    queryPort: 27017,
    image: "/Gemini_Generated_Image_jm22xyjm22xyjm22.jpg",
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-orange-600 overflow-x-hidden">
      {/* BACKGROUND BLUR */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <img src={serverData.image} className="w-full h-full object-cover blur-[120px]" alt="bg"/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-32">
        {/* NAV (Mismo estilo anterior) */}
        <nav className="flex justify-between items-center bg-white/5 backdrop-blur-2xl p-6 rounded-[3rem] border border-white/10 shadow-2xl sticky top-6 z-[100]">
          <div className="flex items-center gap-5">
            <div className="p-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl">
              <img src="/logo/logo.png" className="w-14 h-14 rounded-xl" alt="logo" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase italic leading-none tracking-tighter">Legión <span className="text-orange-600">de Reyes</span></h1>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Survival RP PvP Server</span>
            </div>
          </div>
          <a href="https://discord.gg/4SmuhXPfMr" target="_blank" className="p-4 bg-orange-600 rounded-2xl hover:scale-110 transition-all shadow-lg"><MessageCircle size={24}/></a>
        </nav>

        {/* HERO SECTION */}
        <header className="flex flex-col items-center text-center space-y-16">
          <h2 className="text-8xl md:text-[11rem] font-black italic uppercase tracking-tighter leading-[0.75] drop-shadow-2xl">
            CONAN <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-red-700">EXILES</span>
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
            <button onClick={() => setOpen(true)} className="flex-[2] bg-white text-black py-8 rounded-[2.5rem] font-black uppercase italic text-sm hover:bg-orange-600 hover:text-white transition-all">REGLAMENTO</button>
            <a href={`steam://run/440900//+connect%20${serverData.ip}:${serverData.port}`} className="flex-1 bg-white/5 border border-white/10 py-8 rounded-[2.5rem] font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
              <Zap size={22} className="text-orange-500" /> ENTRAR AL SERVER
            </a>
          </div>
        </header>

        {/* NUEVA SECCIÓN: IMAGEN + REGISTRO */}
        <HeroRegistration />

        {/* MODS / GUÍAS */}
        <section id="mods" className="space-y-12">
          <div className="text-center">
            <h3 className="text-6xl font-black italic uppercase tracking-tighter">Sistemas <span className="text-orange-600">Únicos</span></h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 font-black uppercase italic text-center">
             <div className="p-10 bg-white/5 border border-white/5 rounded-[3rem]">Facciones Propias</div>
             <div className="p-10 bg-white/5 border border-white/5 rounded-[3rem]">Misiones de Lore</div>
             <div className="p-10 bg-white/5 border border-white/5 rounded-[3rem]">Economía Real</div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center py-20 opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.5em]">© 2026 Legión de Reyes - Dataweb Games</p>
        </footer>
      </div>

      <ServerModal open={open} onClose={() => setOpen(false)} server={serverData} />
    </main>
  );
}
