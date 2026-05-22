import { ClipboardList } from "lucide-react";

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/40 px-6 py-16 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl gradient-primary shadow-glow">
        <ClipboardList className="h-8 w-8 text-primary-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {hint && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}
