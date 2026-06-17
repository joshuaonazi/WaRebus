// src/components/auth/AuthModal.tsx
"use client";

import { useState } from "react";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onClose: () => void;
}

type AuthMode = "signin" | "signup";

export default function AuthModal({ onClose }: Props) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    let err: string | null = null;

    if (mode === "signup") {
      if (!handle.trim()) {
        setError("Handle is required.");
        setLoading(false);
        return;
      }
      err = await signUp(email, password, handle.trim());
      if (!err) setSuccess(true);
    } else {
      err = await signIn(email, password);
      if (!err) onClose();
    }

    if (err) setError(err);
    setLoading(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  if (success) {
    return (
      <div className="auth-modal-backdrop" onClick={onClose}>
        <div className="auth-modal glass-card-cyan" onClick={(e) => e.stopPropagation()}>
          <div className="auth-success">
            <span style={{ fontSize: "2.5rem" }}>📬</span>
            <h2 className="auth-title">Check your email</h2>
            <p className="auth-subtitle">
              We sent a confirmation link to <strong>{email}</strong>.
              Click it to activate your account and start earning $WAR.
            </p>
            <button className="btn-neon-cyan" style={{ width: "100%" }} onClick={onClose}>
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div
        className="auth-modal glass-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="auth-modal-header">
          <h2 className="auth-title">
            {mode === "signin" ? "Welcome back" : "Join WaRebus"}
          </h2>
          <button className="auth-close-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <p className="auth-subtitle">
          {mode === "signin"
            ? "Sign in to track your $WAR and streaks."
            : "Create an account to earn $WAR and compete."}
        </p>

        {/* Fields */}
        <div className="auth-fields">
          {mode === "signup" && (
            <div className="auth-field">
              <label className="auth-label">Handle</label>
              <div className="auth-input-wrap">
                <User size={14} className="auth-input-icon" />
                <input
                  className="auth-input"
                  type="text"
                  placeholder="0xYourName"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  onKeyDown={handleKey}
                  maxLength={24}
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrap">
              <Mail size={14} className="auth-input-icon" />
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={14} className="auth-input-icon" />
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <p className="auth-error">{error}</p>}

        {/* Submit */}
        <button
          className="btn-neon-cyan"
          style={{ width: "100%" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <Loader2 size={16} className="auth-spinner" />
            : mode === "signin" ? "Sign In" : "Create Account"
          }
        </button>

        {/* Toggle mode */}
        <p className="auth-toggle">
          {mode === "signin" ? "No account?" : "Already have one?"}
          {" "}
          <button
            className="auth-toggle-btn"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}