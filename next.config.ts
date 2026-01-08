import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Para que Next no intente empaquetar gamedig (y sus requires dinámicos)
  serverExternalPackages: ["gamedig", "keyv"],
};

export default nextConfig;
