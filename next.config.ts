import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ evita que Turbopack/Next intente “bundlear” gamedig (rompe por requires dinámicos)
  serverExternalPackages: ["gamedig"],
};

export default nextConfig;
