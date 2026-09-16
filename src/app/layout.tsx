import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FLUXA — Orquestração Inteligente de Recebíveis B2B",
  description: "Recupere até 3x mais sem aumentar headcount. Régua automática multicanal, Pix, conciliação e IA preditiva para PMEs B2B.",
};

import { AuthProvider } from "@/components/AuthProvider";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`antialiased bg-slate-50`} style={{fontFamily:'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif'}}><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
