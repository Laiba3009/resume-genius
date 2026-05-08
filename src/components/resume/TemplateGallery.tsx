import { TEMPLATES, type TemplateId } from "@/lib/resume-types";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
}

export function TemplateGallery({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {TEMPLATES.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "group relative aspect-[3/4] rounded-lg border-2 overflow-hidden text-left transition-all",
              active ? "border-brand shadow-elegant scale-[1.02]" : "border-border hover:border-brand/50"
            )}
          >
            <Thumb id={t.id} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <div className="text-white text-xs font-semibold">{t.name}</div>
              <div className="text-white/70 text-[10px] truncate">{t.desc}</div>
            </div>
            {active && (
              <div className="absolute top-2 right-2 size-5 rounded-full bg-brand text-brand-foreground flex items-center justify-center">
                <Check className="size-3" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Thumb({ id }: { id: TemplateId }) {
  const styles: Record<TemplateId, React.CSSProperties> = {
    modern: { background: "linear-gradient(135deg,#111 40%,#fff 40%)" },
    minimal: { background: "#fafafa" },
    creative: { background: "linear-gradient(135deg,#7c3aed,#ec4899)" },
    corporate: { background: "#fff" },
    ats: { background: "#fff" },
    elegant: { background: "#faf7f2" },
    sidebar: { background: "linear-gradient(90deg,#1f2937 35%,#fff 35%)" },
    compact: { background: "#fff" },
    executive: { background: "linear-gradient(180deg,#e5e7eb 30%,#fff 30%)" },
    techie: { background: "#0a0a0a" },
  };
  return (
    <div className="absolute inset-0" style={styles[id]}>
      <div className="p-3 space-y-1.5">
        <div className="h-1.5 w-12 rounded" style={{ background: id === "techie" ? "#10b981" : id === "creative" ? "rgba(255,255,255,.8)" : id === "modern" || id === "sidebar" ? "rgba(255,255,255,.7)" : "#111" }} />
        <div className="h-1 w-8 rounded opacity-50" style={{ background: id === "techie" ? "#10b981" : id === "creative" || id === "modern" || id === "sidebar" ? "#fff" : "#999" }} />
        <div className="pt-2 space-y-1">
          {[80, 60, 70, 50, 65].map((w, i) => (
            <div key={i} className="h-1 rounded" style={{ width: `${w}%`, background: id === "techie" ? "#10b98155" : id === "creative" || id === "modern" || id === "sidebar" ? "rgba(255,255,255,.4)" : "#ddd" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
