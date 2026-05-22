import { motion } from "framer-motion";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDueDate, isOverdue } from "@/utils/format";

const priorityStyles: Record<Task["priority"], { dot: string; chip: string; label: string }> = {
  high:   { dot: "bg-[var(--priority-high)]",   chip: "bg-[var(--priority-high)]/15 text-[var(--priority-high)]",   label: "High" },
  medium: { dot: "bg-[var(--priority-medium)]", chip: "bg-[var(--priority-medium)]/15 text-[var(--priority-medium)]", label: "Medium" },
  low:    { dot: "bg-[var(--priority-low)]",    chip: "bg-[var(--priority-low)]/15 text-[var(--priority-low)]",    label: "Low" },
};

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  const p = priorityStyles[task.priority];
  const overdue = !task.completed && isOverdue(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={cn(
        "group relative flex gap-3 rounded-2xl border bg-card/70 p-4 shadow-soft backdrop-blur transition-all hover:shadow-glow hover:-translate-y-0.5",
        task.completed && "opacity-70"
      )}
    >
      <span className={cn("absolute left-0 top-4 h-8 w-1 rounded-r-full", p.dot)} aria-hidden />

      <div className="pt-0.5">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          aria-label={`Mark ${task.title} as ${task.completed ? "pending" : "complete"}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className={cn(
            "truncate font-medium leading-tight",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
          <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", p.chip)}>
            {p.label}
          </span>
        </div>

        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className={cn(
            "flex items-center gap-1.5 text-xs",
            overdue ? "text-destructive font-medium" : "text-muted-foreground"
          )}>
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDueDate(task.dueDate)}</span>
          </div>

          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(task)} aria-label="Edit task">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(task)} aria-label="Delete task">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
