// src/app/page.tsx
import Link from "next/link";
import { Zap, Users, Trophy, ArrowRight, Coins } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-16 gap-16">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="flex flex-col items-center gap-6 text-center max-w-2xl">

        {/* $WAR badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-war-gold/30 bg-war-gold/5 text-war-gold text-xs font-mono tracking-widest uppercase">
          <Coins size={12} />
          <span>Powered by $WAR</span>
        </div>

        {/* Wordmark */}
        <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl tracking-tight leading-none">
          <span className="text-white">Wa</span>
          <span className="text-neon-cyan">Re</span>
          <span className="text-white">bus</span>

        </h1>

        {/* Tagline */}
        <p className="font-body text-white/50 text-lg max-w-md leading-relaxed">
          Decode the puzzle. Earn the token. Dominate the arena.
        </p>

        {/* Divider */}
        <div className="divider-cyber w-32 my-2" />

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/daily" className="btn-neon-cyan">
            <span className="flex items-center gap-2">
              Play Daily Clue
              <ArrowRight size={14} />
            </span>
          </Link>
          <Link href="/arena" className="btn-ghost-cyan">
            <span className="flex items-center gap-2">
              <Users size={14} />
              Enter Arena
            </span>
          </Link>
        </div>
      </section>

      {/* ── Feature cards ─────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">

        <div className="glass-card-cyan p-6 flex flex-col gap-3 animate-float" style={{ animationDelay: "0s" }}>
          <Zap size={22} className="text-cyan-neon" />
          <h3 className="font-display font-bold text-sm tracking-wider uppercase text-white/90">
            Daily Clue
          </h3>
          <p className="font-body text-white/40 text-sm leading-relaxed">
            One new rebus puzzle every 24 hours. First solvers earn the largest $WAR rewards.
          </p>
        </div>

        <div className="glass-card-magenta p-6 flex flex-col gap-3 animate-float" style={{ animationDelay: "0.8s" }}>
          <Users size={22} className="text-magenta-neon" />
          <h3 className="font-display font-bold text-sm tracking-wider uppercase text-white/90">
            Live Arena
          </h3>
          <p className="font-body text-white/40 text-sm leading-relaxed">
            Kahoot-style multiplayer rounds. Compete live, climb the leaderboard, claim the pot.
          </p>
        </div>

        <div className="glass-card p-6 flex flex-col gap-3 animate-float" style={{ animationDelay: "1.6s" }}>
          <Trophy size={22} className="text-neon-gold" />
          <h3 className="font-display font-bold text-sm tracking-wider uppercase text-white/90">
            $WAR Economy
          </h3>
          <p className="font-body text-white/40 text-sm leading-relaxed">
            Your score is your stake. Accumulate $WAR tokens through skill, speed, and streaks.
          </p>
        </div>
      </section>

      {/* ── Status ticker ─────────────────────────────────────── */}
      <div className="glass-card px-6 py-3 flex items-center gap-6 text-xs font-mono text-white/30">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-neon animate-pulse-slow" />
          <span className="text-cyan-neon/70">NETWORK: LIVE</span>
        </span>
        <span className="text-white/10">|</span>
        <span>DAILY PUZZLE: ACTIVE</span>
        <span className="text-white/10">|</span>
        <span>ARENA: WAITING FOR PLAYERS</span>
      </div>

    </main>
  );
}