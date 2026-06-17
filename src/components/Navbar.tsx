// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Users, Trophy, Coins, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

const NAV_LINKS = [
  { href: "/daily",       label: "Daily Clue",  icon: Zap },
  { href: "/arena",       label: "Arena",       icon: Users },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="navbar-root">
        <div className="navbar-glow-line" aria-hidden="true" />
        <nav className="navbar-inner">

          {/* Wordmark */}
          <Link href="/" className="navbar-wordmark" onClick={() => setMobileOpen(false)}>
            <span className="text-white">Wa</span>
            <span className="text-neon-cyan">Re</span>
            <span style={{ color: "white" }}>bus</span>
          </Link>

          {/* Desktop nav */}
          <ul className="navbar-links">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link href={href} className={`navbar-link ${active ? "navbar-link--active" : ""}`}>
                    <Icon size={14} strokeWidth={2} />
                    <span>{label}</span>
                    {active && <span className="navbar-link-pip" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right cluster */}
          <div className="navbar-right">
            {profile ? (
              <>
                {/* $WAR balance */}
                <div className="war-chip">
                  <Coins size={13} strokeWidth={2.5} style={{ color: "var(--color-war-gold)" }} />
                  <span className="war-chip-amount">
                    {profile.war_balance.toLocaleString()}
                  </span>
                  <span className="war-chip-label">$WAR</span>
                </div>

                {/* Handle */}
                <span className="navbar-handle">{profile.handle}</span>

                {/* Sign out */}
                <button
                  className="navbar-signout-btn"
                  onClick={signOut}
                  title="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <div className="war-chip">
                  <Coins size={13} strokeWidth={2.5} style={{ color: "var(--color-war-gold)" }} />
                  <span className="war-chip-amount">0</span>
                  <span className="war-chip-label">$WAR</span>
                </div>
                <button
                  className="btn-neon-cyan navbar-cta"
                  onClick={() => setAuthOpen(true)}
                >
                  Connect
                </button>
              </>
            )}

            {/* Hamburger */}
            <button
              className="navbar-hamburger"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
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
              {profile ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div className="war-chip">
                    <Coins size={13} style={{ color: "var(--color-war-gold)" }} />
                    <span className="war-chip-amount">{profile.war_balance.toLocaleString()}</span>
                    <span className="war-chip-label">$WAR</span>
                  </div>
                  <button className="btn-ghost-cyan" style={{ width: "100%" }} onClick={signOut}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  className="btn-neon-cyan"
                  style={{ width: "100%" }}
                  onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth modal */}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}