"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../supabase-client";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/tasks", label: "Tasks" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <header className="border-b border-rule bg-paper">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex min-w-0 items-center gap-7">
          <Link
            href="/dashboard"
            className="font-mono text-sm font-semibold tracking-tight whitespace-nowrap text-ink"
          >
            tasks/
          </Link>
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-2 font-mono text-xs font-medium tracking-[0.06em] whitespace-nowrap uppercase transition-[color] duration-150 ${
                    active
                      ? "text-accent"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden items-center gap-2 font-mono text-xs text-muted sm:flex">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            live
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="h-9 shrink-0 rounded-control border border-rule-2 px-4 text-sm font-medium whitespace-nowrap text-ink transition-[border-color] duration-150 hover:border-accent"
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}
