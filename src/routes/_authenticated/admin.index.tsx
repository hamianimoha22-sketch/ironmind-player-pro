import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Dumbbell, CalendarRange, Users, CheckCircle2, Mail, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/")({ component: AdminHome });

async function count(table: "exercises" | "programs" | "profiles" | "completions" | "contact_messages", status?: string) {
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (status) q = q.eq("status" as never, status as never);
  const { count: c } = await q;
  return c ?? 0;
}

function AdminHome() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [ex, exPub, pr, prPub, pl, co, msg] = await Promise.all([
        count("exercises"), count("exercises", "published"), count("programs"), count("programs", "published"),
        count("profiles"), count("completions"), count("contact_messages"),
      ]);
      return { ex, exPub, pr, prPub, pl, co, msg };
    },
  });
  const s = stats.data;
  const cards = [
    { i: Dumbbell, l: "التدريبات", v: s ? `${s.exPub} منشور / ${s.ex}` : "…" },
    { i: CalendarRange, l: "البرامج", v: s ? `${s.prPub} منشور / ${s.pr}` : "…" },
    { i: Users, l: "اللاعبون", v: s?.pl ?? "…" },
    { i: CheckCircle2, l: "تدريبات مكتملة", v: s?.co ?? "…" },
    { i: Mail, l: "رسائل التواصل", v: s?.msg ?? "…" },
  ];
  return (
    <div className="space-y-6">
      <PageTitle title="لوحة الإدارة" subtitle="أضف تدريباتك أولًا، ثم ابنِ البرامج منها وانشرها للمراكز المناسبة." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.l} className="rounded-xl border border-border bg-card p-4">
            <c.i className="h-5 w-5 text-primary" />
            <p className="mt-2 text-xs text-muted-foreground">{c.l}</p>
            <p className="text-lg font-bold">{c.v}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="hero"><Link to="/admin/exercises/$id" params={{ id: "new" }}><Plus />تدريب جديد</Link></Button>
        <Button asChild variant="secondary"><Link to="/admin/programs/$id" params={{ id: "new" }}><Plus />برنامج جديد</Link></Button>
      </div>
    </div>
  );
}