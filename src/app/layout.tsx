// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Orbitron, Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "600", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "WaRebus — Daily Crypto Rebus Puzzles",
    template: "%s | WaRebus",
  },
  description:
    "Solve daily crypto-themed rebus puzzles. Earn $WAR. Compete in live multiplayer arenas.",
  keywords: ["crypto", "rebus", "puzzle", "web3", "daily", "multiplayer"],
};

export const viewport: Viewport = {
  themeColor: "#060B19",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <div className="fixed inset-0 bg-grid-overlay pointer-events-none z-0" aria-hidden="true" />
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px animate-scan-line"
               style={{ background: "rgba(0,229,255,0.1)" }} />
        </div>
        <div className="relative z-10 flex flex-col min-h-dvh">
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}