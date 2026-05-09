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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {TEMPLATES.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "group relative overflow-hidden rounded-xl border-2 bg-white text-left transition-all duration-300",
              "hover:-translate-y-1 hover:shadow-elegant",
              active ? "border-brand shadow-elegant" : "border-border hover:border-brand/50"
            )}
          >
            <div className="relative aspect-[5/6] overflow-hidden bg-neutral-100">
              <div
                className="absolute top-0 left-1/2"
                style={{
                  width: "794px",
                  transform: "translateX(-50%) scale(0.23)",
                  transformOrigin: "top center",
                  pointerEvents: "none",
                }}
              >
                <ResumePreview data={defaultResume} template={t.id} />
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 group-hover:ring-brand/30 transition" />
            </div>
            <div className="flex items-center justify-between border-t bg-white p-3">
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
