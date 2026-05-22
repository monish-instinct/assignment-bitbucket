import { motion } from "framer-motion";
import { Calendar, Loader2, Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDueDate, isOverdue } from "@/utils/format";

const priorityStyles: Record<Task["priority"], { bar: string; chip: string; label: string }> = {
  high:   { bar: "bg-[var(--priority-high)]",   chip: "text-[var(--priority-high)]",   label: "High" },
  medium: { bar: "bg-[var(--priority-medium)]", chip: "text-[var(--priority-medium)]", label: "Medium" },
  low:    { bar: "bg-[var(--priority-low)]",    chip: "text-[var(--priority-low)]",    label: "Low" },
};

interface Props {
  task: Task;
  pending?: boolean;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, pending, onToggle, onEdit, onDelete }: Props) {
  const p = priorityStyles[task.priority];
  const overdue = !task.completed && isOverdue(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      whileHover={{ y: -1 }}
      className={cn(
        "group relative flex gap-3 overflow-hidden rounded-xl border border-border/70 bg-card px-4 py-3.5 transition-colors hover:border-border",
        task.completed && "opacity-60",
      )}
    >
      <span className={cn("absolute left-0 top-0 h-full w-[3px]", p.bar)} aria-hidden />

      <div className="pt-[3px]">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          aria-label={`Mark ${task.title} as ${task.completed ? "pending" : "complete"}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className={cn(
            "min-w-0 break-words text-[15px] font-medium leading-snug",
            task.completed && "line-through text-muted-foreground",
          )}>
            {task.title}
          </h3>
          <span className={cn("shrink-0 text-[11px] font-semibold uppercase tracking-wide", p.chip)}>
            {p.label}
          </span>
        </div>

        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
        )}

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className={cn(
            "flex items-center gap-1.5 text-xs",
            overdue ? "text-destructive font-medium" : "text-muted-foreground",
          )}>
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDueDate(task.dueDate)}</span>
            {pending && <Loader2 className="ml-1 h-3 w-3 animate-spin" />}
          </div>

          <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => onEdit(task)} aria-label="Edit task">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onDelete(task)} aria-label="Delete task">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
