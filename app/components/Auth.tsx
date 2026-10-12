"use client";

import { useState } from "react";
import { supabase } from "../supabase-client";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) return;

    setLoading(true);
    try {
      const { error } =
        mode === "sign-up"
          ? await supabase.auth.signUp({ email: trimmedEmail, password })
          : await supabase.auth.signInWithPassword({
              email: trimmedEmail,
              password,
            });

      if (error) {
        setError(error.message);
        return;
      }

      setEmail("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleAuth}
      className="border-t-2 border-ink bg-paper-2 p-6 sm:p-8"
    >
      <p className="kicker">
        {mode === "sign-up" ? "New account" : "Welcome back"}
      </p>

      <div className="mt-4 grid grid-cols-2 border border-rule" role="tablist">
        {(["sign-in", "sign-up"] as const).map((m) => {
          const active = mode === m;
          return (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`h-10 font-mono text-xs font-medium tracking-[0.06em] whitespace-nowrap uppercase transition-[background-color,color] duration-150 ${
                active
                  ? "bg-ink text-paper"
                  : "text-muted hover:bg-paper hover:text-ink"
              }`}
            >
              {m === "sign-in" ? "Sign in" : "Sign up"}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-5">
        <div className="flex min-w-0 flex-col gap-2">
          <label
            htmlFor="auth-email"
            className="font-mono text-xs font-medium tracking-[0.06em] text-muted uppercase"
          >
            Email address
          </label>
          <input
            id="auth-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 w-full min-w-0 rounded-control border border-rule-2 bg-paper px-4 text-base text-ink outline-none placeholder:text-muted focus:border-accent"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label
            htmlFor="auth-password"
            className="font-mono text-xs font-medium tracking-[0.06em] text-muted uppercase"
          >
            Password
          </label>
          <input
            id="auth-password"
            name="password"
            type="password"
            required
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            className="h-11 w-full min-w-0 rounded-control border border-rule-2 bg-paper px-4 text-base text-ink outline-none placeholder:text-muted focus:border-accent"
          />
        </div>
      </div>

      <p
        aria-live="polite"
        className={`mt-4 min-h-6 pl-3 text-sm leading-6 text-ink ${
          error ? "border-l-2 border-danger" : ""
        }`}
      >
        {error ?? ""}
      </p>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 h-11 w-full rounded-control bg-accent text-sm font-medium whitespace-nowrap text-accent-ink transition-[filter] duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Please wait…"
          : mode === "sign-up"
            ? "Create account"
            : "Sign in"}
      </button>
    </form>
  );
}
