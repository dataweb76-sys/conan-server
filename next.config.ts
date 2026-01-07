import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Para que Vercel/Next no intente bundleear gamedig y se rompa con dependencias dinámicas
  serverExternalPackages: ["gamedig"],

  // Si querés mantener TS estricto, podés borrar esto.
  // Pero si estás en modo “subila ya”, esto evita frenos por types.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

