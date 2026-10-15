import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Check, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/Layout";
import { EmptyState, Loading } from "@/components/site/Cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useIsAdmin, useProfile, useUser } from "@/lib/auth";
import { levelLabel } from "@/lib/constants";
import { completionsQuery, programFullQuery } from "@/lib/programs";

export const Route = createFileRoute("/programs/$id")({
  head: () => ({
    meta: [
      { title: "تفاصيل البرنامج التدريبي — IRON MIND FC" },
      { name: "description", content: "الجدول الأسبوعي للبرنامج التدريبي وتدريبات كل يوم." },
      { property: "og:title", content: "تفاصيل البرنامج التدريبي — IRON MIND FC" },
      { property: "og:description", content: "الجدول الأسبوعي للبرنامج وتدريباته." },
    ],
  }),
  component: ProgramPage,
});

function ProgramPage() {
  const { id } = Route.useParams();
  const { user } = useUser();
  const profile = useProfile(user?.id);
  const { data: isAdmin } = useIsAdmin(user?.id);
  const qc = useQueryClient();
  const q = useQuery(programFullQuery(id));
  const comp = useQuery(completionsQuery(user?.id, id));
  const [week, setWeek] = useState(1);

  const doneSet = new Set((comp.data ?? []).map((c) => c.day_exercise_id));

  const toggle = useMutation({
    mutationFn: async (pdeId: string) => {
      if (!user) throw new Error("سجّل الدخول لحفظ تقدمك");
      if (doneSet.has(pdeId)) {
        const { error } = await supabase.from("completions").delete().eq("user_id", user.id).eq("day_exercise_id", pdeId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("completions").insert({ user_id: user.id, program_id: id, day_exercise_id: pdeId });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["completions"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const follow = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("profiles").update({ current_program_id: id }).eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("تم تعيين البرنامج كبرنامجك الحالي"); qc.invalidateQueries({ queryKey: ["profile"] }); },
    onError: () => toast.error("تعذر حفظ البرنامج"),
  });

  if (q.isLoading) return <PageShell><Loading /></PageShell>;
  if (!q.data) return <PageShell><EmptyState title="البرنامج غير متوفر" text="قد يكون غير منشور أو تم حذفه."><Link to="/programs" className="text-primary">كل البرامج</Link></EmptyState></PageShell>;

  const { program, days } = q.data;
  const locked = program.is_premium && !isAdmin && profile.data?.subscription_tier !== "premium";
  const allItems = days.flatMap((d) => d.program_day_exercises);
  const pct = allItems.length ? Math.round((allItems.filter((i) => doneSet.has(i.id)).length / allItems.length) * 100) : 0;
  const weeks = Array.from(new Set(days.map((d) => d.week_number))).sort((a, b) => a - b);
  const weekDays = days.filter((d) => d.week_number === week);
  const isCurrent = profile.data?.current_program_id === id;

  return (
    <PageShell>
      <Link to="/programs" className="mb-4 flex items-center gap-1 text-sm text-muted-foreground"><ArrowRight className="h-4 w-4" />كل البرامج</Link>
      {program.status !== "published" && <div className="mb-4 rounded-lg border border-primary/40 bg-primary/10 p-3 text-sm">معاينة: هذا البرنامج غير منشور ولا يراه اللاعبون.</div>}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {program.cover_url && <img src={program.cover_url} alt={program.title} className="aspect-[21/9] w-full object-cover" />}
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap gap-1">
            {program.positions.map((p) => <Badge key={p} variant="secondary">{p}</Badge>)}
            {program.levels.map((l) => <Badge key={l} variant="outline">{levelLabel(l)}</Badge>)}
            {program.is_premium && <Badge>مميز</Badge>}
          </div>
          <h1 className="text-3xl font-bold">{program.title}</h1>
          {program.description && <p className="whitespace-pre-line text-muted-foreground">{program.description}</p>}
          {program.goals && <p className="text-sm"><span className="text-primary">الأهداف: </span>{program.goals}</p>}
          <p className="text-sm text-muted-foreground">{program.weeks} أسبوع · {program.days_per_week} أيام أسبوعيًا</p>
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span>نسبة الإكمال</span><span className="font-bold">{pct}%</span></div>
              <Progress value={pct} />
              {!locked && (
                <Button onClick={() => follow.mutate()} disabled={isCurrent || follow.isPending} variant={isCurrent ? "secondary" : "hero"} className="w-full sm:w-auto">
                  {isCurrent ? "هذا برنامجك الحالي" : "ابدأ هذا البرنامج"}
                </Button>
              )}
            </div>
          ) : (
            <Button asChild variant="hero"><Link to="/auth">سجّل الدخول لمتابعة البرنامج وحفظ تقدمك</Link></Button>
          )}
        </div>
      </div>

      {locked ? (
        <div className="mt-6"><EmptyState title="برنامج مميز" text="هذا البرنامج متاح للمشتركين فقط. ستتوفر الاشتراكات قريبًا."><Lock className="mx-auto h-5 w-5 text-primary" /></EmptyState></div>
      ) : days.length === 0 ? (
        <div className="mt-6"><EmptyState title="لم تتم إضافة جدول لهذا البرنامج بعد" /></div>
      ) : (
        <div className="mt-6">
          <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
            {weeks.map((w) => (
              <button key={w} onClick={() => setWeek(w)} className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${week === w ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>الأسبوع {w}</button>
            ))}
          </div>
          <div className="space-y-4">
            {weekDays.map((d) => {
              const doneCount = d.program_day_exercises.filter((i) => doneSet.has(i.id)).length;
              return (
                <div key={d.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">اليوم {d.day_number}{d.title ? ` — ${d.title}` : ""}</h3>
                    <span className="text-xs text-muted-foreground">{doneCount}/{d.program_day_exercises.length}</span>
                  </div>
                  {d.notes && <p className="mb-3 text-sm text-muted-foreground">{d.notes}</p>}
                  <ul className="space-y-2">
                    {d.program_day_exercises.filter((i) => i.exercises).map((i) => {
                      const done = doneSet.has(i.id);
                      return (
                        <li key={i.id} className="flex items-center gap-3 rounded-lg bg-surface p-3">
                          <button
                            aria-label={done ? "إلغاء الإكمال" : "تحديد كمكتمل"}
                            disabled={!user || toggle.isPending}
                            onClick={() => toggle.mutate(i.id)}
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition ${done ? "border-success bg-success text-background" : "border-border"}`}
                          >
                            {done && <Check className="h-4 w-4" />}
                          </button>
                          <Link to="/exercises/$id" params={{ id: i.exercises!.id }} className="min-w-0 flex-1">
                            <p className={`truncate font-medium ${done ? "text-muted-foreground line-through" : ""}`}>{i.exercises!.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {[i.duration_min ? `${i.duration_min} د` : i.exercises!.duration_min ? `${i.exercises!.duration_min} د` : null, i.rest ? `راحة ${i.rest}` : null, i.notes].filter(Boolean).join(" · ")}
                            </p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            {weekDays.length === 0 && <EmptyState title="لا توجد أيام في هذا الأسبوع" />}
          </div>
        </div>
      )}
    </PageShell>
  );
}
