export type TrainingType = "technical" | "physical" | "tactical" | "mental";
export type Level = "beginner" | "intermediate" | "advanced";
export type Status = "draft" | "published" | "hidden";

export const TRAINING_TYPES: { key: TrainingType; label: string; path: string; desc: string }[] = [
  { key: "technical", label: "التدريب الفني", path: "/training/technical", desc: "التحكم، المراوغة، التمرير، التسديد والإنهاء." },
  { key: "physical", label: "التدريب البدني", path: "/training/physical", desc: "السرعة، القوة الانفجارية، الرشاقة والتحمل." },
  { key: "tactical", label: "التدريب التكتيكي", path: "/training/tactical", desc: "التمركز، الضغط، التحولات وقراءة اللعب." },
  { key: "mental", label: "العقلية الكروية", path: "/training/mental", desc: "التركيز، الثقة، الانضباط والاستعداد الذهني." },
];

export const typeLabel = (t: string) => TRAINING_TYPES.find((x) => x.key === t)?.label ?? t;

export const LEVELS: { key: Level; label: string }[] = [
  { key: "beginner", label: "مبتدئ" },
  { key: "intermediate", label: "متوسط" },
  { key: "advanced", label: "متقدم" },
];
export const levelLabel = (l?: string | null) => LEVELS.find((x) => x.key === l)?.label ?? "—";

export const FACILITIES = [
  { key: "home", label: "المنزل" },
  { key: "field", label: "الملعب" },
  { key: "gym", label: "الصالة الرياضية" },
  { key: "equipment", label: "معدات التدريب" },
];

export const STATUS_LABEL: Record<Status, string> = {
  draft: "مسودة",
  published: "منشور",
  hidden: "مخفي",
};

// Fixed fallback list; the database "positions" table is the source of truth.
export const POSITIONS = [
  { code: "ST", name_ar: "مهاجم صريح" },
  { code: "RW", name_ar: "جناح أيمن" },
  { code: "LW", name_ar: "جناح أيسر" },
  { code: "CAM", name_ar: "وسط هجومي" },
  { code: "CM", name_ar: "وسط مركزي" },
  { code: "CDM", name_ar: "وسط دفاعي" },
  { code: "RB", name_ar: "ظهير أيمن" },
  { code: "LB", name_ar: "ظهير أيسر" },
  { code: "CB", name_ar: "قلب دفاع" },
  { code: "GK", name_ar: "حارس مرمى" },
];
export const positionLabel = (c?: string | null) => {
  const p = POSITIONS.find((x) => x.code === c);
  return p ? `${p.name_ar} (${p.code})` : "—";
};

export function videoEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}
