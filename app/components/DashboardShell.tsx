"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import { supabase } from "../supabase-client";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
      } else {
        setChecking(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper font-body">
        <p className="font-mono text-sm text-muted">Loading workspace…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-ink-2">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        {children}
      </main>
      <footer className="border-t border-rule">
        <p className="mx-auto w-full max-w-5xl px-6 py-5 font-mono text-xs text-muted">
          tasks/ — signed in · realtime on
        </p>
      </footer>
    </div>
  );
}
