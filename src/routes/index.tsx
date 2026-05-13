import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Download, Layout, Zap, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/resume-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resumely — Build a beautiful resume in minutes" },
      { name: "description", content: "A modern, free resume builder with 10 professional templates, live preview, and one-click PDF export." },
      { property: "og:title", content: "Resumely — Modern Resume Builder" },
      { property: "og:description", content: "Beautiful, ATS-friendly resumes. Free. No signup." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Nav />
      <Hero />
      <Features />
      <TemplatesShowcase />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <div className="size-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <FileText className="size-4 text-white" />
          </div>
          <span className="flex flex-col leading-none">
            <span>Resumely</span>
            <span className="text-[9px] font-normal tracking-wide text-muted-foreground hidden sm:inline">by Laiba Jaweed</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition">Features</a>
          <a href="#templates" className="text-muted-foreground hover:text-foreground transition">Templates</a>
          <Link to="/builder" className="text-muted-foreground hover:text-foreground transition">Builder</Link>
        </nav>
        <Button asChild size="sm" className="bg-gradient-brand text-brand-foreground hover:opacity-90">
          <Link to="/builder">Start free <ArrowRight className="size-4 ml-1" /></Link>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-border bg-card mb-6">
          <Sparkles className="size-3 text-brand" /> 100% free · No signup required
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">
          Resumes that <span className="text-gradient">actually get</span> read.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Pick from 10 hand-crafted templates, fill in the form, watch it update live, and export a pixel-perfect PDF in seconds.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-gradient-brand text-brand-foreground hover:opacity-90 shadow-elegant">
            <Link to="/builder">Build my resume <ArrowRight className="size-4 ml-2" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#templates">Browse templates</a>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-16 relative max-w-4xl mx-auto"
      >
        <div className="rounded-2xl border bg-card shadow-elegant overflow-hidden p-2">
          <div className="grid grid-cols-3 gap-2">
            {["modern", "creative", "elegant"].map((id) => (
              <div key={id} className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                <MiniPreview id={id} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function MiniPreview({ id }: { id: string }) {
  const styles: Record<string, React.CSSProperties> = {
    modern: { background: "linear-gradient(135deg,#111 40%,#fff 40%)" },
    creative: { background: "linear-gradient(135deg,#7c3aed,#ec4899)" },
    elegant: { background: "#faf7f2" },
  };
  return <div className="size-full" style={styles[id]} />;
}

function Features() {
  const items = [
    { icon: Layout, title: "10 Templates", desc: "Modern, minimal, creative, corporate, ATS-friendly and more." },
    { icon: Zap, title: "Live Preview", desc: "See changes instantly as you type. No reload, no lag." },
    { icon: Download, title: "PDF Export", desc: "One-click download, print-ready, pixel-perfect output." },
    { icon: Shield, title: "ATS Friendly", desc: "Layouts parsers love. Get past the bots, into the hands of recruiters." },
  ];
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">Everything you need. Nothing you don't.</h2>
        <p className="mt-3 text-muted-foreground">Crafted for speed and clarity.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-card border shadow-card hover:shadow-elegant transition"
          >
            <div className="size-10 rounded-lg bg-gradient-brand flex items-center justify-center mb-4">
              <it.icon className="size-5 text-white" />
            </div>
            <h3 className="font-semibold">{it.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const TEMPLATE_IMAGES: Record<string, string> = {
  modern: "/templates/template-modern.png",
  minimal: "/templates/template-minimal.png",
  creative: "/templates/template-creative.png",
  corporate: "/templates/template-corporate.png",
  ats: "/templates/template-dark.png",
  elegant: "/templates/template-elegant.png",
  sidebar: "/templates/template-sidebar.png",
  compact: "/templates/template-compact.png",
  executive: "/templates/template-executive.png",
  techie: "/templates/template-tech.png",
};

function TemplatesShowcase() {
  return (
    <section id="templates" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-border bg-card mb-4">
          <Layout className="size-3 text-brand" /> 10 premium designs
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Pick a template you'll be proud of.</h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Every design is hand-tuned, ATS-friendly, and ready to export. Swap any time — your content stays put.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {TEMPLATES.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
            className="group"
          >
            <Link
              to="/builder"
              className="block rounded-2xl border border-border/70 bg-card overflow-hidden shadow-card hover:shadow-elegant hover:-translate-y-1.5 hover:border-brand/40 transition-all duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                <img
                  src={TEMPLATE_IMAGES[t.id]}
                  alt={`${t.name} resume template preview`}
                  width={768}
                  height={1024}
                  loading="lazy"
                  className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-neutral-900 shadow">
                    Use this template <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
              <div className="p-5 border-t border-border/60">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-base">{t.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Free</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{t.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24">
      <div className="rounded-3xl bg-gradient-brand p-12 text-center text-brand-foreground shadow-elegant">
        <h2 className="text-4xl font-bold">Your next role is one resume away.</h2>
        <p className="mt-3 opacity-90">Start building — it's free, fast, and looks great.</p>
        <Button asChild size="lg" variant="secondary" className="mt-8">
          <Link to="/builder">Open the builder <ArrowRight className="size-4 ml-2" /></Link>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-gradient-brand flex items-center justify-center">
            <FileText className="size-3 text-white" />
          </div>
          <span>© {new Date().getFullYear()} <span className="font-semibold text-foreground">Resumely</span> — Developed by <span className="text-foreground font-medium">Laiba Jaweed</span></span>
        </div>
        <div className="text-xs">A modern, free resume builder.</div>
      </div>
    </footer>
  );
}
