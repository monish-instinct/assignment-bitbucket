import { Plus, Search, Sun, Moon, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useTasks } from "@/context/TaskContext";

interface Props {
  onAdd: () => void;
}

export function Header({ onAdd }: Props) {
  const { theme, toggle } = useTheme();
  const { search, setSearch } = useTasks();

  return (
    <header className="sticky top-0 z-30 glass border-b">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow">
            <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="hidden text-lg font-semibold tracking-tight sm:block">
            <span className="text-gradient">Lumen</span> Tasks
          </h1>
        </div>

        <div className="relative ml-auto w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="pl-9 bg-card/60"
            aria-label="Search tasks"
          />
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={toggle}
          aria-label="Toggle theme"
          className="shrink-0"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button onClick={onAdd} className="shrink-0 gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
          <Plus className="mr-1 h-4 w-4" /> <span className="hidden sm:inline">New Task</span>
        </Button>
      </div>
    </header>
  );
}
