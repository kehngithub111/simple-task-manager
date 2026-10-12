"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";

type Item = {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  user_id: string;
};

const SKELETON_ROWS: Array<[string, string]> = [
  ["w-2/5", "w-3/5"],
  ["w-1/3", "w-1/2"],
  ["w-1/2", "w-2/3"],
];

export default function TaskManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function fetchTasks() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
        if (!cancelled) setLoading(false);
        return;
      }

      if (cancelled) return;
      setItems((data as Item[]) ?? []);
      setLoading(false);

      channel = supabase
        .channel(`tasks-changes-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "tasks",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newItem = payload.new as Item;
            setItems((prev) =>
              prev.some((item) => item.id === newItem.id)
                ? prev
                : [newItem, ...prev]
            );
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "tasks",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const updatedItem = payload.new as Item;
            setItems((prev) =>
              prev.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
              )
            );
          }
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "tasks" },
          (payload) => {
            const deleted = payload.old as { id: number };
            setItems((prev) =>
              prev.filter((item) => item.id !== deleted.id)
            );
            setEditingId((current) =>
              current === deleted.id ? null : current
            );
          }
        )
        .subscribe();
    }

    fetchTasks();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle) return;

    setSaving(true);
    try {
      if (editingId !== null) {
        const { data, error } = await supabase
          .from("tasks")
          .update({ title: trimmedTitle, description: trimmedDescription })
          .eq("id", editingId)
          .select()
          .single();

        if (error) {
          console.error(error);
          return;
        }

        setItems((prev) =>
          prev.map((item) => (item.id === editingId ? data : item))
        );
        setEditingId(null);
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("tasks")
          .insert({
            title: trimmedTitle,
            description: trimmedDescription,
            is_completed: false,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          console.error(error);
          return;
        }

        setItems((prev) => [(data as Item), ...prev]);
      }

      setTitle("");
      setDescription("");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item: Item) {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setTitle("");
    setDescription("");
  }

  async function handleToggleComplete(item: Item) {
    const { data, error } = await supabase
      .from("tasks")
      .update({ is_completed: !item.is_completed })
      .eq("id", item.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setItems((prev) =>
      prev.map((t) => (t.id === item.id ? (data as Item) : t))
    );
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) handleCancelEdit();
  }

  return (
    <>
      {/* New task — bordered panel */}
      <form
        onSubmit={handleSubmit}
        className="reveal border-t-2 border-ink bg-paper-2 p-6 sm:p-8"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="kicker">
            {editingId !== null ? "Editing task" : "New task"}
          </p>
          {editingId !== null && (
            <p className="font-mono text-xs text-muted tabular-nums">
              id {editingId}
            </p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="title"
              className="font-mono text-xs font-medium tracking-[0.06em] text-muted uppercase"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wire up realtime"
              className="h-11 w-full min-w-0 rounded-control border border-rule-2 bg-paper px-4 text-base text-ink outline-none placeholder:text-muted focus:border-accent"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="description"
              className="font-mono text-xs font-medium tracking-[0.06em] text-muted uppercase"
            >
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="One line of context…"
              className="h-11 w-full min-w-0 rounded-control border border-rule-2 bg-paper px-4 text-base text-ink outline-none placeholder:text-muted focus:border-accent"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="h-11 rounded-control bg-accent px-6 text-sm font-medium whitespace-nowrap text-accent-ink transition-[filter] duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving…"
              : editingId !== null
                ? "Save changes"
                : "Add task"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              className="h-11 rounded-control border border-rule-2 px-6 text-sm font-medium whitespace-nowrap text-ink transition-[border-color] duration-150 hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Rows — tabular spec sheet */}
      <section className="reveal flex min-w-0 flex-col gap-4" style={{ "--i": 2 } as React.CSSProperties}>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
            All tasks
          </h2>
          <p className="font-mono text-xs text-muted tabular-nums">
            {loading
              ? "…/… done"
              : `${items.filter((t) => t.is_completed).length}/${
                  items.length
                } done`}
          </p>
        </div>

        {loading ? (
          <ul aria-label="Loading tasks" className="border-t border-rule">
            {SKELETON_ROWS.map(([titleWidth, descWidth], i) => (
              <li
                key={i}
                aria-hidden="true"
                className="flex animate-pulse gap-4 border-b border-rule py-4"
              >
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-control bg-rule" />
                <span className="flex min-w-0 flex-1 flex-col gap-2">
                  <span
                    className={`h-4 rounded-control bg-rule ${titleWidth}`}
                  />
                  <span className={`h-3 rounded-control bg-rule ${descWidth}`} />
                </span>
              </li>
            ))}
          </ul>
        ) : items.length === 0 ? (
          <div className="border border-rule bg-paper-2 p-8">
            <p className="text-base font-medium text-ink">No tasks yet.</p>
            <p className="mt-1 text-sm leading-6">
              Tasks group your work. Add the first one above.
            </p>
          </div>
        ) : (
          <ul className="border-t border-rule">
            {items.map((item) => {
              const editing = editingId === item.id;
              return (
                <li
                  key={item.id}
                  className={`grid grid-cols-1 gap-3 border-b border-rule py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 ${
                    editing ? "bg-paper-2" : ""
                  }`}
                >
                  <div className="flex min-w-0 gap-4">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={item.is_completed}
                      aria-label={
                        item.is_completed
                          ? `Mark "${item.title}" as not completed`
                          : `Mark "${item.title}" as completed`
                      }
                      onClick={() => handleToggleComplete(item)}
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-control border transition-[background-color,border-color] duration-150 ${
                        item.is_completed
                          ? "border-accent bg-accent"
                          : "border-rule-2 bg-paper hover:border-accent"
                      }`}
                    >
                      {item.is_completed && (
                        <svg
                          aria-hidden="true"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2.5 6.2 4.8 8.5 9.5 3.5"
                            stroke="var(--color-accent-ink)"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                    <div className="min-w-0">
                      <h3
                        className={`truncate text-base font-medium ${
                          item.is_completed
                            ? "text-muted line-through"
                            : "text-ink"
                        }`}
                      >
                        {item.title}
                      </h3>
                      {item.description && (
                        <p
                          className={`mt-0.5 line-clamp-2 text-sm leading-6 ${
                            item.is_completed ? "text-muted/70" : ""
                          }`}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-5 pl-9 sm:pl-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="link-underline text-sm"
                    >
                      {editing ? "Editing…" : "Edit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-sm whitespace-nowrap text-danger underline decoration-danger/40 decoration-1 underline-offset-[3px] transition-[color] duration-150 hover:text-ink"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
