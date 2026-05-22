/**
 * Realistic seed data used when the API returns no tasks and
 * localStorage is empty. Covers priorities, completion states,
 * past / future / no due dates, and long titles.
 */
import type { Task } from "@/types/task";

const iso = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const mockTasks: Task[] = [
  {
    id: "seed-1",
    title: "Finalize Q3 product roadmap and share with stakeholders before Friday standup",
    description: "Consolidate feedback from design, eng, and growth. Pin top 5 bets.",
    completed: false,
    dueDate: iso(1),
    priority: "high",
    createdAt: iso(-3),
  },
  {
    id: "seed-2",
    title: "Review pull requests",
    description: "Backend auth refactor and onboarding flow A/B test.",
    completed: false,
    dueDate: iso(0),
    priority: "high",
    createdAt: iso(-1),
  },
  {
    id: "seed-3",
    title: "Schedule dentist appointment",
    description: "",
    completed: false,
    dueDate: iso(7),
    priority: "low",
    createdAt: iso(-2),
  },
  {
    id: "seed-4",
    title: "Draft launch announcement",
    description: "Email + Twitter + LinkedIn. Keep it tight.",
    completed: true,
    dueDate: iso(-2),
    priority: "medium",
    createdAt: iso(-5),
  },
  {
    id: "seed-5",
    title: "Pay quarterly taxes",
    description: "Don't forget the estimated payment voucher.",
    completed: false,
    dueDate: iso(-1),
    priority: "high",
    createdAt: iso(-10),
  },
  {
    id: "seed-6",
    title: "Read 'Shape Up' chapter 4",
    description: "",
    completed: false,
    dueDate: null,
    priority: "low",
    createdAt: iso(-4),
  },
  {
    id: "seed-7",
    title: "Plan team offsite logistics — venue, travel, agenda, and dietary preferences",
    description: "Target 12 attendees. Budget cap 18k.",
    completed: false,
    dueDate: iso(14),
    priority: "medium",
    createdAt: iso(-1),
  },
  {
    id: "seed-8",
    title: "Cancel unused SaaS subscriptions",
    description: "",
    completed: true,
    dueDate: null,
    priority: "low",
    createdAt: iso(-7),
  },
];
