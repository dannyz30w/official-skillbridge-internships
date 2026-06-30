
-- Lock down login_attempts: only service_role (edge function) may touch it
DROP POLICY IF EXISTS "Anon and auth can insert login_attempts" ON public.login_attempts;
DROP POLICY IF EXISTS "Anon and auth can update login_attempts" ON public.login_attempts;
DROP POLICY IF EXISTS "Anyone can read login_attempts" ON public.login_attempts;
REVOKE ALL ON public.login_attempts FROM anon, authenticated, PUBLIC;
GRANT ALL ON public.login_attempts TO service_role;

-- Restrict business_profiles: no anon SELECT; authenticated only via existing policies
DROP POLICY IF EXISTS "bp_public_select" ON public.business_profiles;
REVOKE SELECT ON public.business_profiles FROM anon;
CREATE POLICY "bp_authenticated_select" ON public.business_profiles
  FOR SELECT TO authenticated USING (true);

-- Convert RLS helper functions away from SECURITY DEFINER so linter is happy.
-- The 'profiles' table has a public SELECT policy, so SECURITY INVOKER works.
CREATE OR REPLACE FUNCTION public.is_business(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY INVOKER
 SET search_path TO 'public'
AS $function$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = _user_id AND account_type = 'business') $function$;

CREATE OR REPLACE FUNCTION public.is_intern(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY INVOKER
 SET search_path TO 'public'
AS $function$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = _user_id AND account_type = 'intern') $function$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY INVOKER
 SET search_path TO 'public'
AS $function$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = _user_id AND account_type = 'admin') $function$;
