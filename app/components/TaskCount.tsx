"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";

export default function TaskCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function setup() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      function refresh() {
        if (cancelled) return;
        supabase
          .from("tasks")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user!.id)
          .eq("is_completed", false)
          .then(({ count }) => {
            if (!cancelled) setCount(count ?? 0);
          });
      }

      refresh();

      channel = supabase
        .channel(`tasks-count-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "tasks",
            filter: `user_id=eq.${user.id}`,
          },
          refresh
        )
        .subscribe();
    }

    setup();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <p className="mt-2 font-display text-5xl font-semibold tracking-[-0.025em] text-ink tabular-nums">
      {count === null ? "—" : count}
    </p>
  );
}
