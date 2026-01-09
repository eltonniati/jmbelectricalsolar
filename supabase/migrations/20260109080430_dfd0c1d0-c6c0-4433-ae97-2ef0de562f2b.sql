-- Add email tracking columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP WITH TIME ZONE;