import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/Layout";
import { EmptyState, Loading } from "@/components/site/Cards";
import { ExerciseView } from "@/components/site/ExerciseView";

export const Route = createFileRoute("/exercises/$id")({
  head: () => ({
    meta: [
      { title: "تفاصيل التدريب — IRON MIND FC" },
      { name: "description", content: "خطوات تنفيذ التدريب وتفاصيله والصور والفيديوهات التوضيحية." },
      { property: "og:title", content: "تفاصيل التدريب — IRON MIND FC" },
      { property: "og:description", content: "خطوات تنفيذ التدريب وتفاصيله." },
    ],
  }),
  component: ExercisePage,
});

function ExercisePage() {
  const { id } = Route.useParams();
  const q = useQuery({
    queryKey: ["exercise", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("exercises").select("*, categories(name_ar)").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <button onClick={() => history.back()} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowRight className="h-4 w-4" /> رجوع
        </button>
        {q.isLoading ? <Loading /> : !q.data ? (
          <EmptyState title="التدريب غير متوفر" text="قد يكون غير منشور أو تم حذفه.">
            <Link to="/" className="text-primary">العودة للرئيسية</Link>
          </EmptyState>
        ) : (
          <ExerciseView e={q.data} categoryName={q.data.categories?.name_ar} />
        )}
      </div>
    </PageShell>
  );
}
