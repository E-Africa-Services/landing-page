-- Migration: Add Paystack integration fields to training_enrollments table
-- Run this in your Supabase SQL editor

-- Add currency and payment_reference columns to training_enrollments
ALTER TABLE training_enrollments 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100) UNIQUE;

-- Create index on payment_reference for faster lookups
CREATE INDEX IF NOT EXISTS idx_training_enrollments_payment_reference 
ON training_enrollments(payment_reference);

-- Update existing records to have USD as default currency
UPDATE training_enrollments 
SET currency = 'USD' 
WHERE currency IS NULL;

-- Make currency column NOT NULL after setting defaults
ALTER TABLE training_enrollments 
ALTER COLUMN currency SET NOT NULL;

-- Add constraint to ensure currency is one of supported values
ALTER TABLE training_enrollments 
ADD CONSTRAINT check_currency_valid 
CHECK (currency IN ('USD', 'NGN', 'GHS', 'ZAR', 'KES'));

-- Add comment to the table
COMMENT ON TABLE training_enrollments IS 'Training enrollment records with Paystack payment integration';
COMMENT ON COLUMN training_enrollments.currency IS 'Payment currency (USD, NGN, GHS, ZAR, KES)';
COMMENT ON COLUMN training_enrollments.payment_reference IS 'Unique payment reference for Paystack transactions';