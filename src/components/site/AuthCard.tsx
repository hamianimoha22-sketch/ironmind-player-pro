import type { ReactNode } from "react";
import { toast } from "sonner";
import { Brand } from "./Layout";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable/index";

export function AuthCard({ title, subtitle, children, wide }: { title: string; subtitle?: string; children: ReactNode; wide?: boolean }) {
  return (
    <main className="flex min-h-[80vh] items-start justify-center px-4 py-10 pb-28">
      <div className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-2xl border border-border bg-card p-6 sm:p-8 animate-rise`}>
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Brand />
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </div>
    </main>
  );
}

export function GoogleButton() {
  return (
    <Button type="button" variant="outline" className="w-full" onClick={async () => {
      const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (r.error) toast.error("تعذر تسجيل الدخول عبر Google");
    }}>
      المتابعة باستخدام Google
    </Button>
  );
}
