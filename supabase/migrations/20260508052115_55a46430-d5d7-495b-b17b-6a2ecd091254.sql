
CREATE TABLE public.resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  template_id TEXT NOT NULL DEFAULT 'modern',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX resumes_session_idx ON public.resumes(session_id);
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON public.resumes FOR SELECT USING (true);
CREATE POLICY "public insert" ON public.resumes FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON public.resumes FOR UPDATE USING (true);
CREATE POLICY "public delete" ON public.resumes FOR DELETE USING (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
CREATE POLICY "avatars public read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars public insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "avatars public update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');
CREATE POLICY "avatars public delete" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');
