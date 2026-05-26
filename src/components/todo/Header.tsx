import { Plus, Search, Sun, Moon, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useTasks } from "@/context/TaskContext";
import { cn } from "@/lib/utils";

interface Props {
  onAdd: () => void;
}

export function Header({ onAdd }: Props) {
  const { theme, toggle } = useTheme();
  const { search, setSearch, refetch, loading } = useTasks();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="h-9 border-border/60 bg-muted/40 pl-9 focus-visible:bg-card"
            aria-label="Search tasks"
          />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => void refetch()}
            aria-label="Refresh tasks"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggle}
            aria-label="Toggle theme"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button onClick={onAdd} size="sm" className="h-9 ml-1">
            <Plus className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">New task</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
