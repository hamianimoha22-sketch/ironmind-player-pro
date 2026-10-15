import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageTitle } from "@/components/site/Layout";
import { EmptyState, ErrorBox, Loading, ProgramCard } from "@/components/site/Cards";
import { LEVELS, POSITIONS } from "@/lib/constants";

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title: "البرامج التدريبية — IRON MIND FC" },
      { name: "description", content: "تصفح البرامج التدريبية المنشورة حسب المركز والمستوى." },
      { property: "og:title", content: "البرامج التدريبية — IRON MIND FC" },
      { property: "og:description", content: "برامج تدريبية منظمة لكل مركز ومستوى." },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const [pos, setPos] = useState("");
  const [lvl, setLvl] = useState("");
  const q = useQuery({
    queryKey: ["programs-public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("programs").select("*").eq("status", "published").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const list = (q.data ?? []).filter((p) => (!pos || p.positions.includes(pos)) && (!lvl || p.levels.length === 0 || p.levels.includes(lvl)));
  const sel = "h-10 rounded-md border border-input bg-card px-3 text-sm";
  return (
    <PageShell>
      <PageTitle title="البرامج التدريبية" subtitle="برامج أعدّها فريق IRON MIND FC لكل مركز ومستوى.">
        <div className="flex gap-2">
          <select className={sel} value={pos} onChange={(e) => setPos(e.target.value)}>
            <option value="">كل المراكز</option>
            {POSITIONS.map((p) => <option key={p.code} value={p.code}>{p.name_ar}</option>)}
          </select>
          <select className={sel} value={lvl} onChange={(e) => setLvl(e.target.value)}>
            <option value="">كل المستويات</option>
            {LEVELS.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}
          </select>
        </div>
      </PageTitle>
      {q.isLoading ? <Loading /> : q.error ? <ErrorBox /> : list.length === 0 ? (
        <EmptyState title={pos ? "البرامج لهذا المركز غير متوفرة حاليًا" : "لا توجد برامج منشورة حاليًا"} text="سيتم نشر برامج جديدة قريبًا." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProgramCard key={p.id} p={p} />)}</div>
      )}
    </PageShell>
  );
}
