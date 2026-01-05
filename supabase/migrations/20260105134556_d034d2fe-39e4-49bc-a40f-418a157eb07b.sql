-- Create storage bucket for images (jpg/png only)
INSERT INTO storage.buckets (id, name, public, allowed_mime_types)
VALUES ('images', 'images', true, ARRAY['image/jpeg', 'image/png']);

-- Create storage policies for public read access
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Create policy for admin upload (anyone can upload for now since there's no auth)
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Create policy for admin delete
CREATE POLICY "Anyone can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can create orders (customer checkout)
CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
WITH CHECK (true);

-- Orders are viewable (for admin - since no auth, we'll rely on app-level admin check)
CREATE POLICY "Orders are viewable"
ON public.orders FOR SELECT
USING (true);

-- Orders can be updated (admin status updates)
CREATE POLICY "Orders can be updated"
ON public.orders FOR UPDATE
USING (true);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Anyone can create order items
CREATE POLICY "Anyone can create order items"
ON public.order_items FOR INSERT
WITH CHECK (true);

-- Order items are viewable
CREATE POLICY "Order items are viewable"
ON public.order_items FOR SELECT
USING (true);

-- Create trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update products RLS to allow admin operations
CREATE POLICY "Products can be inserted"
ON public.products FOR INSERT
WITH CHECK (true);

CREATE POLICY "Products can be updated"
ON public.products FOR UPDATE
USING (true);

CREATE POLICY "Products can be deleted"
ON public.products FOR DELETE
USING (true);

-- Update completed_jobs RLS to allow admin operations
CREATE POLICY "Completed jobs can be inserted"
ON public.completed_jobs FOR INSERT
WITH CHECK (true);

CREATE POLICY "Completed jobs can be updated"
ON public.completed_jobs FOR UPDATE
USING (true);

CREATE POLICY "Completed jobs can be deleted"
ON public.completed_jobs FOR DELETE
USING (true);