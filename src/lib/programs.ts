import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const programFullQuery = (id: string) =>
  queryOptions({
    queryKey: ["program-full", id],
    queryFn: async () => {
      const { data: program, error } = await supabase.from("programs").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!program) return null;
      const { data: days, error: e2 } = await supabase
        .from("program_days")
        .select("*, program_day_exercises(*, exercises(id,title,summary,image_url,training_type,duration_min,sets,reps,rest,status))")
        .eq("program_id", id)
        .order("week_number")
        .order("day_number");
      if (e2) throw e2;
      const sorted = (days ?? []).map((d) => ({
        ...d,
        program_day_exercises: [...d.program_day_exercises].sort((a, b) => a.sort_order - b.sort_order),
      }));
      return { program, days: sorted };
    },
  });

export const completionsQuery = (userId: string | undefined, programId: string) =>
  queryOptions({
    queryKey: ["completions", userId, programId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("completions").select("day_exercise_id, completed_at").eq("user_id", userId!).eq("program_id", programId);
      if (error) throw error;
      return data;
    },
  });

/** Programs matching the player's position(s) and level, published only. */
export async function fetchMatchingPrograms(p: { primary_position: string | null; secondary_position: string | null; level: string | null; age: number | null }) {
  const positions = [p.primary_position, p.secondary_position].filter(Boolean) as string[];
  if (positions.length === 0) return [];
  const { data, error } = await supabase.from("programs").select("*").eq("status", "published").overlaps("positions", positions).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).filter((x) =>
    (x.levels.length === 0 || (p.level && x.levels.includes(p.level))) &&
    (!p.age || ((x.age_min == null || p.age >= x.age_min) && (x.age_max == null || p.age <= x.age_max))),
  ).sort((a, b) => Number(b.positions.includes(p.primary_position ?? "")) - Number(a.positions.includes(p.primary_position ?? "")));
}
