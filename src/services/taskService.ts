import axios from "axios";
import type { Task } from "@/types/task";

const API = "https://my-todo-app.free.beeceptor.com/todos";

export const taskApi = {
  async fetchTasks(): Promise<Task[]> {
    const { data } = await axios.get(API, { timeout: 8000 });
    if (!Array.isArray(data)) return [];
    return data.map((t: Partial<Task> & { id?: string | number }) => ({
      id: String(t.id ?? crypto.randomUUID()),
      title: t.title ?? "Untitled",
      description: t.description ?? "",
      completed: Boolean(t.completed),
      dueDate: t.dueDate ?? null,
      priority: (t.priority as Task["priority"]) ?? "medium",
      createdAt: t.createdAt ?? new Date().toISOString(),
    }));
  },
  async createTask(task: Task): Promise<void> {
    try {
      await axios.post(API, task, { timeout: 8000 });
    } catch {
      // ignore — optimistic UI + localStorage handle persistence
    }
  },
};
