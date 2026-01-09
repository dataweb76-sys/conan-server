"use client";
import Script from "next/script";

export default function DiscordChat() {
  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3"
      strategy="lazyOnload"
      onLoad={() => {
        try {
          // @ts-ignore
          new Crate({
            server: '1039143521342455918',
            channel: '1058403232445104140',
            color: '#f97316'
          });
        } catch (e) {
          console.log("Error cargando WidgetBot:", e);
        }
      }}
    />
  );
}