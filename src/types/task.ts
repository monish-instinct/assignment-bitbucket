export type Priority = "high" | "medium" | "low";
export type Filter = "all" | "completed" | "pending";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string | null;
  priority: Priority;
  createdAt: string;
}
