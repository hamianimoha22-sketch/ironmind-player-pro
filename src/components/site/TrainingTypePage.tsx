import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TRAINING_TYPES, type TrainingType, POSITIONS } from "@/lib/constants";
import { PageShell, PageTitle } from "./Layout";
import { EmptyState, ErrorBox, ExerciseCard, Loading } from "./Cards";

export function TrainingTypePage({ type }: { type: TrainingType }) {
  const meta = TRAINING_TYPES.find((t) => t.key === type)!;
  const [cat, setCat] = useState<string | null>(null);
  const [pos, setPos] = useState<string>("");

  const cats = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").eq("training_type", type).eq("is_visible", true).order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  const ex = useQuery({
    queryKey: ["exercises", type],
    queryFn: async () => {
      const { data, error } = await supabase.from("exercises")
        .select("id,title,summary,image_url,training_type,duration_min,levels,positions,category_id")
        .eq("training_type", type).eq("status", "published").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const list = (ex.data ?? []).filter((e) => (!cat || e.category_id === cat) && (!pos || e.positions.length === 0 || e.positions.includes(pos)));
  const chip = (active: boolean) => `shrink-0 rounded-full border px-3 py-1.5 text-sm transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`;

  return (
    <PageShell>
      <PageTitle title={meta.label} subtitle={meta.desc}>
        <select value={pos} onChange={(e) => setPos(e.target.value)} className="h-10 rounded-md border border-input bg-card px-3 text-sm">
          <option value="">كل المراكز</option>
          {POSITIONS.map((p) => <option key={p.code} value={p.code}>{p.name_ar}</option>)}
        </select>
      </PageTitle>
      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2">
        <button className={chip(!cat)} onClick={() => setCat(null)}>الكل</button>
        {cats.data?.map((c) => (
          <button key={c.id} className={chip(cat === c.id)} onClick={() => setCat(c.id)}>{c.name_ar}</button>
        ))}
      </div>
      {ex.isLoading ? <Loading /> : ex.error ? <ErrorBox /> : list.length === 0 ? (
        <EmptyState title="لا توجد تدريبات منشورة في هذا القسم حاليًا" text="ستتم إضافة التدريبات قريبًا." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">{list.map((e) => <ExerciseCard key={e.id} e={e} />)}</div>
      )}
    </PageShell>
  );
}
