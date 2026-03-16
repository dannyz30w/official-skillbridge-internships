-- Add traits column to intern_profiles
ALTER TABLE public.intern_profiles ADD COLUMN IF NOT EXISTS traits text[] DEFAULT '{}'::text[];

-- Add database indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at);
CREATE INDEX IF NOT EXISTS idx_listings_business_id ON public.listings(business_id);
CREATE INDEX IF NOT EXISTS idx_listing_applications_intern_id ON public.listing_applications(intern_id);
CREATE INDEX IF NOT EXISTS idx_listing_applications_listing_id ON public.listing_applications(listing_id);
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON public.profiles(account_type);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON public.login_attempts(email);