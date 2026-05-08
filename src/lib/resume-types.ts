export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}
export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  period: string;
}
export interface ResumeData {
  fullName: string;
  title: string;
  photo: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  age: string;
  objective: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

export const defaultResume: ResumeData = {
  fullName: "Alex Morgan",
  title: "Senior Product Designer",
  photo: "",
  phone: "+1 (555) 123-4567",
  email: "alex@example.com",
  address: "San Francisco, CA",
  status: "Open to opportunities",
  age: "",
  objective:
    "Designer with 8+ years crafting digital products that balance beauty and usability. Passionate about systems, typography, and shipping work that matters.",
  skills: ["Figma", "Design Systems", "Prototyping", "User Research", "React", "Tailwind CSS"],
  experience: [
    {
      id: "e1",
      role: "Senior Product Designer",
      company: "Northwind Labs",
      period: "2022 — Present",
      description:
        "Lead end-to-end design for the flagship analytics suite. Established design tokens, increased activation by 34%.",
    },
    {
      id: "e2",
      role: "Product Designer",
      company: "Lumen Studio",
      period: "2019 — 2022",
      description:
        "Shipped 12+ marketing sites and 3 SaaS products. Owned the in-house component library used across teams.",
    },
  ],
  education: [
    { id: "ed1", degree: "BFA, Visual Communication", school: "Rhode Island School of Design", period: "2015 — 2019" },
  ],
};

export const TEMPLATES = [
  { id: "modern", name: "Modern", desc: "Clean two-column with accent rail" },
  { id: "minimal", name: "Minimal", desc: "Quiet typography, generous space" },
  { id: "creative", name: "Creative", desc: "Bold gradient header" },
  { id: "corporate", name: "Corporate", desc: "Classic, trusted, ATS-safe" },
  { id: "ats", name: "ATS Pure", desc: "Single-column, parser optimized" },
  { id: "elegant", name: "Elegant", desc: "Serif, editorial feel" },
  { id: "sidebar", name: "Sidebar", desc: "Dark sidebar with profile" },
  { id: "compact", name: "Compact", desc: "Dense, fits more content" },
  { id: "executive", name: "Executive", desc: "Refined, leadership-focused" },
  { id: "techie", name: "Techie", desc: "Mono accents for engineers" },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];
