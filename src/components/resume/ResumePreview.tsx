import { forwardRef } from "react";
import type { ResumeData, TemplateId } from "@/lib/resume-types";
import { Mail, Phone, MapPin, User } from "lucide-react";

interface Props {
  data: ResumeData;
  template: TemplateId;
}

export const ResumePreview = forwardRef<HTMLDivElement, Props>(({ data, template }, ref) => {
  return (
    <div
      ref={ref}
      id="resume-canvas"
      className="bg-[#ffffff] text-[#171717] mx-auto shadow-card"
      style={{ width: "900px", minHeight: "1273px" }}
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
      className="rounded-full bg-[#e5e5e5] overflow-hidden flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {src ? <img src={src} className="w-full h-full object-cover" /> : <User className="text-[#a3a3a3]" />}
    </div>
  );
}

const Section = ({ title, children, color = "#111" }: any) => (
  <div className="mb-5">
    <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2 pb-1 border-b" style={{ color, borderColor: color + "33" }}>{title}</h3>
    {children}
  </div>
);

/* ============ TEMPLATES ============ */

function ModernTpl({ d }: { d: ResumeData }) {
  return (
    <div className="grid grid-cols-[1fr_2fr] h-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <aside className="bg-[#171717] text-[#ffffff] p-8 space-y-6">
        <Avatar src={d.photo} size={96} />
        <div>
          <h1 className="text-2xl font-bold leading-tight">{d.fullName}</h1>
          <p className="text-[#d4d4d4] text-sm mt-1">{d.title}</p>
        </div>
        <div className="space-y-2 text-xs">
          {d.email && <div className="flex items-center gap-2"><Mail className="size-3" /> {d.email}</div>}
          {d.phone && <div className="flex items-center gap-2"><Phone className="size-3" /> {d.phone}</div>}
          {d.address && <div className="flex items-center gap-2"><MapPin className="size-3" /> {d.address}</div>}
        </div>
        <Section title="Skills" color="#fff">
          <div className="flex flex-wrap gap-1.5">
            {d.skills.map((s) => <span key={s} className="text-[10px] bg-[#ffffff] px-2 py-1 rounded">{s}</span>)}
          </div>
        </Section>
      </aside>
      <main className="p-8 text-[13px] leading-relaxed">
        <Section title="Profile"><p>{d.objective}</p></Section>
        <Section title="Experience">{d.experience.map(e => (
          <div key={e.id} className="mb-3">
            <div className="flex justify-between"><strong>{e.role}</strong><span className="text-xs text-[#737373]">{e.period}</span></div>
            <div className="text-xs text-[#525252] italic">{e.company}</div>
            <p className="text-xs mt-1">{e.description}</p>
          </div>
        ))}</Section>
        <Section title="Education">{d.education.map(e => (
          <div key={e.id} className="mb-2"><div className="flex justify-between"><strong>{e.degree}</strong><span className="text-xs text-[#737373]">{e.period}</span></div><div className="text-xs text-[#525252]">{e.school}</div></div>
        ))}</Section>
      </main>
    </div>
  );
}

function MinimalTpl({ d }: { d: ResumeData }) {
  return (
    <div className="p-12" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-light tracking-tight">{d.fullName}</h1>
        <p className="text-sm text-[#737373] mt-2 tracking-widest uppercase">{d.title}</p>
        <div className="text-xs text-[#737373] mt-3 flex justify-center gap-4">
          {d.email && <span>{d.email}</span>}{d.phone && <span>· {d.phone}</span>}{d.address && <span>· {d.address}</span>}
        </div>
      </div>
      <div className="text-[13px] leading-relaxed space-y-5">
        <p className="text-center italic max-w-xl mx-auto text-[#525252]">{d.objective}</p>
        <Section title="Experience">{d.experience.map(e => (
          <div key={e.id} className="mb-3"><div className="flex justify-between"><strong>{e.role} — {e.company}</strong><span className="text-xs">{e.period}</span></div><p className="text-xs mt-1">{e.description}</p></div>
        ))}</Section>
        <Section title="Education">{d.education.map(e => <div key={e.id} className="text-xs flex justify-between mb-1"><span><strong>{e.degree}</strong> · {e.school}</span><span>{e.period}</span></div>)}</Section>
        <Section title="Skills"><p className="text-xs">{d.skills.join(" · ")}</p></Section>
      </div>
    </div>
  );
}

function CreativeTpl({ d }: { d: ResumeData }) {
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="p-10 text-[#ffffff]" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>
        <div className="flex items-center gap-5">
          <Avatar src={d.photo} size={88} />
          <div>
            <h1 className="text-3xl font-bold">{d.fullName}</h1>
            <p className="opacity-90">{d.title}</p>
            <div className="text-xs opacity-80 mt-2 flex gap-3">{d.email}<span>·</span>{d.phone}<span>·</span>{d.address}</div>
          </div>
        </div>
      </div>
      <div className="p-10 text-[13px] leading-relaxed">
        <Section title="About" color="#7c3aed"><p>{d.objective}</p></Section>
        <Section title="Experience" color="#7c3aed">{d.experience.map(e => (
          <div key={e.id} className="mb-3"><div className="flex justify-between"><strong>{e.role}</strong><span className="text-xs text-[#db2777]">{e.period}</span></div><div className="text-xs italic">{e.company}</div><p className="text-xs mt-1">{e.description}</p></div>
        ))}</Section>
        <Section title="Skills" color="#7c3aed"><div className="flex flex-wrap gap-1.5">{d.skills.map(s => <span key={s} className="text-[10px] px-2 py-1 rounded-full" style={{ background: "linear-gradient(135deg,#7c3aed22,#ec489922)", color: "#7c3aed" }}>{s}</span>)}</div></Section>
        <Section title="Education" color="#7c3aed">{d.education.map(e => <div key={e.id} className="text-xs mb-1"><strong>{e.degree}</strong> — {e.school} <span className="text-[#737373]">({e.period})</span></div>)}</Section>
      </div>
    </div>
  );
}

function CorporateTpl({ d }: { d: ResumeData }) {
  return (
    <div className="p-10" style={{ fontFamily: "Georgia, serif" }}>
      <div className="border-b-2 border-[#171717] pb-4 mb-6">
        <h1 className="text-3xl font-bold">{d.fullName}</h1>
        <p className="text-sm text-[#404040]">{d.title}</p>
        <div className="text-xs mt-2">{[d.email, d.phone, d.address].filter(Boolean).join("  |  ")}</div>
      </div>
      <div className="text-[13px] leading-relaxed">
        <Section title="Summary"><p>{d.objective}</p></Section>
        <Section title="Professional Experience">{d.experience.map(e => (
          <div key={e.id} className="mb-3"><div className="flex justify-between"><strong>{e.company}</strong><span className="text-xs">{e.period}</span></div><div className="italic text-xs">{e.role}</div><p className="text-xs mt-1">{e.description}</p></div>
        ))}</Section>
        <Section title="Education">{d.education.map(e => <div key={e.id} className="text-xs mb-1 flex justify-between"><span><strong>{e.school}</strong> — {e.degree}</span><span>{e.period}</span></div>)}</Section>
        <Section title="Core Competencies"><p className="text-xs">{d.skills.join(" • ")}</p></Section>
      </div>
    </div>
  );
}

function AtsTpl({ d }: { d: ResumeData }) {
  return (
    <div className="p-10 text-[13px] leading-relaxed" style={{ fontFamily: "Arial, sans-serif" }}>
      <h1 className="text-2xl font-bold">{d.fullName}</h1>
      <p>{d.title}</p>
      <p className="text-xs mt-1">{[d.email, d.phone, d.address].filter(Boolean).join(" | ")}</p>
      <hr className="my-3" />
      <h2 className="font-bold uppercase text-sm mt-3">Summary</h2><p>{d.objective}</p>
      <h2 className="font-bold uppercase text-sm mt-3">Experience</h2>
      {d.experience.map(e => <div key={e.id} className="mb-2"><strong>{e.role}</strong>, {e.company} ({e.period})<br /><span className="text-xs">{e.description}</span></div>)}
      <h2 className="font-bold uppercase text-sm mt-3">Education</h2>
      {d.education.map(e => <div key={e.id} className="text-xs">{e.degree}, {e.school} ({e.period})</div>)}
      <h2 className="font-bold uppercase text-sm mt-3">Skills</h2><p className="text-xs">{d.skills.join(", ")}</p>
    </div>
  );
}

function ElegantTpl({ d }: { d: ResumeData }) {
  return (
    <div className="p-12" style={{ fontFamily: "Georgia, serif" }}>
      <div className="text-center mb-8 border-b border-[#d4d4d4] pb-6">
        <h1 className="text-5xl font-normal italic">{d.fullName}</h1>
        <p className="text-sm tracking-[0.3em] uppercase mt-3 text-[#737373]">{d.title}</p>
        <p className="text-xs mt-2 text-[#525252]">{[d.email, d.phone, d.address].filter(Boolean).join(" · ")}</p>
      </div>
      <div className="text-[13px] leading-relaxed space-y-5">
        <p className="italic text-center text-[#404040]">{d.objective}</p>
        <Section title="Experience">{d.experience.map(e => <div key={e.id} className="mb-3 text-center"><div className="font-bold">{e.role}</div><div className="text-xs italic">{e.company} · {e.period}</div><p className="text-xs mt-1">{e.description}</p></div>)}</Section>
        <Section title="Education">{d.education.map(e => <div key={e.id} className="text-xs text-center mb-1"><strong>{e.degree}</strong> — {e.school} · {e.period}</div>)}</Section>
        <Section title="Skills"><p className="text-xs text-center">{d.skills.join(" · ")}</p></Section>
      </div>
    </div>
  );
}

function SidebarTpl({ d }: { d: ResumeData }) {
  return (
    <div className="grid grid-cols-[260px_1fr] h-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <aside className="p-7 text-[#ffffff] space-y-5" style={{ background: "#1f2937" }}>
        <Avatar src={d.photo} size={110} />
        <div><h1 className="text-xl font-bold">{d.fullName}</h1><p className="text-xs opacity-80">{d.title}</p></div>
        <Section title="Contact" color="#fff">
          <div className="text-xs space-y-1.5">
            {d.email && <div>{d.email}</div>}{d.phone && <div>{d.phone}</div>}{d.address && <div>{d.address}</div>}
            {d.status && <div>{d.status}</div>}
          </div>
        </Section>
        <Section title="Skills" color="#fff"><div className="text-xs space-y-1">{d.skills.map(s => <div key={s}>• {s}</div>)}</div></Section>
      </aside>
      <main className="p-8 text-[13px] leading-relaxed">
        <Section title="Profile"><p>{d.objective}</p></Section>
        <Section title="Experience">{d.experience.map(e => <div key={e.id} className="mb-3"><div className="flex justify-between"><strong>{e.role}</strong><span className="text-xs">{e.period}</span></div><div className="text-xs italic">{e.company}</div><p className="text-xs mt-1">{e.description}</p></div>)}</Section>
        <Section title="Education">{d.education.map(e => <div key={e.id} className="text-xs mb-1 flex justify-between"><span><strong>{e.degree}</strong> · {e.school}</span><span>{e.period}</span></div>)}</Section>
      </main>
    </div>
  );
}

function CompactTpl({ d }: { d: ResumeData }) {
  return (
    <div className="p-8 text-[12px] leading-snug" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex justify-between items-start mb-4"><div><h1 className="text-2xl font-bold">{d.fullName}</h1><p className="text-xs text-[#525252]">{d.title}</p></div><div className="text-right text-xs">{d.email}<br />{d.phone}<br />{d.address}</div></div>
      <Section title="Summary"><p>{d.objective}</p></Section>
      <Section title="Experience">{d.experience.map(e => <div key={e.id} className="mb-2"><div className="flex justify-between"><strong>{e.role} · {e.company}</strong><span className="text-[10px]">{e.period}</span></div><p className="text-[11px]">{e.description}</p></div>)}</Section>
      <Section title="Education">{d.education.map(e => <div key={e.id} className="text-[11px] flex justify-between"><span><strong>{e.degree}</strong> · {e.school}</span><span>{e.period}</span></div>)}</Section>
      <Section title="Skills"><p className="text-[11px]">{d.skills.join(" • ")}</p></Section>
    </div>
  );
}

function ExecutiveTpl({ d }: { d: ResumeData }) {
  return (
    <div style={{ fontFamily: "Georgia, serif" }}>
      <div className="p-10 bg-[#f5f5f5] border-b-4" style={{ borderColor: "#0f172a" }}>
        <h1 className="text-4xl font-bold text-[#171717]">{d.fullName}</h1>
        <p className="text-base text-[#404040] mt-1">{d.title}</p>
        <p className="text-xs mt-3 text-[#525252]">{[d.email, d.phone, d.address].filter(Boolean).join("  ·  ")}</p>
      </div>
      <div className="p-10 text-[13px] leading-relaxed">
        <Section title="Executive Summary" color="#0f172a"><p>{d.objective}</p></Section>
        <Section title="Leadership Experience" color="#0f172a">{d.experience.map(e => <div key={e.id} className="mb-3"><div className="flex justify-between"><strong className="uppercase tracking-wide">{e.role}</strong><span className="text-xs">{e.period}</span></div><div className="italic text-xs">{e.company}</div><p className="text-xs mt-1">{e.description}</p></div>)}</Section>
        <Section title="Education" color="#0f172a">{d.education.map(e => <div key={e.id} className="text-xs flex justify-between mb-1"><span><strong>{e.degree}</strong>, {e.school}</span><span>{e.period}</span></div>)}</Section>
        <Section title="Expertise" color="#0f172a"><p className="text-xs">{d.skills.join(" • ")}</p></Section>
      </div>
    </div>
  );
}

function TechieTpl({ d }: { d: ResumeData }) {
  return (
    <div className="p-10 text-[13px] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="font-mono text-xs text-[#059669] mb-2">$ whoami</div>
      <h1 className="text-3xl font-bold">{d.fullName}</h1>
      <p className="font-mono text-sm text-[#525252]">// {d.title}</p>
      <p className="text-xs mt-2 font-mono">{[d.email, d.phone, d.address].filter(Boolean).join(" | ")}</p>
      <Section title="// summary" color="#059669"><p>{d.objective}</p></Section>
      <Section title="// experience" color="#059669">{d.experience.map(e => <div key={e.id} className="mb-3"><div className="flex justify-between"><strong className="font-mono">{e.role}</strong><span className="text-xs font-mono">{e.period}</span></div><div className="text-xs text-[#525252]">@ {e.company}</div><p className="text-xs mt-1">{e.description}</p></div>)}</Section>
      <Section title="// stack" color="#059669"><div className="flex flex-wrap gap-1.5">{d.skills.map(s => <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#059669] text-[#047857]">{s}</span>)}</div></Section>
      <Section title="// education" color="#059669">{d.education.map(e => <div key={e.id} className="text-xs font-mono mb-1">{e.degree} — {e.school} <span className="text-[#737373]">[{e.period}]</span></div>)}</Section>
    </div>
  );
}
