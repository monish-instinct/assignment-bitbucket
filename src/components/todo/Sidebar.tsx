import { ListTodo, CircleDashed, CheckCheck } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import type { Filter } from "@/types/task";
import { cn } from "@/lib/utils";

const filters: { key: Filter; label: string; icon: typeof ListTodo }[] = [
  { key: "all", label: "All tasks", icon: ListTodo },
  { key: "pending", label: "Pending", icon: CircleDashed },
  { key: "completed", label: "Completed", icon: CheckCheck },
];

export function Sidebar() {
  const { filter, setFilter, stats } = useTasks();
  const counts: Record<Filter, number> = {
    all: stats.total, pending: stats.pending, completed: stats.completed,
  };

  return (
    <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:gap-6">
      <nav className="flex flex-col gap-0.5">
        {filters.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              filter === key
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1 text-left">{label}</span>
            <span className="text-xs tabular-nums text-muted-foreground">{counts[key]}</span>
          </button>
        ))}
      </nav>

      <div className="rounded-xl border border-border/70 bg-card p-4">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Progress</span>
          <span className="text-xs tabular-nums text-muted-foreground">{stats.completed}/{stats.total}</span>
        </div>
        <div className="mb-3 text-2xl font-semibold tabular-nums tracking-tight">{stats.progress}%</div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
