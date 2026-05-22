import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTasks } from "@/context/TaskContext";
import type { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import { EmptyState } from "./EmptyState";
import { TaskSkeleton } from "./TaskSkeleton";

interface Props {
  modalOpen: boolean;
  setModalOpen: (o: boolean) => void;
}

export function TaskList({ modalOpen, setModalOpen }: Props) {
  const {
    filteredTasks, tasks, loading, error, pendingIds, refetch,
    addTask, updateTask, deleteTask, toggleTask, filter, search,
  } = useTasks();
  const [editing, setEditing] = useState<Task | null>(null);
  const [confirming, setConfirming] = useState<Task | null>(null);

  const openEdit = (t: Task) => { setEditing(t); setModalOpen(true); };

  if (loading && tasks.length === 0) return <TaskSkeleton />;

  return (
    <>
      {error && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <span>{error}</span>
          <button
            onClick={() => void refetch()}
            className="font-medium text-foreground hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        error && tasks.length === 0 ? (
          <EmptyState
            variant="error"
            title="Couldn't load your tasks"
            hint="We'll keep trying. Your local changes are saved."
            onRetry={() => void refetch()}
          />
        ) : (
          <EmptyState
            title={
              search ? "No matching tasks"
              : filter === "completed" ? "Nothing completed yet"
              : filter === "pending" ? "No pending tasks"
              : "You're all caught up"
            }
            hint={search ? "Try a different keyword." : "Create your first task to get started."}
          />
        )
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {filteredTasks.map((t) => (
              <li key={t.id}>
                <TaskCard
                  task={t}
                  pending={pendingIds.has(t.id)}
                  onToggle={toggleTask}
                  onEdit={openEdit}
                  onDelete={setConfirming}
                />
              </li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <TaskModal
        open={modalOpen}
        task={editing}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={(data) => {
          if (editing) void updateTask(editing.id, data);
          else void addTask(data);
        }}
      />

      <AlertDialog open={!!confirming} onOpenChange={(o) => !o && setConfirming(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              "{confirming?.title}" will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertogCancel>
            <AlertDialogAction
              onClick={() => { if (confirming) void deleteTask(confirming.id); setConfirming(null); }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
