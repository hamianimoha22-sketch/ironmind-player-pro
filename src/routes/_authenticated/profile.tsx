import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageTitle } from "@/components/site/Layout";
import { Loading } from "@/components/site/Cards";
import { ProfileFields, emptyProfile, toDbProfile, validateProfile, type ProfileForm } from "@/components/site/ProfileFields";
import { Button } from "@/components/ui/button";
import { useProfile, useUser } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "الملف الشخصي — IRON MIND FC" }, { name: "description", content: "تعديل بياناتك ومركزك." }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useUser();
  const profile = useProfile(user?.id);
  const qc = useQueryClient();
  const [f, setF] = useState<ProfileForm>(emptyProfile);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const p = profile.data;
    if (!p) return;
    setF({
      username: p.username, age: p.age?.toString() ?? "", primary_position: p.primary_position ?? "",
      secondary_position: p.secondary_position ?? "", level: p.level ?? "", goal: p.goal ?? "",
      days_per_week: (p.days_per_week ?? 3).toString(), facilities: p.facilities, notes: p.notes ?? "",
      height_cm: p.height_cm?.toString() ?? "", weight_kg: p.weight_kg?.toString() ?? "", personal_goals: p.personal_goals ?? "",
    });
  }, [profile.data]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const err = validateProfile(f);
    if (err) return void toast.error(err);
    setBusy(true);
    const { error } = await supabase.from("profiles").update({ ...toDbProfile(f), personal_goals: f.personal_goals || null }).eq("id", user!.id);
    setBusy(false);
    if (error) return void toast.error("تعذر حفظ البيانات");
    toast.success("تم حفظ بياناتك");
    qc.invalidateQueries();
  }
  if (profile.isLoading) return <PageShell><Loading /></PageShell>;
  return (
    <PageShell>
      <PageTitle title="الملف الشخصي" />
      <form onSubmit={save} className="space-y-6 rounded-2xl border border-border bg-card p-5">
        <ProfileFields value={f} onChange={setF} showPersonalGoals />
        <Button type="submit" variant="hero" disabled={busy}>حفظ التغييرات</Button>
      </form>
    </PageShell>
  );
}
