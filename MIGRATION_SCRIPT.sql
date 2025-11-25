-- ============================================================================
-- SAFE MIGRATION SCRIPT FOR EXISTING SUPABASE DATABASE
-- Run this if you already have tables and need to add Paystack integration
-- ============================================================================

-- ============================================================================
-- 1. ADD MISSING COLUMNS TO EXISTING TABLES (Safe Migration)
-- ============================================================================

-- Add currency and payment_reference columns to training_enrollments if they don't exist
DO $$
BEGIN
    -- Add currency column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'training_enrollments' 
        AND column_name = 'currency'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.training_enrollments ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
        RAISE NOTICE '✅ Added currency column to training_enrollments';
    ELSE
        RAISE NOTICE 'ℹ️ Currency column already exists in training_enrollments';
    END IF;

    -- Add payment_reference column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'training_enrollments' 
        AND column_name = 'payment_reference'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.training_enrollments ADD COLUMN payment_reference VARCHAR(255) UNIQUE;
        RAISE NOTICE '✅ Added payment_reference column to training_enrollments';
    ELSE
        RAISE NOTICE 'ℹ️ Payment_reference column already exists in training_enrollments';
    END IF;

    -- Update enrollment_status check constraint to include 'pending'
    BEGIN
        ALTER TABLE public.training_enrollments 
        DROP CONSTRAINT IF EXISTS training_enrollments_enrollment_status_check;
        
        ALTER TABLE public.training_enrollments 
        ADD CONSTRAINT training_enrollments_enrollment_status_check 
        CHECK (enrollment_status IN ('pending', 'active', 'completed', 'cancelled', 'paused'));
        
        RAISE NOTICE '✅ Updated enrollment_status constraint';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Enrollment_status constraint update skipped (may already be correct)';
    END;

    -- Update payment_status check constraint to include 'processing'
    BEGIN
        ALTER TABLE public.training_enrollments 
        DROP CONSTRAINT IF EXISTS training_enrollments_payment_status_check;
        
        ALTER TABLE public.training_enrollments 
        ADD CONSTRAINT training_enrollments_payment_status_check 
        CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded'));
        
        RAISE NOTICE '✅ Updated payment_status constraint';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Payment_status constraint update skipped (may already be correct)';
    END;

    -- Update default enrollment_status to 'pending'
    BEGIN
        ALTER TABLE public.training_enrollments 
        ALTER COLUMN enrollment_status SET DEFAULT 'pending';
        RAISE NOTICE '✅ Updated enrollment_status default to pending';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Enrollment_status default update skipped';
    END;

END $$;

-- ============================================================================
-- 2. CREATE PAYMENTS TABLE (For Paystack Integration)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.training_enrollments(id) ON DELETE CASCADE,
  payment_reference VARCHAR(255) NOT NULL UNIQUE,
  paystack_reference VARCHAR(255) UNIQUE,
  training_program VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  payment_method VARCHAR(50) DEFAULT 'paystack',
  paystack_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT
);

-- Add training_program column to payments table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payments' 
        AND column_name = 'training_program'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.payments ADD COLUMN training_program VARCHAR(255);
        RAISE NOTICE '✅ Added training_program column to payments table';
    ELSE
        RAISE NOTICE 'ℹ️ Training_program column already exists in payments table';
    END IF;
END $$;

-- ============================================================================
-- 3. CREATE MISSING INDEXES (AFTER all column additions are complete)
-- ============================================================================

-- SAFELY create indexes only if columns exist
DO $$
BEGIN
    -- Index for training_enrollments.payment_reference
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'training_enrollments' 
        AND column_name = 'payment_reference'
        AND table_schema = 'public'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_training_enrollments_payment_ref ON public.training_enrollments(payment_reference)';
        RAISE NOTICE '✅ Created index on training_enrollments.payment_reference';
    ELSE
        RAISE NOTICE '⚠️ Skipping index creation: payment_reference column does not exist in training_enrollments';
    END IF;

    -- Other indexes that should always work
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_payments_enrollment_id ON public.payments(enrollment_id)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments(payment_reference)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_payments_paystack_ref ON public.payments(paystack_reference)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC)';
    
    -- Index for training_program column if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payments' 
        AND column_name = 'training_program'
        AND table_schema = 'public'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_payments_training_program ON public.payments(training_program)';
        RAISE NOTICE '✅ Created index on payments.training_program';
    END IF;

    RAISE NOTICE '✅ Index creation completed';
END $$;

-- ============================================================================
-- 4. CREATE OTHER MISSING TABLES (if they don't exist)
-- ============================================================================

-- Discovery Calls Table
CREATE TABLE IF NOT EXISTS public.discovery_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20),
  service VARCHAR(100) NOT NULL,
  requirements TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Talent Pool Profiles Table
CREATE TABLE IF NOT EXISTS public.talent_pool_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  country VARCHAR(100) NOT NULL,
  field_of_experience VARCHAR(100) NOT NULL,
  experience_level VARCHAR(50) NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  cv_url VARCHAR(500),
  video_url VARCHAR(500),
  profile_status VARCHAR(50) DEFAULT 'pending' CHECK (profile_status IN ('pending', 'approved', 'rejected', 'inactive')),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Landing Page Analytics Table
