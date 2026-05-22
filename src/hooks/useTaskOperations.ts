/**
 * Reusable task operations hook.
 *
 * Wraps the TaskContext to expose a clean, ergonomic API for components
 * that only need to mutate tasks (without depending on the full context shape).
 */
import { useTasks } from "@/context/TaskContext";

export function useTaskOperations() {
  const { addTask, updateTask, deleteTask, toggleTask, refetch, pendingIds, loading, error } = useTasks();
  return { addTask, updateTask, deleteTask, toggleTask, refetch, pendingIds, loading, error };
}
