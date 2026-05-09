import { forwardRef, type ReactNode } from "react";
import type { ResumeData, TemplateId } from "@/lib/resume-types";
import { Mail, MapPin, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  data: ResumeData;
  template: TemplateId;
}

const contactItems = (d: ResumeData) => [d.email, d.phone, d.address].filter(Boolean);

export const ResumePreview = forwardRef<HTMLDivElement, Props>(({ data, template }, ref) => {
  return (
    <div
      ref={ref}
      id="resume-canvas"
      data-resume-page
      className="mx-auto w-[794px] min-h-[1123px] overflow-visible bg-white text-slate-900 shadow-card print:shadow-none"
    >
      {template === "modern" && <ModernTpl d={data} />}
      {template === "minimal" && <MinimalTpl d={data} />}
      {template === "creative" && <CreativeTpl d={data} />}
      {template === "corporate" && <CorporateTpl d={data} />}
      {template === "ats" && <AtsTpl d={data} />}
      {template === "elegant" && <ElegantTpl d={data} />}
      {template === "sidebar" && <SidebarTpl d={data} />}
      {template === "compact" && <CompactTpl d={data} />}
      {template === "executive" && <ExecutiveTpl d={data} />}
      {template === "techie" && <TechieTpl d={data} />}
    </div>
  );
});
ResumePreview.displayName = "ResumePreview";

function Avatar({ src, size = 80 }: { src?: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt="Profile" className="h-full w-full object-cover" />
      ) : (
        <User className="h-1/2 w-1/2 text-slate-400" />
      )}
    </div>
  );
}

function Section({
  title,
  children,
  color = "#111827",
  className,
}: {
  title: string;
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <section data-pdf-section className={cn("break-inside-avoid space-y-3 overflow-visible", className)}>
      <h3
        className="border-b pb-1 text-[11px] font-bold uppercase leading-relaxed tracking-[0.18em]"
        style={{ color, borderColor: `${color}33` }}
      >
        {title}
      </h3>
      <div className="space-y-3 leading-relaxed break-words">{children}</div>
    </section>
  );
}

function ExperienceList({ d, compact = false }: { d: ResumeData; compact?: boolean }) {
  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      {d.experience.map((e) => (
        <article key={e.id} className="break-inside-avoid space-y-1 overflow-visible">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <strong className="min-w-0 break-words leading-snug">{e.role}</strong>
            <span className="shrink-0 text-xs leading-relaxed text-slate-500">{e.period}</span>
          </div>
          <div className="break-words text-xs italic leading-relaxed text-slate-600">{e.company}</div>
          <p className={cn("break-words text-xs leading-relaxed text-slate-800", compact && "leading-normal")}>{e.description}</p>
        </article>
      ))}
    </div>
  );
}

