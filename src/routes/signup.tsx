import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, GoogleButton } from "@/components/site/AuthCard";
import { ProfileFields, emptyProfile, toDbProfile, validateProfile, type ProfileForm } from "@/components/site/ProfileFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { arabicAuthError } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "إنشاء حساب — IRON MIND FC" },
      { name: "description", content: "أنشئ حسابك واختر مركزك لتحصل على البرامج التدريبية المناسبة لك." },
      { property: "og:title", content: "إنشاء حساب — IRON MIND FC" },
      { property: "og:description", content: "ابدأ رحلتك في تطوير مستواك الكروي." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  function next(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("أدخل بريدًا إلكترونيًا صحيحًا");
    if (password.length < 8) return toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    setStep(2);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateProfile(profile);
    if (err) return toast.error(err);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: window.location.origin + "/dashboard", data: { ...toDbProfile(profile) } },
    });
    setBusy(false);
    if (error) return toast.error(arabicAuthError(error.message));
    setSent(true);
  }

  if (sent) {
    return (
      <AuthCard title="تحقق من بريدك الإلكتروني">
        <div className="space-y-4 text-center">
          <MailCheck className="mx-auto h-12 w-12 text-primary" />
          <p className="text-muted-foreground">أرسلنا رابط تأكيد إلى <span dir="ltr" className="text-foreground">{email}</span>. افتح الرابط لتفعيل حسابك ثم سجّل الدخول.</p>
          <Button asChild variant="secondary"><Link to="/auth">الذهاب لتسجيل الدخول</Link></Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="إنشاء حساب جديد" subtitle={step === 1 ? "الخطوة 1 من 2: بيانات الدخول" : "الخطوة 2 من 2: بياناتك الكروية"} wide={step === 2}>
      {step === 1 ? (
        <form onSubmit={next} className="space-y-4">
          <div className="space-y-1.5"><Label>البريد الإلكتروني</Label><Input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
          <div className="space-y-1.5"><Label>كلمة المرور (8 أحرف على الأقل)</Label><Input type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></div>
          <Button type="submit" variant="hero" className="w-full">التالي</Button>
          <GoogleButton />
          <p className="text-center text-sm text-muted-foreground">لديك حساب؟ <Link to="/auth" className="text-primary">سجّل الدخول</Link></p>
        </form>
      ) : (
        <form onSubmit={submit} className="space-y-6">
          <ProfileFields value={profile} onChange={setProfile} />
          <p className="text-xs text-muted-foreground">بإنشاء الحساب فإنك توافق على <Link to="/terms" className="text-primary">شروط الاستخدام</Link> و<Link to="/privacy" className="text-primary">سياسة الخصوصية</Link>.</p>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>رجوع</Button>
            <Button type="submit" variant="hero" className="flex-1" disabled={busy}>{busy && <Loader2 className="animate-spin" />}إنشاء الحساب</Button>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
