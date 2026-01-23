-- Create settings table for configurable values like email
CREATE TABLE public.settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (for displaying email on website)
CREATE POLICY "Settings are viewable by everyone"
ON public.settings
FOR SELECT
USING (true);

-- Settings can be updated (admin will manage this)
CREATE POLICY "Settings can be updated"
ON public.settings
FOR UPDATE
USING (true);

-- Settings can be inserted
CREATE POLICY "Settings can be inserted"
ON public.settings
FOR INSERT
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default email setting
INSERT INTO public.settings (key, value) VALUES ('contact_email', 'info@jmbcontractors.co.za');