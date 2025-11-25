-- Migration: Enhance payments table for better Paystack integration
-- Run this in your Supabase SQL editor

-- Update payments table structure if needed
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS paystack_authorization_code VARCHAR(100),
ADD COLUMN IF NOT EXISTS paystack_access_code VARCHAR(100),
ADD COLUMN IF NOT EXISTS payment_gateway VARCHAR(20) DEFAULT 'paystack',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS fees_paid DECIMAL(10,2) DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_paystack_reference 
ON payments(paystack_reference);

CREATE INDEX IF NOT EXISTS idx_payments_enrollment_id 
ON payments(enrollment_id);

CREATE INDEX IF NOT EXISTS idx_payments_status_created 
ON payments(payment_status, created_at);

-- Add constraint for payment_gateway
ALTER TABLE payments 
ADD CONSTRAINT check_payment_gateway_valid 
CHECK (payment_gateway IN ('paystack', 'stripe', 'flutterwave'));

-- Add constraint for currency
ALTER TABLE payments 
ADD CONSTRAINT check_payment_currency_valid 
CHECK (currency IN ('USD', 'NGN', 'GHS', 'ZAR', 'KES'));

-- Update existing records
UPDATE payments 
SET payment_gateway = 'paystack' 
WHERE payment_gateway IS NULL;

-- Make payment_gateway NOT NULL
ALTER TABLE payments 
ALTER COLUMN payment_gateway SET NOT NULL;

-- Add comments
COMMENT ON TABLE payments IS 'Payment records for training enrollments and services';
COMMENT ON COLUMN payments.paystack_authorization_code IS 'Paystack authorization code for recurring payments';
COMMENT ON COLUMN payments.paystack_access_code IS 'Paystack access code for payment initialization';
COMMENT ON COLUMN payments.metadata IS 'Additional payment metadata (JSON format)';
COMMENT ON COLUMN payments.fees_paid IS 'Transaction fees paid to payment gateway';