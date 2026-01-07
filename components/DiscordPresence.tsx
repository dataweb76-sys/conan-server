"use client";

export default function DiscordWidget() {
  return (
    <div className="w-full flex justify-center">
      <iframe
        src="https://discord.com/widget?id=1039143521342455918&theme=dark"
        width="100%"
        height="500"
        allow="clipboard-write; encrypted-media; picture-in-picture"
       allowTransparency={true}
        frameBorder={0}
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        className="rounded-xl border border-black/10"
        title="Discord Widget"
      />
    </div>
  );
}
