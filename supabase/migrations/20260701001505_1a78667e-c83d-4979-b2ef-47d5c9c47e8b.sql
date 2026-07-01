
-- Recreate missing trigger so new signups get profile rows
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for existing users missing them
INSERT INTO public.profiles (user_id, full_name, account_type)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'full_name', ''),
       CASE WHEN COALESCE(u.raw_user_meta_data->>'account_type','intern') = 'admin'
            THEN 'intern'
            ELSE COALESCE(u.raw_user_meta_data->>'account_type','intern') END
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL;

-- Backfill intern_profiles
INSERT INTO public.intern_profiles (user_id, first_name, last_name, date_of_birth)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'first_name',''),
       COALESCE(u.raw_user_meta_data->>'last_name',''),
       NULLIF(u.raw_user_meta_data->>'date_of_birth','')::date
FROM auth.users u
LEFT JOIN public.intern_profiles ip ON ip.user_id = u.id
WHERE ip.user_id IS NULL
  AND COALESCE(u.raw_user_meta_data->>'account_type','intern') = 'intern';

-- Backfill business_profiles
INSERT INTO public.business_profiles (user_id, business_name, contact_name, business_email, business_type)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'business_name',''),
       COALESCE(u.raw_user_meta_data->>'contact_name',''),
       u.email,
       COALESCE(u.raw_user_meta_data->>'business_type','')
FROM auth.users u
LEFT JOIN public.business_profiles bp ON bp.user_id = u.id
WHERE bp.user_id IS NULL
  AND u.raw_user_meta_data->>'account_type' = 'business';
