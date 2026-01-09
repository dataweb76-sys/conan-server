import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Los Antiguos | Conan Exiles",
  description: "Comunidad Hispana de Conan Exiles - Servidores y Soporte",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-[#05070a] text-white antialiased`}>
        {children}
        {/* El chat ahora está dentro del modal, por eso no lo llamamos aquí */}
      </body>
    </html>
  );
}