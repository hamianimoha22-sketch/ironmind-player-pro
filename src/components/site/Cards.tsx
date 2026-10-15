import { Link } from "@tanstack/react-router";
import { Clock, Calendar, Lock, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { levelLabel, typeLabel } from "@/lib/constants";

type ProgramLite = {
  id: string; title: string; description: string | null; cover_url: string | null;
  weeks: number; days_per_week: number; positions: string[]; levels: string[]; is_premium: boolean;
};

export function ProgramCard({ p }: { p: ProgramLite }) {
  return (
    <Link to="/programs/$id" params={{ id: p.id }} className="group overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/60 hover:-translate-y-0.5">
      <div className="aspect-[16/9] bg-muted">
        {p.cover_url ? (
          <img src={p.cover_url} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-primary/20 font-brand text-2xl text-muted-foreground">IRON MIND</div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex flex-wrap gap-1">
          {p.positions.map((x) => <Badge key={x} variant="secondary">{x}</Badge>)}
          {p.levels.map((l) => <Badge key={l} variant="outline">{levelLabel(l)}</Badge>)}
          {p.is_premium && <Badge className="gap-1"><Lock className="h-3 w-3" />مميز</Badge>}
        </div>
        <h3 className="text-lg font-semibold group-hover:text-primary">{p.title}</h3>
        {p.description && <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>}
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{p.weeks} أسبوع</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{p.days_per_week} أيام/أسبوع</span>
        </div>
      </div>
    </Link>
  );
}

type ExerciseLite = {
  id: string; title: string; summary: string | null; image_url: string | null;
  training_type: string; duration_min: number | null; levels: string[];
};

export function ExerciseCard({ e }: { e: ExerciseLite }) {
  return (
    <Link to="/exercises/$id" params={{ id: e.id }} className="group flex gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-primary/60">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {e.image_url && <img src={e.image_url} alt="" loading="lazy" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-primary">{typeLabel(e.training_type)}</p>
        <h3 className="truncate font-semibold group-hover:text-primary">{e.title}</h3>
        {e.summary && <p className="line-clamp-2 text-sm text-muted-foreground">{e.summary}</p>}
        <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
          {e.duration_min && <span>{e.duration_min} دقيقة</span>}
          {e.levels.map((l) => <span key={l}>{levelLabel(l)}</span>)}
        </div>
      </div>
    </Link>
  );
}

export function EmptyState({ title, text, children }: { title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
      <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      {text && <p className="mt-1 text-sm text-muted-foreground">{text}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex justify-center py-16 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

export function ErrorBox({ message }: { message?: string }) {
  return <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm">تعذر تحميل البيانات. {message}</div>;
}