function EducationList({ d }: { d: ResumeData }) {
  return (
    <div className="space-y-2">
      {d.education.map((e) => (
        <article key={e.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1 break-inside-avoid text-xs leading-relaxed">
          <span className="min-w-0 break-words">
            <strong>{e.degree}</strong> · {e.school}
          </span>
          <span className="shrink-0 text-slate-500">{e.period}</span>
        </article>
      ))}
    </div>
  );
}

function SkillPills({ skills, dark = false }: { skills: string[]; dark?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2 overflow-visible">
      {skills.map((s) => (
        <span
          key={s}
          className={cn(
            "max-w-full break-words rounded-full px-2.5 py-1 text-[10px] font-medium leading-relaxed",
            dark ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-700",
          )}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function ModernTpl({ d }: { d: ResumeData }) {
  return (
    <div className="grid min-h-[1123px] grid-cols-[260px_1fr] overflow-visible font-sans">
      <aside className="space-y-6 overflow-visible bg-slate-900 p-8 text-white">
        <Avatar src={d.photo} size={96} />
        <div className="space-y-1 break-words">
          <h1 className="text-2xl font-bold leading-tight">{d.fullName}</h1>
          <p className="text-sm leading-relaxed text-slate-300">{d.title}</p>
        </div>
        <div className="space-y-2 break-words text-xs leading-relaxed text-slate-100">
          {d.email && <div className="flex gap-2"><Mail className="mt-0.5 size-3 shrink-0" /> <span>{d.email}</span></div>}
          {d.phone && <div className="flex gap-2"><Phone className="mt-0.5 size-3 shrink-0" /> <span>{d.phone}</span></div>}
          {d.address && <div className="flex gap-2"><MapPin className="mt-0.5 size-3 shrink-0" /> <span>{d.address}</span></div>}
        </div>
        <Section title="Skills" color="#ffffff">
          <SkillPills skills={d.skills} dark />
        </Section>
      </aside>
      <main className="space-y-6 overflow-visible p-9 text-[13px] leading-relaxed">
        <Section title="Profile"><p className="break-words leading-relaxed">{d.objective}</p></Section>
        <Section title="Experience"><ExperienceList d={d} /></Section>
        <Section title="Education"><EducationList d={d} /></Section>
      </main>
    </div>
  );
}

function MinimalTpl({ d }: { d: ResumeData }) {
  return (
    <div className="min-h-[1123px] space-y-8 overflow-visible p-12 font-sans text-[13px] leading-relaxed">
      <header data-pdf-section className="space-y-3 break-inside-avoid text-center">
        <h1 className="break-words text-4xl font-light leading-tight tracking-normal">{d.fullName}</h1>
        <p className="break-words text-sm uppercase leading-relaxed tracking-[0.2em] text-slate-500">{d.title}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 break-words text-xs leading-relaxed text-slate-500">
          {contactItems(d).map((item) => <span key={item}>{item}</span>)}
        </div>
      </header>
      <p data-pdf-section className="mx-auto max-w-xl break-words text-center italic leading-relaxed text-slate-600">{d.objective}</p>
      <Section title="Experience"><ExperienceList d={d} /></Section>
      <Section title="Education"><EducationList d={d} /></Section>
      <Section title="Skills"><p className="break-words text-xs leading-relaxed">{d.skills.join(" · ")}</p></Section>
    </div>
  );
}

function CreativeTpl({ d }: { d: ResumeData }) {
  return (
    <div className="min-h-[1123px] overflow-visible font-sans">
      <header data-pdf-section className="bg-gradient-to-br from-violet-700 to-pink-500 p-10 text-white">
        <div className="flex flex-wrap items-center gap-5 overflow-visible">
          <Avatar src={d.photo} size={88} />
          <div className="min-w-0 flex-1 space-y-2 break-words">
            <h1 className="text-3xl font-bold leading-tight">{d.fullName}</h1>
            <p className="leading-relaxed text-white">{d.title}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs leading-relaxed text-white">
              {contactItems(d).map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </div>
      </header>
      <main className="space-y-6 overflow-visible p-10 text-[13px] leading-relaxed">
        <Section title="About" color="#6d28d9"><p className="break-words leading-relaxed">{d.objective}</p></Section>
        <Section title="Experience" color="#6d28d9"><ExperienceList d={d} /></Section>
        <Section title="Skills" color="#6d28d9"><SkillPills skills={d.skills} /></Section>
        <Section title="Education" color="#6d28d9"><EducationList d={d} /></Section>
      </main>
    </div>
  );
}

function CorporateTpl({ d }: { d: ResumeData }) {
  return (
    <div className="min-h-[1123px] space-y-6 overflow-visible p-10 text-[13px] leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
      <header data-pdf-section className="break-inside-avoid border-b-2 border-slate-900 pb-5">
        <h1 className="break-words text-3xl font-bold leading-tight">{d.fullName}</h1>
        <p className="mt-1 break-words text-sm leading-relaxed text-slate-700">{d.title}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 break-words text-xs leading-relaxed text-slate-600">
          {contactItems(d).map((item) => <span key={item}>{item}</span>)}
        </div>
      </header>
      <Section title="Summary"><p className="break-words leading-relaxed">{d.objective}</p></Section>
      <Section title="Professional Experience"><ExperienceList d={d} /></Section>
      <Section title="Education"><EducationList d={d} /></Section>
      <Section title="Core Competencies"><p className="break-words text-xs leading-relaxed">{d.skills.join(" • ")}</p></Section>
    </div>
  );
}

function AtsTpl({ d }: { d: ResumeData }) {
  return (
    <div className="min-h-[1123px] space-y-5 overflow-visible p-10 text-[13px] leading-relaxed" style={{ fontFamily: "Arial, sans-serif" }}>
      <header data-pdf-section className="break-inside-avoid space-y-1 border-b border-slate-300 pb-4">
        <h1 className="break-words text-2xl font-bold leading-tight">{d.fullName}</h1>
        <p className="break-words leading-relaxed">{d.title}</p>
        <p className="break-words text-xs leading-relaxed">{contactItems(d).join(" | ")}</p>
      </header>
      <Section title="Summary"><p className="break-words leading-relaxed">{d.objective}</p></Section>
      <Section title="Experience"><ExperienceList d={d} /></Section>
      <Section title="Education"><EducationList d={d} /></Section>
      <Section title="Skills"><p className="break-words text-xs leading-relaxed">{d.skills.join(", ")}</p></Section>
    </div>
  );
}

function ElegantTpl({ d }: { d: ResumeData }) {
  return (
    <div className="min-h-[1123px] space-y-7 overflow-visible p-12 text-[13px] leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
      <header data-pdf-section className="break-inside-avoid space-y-3 border-b border-slate-300 pb-6 text-center">
        <h1 className="break-words text-5xl font-normal italic leading-tight">{d.fullName}</h1>
        <p className="break-words text-sm uppercase leading-relaxed tracking-[0.24em] text-slate-500">{d.title}</p>
        <p className="break-words text-xs leading-relaxed text-slate-600">{contactItems(d).join(" · ")}</p>
      </header>
      <p data-pdf-section className="break-words text-center italic leading-relaxed text-slate-700">{d.objective}</p>
      <Section title="Experience"><ExperienceList d={d} /></Section>
      <Section title="Education"><EducationList d={d} /></Section>
      <Section title="Skills"><p className="break-words text-center text-xs leading-relaxed">{d.skills.join(" · ")}</p></Section>
    </div>
  );
}

function SidebarTpl({ d }: { d: ResumeData }) {
  return (
    <div className="grid min-h-[1123px] grid-cols-[260px_1fr] overflow-visible font-sans">
      <aside className="space-y-6 overflow-visible bg-slate-800 p-7 text-white">
        <Avatar src={d.photo} size={110} />
        <div className="space-y-1 break-words">
          <h1 className="text-xl font-bold leading-tight">{d.fullName}</h1>
          <p className="text-xs leading-relaxed text-white">{d.title}</p>
        </div>
        <Section title="Contact" color="#ffffff">
          <div className="space-y-1.5 break-words text-xs leading-relaxed text-white">
            {contactItems(d).map((item) => <div key={item}>{item}</div>)}
            {d.status && <div>{d.status}</div>}
          </div>
        </Section>
        <Section title="Skills" color="#ffffff"><SkillPills skills={d.skills} dark /></Section>
      </aside>
      <main className="space-y-6 overflow-visible p-9 text-[13px] leading-relaxed">
        <Section title="Profile"><p className="break-words leading-relaxed">{d.objective}</p></Section>
        <Section title="Experience"><ExperienceList d={d} /></Section>
        <Section title="Education"><EducationList d={d} /></Section>
      </main>
    </div>
  );
}

function CompactTpl({ d }: { d: ResumeData }) {
  return (
    <div className="min-h-[1123px] space-y-4 overflow-visible p-8 font-sans text-[12px] leading-relaxed">
      <header data-pdf-section className="flex flex-wrap items-start justify-between gap-4 break-inside-avoid border-b border-slate-200 pb-4">
        <div className="min-w-0 flex-1 break-words">
          <h1 className="text-2xl font-bold leading-tight">{d.fullName}</h1>
          <p className="text-xs leading-relaxed text-slate-600">{d.title}</p>
        </div>
        <div className="max-w-[260px] space-y-1 break-words text-right text-xs leading-relaxed text-slate-600">
          {contactItems(d).map((item) => <div key={item}>{item}</div>)}
        </div>
      </header>
      <Section title="Summary"><p className="break-words leading-relaxed">{d.objective}</p></Section>
      <Section title="Experience"><ExperienceList d={d} compact /></Section>
      <Section title="Education"><EducationList d={d} /></Section>
      <Section title="Skills"><p className="break-words text-[11px] leading-relaxed">{d.skills.join(" • ")}</p></Section>
    </div>
  );
}

function ExecutiveTpl({ d }: { d: ResumeData }) {
  return (
    <div className="min-h-[1123px] overflow-visible" style={{ fontFamily: "Georgia, serif" }}>
      <header data-pdf-section className="break-inside-avoid border-b-4 border-slate-900 bg-slate-100 p-10">
        <h1 className="break-words text-4xl font-bold leading-tight text-slate-900">{d.fullName}</h1>
        <p className="mt-1 break-words text-base leading-relaxed text-slate-700">{d.title}</p>
        <p className="mt-3 break-words text-xs leading-relaxed text-slate-600">{contactItems(d).join(" · ")}</p>
      </header>
      <main className="space-y-6 overflow-visible p-10 text-[13px] leading-relaxed">
        <Section title="Executive Summary" color="#0f172a"><p className="break-words leading-relaxed">{d.objective}</p></Section>
        <Section title="Leadership Experience" color="#0f172a"><ExperienceList d={d} /></Section>
        <Section title="Education" color="#0f172a"><EducationList d={d} /></Section>
        <Section title="Expertise" color="#0f172a"><p className="break-words text-xs leading-relaxed">{d.skills.join(" • ")}</p></Section>
      </main>
    </div>
  );
}

function TechieTpl({ d }: { d: ResumeData }) {
  return (
    <div className="min-h-[1123px] space-y-5 overflow-visible p-10 font-sans text-[13px] leading-relaxed">
      <header data-pdf-section className="break-inside-avoid space-y-2 border-b border-emerald-200 pb-5">
        <div className="font-mono text-xs leading-relaxed text-emerald-600">$ whoami</div>
        <h1 className="break-words text-3xl font-bold leading-tight">{d.fullName}</h1>
        <p className="break-words font-mono text-sm leading-relaxed text-slate-600">// {d.title}</p>
        <p className="break-words font-mono text-xs leading-relaxed">{contactItems(d).join(" | ")}</p>
      </header>
      <Section title="// summary" color="#059669"><p className="break-words leading-relaxed">{d.objective}</p></Section>
      <Section title="// experience" color="#059669"><ExperienceList d={d} /></Section>
      <Section title="// stack" color="#059669"><SkillPills skills={d.skills} /></Section>
      <Section title="// education" color="#059669"><EducationList d={d} /></Section>
    </div>
  );
}
