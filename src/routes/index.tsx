import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/hooks/useTheme";
import { TaskProvider, useTasks } from "@/context/TaskContext";
import { Header } from "@/components/todo/Header";
import { Sidebar } from "@/components/todo/Sidebar";
import { MobileFilters } from "@/components/todo/MobileFilters";
import { TaskList } from "@/components/todo/TaskList";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Lumen Tasks — Beautiful Todo App" },
      { name: "description", content: "A premium, modern todo app with priorities, due dates, search and dark mode." },
    ],
  }),
});

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const { stats, filter } = useTasks();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "n" || e.key === "N") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setModalOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const heading =
    filter === "completed" ? "Completed" : filter === "pending" ? "Pending" : "All tasks";

  return (
    <div className="min-h-screen">
      <Header onAdd={() => setModalOpen(true)} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex gap-6">
          <Sidebar />
          <section className="min-w-0 flex-1 space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
                <p className="text-sm text-muted-foreground">
                  {stats.pending} pending · {stats.completed} completed · {stats.progress}% done
                </p>
              </div>
            </div>
            <MobileFilters />
            <TaskList modalOpen={modalOpen} setModalOpen={setModalOpen} />
          </section>
        </div>
      </main>
    </div>
  );
}

function Index() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Dashboard />
        <Toaster richColors position="bottom-right" />
      </TaskProvider>
    </ThemeProvider>
  );
}
