import { useTasks } from "@/context/TaskContext";
import type { Filter } from "@/types/task";
import { cn } from "@/lib/utils";

const items: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
];

export function MobileFilters() {
  const { filter, setFilter, stats } = useTasks();
  const counts: Record<Filter, number> = { all: stats.total, pending: stats.pending, completed: stats.completed };
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 lg:hidden scrollbar-thin -mx-1 px-1">
      {items.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          className={cn(
            "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            filter === key
              ? "border-foreground bg-foreground text-background"
              : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
          <span className="ml-1.5 text-xs opacity-70 tabular-nums">{counts[key]}</span>
        </button>
      ))}
    </div>
  );
}
