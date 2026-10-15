import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard } from "@/components/site/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { arabicAuthError } from "@/lib/auth";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "تعيين كلمة مرور جديدة — IRON MIND FC" },
      { name: "description", content: "عيّن كلمة مرور جديدة لحسابك." },
      { property: "og:title", content: "تعيين كلمة مرور جديدة — IRON MIND FC" },
      { property: "og:description", content: "تعيين كلمة مرور جديدة." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) setReady(true);
    const { data } = supabase.auth.onAuthStateChange((e) => { if (e === "PASSWORD_RECOVERY") setReady(true); });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) return toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    if (pw !== pw2) return toast.error("كلمتا المرور غير متطابقتين");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(arabicAuthError(error.message));
    toast.success("تم تحديث كلمة المرور");
    navigate({ to: "/dashboard" });
  }
  return (
    <AuthCard title="تعيين كلمة مرور جديدة">
      {!ready ? (
        <p className="text-center text-muted-foreground">افتح هذه الصفحة من الرابط المرسل إلى بريدك الإلكتروني.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5"><Label>كلمة المرور الجديدة</Label><Input type="password" dir="ltr" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>تأكيد كلمة المرور</Label><Input type="password" dir="ltr" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
          <Button type="submit" variant="hero" className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}حفظ</Button>
        </form>
      )}
    </AuthCard>
  );
}
