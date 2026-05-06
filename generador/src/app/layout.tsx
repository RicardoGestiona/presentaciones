import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generador esPublico",
  description: "Generador web de presentaciones corporativas esPublico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
