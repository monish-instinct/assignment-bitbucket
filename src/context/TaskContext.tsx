import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { Filter, Task } from "@/types/task";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { taskApi } from "@/services/taskService";
import { getApiErrorMessage } from "@/services/api";
import { mockTasks } from "@/data/mockTasks";

interface TaskContextValue {
  tasks: Task[];
  filter: Filter;
  search: string;
  loading: boolean;
  error: string | null;
  pendingIds: Set<string>;
  setFilter: (f: Filter) => void;
  setSearch: (s: string) => void;
  addTask: (input: Omit<Task, "id" | "createdAt" | "completed">) => Promise<void>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
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
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const seededRef = useRef(false);

  const markPending = (id: string, on: boolean) =>
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(id); else next.delete(id);
      return next;
    });

  /** Initial load: try API → fall back to localStorage → seed mock data. */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const remote = await taskApi.list();
      if (remote.length > 0) {
        setTasks((prev) => {
          const map = new Map(prev.map((t) => [t.id, t]));
          remote.forEach((r) => { if (!map.has(r.id)) map.set(r.id, r); });
          return Array.from(map.values());
        });
      } else if (!seededRef.current) {
        setTasks((prev) => (prev.length === 0 ? mockTasks : prev));
        seededRef.current = true;
      }
      setError(null);
    } catch (err) {
      const msg = getApiErrorMessage(err, "Could not reach the server.");
      setError(`${msg} Showing cached data.`);
      toast.error("Failed to fetch tasks", { description: msg });
      if (!seededRef.current) {
        setTasks((prev) => (prev.length === 0 ? mockTasks : prev));
        seededRef.current = true;
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { void fetchTasks(); }, [fetchTasks]);

  // ---- Mutations (optimistic, with API + localStorage fallback) ---------

  const addTask = useCallback<TaskContextValue["addTask"]>(async (input) => {
    const task: Task = {
      ...input,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((p) => [task, ...p]);
    markPending(task.id, true);
    try {
      await taskApi.create(task);
      toast.success("Task created");
    } catch (err) {
      toast.error("Couldn't sync new task", { description: getApiErrorMessage(err) + " Saved locally." });
    } finally {
      markPending(task.id, false);
    }
  }, [setTasks]);

  const updateTask = useCallback<TaskContextValue["updateTask"]>(async (id, patch) => {
    const prev = tasks.find((t) => t.id === id);
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    markPending(id, true);
    try {
      await taskApi.update(id, { ...prev, ...patch });
      toast.success("Task updated");
    } catch (err) {
      toast.error("Couldn't sync update", { description: getApiErrorMessage(err) + " Saved locally." });
    } finally {
      markPending(id, false);
    }
  }, [tasks, setTasks]);

  const deleteTask = useCallback<TaskContextValue["deleteTask"]>(async (id) => {
    const snapshot = tasks;
    setTasks((p) => p.filter((t) => t.id !== id));
    markPending(id, true);
    try {
      await taskApi.remove(id);
      toast.success("Task deleted");
    } catch (err) {
      // rollback
      setTasks(snapshot);
      toast.error("Couldn't delete task", { description: getApiErrorMessage(err) });
    } finally {
      markPending(id, false);
    }
  }, [tasks, setTasks]);

  const toggleTask = useCallback<TaskContextValue["toggleTask"]>(async (id) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    const next = !target.completed;
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, completed: next } : t)));
    markPending(id, true);
    try {
      await taskApi.patch(id, { completed: next });
    } catch (err) {
      toast.error("Couldn't sync status", { description: getApiErrorMessage(err) + " Saved locally." });
    } finally {
      markPending(id, false);
    }
  }, [tasks, setTasks]);

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks
      .filter((t) => (filter === "all" ? true : filter === "completed" ? t.completed : !t.completed))
      .filter((t) => !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
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
    return { total, completed, pending: total - completed, progress: total === 0 ? 0 : Math.round((completed / total) * 100) };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks, filter, search, loading, error, pendingIds,
        setFilter, setSearch, addTask, updateTask, deleteTask, toggleTask,
        refetch: fetchTasks, filteredTasks, stats,
      }}
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
