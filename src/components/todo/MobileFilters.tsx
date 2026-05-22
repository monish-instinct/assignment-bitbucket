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
    <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden scrollbar-thin">
      {items.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            filter === key
              ? "gradient-primary text-primary-foreground shadow-glow"
              : "glass text-muted-foreground"
          )}
        >
          {label} <span className="ml-1 opacity-70">{counts[key]}</span>
        </button>
      ))}
    </div>
  );
}
