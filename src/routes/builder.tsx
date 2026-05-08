import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download, FileText, ArrowLeft, LayoutTemplate } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { TemplateGallery } from "@/components/resume/TemplateGallery";
import { defaultResume, type ResumeData, type TemplateId } from "@/lib/resume-types";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "Resume Builder — Resumely" },
      { name: "description", content: "Build your resume with live preview and download as PDF." },
    ],
  }),
  component: Builder,
});

const SESSION_KEY = "resumely.session";

function getSessionId() {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function Builder() {
  const [data, setData] = useState<ResumeData>(defaultResume);
  const [template, setTemplate] = useState<TemplateId>("modern");
  const [loaded, setLoaded] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load
  useEffect(() => {
    const sid = getSessionId();
    supabase.from("resumes").select("*").eq("session_id", sid).maybeSingle().then(({ data: row }) => {
      if (row) {
        setData(row.data as unknown as ResumeData);
        setTemplate(row.template_id as TemplateId);
      }
      setLoaded(true);
    });
  }, []);

  // Auto-save (debounced)
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(async () => {
      const sid = getSessionId();
      await supabase.from("resumes").upsert(
        { session_id: sid, data: data as any, template_id: template, updated_at: new Date().toISOString() },
        { onConflict: "session_id" }
      );
    }, 800);
    return () => clearTimeout(t);
  }, [data, template, loaded]);

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    toast.loading("Generating PDF…", { id: "pdf" });
    try {
      // --- oklch -> rgb conversion (html2canvas can't parse oklch) ---
      const oklchToRgb = (L: number, C: number, h: number, alpha = 1) => {
        const hr = (h * Math.PI) / 180;
        const a = Math.cos(hr) * C;
        const b = Math.sin(hr) * C;
        const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
        const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
        const s_ = L - 0.0894841775 * a - 1.291485548 * b;
        const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
        let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
        let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
        let bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
        const toSrgb = (v: number) => {
          v = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
          return Math.max(0, Math.min(255, Math.round(v * 255)));
        };
        return `rgba(${toSrgb(r)}, ${toSrgb(g)}, ${toSrgb(bl)}, ${alpha})`;
      };
      const replaceOklch = (str: string) =>
        str.replace(/oklch\(\s*([0-9.%]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.%]+))?\s*\)/gi,
          (_m, L, C, h, A) => {
            const Ln = L.endsWith("%") ? parseFloat(L) / 100 : parseFloat(L);
            const An = A ? (A.endsWith("%") ? parseFloat(A) / 100 : parseFloat(A)) : 1;
            return oklchToRgb(Ln, parseFloat(C), parseFloat(h), An);
          });

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (doc) => {
          // 1) Sanitize all <style> tags
          doc.querySelectorAll("style").forEach((s) => {
            if (s.textContent && s.textContent.includes("oklch")) {
              s.textContent = replaceOklch(s.textContent);
            }
          });
          // 2) Sanitize inline styles on every element
          const props = [
            "color","background-color","border-top-color","border-right-color",
            "border-bottom-color","border-left-color","outline-color","fill","stroke",
            "text-decoration-color","caret-color","column-rule-color","background-image",
          ];
          doc.querySelectorAll<HTMLElement>("*").forEach((el) => {
            const cs = doc.defaultView!.getComputedStyle(el);
            props.forEach((p) => {
              const v = cs.getPropertyValue(p);
              if (v && v.includes("oklch")) {
                el.style.setProperty(p, replaceOklch(v));
              }
            });
            if (el.getAttribute("style")?.includes("oklch")) {
              el.setAttribute("style", replaceOklch(el.getAttribute("style")!));
            }
          });
        },
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.height / canvas.width;
      const imgH = pageW * ratio;
      let y = 0;
      let remaining = imgH;
      pdf.addImage(img, "PNG", 0, 0, pageW, imgH);
      remaining -= pageH;
      while (remaining > 0) {
        pdf.addPage();
        y -= pageH;
        pdf.addImage(img, "PNG", 0, y, pageW, imgH);
        remaining -= pageH;
      }
      pdf.save(`${data.fullName || "resume"}.pdf`);
      toast.success("Downloaded", { id: "pdf" });
    } catch (e: any) {
      toast.error(e.message || "Failed", { id: "pdf" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/50 no-print">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 font-display font-bold">
            <div className="size-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <FileText className="size-4 text-white" />
            </div>
            <span className="hidden sm:inline">Resumely</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft className="size-4 mr-1" /> Home</Link></Button>
            <Button onClick={downloadPDF} className="bg-gradient-brand text-brand-foreground hover:opacity-90">
              <Download className="size-4 mr-2" /> Download PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-6">
        {/* Left: form / templates */}
        <div className="space-y-4 no-print">
          <Tabs defaultValue="content">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="content"><FileText className="size-4 mr-2" /> Content</TabsTrigger>
              <TabsTrigger value="templates"><LayoutTemplate className="size-4 mr-2" /> Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="mt-4">
              <ResumeForm data={data} onChange={setData} />
            </TabsContent>
            <TabsContent value="templates" className="mt-4">
              <TemplateGallery value={template} onChange={setTemplate} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: preview */}
        <div className="bg-muted/40 rounded-2xl p-4 sm:p-8 overflow-auto">
          <div className="origin-top mx-auto" style={{ transform: "scale(var(--preview-scale, 0.85))", transformOrigin: "top center" }}>
            <ResumePreview ref={previewRef} data={data} template={template} />
          </div>
        </div>
      </main>
    </div>
  );
}
