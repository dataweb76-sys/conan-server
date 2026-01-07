import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // IMPORTANTE:
  // - No uses typedRoutes ahora (te rompe el build con validators)
  // - Externalizamos gamedig para que no lo intente “bundle-ar”
  serverExternalPackages: ["gamedig"],

  // Si te vuelve a romper por ESLint en Vercel, podés habilitar esto:
  // eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
