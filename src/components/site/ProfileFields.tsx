import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FACILITIES, LEVELS, POSITIONS } from "@/lib/constants";

export type ProfileForm = {
  username: string;
  age: string;
  primary_position: string;
  secondary_position: string;
  level: string;
  goal: string;
  days_per_week: string;
  facilities: string[];
  notes: string;
  height_cm: string;
  weight_kg: string;
  personal_goals?: string;
};

export const emptyProfile: ProfileForm = {
  username: "", age: "", primary_position: "", secondary_position: "", level: "", goal: "",
  days_per_week: "3", facilities: [], notes: "", height_cm: "", weight_kg: "", personal_goals: "",
};

export function validateProfile(f: ProfileForm): string | null {
  if (f.username.trim().length < 2 || f.username.length > 40) return "الاسم يجب أن يكون بين 2 و40 حرفًا";
  const age = Number(f.age);
  if (!f.age || !Number.isInteger(age) || age < 6 || age > 60) return "أدخل عمرًا صحيحًا بين 6 و60";
  if (!f.primary_position) return "اختر مركزك الأساسي";
  if (f.secondary_position && f.secondary_position === f.primary_position) return "المركز الثانوي يجب أن يختلف عن الأساسي";
  if (!f.level) return "اختر مستوى خبرتك";
  if (!f.goal.trim()) return "اكتب هدفك الأساسي من التدريب";
  const d = Number(f.days_per_week);
  if (!Number.isInteger(d) || d < 1 || d > 7) return "عدد أيام التدريب بين 1 و7";
  if (f.height_cm && (Number(f.height_cm) < 100 || Number(f.height_cm) > 230)) return "الطول غير صحيح";
  if (f.weight_kg && (Number(f.weight_kg) < 20 || Number(f.weight_kg) > 200)) return "الوزن غير صحيح";
  return null;
}

export function toDbProfile(f: ProfileForm) {
  return {
    username: f.username.trim(),
    age: Number(f.age),
    primary_position: f.primary_position || null,
    secondary_position: f.secondary_position || null,
    level: f.level || null,
    goal: f.goal.trim() || null,
    days_per_week: Number(f.days_per_week),
    facilities: f.facilities,
    notes: f.notes.trim() || null,
    height_cm: f.height_cm ? Number(f.height_cm) : null,
    weight_kg: f.weight_kg ? Number(f.weight_kg) : null,
  };
}

const sel = "h-10 w-full rounded-md border border-input bg-card px-3 text-sm";

export function ProfileFields({ value, onChange, showPersonalGoals }: { value: ProfileForm; onChange: (v: ProfileForm) => void; showPersonalGoals?: boolean }) {
  const set = <K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5"><Label>الاسم أو اسم المستخدم *</Label><Input value={value.username} onChange={(e) => set("username", e.target.value)} maxLength={40} /></div>
      <div className="space-y-1.5"><Label>العمر *</Label><Input type="number" inputMode="numeric" value={value.age} onChange={(e) => set("age", e.target.value)} /></div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label>المركز الأساسي *</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {POSITIONS.map((p) => (
            <button type="button" key={p.code} onClick={() => set("primary_position", p.code)}
              className={`rounded-lg border p-2 text-center text-sm transition ${value.primary_position === p.code ? "border-primary bg-primary/15 text-foreground" : "border-border bg-card text-muted-foreground"}`}>
              <span className="block font-brand font-bold">{p.code}</span>{p.name_ar}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>المركز الثانوي (اختياري)</Label>
        <select className={sel} value={value.secondary_position} onChange={(e) => set("secondary_position", e.target.value)}>
          <option value="">بدون</option>
          {POSITIONS.filter((p) => p.code !== value.primary_position).map((p) => <option key={p.code} value={p.code}>{p.name_ar} ({p.code})</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label>مستوى الخبرة *</Label>
        <select className={sel} value={value.level} onChange={(e) => set("level", e.target.value)}>
          <option value="">اختر</option>
          {LEVELS.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}
        </select>
      </div>
      <div className="space-y-1.5 sm:col-span-2"><Label>الهدف الأساسي من التدريب *</Label><Input value={value.goal} onChange={(e) => set("goal", e.target.value)} maxLength={200} placeholder="مثال: تحسين السرعة والإنهاء" /></div>
      <div className="space-y-1.5">
        <Label>أيام التدريب المتاحة أسبوعيًا *</Label>
        <select className={sel} value={value.days_per_week} onChange={(e) => set("days_per_week", e.target.value)}>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label>الإمكانيات المتوفرة</Label>
        <div className="flex flex-wrap gap-2">
          {FACILITIES.map((f) => {
            const on = value.facilities.includes(f.key);
            return (
              <button type="button" key={f.key} onClick={() => set("facilities", on ? value.facilities.filter((x) => x !== f.key) : [...value.facilities, f.key])}
                className={`rounded-full border px-3 py-1.5 text-sm ${on ? "border-primary bg-primary/15" : "border-border text-muted-foreground"}`}>{f.label}</button>
            );
          })}
        </div>
      </div>
      <div className="space-y-1.5"><Label>الطول بالسم (اختياري)</Label><Input type="number" inputMode="numeric" value={value.height_cm} onChange={(e) => set("height_cm", e.target.value)} /></div>
      <div className="space-y-1.5"><Label>الوزن بالكغ (اختياري)</Label><Input type="number" inputMode="decimal" value={value.weight_kg} onChange={(e) => set("weight_kg", e.target.value)} /></div>
      <div className="space-y-1.5 sm:col-span-2"><Label>نقاط القوة والضعف (اختياري)</Label><Textarea value={value.notes} onChange={(e) => set("notes", e.target.value)} maxLength={1000} /></div>
      {showPersonalGoals && (
        <div className="space-y-1.5 sm:col-span-2"><Label>أهدافي الشخصية</Label><Textarea value={value.personal_goals ?? ""} onChange={(e) => set("personal_goals", e.target.value)} maxLength={1000} placeholder="اكتب أهدافك قصيرة وطويلة المدى" /></div>
      )}
    </div>
  );
}
