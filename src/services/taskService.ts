/**
 * Task API service.
 *
 * Thin wrapper over the shared Axios instance. Each method returns
 * a typed Promise and lets callers handle errors / toasts.
 *
 * Endpoints (Beeceptor mock):
 *   GET    /todos
 *   POST   /todos
 *   PUT    /todos/:id
 *   PATCH  /todos/:id      → toggle completion
 *   DELETE /todos/:id
 */
import { api } from "./api";
import type { Task } from "@/types/task";

const ENDPOINT = "/todos";

function normalize(t: Partial<Task> & { id?: string | number }): Task {
  return {
    id: String(t.id ?? crypto.randomUUID()),
    title: t.title ?? "Untitled",
    description: t.description ?? "",
    completed: Boolean(t.completed),
    dueDate: t.dueDate ?? null,
    priority: (t.priority as Task["priority"]) ?? "medium",
    createdAt: t.createdAt ?? new Date().toISOString(),
  };
}

export const taskApi = {
  /** Fetch all tasks. */
  async list(): Promise<Task[]> {
    const { data } = await api.get<Task[]>(ENDPOINT);
    return Array.isArray(data) ? data.map(normalize) : [];
  },

  /** Create a new task. */
  async create(task: Task): Promise<Task> {
    const { data } = await api.post<Task>(ENDPOINT, task);
    return normalize({ ...task, ...(data ?? {}) });
  },

  /** Replace a task (full update). */
  async update(id: string, task: Partial<Task>): Promise<Task> {
    const { data } = await api.put<Task>(`${ENDPOINT}/${id}`, task);
    return normalize({ ...task, ...(data ?? {}), id });
  },

  /** Toggle / patch completion or any partial field. */
  async patch(id: string, patch: Partial<Task>): Promise<Task> {
    const { data } = await api.patch<Task>(`${ENDPOINT}/${id}`, patch);
    return normalize({ ...patch, ...(data ?? {}), id });
  },

  /** Delete a task by id. */
  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
