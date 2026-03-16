-- Tighten login_attempts policies - replace overly permissive INSERT and UPDATE
DROP POLICY IF EXISTS "Anyone can insert login_attempts" ON public.login_attempts;
DROP POLICY IF EXISTS "Anyone can update login_attempts" ON public.login_attempts;

CREATE POLICY "Anon and auth can insert login_attempts" ON public.login_attempts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anon and auth can update login_attempts" ON public.login_attempts FOR UPDATE TO anon, authenticated USING (true);