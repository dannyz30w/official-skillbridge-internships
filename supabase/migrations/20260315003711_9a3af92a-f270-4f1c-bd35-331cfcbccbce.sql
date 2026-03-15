
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  failed_count integer NOT NULL DEFAULT 0,
  locked_until timestamp with time zone,
  last_attempt timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS login_attempts_email_idx ON public.login_attempts (email);

ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read login_attempts" ON public.login_attempts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert login_attempts" ON public.login_attempts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update login_attempts" ON public.login_attempts FOR UPDATE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings (status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings (created_at);
CREATE INDEX IF NOT EXISTS idx_listings_business_id ON public.listings (business_id);
CREATE INDEX IF NOT EXISTS idx_listing_applications_intern_id ON public.listing_applications (intern_id);
CREATE INDEX IF NOT EXISTS idx_listing_applications_listing_id ON public.listing_applications (listing_id);

ALTER TABLE public.listings DROP COLUMN IF EXISTS age_requirement;
