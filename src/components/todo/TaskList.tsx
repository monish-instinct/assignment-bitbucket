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
  const { filteredTasks, loading, error, addTask, updateTask, deleteTask, toggleTask, filter, search } = useTasks();
  const [editing, setEditing] = useState<Task | null>(null);
  const [confirming, setConfirming] = useState<Task | null>(null);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (t: Task) => { setEditing(t); setModalOpen(true); };

  if (loading) return <TaskSkeleton />;

  return (
    <>
      {error && (
        <div className="mb-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <EmptyState
          title={search ? "No matching tasks" : filter === "completed" ? "Nothing completed yet" : filter === "pending" ? "No pending tasks" : "Your day is a blank canvas"}
          hint={search ? "Try a different keyword." : "Click New Task to add your first item — press Enter to save it fast."}
        />
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {filteredTasks.map((t) => (
              <li key={t.id}>
                <TaskCard task={t} onToggle={toggleTask} onEdit={openEdit} onDelete={setConfirming} />
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
          if (editing) updateTask(editing.id, data);
          else addTask(data);
        }}
      />
      {/* Hidden helper for external "new" button */}
      <button type="button" className="hidden" onClick={openNew} aria-hidden />

      <AlertDialog open={!!confirming} onOpenChange={(o) => !o && setConfirming(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              "{confirming?.title}" will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (confirming) deleteTask(confirming.id); setConfirming(null); }}
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
