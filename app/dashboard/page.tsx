import Link from "next/link";
import TaskCount from "../components/TaskCount";

export const instant = false;

export default function DashboardHome() {
  return (
    <div className="flex flex-col gap-10">
      <div className="reveal min-w-0">
        <p className="kicker">
          <span className="kicker__tick" />
          Workspace
        </p>
        <h1 className="mt-4 font-display text-display leading-[1.05] font-semibold tracking-[-0.025em] text-ink">
          Overview.
        </h1>
        <p className="mt-4 max-w-[52ch] text-lg leading-8">
          Everything in one place. Tasks sync across tabs the moment they
          change — open a second window and watch.
        </p>
      </div>

      <section
        className="reveal grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-2"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <div className="bg-paper p-6">
          <p className="font-mono text-xs font-medium tracking-[0.06em] text-muted uppercase">
            Open tasks
          </p>
          <TaskCount />
        </div>
        <div className="flex flex-col justify-between gap-6 bg-paper p-6">
          <p className="font-mono text-xs font-medium tracking-[0.06em] text-muted uppercase">
            Next action
          </p>
          <Link href="/dashboard/tasks" className="link-underline text-base">
            Manage tasks →
          </Link>
        </div>
      </section>
    </div>
  );
}
