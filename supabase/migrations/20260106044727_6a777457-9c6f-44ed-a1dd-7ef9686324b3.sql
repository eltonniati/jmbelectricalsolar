-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit feedback
CREATE POLICY "Anyone can submit feedback"
ON public.feedback
FOR INSERT
WITH CHECK (true);

-- Allow viewing feedback (for admin)
CREATE POLICY "Feedback is viewable"
ON public.feedback
FOR SELECT
USING (true);