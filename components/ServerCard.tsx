export default function ServerCard({ title, subtitle, image, ip, port, qPort }: any) {
  return (
    <div className="relative h-full w-full flex flex-col justify-end p-10 overflow-hidden group">
      <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-10 transition-opacity duration-700" alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d121b] via-[#0d121b]/60 to-transparent z-20" />
      
      <div className="relative z-30 pointer-events-none text-left">
        <h3 className="text-2xl font-black italic leading-tight text-white uppercase drop-shadow-[0_2px_15px_rgba(0,0,0,1)]">
          {title}
        </h3>
        <p className="text-[10px] font-bold tracking-[0.2em] text-orange-500 uppercase mt-2">
          {subtitle}
        </p>
        <div className="mt-4 text-[9px] font-mono text-white/30 tracking-widest">
           {ip}:{port} {qPort ? `| Q:${qPort}` : ''}
        </div>
      </div>
    </div>
  );
}