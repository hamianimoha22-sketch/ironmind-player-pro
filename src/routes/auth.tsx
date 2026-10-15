import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, GoogleButton } from "@/components/site/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { arabicAuthError } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — IRON MIND FC" },
      { name: "description", content: "سجّل الدخول إلى حسابك في IRON MIND FC لمتابعة برنامجك التدريبي." },
      { property: "og:title", content: "تسجيل الدخول — IRON MIND FC" },
      { property: "og:description", content: "الدخول إلى حساب اللاعب." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("أدخل بريدًا إلكترونيًا صحيحًا");
    if (!password) return toast.error("أدخل كلمة المرور");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return toast.error(arabicAuthError(error.message));
    toast.success("تم تسجيل الدخول بنجاح");
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthCard title="تسجيل الدخول" subtitle="مرحبًا بعودتك">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5"><Label>البريد الإلكتروني</Label><Input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
        <div className="space-y-1.5"><Label>كلمة المرور</Label><Input type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></div>
        <div className="text-start"><Link to="/forgot-password" className="text-sm text-primary">نسيت كلمة المرور؟</Link></div>
        <Button type="submit" variant="hero" className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}دخول</Button>
        <GoogleButton />
        <p className="text-center text-sm text-muted-foreground">ليس لديك حساب؟ <Link to="/signup" className="text-primary">أنشئ حسابًا</Link></p>
      </form>
    </AuthCard>
  );
}
