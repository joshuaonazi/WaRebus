// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Users, Trophy, Coins, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/daily",       label: "Daily Clue",   icon: Zap },
  { href: "/arena",       label: "Arena",        icon: Users },
  { href: "/leaderboard", label: "Leaderboard",  icon: Trophy },
] as const;

// Placeholder — will be replaced with real Supabase auth/wallet data later
const MOCK_WAR_BALANCE = "1,240";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="navbar-root">
      {/* Top border glow line */}
      <div className="navbar-glow-line" aria-hidden="true" />

      <nav className="navbar-inner">
        {/* ── Wordmark ── */}
        <Link href="/" className="navbar-wordmark" onClick={() => setMobileOpen(false)}>
          <span className="text-white">Wa</span>
          <span className="text-neon-cyan">Re</span>
          <span className="text-white">bus</span>
        </Link>

        {/* ── Desktop nav links ── */}
        <ul className="navbar-links">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`navbar-link ${active ? "navbar-link--active" : ""}`}
                >
                  <Icon size={14} strokeWidth={2} />
                  <span>{label}</span>
                  {active && <span className="navbar-link-pip" aria-hidden="true" />}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Right cluster ── */}
        <div className="navbar-right">
          {/* $WAR balance chip */}
          <div className="war-chip">
            <Coins size={13} strokeWidth={2.5} style={{ color: "var(--color-war-gold)" }} />
            <span className="war-chip-amount">{MOCK_WAR_BALANCE}</span>
            <span className="war-chip-label">$WAR</span>
          </div>

          {/* Connect wallet CTA — placeholder */}
          <button className="btn-neon-cyan navbar-cta">
            Connect
          </button>

          {/* Mobile hamburger */}
          <button
            className="navbar-hamburger"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="navbar-mobile-drawer">
          <ul className="navbar-mobile-links">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`navbar-mobile-link ${active ? "navbar-mobile-link--active" : ""}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={16} strokeWidth={2} />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="navbar-mobile-footer">
            <div className="war-chip">
              <Coins size={13} strokeWidth={2.5} style={{ color: "var(--color-war-gold)" }} />
              <span className="war-chip-amount">{MOCK_WAR_BALANCE}</span>
              <span className="war-chip-label">$WAR</span>
            </div>
            <button className="btn-neon-cyan" style={{ width: "100%", marginTop: "0.75rem" }}>
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </header>
  );
}