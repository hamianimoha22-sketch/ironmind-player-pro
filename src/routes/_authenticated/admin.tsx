import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageTitle } from "@/components/site/Layout";
import { EmptyState, Loading } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { useIsAdmin, useUser } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "لوحة الإدارة — IRON MIND FC" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user } = useUser();
  const admin = useIsAdmin(user?.id);
  const qc = useQueryClient();
  async function claim() {
    const { data } = await supabase.rpc("claim_first_admin");
    if (data) { toast.success("تم تعيين حسابك كمدير رئيسي"); qc.invalidateQueries(); }
    else toast.error("يوجد مدير بالفعل، لا يمكن تعيين حساب آخر من هنا");
  }
  if (admin.isLoading) return <PageShell><Loading /></PageShell>;
  return (
    <PageShell>
      <PageTitle title="لوحة الإدارة" />
      {!admin.data ? (
        <EmptyState title="هذه الصفحة للمدير فقط" text="إذا كنت صاحب الموقع ولم يُعيَّن أي مدير بعد، يمكنك تعيين حسابك كمدير رئيسي.">
          <Button onClick={claim}>تعيين حسابي كمدير رئيسي</Button>
        </EmptyState>
      ) : (
        <EmptyState title="لوحة الإدارة قيد الإنشاء" text="أدوات إضافة التدريبات والبرامج لم تكتمل بعد." />
      )}
    </PageShell>
  );
}
