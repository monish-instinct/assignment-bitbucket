import { useTasks } from "@/context/TaskContext";

export function useTaskOperations() {
  const { addTask, updateTask, deleteTask, toggleTask, refetch, pendingIds, loading, error } = useTasks();
  return { addTask, updateTask, deleteTask, toggleTask, refetch, pendingIds, loading, error };
}
