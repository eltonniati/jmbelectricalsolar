-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  stock_quantity INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create completed_jobs table for the photo gallery
CREATE TABLE public.completed_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for products (customers need to see products)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (is_active = true);

-- Public read access for completed jobs (for gallery display)
CREATE POLICY "Completed jobs are viewable by everyone" 
ON public.completed_jobs 
FOR SELECT 
USING (is_active = true);

-- Anyone can submit contact form
CREATE POLICY "Anyone can create contact submissions" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for products timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, price, image, stock_quantity) VALUES
('550W Mono Solar Panel', 'High-efficiency monocrystalline solar panel for residential and commercial use.', 2899.99, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop', 25),
('5kW Hybrid Inverter', 'Hybrid solar inverter with battery backup support and WiFi monitoring.', 18999.99, 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=300&fit=crop', 12),
('10kWh Lithium Battery', 'Long-lasting lithium-ion battery for solar energy storage.', 45999.99, 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=300&fit=crop', 8),
('Solar Panel Mounting Kit', 'Complete roof mounting system for 4-6 solar panels with all hardware.', 1499.99, 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=400&h=300&fit=crop', 30),
('3kW Inverter', 'Pure sine wave inverter ideal for small homes and backup power.', 8999.99, 'https://images.unsplash.com/photo-1597079910443-60c43fc25754?w=400&h=300&fit=crop', 15),
('Solar Cable Kit (50m)', 'UV-resistant solar cables with MC4 connectors for panel connections.', 899.99, 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=300&fit=crop', 50);

-- Insert sample completed jobs
INSERT INTO public.completed_jobs (title, location, image, sort_order) VALUES
('Solar Installation - Residential', 'Johannesburg, Gauteng', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop', 1),
('Commercial Solar System', 'Pretoria, Gauteng', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&h=600&fit=crop', 2),
('Inverter & Battery Setup', 'Centurion, Gauteng', 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop', 3),
('Rooftop Solar Panels', 'Sandton, Gauteng', 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800&h=600&fit=crop', 4),
('Energy Storage System', 'Midrand, Gauteng', 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800&h=600&fit=crop', 5),
('Complete Solar Solution', 'Soweto, Gauteng', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop', 6);