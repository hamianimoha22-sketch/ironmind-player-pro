import { useState, type ReactNode } from "react";
import { Loader2, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { uploadImage } from "@/lib/media";
import { STATUS_LABEL, type Status } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const selectCls = "h-10 w-full rounded-md border border-input bg-card px-3 text-sm";

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function MultiToggle({ options, value, onChange }: { options: { key: string; label: string }[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o.key);
        return (
          <button type="button" key={o.key} onClick={() => onChange(on ? value.filter((x) => x !== o.key) : [...value, o.key])}
            className={cn("rounded-full border px-3 py-1.5 text-sm transition", on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/60")}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function ImageInput({ value, onChange, folder }: { value: string; onChange: (v: string) => void; folder: string }) {
  const [busy, setBusy] = useState(false);
  async function pick(file?: File) {
    if (!file) return;
    setBusy(true);
    try { onChange(await uploadImage(file, folder)); toast.success("تم رفع الصورة"); }
    catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  }
  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-full max-w-xs overflow-hidden rounded-lg border border-border">
          <img src={value} alt="" className="aspect-video w-full object-cover" />
          <button type="button" onClick={() => onChange("")} className="absolute left-2 top-2 rounded-full bg-background/80 p-1" aria-label="إزالة الصورة"><X className="h-4 w-4" /></button>
        </div>
      )}
      <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-card px-3 py-3 text-sm text-muted-foreground hover:border-primary/60">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        {busy ? "جارٍ الرفع..." : "رفع صورة من جهازك (تُضغط تلقائيًا)"}
        <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => pick(e.target.files?.[0])} />
      </label>
      <Input dir="ltr" placeholder="أو الصق رابط صورة https://..." value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function StatusBadge({ s }: { s: Status }) {
  return <Badge variant={s === "published" ? "default" : s === "draft" ? "secondary" : "outline"}>{STATUS_LABEL[s]}</Badge>;
}

export function StatusSelect({ value, onChange }: { value: Status; onChange: (s: Status) => void }) {
  return (
    <select className={selectCls} value={value} onChange={(e) => onChange(e.target.value as Status)}>
      {(Object.keys(STATUS_LABEL) as Status[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
    </select>
  );
}

export const numOrNull = (s: string) => (s.trim() === "" ? null : Number(s));
export const strOrNull = (s: string) => (s.trim() === "" ? null : s.trim());