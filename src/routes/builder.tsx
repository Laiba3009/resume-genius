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
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
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
