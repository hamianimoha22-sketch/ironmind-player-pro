import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "./Layout";
import { Loading } from "./Cards";

export function ContentPage({ slug, fallbackTitle, fallback }: { slug: string; fallbackTitle: string; fallback: string }) {
  const q = useQuery({
    queryKey: ["page", slug],
    queryFn: async () => (await supabase.from("site_pages").select("*").eq("slug", slug).maybeSingle()).data,
  });
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        {q.isLoading ? <Loading /> : (
          <>
            <h1 className="text-3xl font-bold sm:text-4xl">{q.data?.title || fallbackTitle}</h1>
            <div className="mt-6 whitespace-pre-line leading-loose text-muted-foreground">{q.data?.content || fallback}</div>
          </>
        )}
      </div>
    </PageShell>
  );
}