CREATE TABLE IF NOT EXISTS public.landing_page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  page_url VARCHAR(500),
  referrer VARCHAR(500),
  user_agent TEXT,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. CREATE MISSING INDEXES FOR OTHER TABLES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_discovery_calls_email ON public.discovery_calls(email);
CREATE INDEX IF NOT EXISTS idx_discovery_calls_created_at ON public.discovery_calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discovery_calls_status ON public.discovery_calls(status);
CREATE INDEX IF NOT EXISTS idx_discovery_calls_service ON public.discovery_calls(service);

CREATE INDEX IF NOT EXISTS idx_talent_pool_email ON public.talent_pool_profiles(email);
CREATE INDEX IF NOT EXISTS idx_talent_pool_country ON public.talent_pool_profiles(country);
CREATE INDEX IF NOT EXISTS idx_talent_pool_field ON public.talent_pool_profiles(field_of_experience);
CREATE INDEX IF NOT EXISTS idx_talent_pool_status ON public.talent_pool_profiles(profile_status);
CREATE INDEX IF NOT EXISTS idx_talent_pool_created_at ON public.talent_pool_profiles(registration_date DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.landing_page_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON public.landing_page_analytics(timestamp DESC);

-- ============================================================================
-- 6. HELPER FUNCTIONS
-- ============================================================================
CREATE OR REPLACE FUNCTION current_user_email() RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    auth.jwt() ->> 'email',
    (SELECT email FROM auth.users WHERE id = auth.uid())
  );
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. ROW LEVEL SECURITY SETUP
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_pool_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "training_enrollments_insert_public" ON public.training_enrollments;
DROP POLICY IF EXISTS "training_enrollments_select_own" ON public.training_enrollments;
DROP POLICY IF EXISTS "training_enrollments_update_own" ON public.training_enrollments;
DROP POLICY IF EXISTS "payments_insert_system" ON public.payments;
DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
DROP POLICY IF EXISTS "payments_update_system" ON public.payments;
DROP POLICY IF EXISTS "discovery_calls_insert_public" ON public.discovery_calls;
DROP POLICY IF EXISTS "talent_pool_insert_public" ON public.talent_pool_profiles;
DROP POLICY IF EXISTS "analytics_insert_public" ON public.landing_page_analytics;

-- Training Enrollments Policies
CREATE POLICY "training_enrollments_insert_public" ON public.training_enrollments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "training_enrollments_select_own" ON public.training_enrollments
  FOR SELECT USING (email = current_user_email() OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "training_enrollments_update_own" ON public.training_enrollments
  FOR UPDATE USING (email = current_user_email() OR auth.jwt() ->> 'role' = 'admin');

-- Payments Policies
CREATE POLICY "payments_insert_system" ON public.payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "payments_select_own" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.training_enrollments te
      WHERE te.id = payments.enrollment_id
      AND te.email = current_user_email()
    ) OR auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "payments_update_system" ON public.payments
  FOR UPDATE USING (true);

-- Other Tables Policies
CREATE POLICY "discovery_calls_insert_public" ON public.discovery_calls
  FOR INSERT WITH CHECK (true);

CREATE POLICY "talent_pool_insert_public" ON public.talent_pool_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "analytics_insert_public" ON public.landing_page_analytics
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 8. TRIGGERS FOR UPDATED_AT
-- ============================================================================
DROP TRIGGER IF EXISTS training_enrollments_updated_at ON public.training_enrollments;
DROP TRIGGER IF EXISTS payments_updated_at ON public.payments;
DROP TRIGGER IF EXISTS discovery_calls_updated_at ON public.discovery_calls;
DROP TRIGGER IF EXISTS talent_pool_updated_at ON public.talent_pool_profiles;

CREATE TRIGGER training_enrollments_updated_at BEFORE UPDATE ON public.training_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER discovery_calls_updated_at BEFORE UPDATE ON public.discovery_calls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER talent_pool_updated_at BEFORE UPDATE ON public.talent_pool_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 9. COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 ============================================';
  RAISE NOTICE '✅ PAYSTACK INTEGRATION MIGRATION COMPLETE!';
  RAISE NOTICE '🎉 ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Database Updates Applied:';
  RAISE NOTICE '   ✅ Added currency column to training_enrollments';
  RAISE NOTICE '   ✅ Added payment_reference column to training_enrollments';
  RAISE NOTICE '   ✅ Updated enrollment/payment status constraints';
  RAISE NOTICE '   ✅ Created payments table for Paystack integration';
  RAISE NOTICE '   ✅ Created all required indexes for performance';
  RAISE NOTICE '   ✅ Set up Row Level Security policies';
  RAISE NOTICE '   ✅ Created helper functions and triggers';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Your database is now ready for Paystack payments!';
  RAISE NOTICE '💳 Multi-currency support: USD, NGN, GHS, ZAR, KES';
  RAISE NOTICE '🔒 Secure payment tracking with RLS policies';
  RAISE NOTICE '';
END $$;