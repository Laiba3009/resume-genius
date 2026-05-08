import { TEMPLATES, type TemplateId, defaultResume } from "@/lib/resume-types";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResumePreview } from "./ResumePreview";

interface Props {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
}

export function TemplateGallery({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {TEMPLATES.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "group relative rounded-xl border-2 overflow-hidden text-left transition-all bg-white",
              "hover:-translate-y-1 hover:shadow-elegant",
              active ? "border-brand shadow-elegant" : "border-border hover:border-brand/50"
            )}
          >
            <div className="aspect-[3/4] overflow-hidden bg-neutral-100 relative">
              <div
                className="absolute top-0 left-1/2"
                style={{
                  width: "900px",
                  transform: "translateX(-50%) scale(0.24)",
                  transformOrigin: "top center",
                  pointerEvents: "none",
                }}
              >
                <ResumePreview data={defaultResume} template={t.id} />
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 group-hover:ring-brand/30 transition" />
            </div>
            <div className="p-3 flex items-center justify-between bg-white border-t">
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-[11px] text-muted-foreground">{t.desc}</div>
              </div>
              {active && (
                <div className="size-6 rounded-full bg-brand text-brand-foreground flex items-center justify-center shrink-0">
                  <Check className="size-3.5" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
