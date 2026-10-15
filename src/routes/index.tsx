import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Target, Dumbbell, Brain, Footprints, UserPlus, MapPin, LayoutList, CheckCircle2 } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { TRAINING_TYPES } from "@/lib/constants";
import { ProgramCard, EmptyState } from "@/components/site/Cards";
import { useUser } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IRON MIND FC — طوّر مستواك. سيطر على لعبتك" },
      { name: "description", content: "منصة عربية لتطوير لاعبي كرة القدم فنيًا وبدنيًا وتكتيكيًا وذهنيًا ببرامج تدريبية منظمة حسب مركزك." },
      { property: "og:title", content: "IRON MIND FC — طوّر مستواك. سيطر على لعبتك" },
      { property: "og:description", content: "برامج تدريبية منظمة لكل مركز في كرة القدم." },
    ],
  }),
  component: Index,
});

const icons = [Footprints, Dumbbell, Target, Brain];

function Index() {
  const { user } = useUser();
  const programs = useQuery({
    queryKey: ["home-programs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("programs").select("*").eq("status", "published").order("created_at", { ascending: false }).limit(6);
      if (error) throw error;
      return data;
    },
  });
  const mission = useQuery({
    queryKey: ["page", "mission"],
    queryFn: async () => (await supabase.from("site_pages").select("content").eq("slug", "mission").maybeSingle()).data,
  });

  return (
    <main className="pb-16">
      <section className="relative isolate flex min-h-[86vh] items-end overflow-hidden">
        <img src={hero} alt="" width={960} height={1200} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 animate-rise">
          <p className="font-brand text-sm text-primary">IRON MIND FC</p>
          <h1 className="mt-3 max-w-xl text-4xl font-extrabold leading-tight sm:text-6xl">
            طوّر مستواك.<br />سيطر على لعبتك.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            خطط تدريبية منظمة حسب مركزك ومستواك، تساعدك على تطوير قدراتك الفنية والبدنية والتكتيكية والذهنية.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to={user ? "/dashboard" : "/signup"}>ابدأ رحلتك</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to={user ? "/dashboard" : "/auth"}>{user ? "لوحتي" : "دخول إلى حسابي"}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">أنواع التدريب</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRAINING_TYPES.map((t, i) => {
            const Icon = icons[i]!;
            return (
              <Link key={t.key} to={t.path} className="group rounded-xl border border-border bg-card p-5 transition hover:border-primary/60">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">{t.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">كيف يعمل الموقع؟</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {[
              { i: UserPlus, t: "أنشئ حسابك", d: "سجّل بياناتك الأساسية في دقيقة." },
              { i: MapPin, t: "اختر مركزك", d: "حدد مركزك ومستواك وهدفك." },
              { i: LayoutList, t: "احصل على برنامجك", d: "تظهر لك البرامج المخصصة لمركزك." },
              { i: CheckCircle2, t: "تابع تقدمك", d: "أكمل الحصص وراقب نسبة إنجازك." },
            ].map((s, n) => (
              <div key={s.t} className="rounded-xl border border-border bg-card p-5">
                <span className="font-brand text-3xl text-primary">0{n + 1}</span>
                <h3 className="mt-2 font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold sm:text-3xl">البرامج التدريبية</h2>
          <Link to="/programs" className="text-sm text-primary">عرض الكل</Link>
        </div>
        <div className="mt-6">
          {programs.data && programs.data.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {programs.data.map((p) => <ProgramCard key={p.id} p={p} />)}
            </div>
          ) : programs.isLoading ? null : (
            <EmptyState title="لا توجد برامج منشورة حاليًا" text="سيتم نشر البرامج التدريبية قريبًا." />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border border-primary/30 bg-card p-8 sm:p-12">
          <p className="font-brand text-sm text-primary">OUR MISSION</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">رسالة IRON MIND FC</h2>
          <p className="mt-4 max-w-2xl whitespace-pre-line leading-relaxed text-muted-foreground">
            {mission.data?.content || "بناء لاعب متكامل بعقلية حديدية: مهارة، قوة، فهم تكتيكي، وثبات ذهني — عبر تدريب منظم ومخصص لكل مركز."}
          </p>
        </div>
      </section>
    </main>
  );
}
