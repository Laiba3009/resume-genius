import { useRef } from "react";
import { Plus, Trash2, Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ResumeData } from "@/lib/resume-types";

interface Props {
  data: ResumeData;
  onChange: (next: ResumeData) => void;
}

export function ResumeForm({ data, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const update = <K extends keyof ResumeData>(k: K, v: ResumeData[K]) =>
    onChange({ ...data, [k]: v });

  const uploadPhoto = async (file: File) => {
    if (file.size > 4 * 1024 * 1024) return toast.error("Image too large (max 4MB)");
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file);
    if (error) return toast.error(error.message);
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    update("photo", pub.publicUrl);
    toast.success("Photo uploaded");
  };

  return (
    <div className="space-y-6">
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Profile</h3>
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
            {data.photo ? (
              <img src={data.photo} alt="" className="size-full object-cover" />
            ) : (
              <User className="size-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4 mr-2" /> Upload
            </Button>
            {data.photo && (
              <Button type="button" variant="ghost" size="sm" onClick={() => update("photo", "")}>
                Remove
              </Button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full Name *" value={data.fullName} onChange={(v) => update("fullName", v)} />
          <Field label="Job Title" value={data.title} onChange={(v) => update("title", v)} />
          <Field label="Email *" type="email" value={data.email} onChange={(v) => update("email", v)} />
          <Field label="Phone" value={data.phone} onChange={(v) => update("phone", v)} />
          <Field label="Address" value={data.address} onChange={(v) => update("address", v)} />
          <Field label="Status" value={data.status} onChange={(v) => update("status", v)} />
          <Field label="Age" value={data.age} onChange={(v) => update("age", v)} />
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Objective</h3>
        <Textarea rows={4} value={data.objective} onChange={(e) => update("objective", e.target.value)} />
      </Card>

      <Card className="p-5 space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Skills</h3>
        <Textarea
          rows={2}
          placeholder="Comma-separated"
          value={data.skills.join(", ")}
          onChange={(e) => update("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
        />
      </Card>

      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Experience</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              update("experience", [
                ...data.experience,
                { id: crypto.randomUUID(), role: "", company: "", period: "", description: "" },
              ])
            }
          >
            <Plus className="size-4 mr-1" /> Add
          </Button>
        </div>
        {data.experience.map((exp, i) => (
          <div key={exp.id} className="border rounded-lg p-3 space-y-2 bg-muted">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Role" value={exp.role} onChange={(v) => {
                const next = [...data.experience]; next[i] = { ...exp, role: v }; update("experience", next);
              }} />
              <Field label="Company" value={exp.company} onChange={(v) => {
                const next = [...data.experience]; next[i] = { ...exp, company: v }; update("experience", next);
              }} />
              <Field label="Period" value={exp.period} onChange={(v) => {
                const next = [...data.experience]; next[i] = { ...exp, period: v }; update("experience", next);
              }} />
            </div>
            <Textarea
              rows={2}
              placeholder="Description"
              value={exp.description}
              onChange={(e) => {
                const next = [...data.experience]; next[i] = { ...exp, description: e.target.value }; update("experience", next);
              }}
            />
            <Button size="sm" variant="ghost" onClick={() => update("experience", data.experience.filter((x) => x.id !== exp.id))}>
              <Trash2 className="size-4 mr-1" /> Remove
            </Button>
          </div>
        ))}
      </Card>

      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Education</h3>
          <Button size="sm" variant="outline" onClick={() => update("education", [...data.education, { id: crypto.randomUUID(), degree: "", school: "", period: "" }])}>
            <Plus className="size-4 mr-1" /> Add
          </Button>
        </div>
        {data.education.map((ed, i) => (
          <div key={ed.id} className="border rounded-lg p-3 space-y-2 bg-muted">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Degree" value={ed.degree} onChange={(v) => { const n = [...data.education]; n[i] = { ...ed, degree: v }; update("education", n); }} />
              <Field label="School" value={ed.school} onChange={(v) => { const n = [...data.education]; n[i] = { ...ed, school: v }; update("education", n); }} />
              <Field label="Period" value={ed.period} onChange={(v) => { const n = [...data.education]; n[i] = { ...ed, period: v }; update("education", n); }} />
            </div>
            <Button size="sm" variant="ghost" onClick={() => update("education", data.education.filter((x) => x.id !== ed.id))}>
              <Trash2 className="size-4 mr-1" /> Remove
            </Button>
          </div>
        ))}
      </Card>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
