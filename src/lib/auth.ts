import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  return { user, loading };
}

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useIsAdmin(userId?: string) {
  return useQuery({
    queryKey: ["is-admin", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: userId!, _role: "admin" });
      return !!data;
    },
  });
}

export function arabicAuthError(msg?: string) {
  if (!msg) return "حدث خطأ غير متوقع";
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
  if (m.includes("email not confirmed")) return "يرجى تأكيد بريدك الإلكتروني أولًا من الرسالة التي وصلتك";
  if (m.includes("already registered")) return "هذا البريد مسجل مسبقًا";
  if (m.includes("password") && m.includes("characters")) return "كلمة المرور قصيرة جدًا";
  if (m.includes("pwned") || m.includes("weak")) return "كلمة المرور ضعيفة أو مسربة، اختر كلمة أقوى";
  if (m.includes("rate limit")) return "محاولات كثيرة، حاول بعد قليل";
  return "حدث خطأ: " + msg;
}
