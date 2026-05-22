import { ListTodo, CircleDashed, CheckCheck, TrendingUp } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import type { Filter } from "@/types/task";
import { cn } from "@/lib/utils";

const filters: { key: Filter; label: string; icon: typeof ListTodo }[] = [
  { key: "all", label: "All Tasks", icon: ListTodo },
  { key: "pending", label: "Pending", icon: CircleDashed },
  { key: "completed", label: "Completed", icon: CheckCheck },
];

export function Sidebar() {
  const { filter, setFilter, stats } = useTasks();
  const counts: Record<Filter, number> = {
    all: stats.total, pending: stats.pending, completed: stats.completed,
  };

  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:gap-4">
      <nav className="glass rounded-2xl p-2 shadow-soft">
        {filters.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              filter === key
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1 text-left">{label}</span>
            <span className={cn(
              "rounded-full px-2 py-0.5 text-xs",
              filter === key ? "bg-white/20" : "bg-muted"
            )}>{counts[key]}</span>
          </button>
        ))}
      </nav>

      <div className="glass rounded-2xl p-5 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Progress</h3>
        </div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-3xl font-bold tracking-tight">{stats.progress}%</span>
          <span className="text-xs text-muted-foreground">{stats.completed} / {stats.total}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full gradient-primary transition-all duration-500"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-card/60 p-3">
            <div className="text-xl font-semibold">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="rounded-xl bg-card/60 p-3">
            <div className="text-xl font-semibold">{stats.completed}</div>
            <div className="text-xs text-muted-foreground">Done</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
