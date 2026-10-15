import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell, PageTitle } from "@/components/site/Layout";
import { EmptyState, Loading, ProgramCard } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { useProfile, useUser } from "@/lib/auth";
import { levelLabel, positionLabel } from "@/lib/constants";
import { fetchMatchingPrograms } from "@/lib/programs";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "لوحة اللاعب — IRON MIND FC" }, { name: "description", content: "برامجك وتقدمك." }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useUser();
  const profile = useProfile(user?.id);
  const p = profile.data;
  const programs = useQuery({
    queryKey: ["matching", p?.primary_position, p?.secondary_position, p?.level, p?.age],
    enabled: !!p,
    queryFn: () => fetchMatchingPrograms(p!),
  });
  if (profile.isLoading) return <PageShell><Loading /></PageShell>;
  return (
    <PageShell>
      <PageTitle title={`مرحبًا ${p?.username ?? ""}`} subtitle={`${positionLabel(p?.primary_position)} · ${levelLabel(p?.level)}`}>
        <Button asChild variant="secondary"><Link to="/profile">تعديل بياناتي</Link></Button>
      </PageTitle>
      {!p?.primary_position ? (
        <EmptyState title="أكمل ملفك الشخصي" text="اختر مركزك ومستواك لتظهر لك البرامج المناسبة."><Button asChild><Link to="/profile">إكمال البيانات</Link></Button></EmptyState>
      ) : programs.isLoading ? <Loading /> : programs.data?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{programs.data.map((x) => <ProgramCard key={x.id} p={x} />)}</div>
      ) : (
        <EmptyState title="البرامج لهذا المركز غير متوفرة حاليًا" text="سيتم إشعارك عند نشر برامج مناسبة لمركزك." />
      )}
    </PageShell>
  );
}
