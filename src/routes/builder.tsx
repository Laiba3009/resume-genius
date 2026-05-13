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
  const [exporting, setExporting] = useState(false);
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
          <Tabs defaultValue="content">
            <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl">
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
        <div className="flex justify-center overflow-auto rounded-3xl bg-white/70 p-4 shadow-card ring-1 ring-border/60 sm:p-8 lg:p-10">
          <div className="origin-top" style={{ transform: "scale(0.92)", transformOrigin: "top center" }}>
            <ResumePreview ref={previewRef} data={data} template={template} />
          </div>
        </div>
      </main>
    </div>
  );
}
