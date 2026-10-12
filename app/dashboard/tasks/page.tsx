import TaskManager from "../../components/TaskManager";

export const instant = false;

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="reveal min-w-0">
        <p className="kicker">
          <span className="kicker__tick" />
          public.tasks
        </p>
        <h1 className="mt-4 font-display text-display leading-[1.05] font-semibold tracking-[-0.025em] text-ink">
          Tasks.
        </h1>
        <p className="mt-4 max-w-[52ch] text-lg leading-8">
          Add a title and one line of context. Rows below update live — no
          refresh, no polling.
        </p>
      </div>
      <TaskManager />
    </div>
  );
}
