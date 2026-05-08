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
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <div className="size-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <FileText className="size-4 text-white" />
          </div>
          Resumely
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

function TemplatesShowcase() {
  return (
    <section id="templates" className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">10 templates. One you.</h2>
        <p className="mt-3 text-muted-foreground">Switch designs in a click — your content stays untouched.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {TEMPLATES.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="aspect-[3/4] rounded-xl border bg-card shadow-card p-3 hover:shadow-elegant hover:-translate-y-1 transition"
          >
            <div className="size-full rounded-lg bg-muted relative overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-[#111111] to-transparent text-white text-xs font-medium">
                {t.name}
              </div>
            </div>
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
    <footer className="border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-6 text-sm text-muted-foreground flex justify-between flex-wrap gap-2">
        <div>© {new Date().getFullYear()} Resumely. Built with love.</div>
        <div>A modern resume builder.</div>
      </div>
    </footer>
  );
}
