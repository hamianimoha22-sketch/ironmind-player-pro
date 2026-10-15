import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard } from "@/components/site/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { arabicAuthError } from "@/lib/auth";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "استعادة كلمة المرور — IRON MIND FC" },
      { name: "description", content: "أرسل رابط إعادة تعيين كلمة المرور إلى بريدك." },
      { property: "og:title", content: "استعادة كلمة المرور — IRON MIND FC" },
      { property: "og:description", content: "استعادة الوصول إلى حسابك." },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return void toast.error("أدخل بريدًا إلكترونيًا صحيحًا");
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    setBusy(false);
    if (error) return void toast.error(arabicAuthError(error.message));
    setSent(true);
  }
  return (
    <AuthCard title="استعادة كلمة المرور" subtitle="سنرسل لك رابطًا لتعيين كلمة مرور جديدة">
      {sent ? (
        <p className="text-center text-muted-foreground">إذا كان البريد مسجلًا، ستصلك رسالة خلال دقائق. تحقق من مجلد الرسائل غير المرغوبة أيضًا.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5"><Label>البريد الإلكتروني</Label><Input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <Button type="submit" variant="hero" className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}إرسال الرابط</Button>
        </form>
      )}
      <p className="mt-4 text-center text-sm"><Link to="/auth" className="text-primary">العودة لتسجيل الدخول</Link></p>
    </AuthCard>
  );
}
