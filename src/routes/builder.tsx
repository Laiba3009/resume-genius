import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download, FileText, ArrowLeft, LayoutTemplate } from "lucide-react";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { TemplateGallery } from "@/components/resume/TemplateGallery";
import { defaultResume, TEMPLATES, type ResumeData, type TemplateId } from "@/lib/resume-types";
import { supabase } from "@/integrations/supabase/client";

const TEMPLATE_IDS = TEMPLATES.map((t) => t.id) as readonly TemplateId[];
const isTemplateId = (v: unknown): v is TemplateId =>
  typeof v === "string" && (TEMPLATE_IDS as readonly string[]).includes(v);

export const Route = createFileRoute("/builder")({
  validateSearch: (search: Record<string, unknown>): { template?: TemplateId } => ({
    template: isTemplateId(search.template) ? search.template : undefined,
  }),
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
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const initialTemplate: TemplateId = search.template ?? "modern";
  const [data, setData] = useState<ResumeData>(defaultResume);
  const [template, setTemplateState] = useState<TemplateId>(initialTemplate);
  const [loaded, setLoaded] = useState(false);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"content" | "templates">("content");

  const setTemplate = (id: TemplateId) => {
    setTemplateState(id);
    navigate({ search: { template: id }, replace: true });
  };

  // Scroll to top on mount for smooth entry from template card
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Sync from URL changes (e.g. user clicks another template link)
  useEffect(() => {
    if (search.template && search.template !== template) {
      setTemplateState(search.template);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.template]);

  // Load saved resume
  useEffect(() => {
    const sid = getSessionId();
    supabase.from("resumes").select("*").eq("session_id", sid).maybeSingle().then(({ data: row }) => {
      if (row) {
        setData(row.data as unknown as ResumeData);
        // URL template wins over saved template if explicitly provided
        if (!search.template) setTemplateState(row.template_id as TemplateId);
      }
      setLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!previewRef.current || exporting) return;
    setExporting(true);
    toast.loading("Generating PDF…", { id: "pdf" });
    try {
      await document.fonts?.ready;
      const node = previewRef.current;
      const width = node.scrollWidth || 794;
      const height = Math.max(node.scrollHeight, 1123);
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        width,
        height,
        backgroundColor: "#ffffff",
        style: {
          margin: "0",
          transform: "none",
          width: `${width}px`,
          minHeight: `${height}px`,
          overflow: "visible",
        },
      });
      const pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgH = pageW * (height / width);
      let y = 0;
      let remaining = imgH;
      pdf.addImage(dataUrl, "PNG", 0, 0, pageW, imgH, undefined, "FAST");
      remaining -= pageH;
      while (remaining > 0) {
        pdf.addPage();
        y -= pageH;
        pdf.addImage(dataUrl, "PNG", 0, y, pageW, imgH, undefined, "FAST");
        remaining -= pageH;
      }
      const fileName = (data.fullName || "resume").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "resume";
      pdf.save(`${fileName}.pdf`);
      toast.success("Downloaded", { id: "pdf" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to export PDF";
      toast.error(message, { id: "pdf" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur-xl no-print">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-display font-bold">
            <div className="size-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <FileText className="size-4 text-white" />
            </div>
            <span className="hidden sm:flex flex-col leading-none">
              <span>Resumely</span>
              <span className="text-[9px] font-normal tracking-wide text-muted-foreground">by Laiba Jaweed</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft className="size-4 mr-1" /> Home</Link></Button>
            <Button
              onClick={downloadPDF}
              disabled={exporting}
              className="rounded-xl bg-gradient-brand px-6 py-3 text-brand-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Download className="size-4 mr-2" /> {exporting ? "Exporting…" : "Download PDF"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(360px,430px)_minmax(0,1fr)] lg:gap-12">
        {/* Left: form / templates */}
        <div className="space-y-5 no-print lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center justify-between gap-2 rounded-2xl border border-border/60 bg-white p-3 shadow-card">
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-flex size-6 items-center justify-center rounded-md bg-gradient-brand text-[10px] font-bold text-brand-foreground shrink-0">T</span>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">Active template</div>
                <div className="text-sm font-semibold truncate">{TEMPLATES.find((t) => t.id === template)?.name ?? template}</div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="rounded-lg" onClick={() => setTab("templates")}>
              <LayoutTemplate className="size-3.5 mr-1.5" /> Change
            </Button>
          </div>
          <Tabs value={tab} onValueChange={(v) => setTab(v as "content" | "templates") }>
            <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl">
              <TabsTrigger value="content"><FileText className="size-4 mr-2" /> Content</TabsTrigger>
              <TabsTrigger value="templates"><LayoutTemplate className="size-4 mr-2" /> Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="mt-4">
              <ResumeForm data={data} onChange={setData} />
            </TabsContent>
            <TabsContent value="templates" className="mt-4">
              <TemplateGallery value={template} onChange={(id) => { setTemplate(id); setTab("content"); }} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: preview */}
        <div className="rounded-3xl bg-white/70 p-3 shadow-card ring-1 ring-border/60 sm:p-6 lg:p-8 animate-in fade-in duration-500 overflow-hidden">
          <div
            className="relative w-full"
            style={{ containerType: "inline-size" }}
          >
            <div
              style={{
                width: "100cqw",
                height: "calc(100cqw * 1123 / 794)",
                position: "relative",
              }}
            >
              <div
                key={template}
                className="origin-top-left animate-in fade-in zoom-in-95 duration-300 absolute top-0 left-0"
                style={{
                  width: "794px",
                  transform: "scale(calc(100cqw / 794px))",
                }}
              >
                <ResumePreview ref={previewRef} data={data} template={template} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
