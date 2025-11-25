-- ============================================================================
-- SAFE MINIMAL MIGRATION FOR PAYSTACK INTEGRATION
-- Run this if the main migration script fails
-- ============================================================================

-- ============================================================================
-- STEP 1: Add missing columns to training_enrollments
-- ============================================================================
DO $$
BEGIN
    -- Add currency column
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'training_enrollments' 
            AND column_name = 'currency'
            AND table_schema = 'public'
        ) THEN
            ALTER TABLE public.training_enrollments ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
            RAISE NOTICE 'SUCCESS: Added currency column to training_enrollments';
        ELSE
            RAISE NOTICE 'INFO: Currency column already exists in training_enrollments';
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ERROR adding currency column: %', SQLERRM;
    END;

    -- Add payment_reference column
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'training_enrollments' 
            AND column_name = 'payment_reference'
            AND table_schema = 'public'
        ) THEN
            ALTER TABLE public.training_enrollments ADD COLUMN payment_reference VARCHAR(255);
            RAISE NOTICE 'SUCCESS: Added payment_reference column to training_enrollments';
        ELSE
            RAISE NOTICE 'INFO: Payment_reference column already exists in training_enrollments';
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ERROR adding payment_reference column: %', SQLERRM;
    END;
END $$;

-- ============================================================================
-- STEP 2: Create payments table
-- ============================================================================
DO $$
BEGIN
    BEGIN
        CREATE TABLE IF NOT EXISTS public.payments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            enrollment_id UUID NOT NULL,
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
        RAISE NOTICE 'SUCCESS: Created payments table';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'INFO: Payments table likely already exists or ERROR: %', SQLERRM;
    END;
END $$;

-- ============================================================================
-- STEP 3: Add foreign key constraint safely
-- ============================================================================
DO $$
BEGIN
    BEGIN
        -- Add foreign key if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'payments_enrollment_id_fkey'
            AND table_name = 'payments'
            AND table_schema = 'public'
        ) THEN
            ALTER TABLE public.payments 
            ADD CONSTRAINT payments_enrollment_id_fkey 
            FOREIGN KEY (enrollment_id) REFERENCES public.training_enrollments(id) ON DELETE CASCADE;
            RAISE NOTICE 'SUCCESS: Added foreign key constraint';
        ELSE
            RAISE NOTICE 'INFO: Foreign key constraint already exists';
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ERROR adding foreign key: %', SQLERRM;
    END;
END $$;

-- ============================================================================
-- STEP 4: Create indexes safely
-- ============================================================================
DO $$
BEGIN
    -- Only create index if payment_reference column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'training_enrollments' 
        AND column_name = 'payment_reference'
        AND table_schema = 'public'
    ) THEN
        BEGIN
            EXECUTE 'CREATE INDEX IF NOT EXISTS idx_training_enrollments_payment_ref ON public.training_enrollments(payment_reference)';
            RAISE NOTICE 'SUCCESS: Created index on training_enrollments.payment_reference';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'ERROR creating training_enrollments index: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'WARNING: Cannot create index - payment_reference column does not exist';
    END IF;

    -- Create other indexes
    BEGIN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_payments_enrollment_id ON public.payments(enrollment_id)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments(payment_reference)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status)';
        RAISE NOTICE 'SUCCESS: Created payment table indexes';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ERROR creating payment indexes: %', SQLERRM;
    END;
END $$;

-- ============================================================================
-- STEP 5: Enable RLS
-- ============================================================================
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'SUCCESS: Enabled Row Level Security';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'INFO: RLS likely already enabled or ERROR: %', SQLERRM;
    END;
END $$;

-- ============================================================================
-- FINAL STATUS CHECK
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ============================================';
    RAISE NOTICE '✅ MINIMAL MIGRATION COMPLETE!';
    RAISE NOTICE '🎉 ============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Check the messages above for any errors.';
    RAISE NOTICE 'If you see "SUCCESS" messages, the migration worked!';
    RAISE NOTICE '';
END $$;