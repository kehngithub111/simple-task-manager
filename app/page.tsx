import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-ink-2">
      {/* N1a — genuinely two destinations */}
      <header className="border-b border-rule">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-mono text-sm font-semibold tracking-tight whitespace-nowrap text-ink"
          >
            tasks/
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/login" className="link-underline text-sm">
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-control bg-accent px-4 py-2 text-sm font-medium whitespace-nowrap text-accent-ink transition-[filter] duration-150 hover:brightness-110"
            >
              Open dashboard
            </Link>
          </div>
        </nav>
      </header>

      {/* H2 Split diptych — title left, code card right */}
      <main className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="reveal min-w-0">
          <p className="kicker">
            <span className="kicker__tick" />
            Realtime · Supabase · Next.js
          </p>
          <h1 className="mt-4 font-display text-display leading-[1.05] font-semibold tracking-[-0.025em] text-ink">
            Tasks, live in every tab.
          </h1>
          <p className="mt-4 max-w-[52ch] text-lg leading-8">
            Sign in, add a title and one line of context, and watch every open
            tab update over a Supabase realtime channel. Nothing to configure.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/dashboard"
              className="rounded-control bg-accent px-5 py-2.5 text-sm font-medium whitespace-nowrap text-accent-ink transition-[filter] duration-150 hover:brightness-110"
            >
              Open dashboard
            </Link>
            <Link href="/login" className="link-underline text-sm">
              Sign in →
            </Link>
          </div>
          <p className="mt-10 font-mono text-xs tracking-[0.06em] text-muted uppercase">
            postgres_changes · public.tasks · live
          </p>
        </div>

        <figure className="code-card reveal p-5">
          <div className="flex items-center justify-between gap-3 border-b border-graphite-line pb-3">
            <figcaption className="font-mono text-xs tracking-[0.06em] text-graphite-muted uppercase">
              tasks-changes · live
            </figcaption>
            <span className="status-ok">200 OK</span>
          </div>
          <pre className="overflow-x-auto pt-4 text-[13px] leading-7">
            <code>
              <span className="tok-key">supabase.channel</span>
              <span className="tok-punct">(</span>
              <span className="tok-str">&quot;tasks-changes&quot;</span>
              <span className="tok-punct">)</span>
              {"\n"}
              <span className="tok-punct">{"  "}.on(</span>
              <span className="tok-str">&quot;postgres_changes&quot;</span>
              <span className="tok-punct">{", "}</span>
              {"\n"}
              <span className="tok-punct">{"       { event: "}</span>
              <span className="tok-str">&quot;*&quot;</span>
              <span className="tok-punct">{", table: "}</span>
              <span className="tok-str">&quot;tasks&quot;</span>
              <span className="tok-punct">{" })"}</span>
              {"\n"}
              <span className="tok-punct">{"  "}.subscribe()</span>
              {"\n\n"}
              <span className="tok-punct">
                {"  "}→ INSERT · UPDATE · DELETE stream in
              </span>
            </code>
          </pre>
        </figure>
      </main>

      {/* Ft2 Inline single line */}
      <footer className="border-t border-rule">
        <p className="mx-auto w-full max-w-5xl px-6 py-5 font-mono text-xs text-muted">
          tasks/ — a realtime notes app · Next.js + Supabase
        </p>
      </footer>
    </div>
  );
}
