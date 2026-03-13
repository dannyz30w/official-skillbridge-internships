
-- Fix: drop the check constraint that blocks 'admin' value
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_account_type_check;

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = _user_id AND account_type = 'admin') $$;

CREATE OR REPLACE FUNCTION public.is_business(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = _user_id AND account_type = 'business') $$;

CREATE OR REPLACE FUNCTION public.is_intern(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = _user_id AND account_type = 'intern') $$;

-- Tables
CREATE TABLE IF NOT EXISTS public.intern_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  first_name text NOT NULL DEFAULT '', last_name text NOT NULL DEFAULT '',
  date_of_birth date, city text DEFAULT '', school text DEFAULT '',
  gpa numeric(3,1), test_scores text DEFAULT '', phone text DEFAULT '',
  languages jsonb DEFAULT '[]'::jsonb, skills text[] DEFAULT '{}',
  bio text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_name text NOT NULL DEFAULT '', contact_name text NOT NULL DEFAULT '',
  business_email text DEFAULT '', business_type text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL, description text NOT NULL DEFAULT '', category text DEFAULT '',
  work_setting text NOT NULL DEFAULT 'In-Person', location text DEFAULT '',
  preferred_hours text DEFAULT '', pay_rate text NOT NULL DEFAULT '',
  hours_per_week text DEFAULT '', duration text DEFAULT '', age_requirement text DEFAULT '',
  preferred_languages text[] DEFAULT '{}', skills_learned text[] DEFAULT '{}',
  requirements text[] DEFAULT '{}', start_date date,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.listing_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  applied_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(intern_id, listing_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  intern_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  content text NOT NULL, read boolean NOT NULL DEFAULT false,
  sent_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.intern_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- intern_profiles RLS
CREATE POLICY "ip_own_select" ON public.intern_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "ip_admin_select" ON public.intern_profiles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "ip_business_select" ON public.intern_profiles FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.listing_applications la JOIN public.listings l ON l.id = la.listing_id WHERE la.intern_id = intern_profiles.user_id AND l.business_id = auth.uid()));
CREATE POLICY "ip_own_insert" ON public.intern_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ip_own_update" ON public.intern_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "ip_admin_delete" ON public.intern_profiles FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- business_profiles RLS
CREATE POLICY "bp_public_select" ON public.business_profiles FOR SELECT USING (true);
CREATE POLICY "bp_own_insert" ON public.business_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bp_own_update" ON public.business_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "bp_admin_delete" ON public.business_profiles FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- listings RLS
CREATE POLICY "l_public_live" ON public.listings FOR SELECT USING (status = 'live');
CREATE POLICY "l_own_select" ON public.listings FOR SELECT TO authenticated USING (auth.uid() = business_id);
CREATE POLICY "l_admin_select" ON public.listings FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "l_business_insert" ON public.listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = business_id AND public.is_business(auth.uid()));
CREATE POLICY "l_own_update" ON public.listings FOR UPDATE TO authenticated USING (auth.uid() = business_id);
CREATE POLICY "l_admin_update" ON public.listings FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "l_own_delete" ON public.listings FOR DELETE TO authenticated USING (auth.uid() = business_id);

-- listing_applications RLS
CREATE POLICY "la_intern_select" ON public.listing_applications FOR SELECT TO authenticated USING (auth.uid() = intern_id);
CREATE POLICY "la_intern_insert" ON public.listing_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = intern_id);
CREATE POLICY "la_business_select" ON public.listing_applications FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.listings WHERE listings.id = listing_applications.listing_id AND listings.business_id = auth.uid()));
CREATE POLICY "la_business_update" ON public.listing_applications FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.listings WHERE listings.id = listing_applications.listing_id AND listings.business_id = auth.uid()));
CREATE POLICY "la_admin_select" ON public.listing_applications FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- messages RLS
CREATE POLICY "m_business_insert" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = business_id);
CREATE POLICY "m_intern_select" ON public.messages FOR SELECT TO authenticated USING (auth.uid() = intern_id);
CREATE POLICY "m_business_select" ON public.messages FOR SELECT TO authenticated USING (auth.uid() = business_id);
CREATE POLICY "m_intern_update_read" ON public.messages FOR UPDATE TO authenticated USING (auth.uid() = intern_id);

-- Update profiles RLS
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "p_own_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND account_type != 'admin');
CREATE POLICY "p_own_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND (account_type != 'admin' OR public.is_admin(auth.uid())));
CREATE POLICY "p_admin_delete" ON public.profiles FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- Update handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE _type text;
BEGIN
  _type := COALESCE(NEW.raw_user_meta_data->>'account_type', 'intern');
  IF _type = 'admin' THEN _type := 'intern'; END IF;
  INSERT INTO public.profiles (user_id, full_name, account_type) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), _type);
  IF _type = 'intern' THEN
    INSERT INTO public.intern_profiles (user_id, first_name, last_name, date_of_birth) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'first_name', ''), COALESCE(NEW.raw_user_meta_data->>'last_name', ''), NULLIF(NEW.raw_user_meta_data->>'date_of_birth', '')::date);
  ELSIF _type = 'business' THEN
    INSERT INTO public.business_profiles (user_id, business_name, contact_name, business_email, business_type) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'business_name', ''), COALESCE(NEW.raw_user_meta_data->>'contact_name', ''), NEW.email, COALESCE(NEW.raw_user_meta_data->>'business_type', ''));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE TRIGGER update_ip_updated_at BEFORE UPDATE ON public.intern_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bp_updated_at BEFORE UPDATE ON public.business_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_l_updated_at BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Weekly application limit
CREATE OR REPLACE FUNCTION public.enforce_weekly_limit()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.listing_applications WHERE intern_id = NEW.intern_id AND applied_at >= now() - interval '7 days') >= 5 THEN
    RAISE EXCEPTION 'Weekly application limit reached';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER enforce_weekly_app_limit BEFORE INSERT ON public.listing_applications FOR EACH ROW EXECUTE FUNCTION public.enforce_weekly_limit();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.listing_applications;

-- Seed admin
DO $$
DECLARE _admin_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE account_type = 'admin') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data, raw_app_meta_data, aud, role)
    VALUES (_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@skillbridge.app', crypt('arnobanddanny', gen_salt('bf')), now(), now(), now(), '{"full_name":"Admin"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb, 'authenticated', 'authenticated');
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at, last_sign_in_at)
    VALUES (gen_random_uuid(), _admin_id, jsonb_build_object('sub', _admin_id::text, 'email', 'admin@skillbridge.app'), 'email', _admin_id::text, now(), now(), now());
    UPDATE public.profiles SET account_type = 'admin' WHERE user_id = _admin_id;
    DELETE FROM public.intern_profiles WHERE user_id = _admin_id;
  END IF;
END;
$$;
