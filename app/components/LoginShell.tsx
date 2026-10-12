"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Auth from "./Auth";
import { supabase } from "../supabase-client";

export default function LoginShell() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/dashboard");
      } else {
        setChecking(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper font-body">
        <p className="font-mono text-sm text-muted">Authenticating…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-ink-2">
      <header className="border-b border-rule">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-mono text-sm font-semibold tracking-tight whitespace-nowrap text-ink"
          >
            tasks/
          </Link>
          <Link href="/" className="link-underline text-sm">
            ← Back home
          </Link>
        </nav>
      </header>

      <main className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 items-start gap-12 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
        <div className="reveal min-w-0 lg:sticky lg:top-16">
          <p className="kicker">
            <span className="kicker__tick" />
            Auth · Supabase
          </p>
          <h1 className="mt-4 font-display text-display leading-[1.05] font-semibold tracking-[-0.025em] text-ink">
            Sign in to your workspace.
          </h1>
          <p className="mt-4 max-w-[46ch] text-lg leading-8">
            One account, every tab. Email and password only — sessions persist
            across reloads and the dashboard guards itself.
          </p>
        </div>

        <div className="reveal min-w-0" style={{ "--i": 1 } as React.CSSProperties}>
          <Auth />
        </div>
      </main>

      <footer className="border-t border-rule">
        <p className="mx-auto w-full max-w-5xl px-6 py-5 font-mono text-xs text-muted">
          tasks/ — a realtime notes app · Next.js + Supabase
        </p>
      </footer>
    </div>
  );
}
