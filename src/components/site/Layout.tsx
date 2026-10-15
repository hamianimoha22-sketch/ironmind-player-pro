import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, Home, Dumbbell, LayoutDashboard, User, Shield, LogOut, Layers } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useUser } from "@/lib/auth";
import { TRAINING_TYPES } from "@/lib/constants";

export function Brand({ small }: { small?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src={logo} alt="IRON MIND FC" width={small ? 32 : 40} height={small ? 32 : 40} className={small ? "h-8 w-8" : "h-10 w-10"} />
      <span className="font-brand text-lg font-bold">
        IRON MIND <span className="text-primary">FC</span>
      </span>
    </Link>
  );
}

export function useSignOut() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
}

export function SiteHeader() {
  const { user } = useUser();
  const { data: isAdmin } = useIsAdmin(user?.id);
  const [open, setOpen] = useState(false);
  const signOut = useSignOut();
  const close = () => setOpen(false);
  const linkCls = "rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent";
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Brand />
        <nav className="hidden items-center gap-1 lg:flex">
          {TRAINING_TYPES.map((t) => (
            <Link key={t.key} to={t.path} className={linkCls} activeProps={{ className: "text-foreground" }}>
              {t.label}
            </Link>
          ))}
          <Link to="/programs" className={linkCls}>البرامج</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/dashboard">لوحتي</Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="secondary">
              <Link to="/auth">دخول</Link>
            </Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="القائمة"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-surface">
              <SheetTitle className="sr-only">القائمة</SheetTitle>
              <div className="mt-6 flex flex-col gap-1" dir="rtl">
                <Link to="/" onClick={close} className={linkCls}>الرئيسية</Link>
                {TRAINING_TYPES.map((t) => (
                  <Link key={t.key} to={t.path} onClick={close} className={linkCls}>{t.label}</Link>
                ))}
                <Link to="/programs" onClick={close} className={linkCls}>البرامج التدريبية</Link>
                <Link to="/about" onClick={close} className={linkCls}>حول الموقع</Link>
                <Link to="/contact" onClick={close} className={linkCls}>تواصل معنا</Link>
                <div className="my-2 border-t border-border" />
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={close} className={linkCls}>لوحة اللاعب</Link>
                    <Link to="/profile" onClick={close} className={linkCls}>الملف الشخصي</Link>
                    {isAdmin && <Link to="/admin" onClick={close} className={linkCls + " text-primary"}>لوحة الإدارة</Link>}
                    <button onClick={() => { close(); signOut(); }} className={linkCls + " flex items-center gap-2 text-start"}>
                      <LogOut className="h-4 w-4" /> تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={close} className={linkCls}>تسجيل الدخول</Link>
                    <Link to="/signup" onClick={close} className={linkCls}>إنشاء حساب</Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { user } = useUser();
  const { data: isAdmin } = useIsAdmin(user?.id);
  const item = "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] text-muted-foreground";
  const active = { className: "text-primary" };
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto flex max-w-md">
        <Link to="/" className={item} activeProps={active} activeOptions={{ exact: true }}><Home className="h-5 w-5" />الرئيسية</Link>
        <Link to="/training/technical" className={item} activeProps={active}><Dumbbell className="h-5 w-5" />التدريب</Link>
        <Link to="/programs" className={item} activeProps={active}><Layers className="h-5 w-5" />البرامج</Link>
        {user ? (
          <Link to="/dashboard" className={item} activeProps={active}><LayoutDashboard className="h-5 w-5" />لوحتي</Link>
        ) : (
          <Link to="/auth" className={item} activeProps={active}><User className="h-5 w-5" />دخول</Link>
        )}
        {isAdmin && <Link to="/admin" className={item} activeProps={active}><Shield className="h-5 w-5" />الإدارة</Link>}
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface pb-24 lg:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div className="space-y-3">
          <Brand small />
          <p className="text-sm text-muted-foreground">منصة لتطوير لاعبي كرة القدم فنيًا وبدنيًا وتكتيكيًا وذهنيًا.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {TRAINING_TYPES.map((t) => <Link key={t.key} to={t.path} className="text-muted-foreground hover:text-foreground">{t.label}</Link>)}
          <Link to="/programs" className="text-muted-foreground hover:text-foreground">البرامج</Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground">حول الموقع</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/contact" className="text-muted-foreground hover:text-foreground">تواصل معنا</Link>
          <Link to="/privacy" className="text-muted-foreground hover:text-foreground">سياسة الخصوصية</Link>
          <Link to="/terms" className="text-muted-foreground hover:text-foreground">شروط الاستخدام</Link>
        </div>
      </div>
      <p className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} <span className="font-brand">IRON MIND FC</span>
      </p>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-8 pb-28 lg:pb-8 animate-rise">{children}</main>;
}

export function PageTitle({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
