import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GridProvider } from "./context/GridContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartGrid AIoT • Command & Digital Twin Dashboard",
  description: "Next.js App Router digital twin dashboard for ESP32 edge node grid telemetry and rover patrol control.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-955 text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-slate-950`}>
        <GridProvider>{children}</GridProvider>
      </body>
    </html>
  );
}
