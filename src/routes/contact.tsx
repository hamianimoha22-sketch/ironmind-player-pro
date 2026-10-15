import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageTitle } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا — IRON MIND FC" },
      { name: "description", content: "راسل فريق IRON MIND FC بأسئلتك واقتراحاتك." },
      { property: "og:title", content: "تواصل معنا — IRON MIND FC" },
      { property: "og:description", content: "راسل فريق IRON MIND FC." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || f.name.length > 100) return void toast.error("أدخل اسمك");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return void toast.error("أدخل بريدًا إلكترونيًا صحيحًا");
    if (f.message.trim().length < 5 || f.message.length > 2000) return void toast.error("اكتب رسالة واضحة (5 إلى 2000 حرف)");
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({ name: f.name.trim(), email: f.email.trim(), message: f.message.trim() });
    setBusy(false);
    if (error) return void toast.error("تعذر إرسال الرسالة، حاول مجددًا");
    toast.success("تم إرسال رسالتك بنجاح");
    setF({ name: "", email: "", message: "" });
  }
  return (
    <PageShell>
      <div className="mx-auto max-w-xl">
        <PageTitle title="تواصل معنا" subtitle="نسعد بأسئلتك واقتراحاتك." />
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="space-y-1.5"><Label>الاسم</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} maxLength={100} /></div>
          <div className="space-y-1.5"><Label>البريد الإلكتروني</Label><Input type="email" dir="ltr" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>الرسالة</Label><Textarea rows={5} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} maxLength={2000} /></div>
          <Button type="submit" variant="hero" className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}إرسال</Button>
        </form>
      </div>
    </PageShell>
  );
}
