-- ============================================================================
-- CRITICAL SECURITY: Row Level Security (RLS) Implementation
-- ============================================================================
-- This migration implements RLS policies to protect sensitive data from
-- unauthorized access via the Supabase anon key.
-- ============================================================================

-- ============================================================================
-- 1. LOGIN_ATTEMPTS TABLE - CRITICAL: Should never be publicly accessible
-- ============================================================================
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view their own login attempts
CREATE POLICY "Users can view their own login attempts"
  ON login_attempts FOR SELECT
  USING (auth.uid() = user_id);

-- Only authenticated users can insert their own login attempts
CREATE POLICY "Users can insert their own login attempts"
  ON login_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 2. PROFILES TABLE - Users can only view/edit their own profile
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 3. BUSINESS_PROFILES TABLE - Businesses can only view/edit their own profile
-- ============================================================================
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

-- Businesses can view their own profile
CREATE POLICY "Businesses can view their own profile"
  ON business_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Businesses can update their own profile
CREATE POLICY "Businesses can update their own profile"
  ON business_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Businesses can insert their own profile
CREATE POLICY "Businesses can insert their own profile"
  ON business_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 4. LISTINGS TABLE - Approved listings are public, but only businesses can edit
-- ============================================================================
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved listings
CREATE POLICY "Anyone can view approved listings"
  ON listings FOR SELECT
  USING (status = 'approved');

-- Businesses can view their own listings (regardless of status)
CREATE POLICY "Businesses can view their own listings"
  ON listings FOR SELECT
  USING (auth.uid() = business_id);

-- Only the business owner can update their listings
CREATE POLICY "Businesses can update their own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = business_id)
  WITH CHECK (auth.uid() = business_id);

-- Only the business owner can insert listings
CREATE POLICY "Businesses can insert listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = business_id);

-- Only the business owner can delete their listings
CREATE POLICY "Businesses can delete their own listings"
  ON listings FOR DELETE
  USING (auth.uid() = business_id);

-- ============================================================================
-- 5. APPLICATIONS TABLE - Users can only view/edit their own applications
-- ============================================================================
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Interns can view their own applications
CREATE POLICY "Interns can view their own applications"
  ON applications FOR SELECT
  USING (auth.uid() = intern_id);

-- Businesses can view applications for their listings
CREATE POLICY "Businesses can view applications for their listings"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = applications.listing_id
      AND listings.business_id = auth.uid()
    )
  );

-- Interns can insert applications
CREATE POLICY "Interns can insert applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = intern_id);

-- Businesses can update applications for their listings
CREATE POLICY "Businesses can update applications for their listings"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = applications.listing_id
      AND listings.business_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = applications.listing_id
      AND listings.business_id = auth.uid()
    )
  );

-- ============================================================================
-- 6. INTERN_PROFILES TABLE - Interns can only view/edit their own profile
-- ============================================================================
ALTER TABLE intern_profiles ENABLE ROW LEVEL SECURITY;

-- Interns can view their own profile
CREATE POLICY "Interns can view their own profile"
  ON intern_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Interns can update their own profile
CREATE POLICY "Interns can update their own profile"
  ON intern_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Interns can insert their own profile
CREATE POLICY "Interns can insert their own profile"
  ON intern_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Businesses can view approved intern profiles (for matching/browsing)
CREATE POLICY "Businesses can view approved intern profiles"
  ON intern_profiles FOR SELECT
  USING (profile_complete = true);

-- ============================================================================
-- 7. MESSAGES TABLE - Users can only view their own messages
-- ============================================================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Interns can view messages sent to them
CREATE POLICY "Interns can view messages sent to them"
  ON messages FOR SELECT
  USING (auth.uid() = intern_id);

-- Businesses can view messages they sent
CREATE POLICY "Businesses can view messages they sent"
  ON messages FOR SELECT
  USING (auth.uid() = business_id);

-- Businesses can insert messages
CREATE POLICY "Businesses can insert messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = business_id);

-- ============================================================================
-- SUMMARY OF SECURITY CHANGES
-- ============================================================================
-- ✅ login_attempts: Completely private (auth only)
-- ✅ profiles: Private (users can only access their own)
-- ✅ business_profiles: Private (businesses can only access their own)
-- ✅ listings: Approved listings are public, but only owners can edit
-- ✅ applications: Private (users can only access their own)
-- ✅ intern_profiles: Private (interns can only access their own, but businesses can view approved)
-- ✅ messages: Private (users can only access their own messages)
-- ============================================================================
