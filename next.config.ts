import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Si tenías typedRoutes prendido y te daba warnings/errores, lo apagamos.
  // (En Next 16 se movió de experimental a typedRoutes.)
  typedRoutes: false,

  // IMPORTANTE: evitamos que Next intente bundle-ar gamedig (rompe por adapters opcionales)
  serverExternalPackages: ["gamedig"],

  // Por las dudas, si turbopack/webpack se pone pesado con requires dinámicos
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Asegura que se ejecute como dependencia externa en runtime
      config.externals = [...(config.externals || []), "gamedig"];
    }
    return config;
  },
};

export default nextConfig;
