import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/Layout";
import { EmptyState, Loading } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { useIsAdmin, useUser } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "لوحة الإدارة — IRON MIND FC" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const TABS = [
  { to: "/admin", label: "الرئيسية", exact: true },
  { to: "/admin/exercises", label: "التدريبات" },
  { to: "/admin/programs", label: "البرامج" },
  { to: "/admin/categories", label: "التصنيفات والمراكز" },
  { to: "/admin/players", label: "اللاعبون" },
  { to: "/admin/pages", label: "الصفحات والرسائل" },
] as const;

function AdminLayout() {
  const { user, loading } = useUser();
  const admin = useIsAdmin(user?.id);
  const qc = useQueryClient();
  async function claim() {
    const { data } = await supabase.rpc("claim_first_admin");
    if (data) { toast.success("تم تعيين حسابك كمدير رئيسي"); qc.invalidateQueries(); }
    else toast.error("يوجد مدير بالفعل، لا يمكن تعيين حساب آخر من هنا");
  }
  if (loading || admin.isLoading) return <PageShell><Loading /></PageShell>;
  if (!admin.data)
    return (
      <PageShell>
        <EmptyState title="هذه الصفحة للمدير فقط" text="إذا كنت صاحب الموقع ولم يُعيَّن أي مدير بعد، يمكنك تعيين حسابك كمدير رئيسي. بعد ذلك يُغلق هذا الخيار نهائيًا.">
          <Button onClick={claim}>تعيين حسابي كمدير رئيسي</Button>
        </EmptyState>
      </PageShell>
    );
  return (
    <PageShell>
      <nav className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2">
        {TABS.map((t) => (
          <Link key={t.to} to={t.to} activeOptions={{ exact: "exact" in t }}
            className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
            activeProps={{ className: "!border-primary !bg-primary !text-primary-foreground" }}>
            {t.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </PageShell>
  );
}