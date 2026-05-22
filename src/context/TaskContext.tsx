import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { Filter, Task } from "@/types/task";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { taskApi } from "@/services/taskService";

interface TaskContextValue {
  tasks: Task[];
  filter: Filter;
  search: string;
  loading: boolean;
  error: string | null;
  setFilter: (f: Filter) => void;
  setSearch: (s: string) => void;
  addTask: (input: Omit<Task, "id" | "createdAt" | "completed">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  filteredTasks: Task[];
  stats: { total: number; completed: number; pending: number; progress: number };
}

const TaskContext = createContext<TaskContextValue | null>(null);

const priorityRank: Record<Task["priority"], number> = { high: 0, medium: 1, low: 2 };

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const remote = await taskApi.fetchTasks();
        if (!cancelled && remote.length > 0) {
          // Merge: prefer local edits by id, append remote-only
          setTasks((prev) => {
            const map = new Map(prev.map((t) => [t.id, t]));
            remote.forEach((r) => { if (!map.has(r.id)) map.set(r.id, r); });
            return Array.from(map.values());
          });
        }
        if (!cancelled) setError(null);
      } catch {
        if (!cancelled) setError("Could not reach API — using local data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTask = useCallback<TaskContextValue["addTask"]>((input) => {
    const task: Task = {
      ...input,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((p) => [task, ...p]);
    toast.success("Task added");
    void taskApi.createTask(task);
  }, [setTasks]);

  const updateTask = useCallback<TaskContextValue["updateTask"]>((id, patch) => {
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    toast.success("Task updated");
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks((p) => p.filter((t) => t.id !== id));
    toast.success("Task deleted");
  }, [setTasks]);

  const toggleTask = useCallback((id: string) => {
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, [setTasks]);

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks
      .filter((t) =>
        filter === "all" ? true : filter === "completed" ? t.completed : !t.completed
      )
      .filter((t) =>
        !q ? true : t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const pr = priorityRank[a.priority] - priorityRank[b.priority];
        if (pr !== 0) return pr;
        const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return da - db;
      });
  }, [tasks, filter, search]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return {
      total,
      completed,
      pending: total - completed,
      progress: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{ tasks, filter, search, loading, error, setFilter, setSearch, addTask, updateTask, deleteTask, toggleTask, filteredTasks, stats }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
}
