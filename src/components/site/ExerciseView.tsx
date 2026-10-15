import { Clock, Repeat, Timer, Layers, MapPin, Wrench, AlertTriangle, Lightbulb, ShieldAlert, Target } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { levelLabel, typeLabel, videoEmbedUrl } from "@/lib/constants";
import type { Tables } from "@/integrations/supabase/types";

export function ExerciseView({ e, categoryName }: { e: Tables<"exercises">; categoryName?: string }) {
  const embed = videoEmbedUrl(e.video_url);
  const stats = [
    { i: Clock, l: "المدة", v: e.duration_min ? `${e.duration_min} دقيقة` : null },
    { i: Layers, l: "المجموعات", v: e.sets },
    { i: Repeat, l: "التكرارات / المدة", v: e.reps },
    { i: Timer, l: "الراحة", v: e.rest },
  ].filter((s) => s.v);
  return (
    <article className="space-y-6">
      <div>
        <p className="text-sm text-primary">{typeLabel(e.training_type)}{categoryName ? ` · ${categoryName}` : ""}</p>
        <h1 className="mt-1 text-3xl font-bold">{e.title}</h1>
        {e.summary && <p className="mt-2 text-muted-foreground">{e.summary}</p>}
        <div className="mt-3 flex flex-wrap gap-1">
          {e.positions.map((p) => <Badge key={p} variant="secondary">{p}</Badge>)}
          {e.levels.map((l) => <Badge key={l} variant="outline">{levelLabel(l)}</Badge>)}
          {(e.age_min || e.age_max) && <Badge variant="outline">العمر {e.age_min ?? "?"}–{e.age_max ?? "?"}</Badge>}
        </div>
      </div>
      {e.image_url && <img src={e.image_url} alt={e.title} loading="lazy" className="w-full rounded-xl border border-border object-cover" />}
      {embed ? (
        <div className="aspect-video overflow-hidden rounded-xl border border-border">
          <iframe src={embed} title={e.title} className="h-full w-full" allowFullScreen loading="lazy" />
        </div>
      ) : e.video_url ? (
        <a href={e.video_url} target="_blank" rel="noreferrer" className="inline-block text-primary underline">مشاهدة الفيديو التوضيحي</a>
      ) : null}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-card p-3">
              <s.i className="h-4 w-4 text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">{s.l}</p>
              <p className="font-semibold">{s.v}</p>
            </div>
          ))}
        </div>
      )}
      <Section icon={<Target />} title="الهدف من التدريب" text={e.objective} />
      <Section icon={<Wrench />} title="المعدات المطلوبة" text={e.equipment} />
      <Section icon={<MapPin />} title="مكان التنفيذ" text={e.location} />
      {e.steps.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 font-semibold">خطوات التنفيذ</h2>
          <ol className="space-y-3">
            {e.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                <p className="pt-0.5">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
      <Section icon={<AlertTriangle />} title="الأخطاء الشائعة" text={e.common_mistakes} />
      <Section icon={<Lightbulb />} title="نصائح إضافية" text={e.tips} />
      <Section icon={<ShieldAlert />} title="ملاحظات السلامة" text={e.safety_notes} />
    </article>
  );
}

function Section({ icon, title, text }: { icon: ReactNode; title: string; text: string | null }) {
  if (!text) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-2 flex items-center gap-2 font-semibold [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-primary">{icon}{title}</h2>
      <p className="whitespace-pre-line text-muted-foreground">{text}</p>
    </div>
  );
}
