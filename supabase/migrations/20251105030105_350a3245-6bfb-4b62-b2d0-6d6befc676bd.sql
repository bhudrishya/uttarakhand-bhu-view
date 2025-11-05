-- Create enum for property types
CREATE TYPE public.property_type AS ENUM ('residential', 'commercial', 'agricultural', 'industrial');

-- Create enum for listing status
CREATE TYPE public.listing_status AS ENUM ('active', 'sold', 'inactive');

-- Create land_listings table
CREATE TABLE public.land_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  district TEXT NOT NULL,
  tehsil TEXT NOT NULL,
  village TEXT NOT NULL,
  property_type property_type NOT NULL,
  area NUMERIC NOT NULL CHECK (area > 0),
  area_unit TEXT NOT NULL DEFAULT 'sq_meters',
  expected_price NUMERIC NOT NULL CHECK (expected_price > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  description TEXT,
  status listing_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create land_listing_photos table
CREATE TABLE public.land_listing_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.land_listings(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for land listing photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('land-listings', 'land-listings', true);

-- Enable Row Level Security
ALTER TABLE public.land_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_listing_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for land_listings
CREATE POLICY "Anyone can view active listings" 
ON public.land_listings 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Authenticated users can create listings" 
ON public.land_listings 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" 
ON public.land_listings 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" 
ON public.land_listings 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for land_listing_photos
CREATE POLICY "Anyone can view photos of active listings" 
ON public.land_listing_photos 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.land_listings 
    WHERE id = listing_id AND status = 'active'
  )
);

CREATE POLICY "Users can insert photos for their listings" 
ON public.land_listing_photos 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.land_listings 
    WHERE id = listing_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete photos from their listings" 
ON public.land_listing_photos 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.land_listings 
    WHERE id = listing_id AND user_id = auth.uid()
  )
);

-- Storage policies for land-listings bucket
CREATE POLICY "Anyone can view land listing photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'land-listings');

CREATE POLICY "Authenticated users can upload land listing photos" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'land-listings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own land listing photos" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'land-listings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger for automatic timestamp updates on land_listings
CREATE TRIGGER update_land_listings_updated_at
BEFORE UPDATE ON public.land_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_land_listings_district ON public.land_listings(district);
CREATE INDEX idx_land_listings_tehsil ON public.land_listings(tehsil);
CREATE INDEX idx_land_listings_village ON public.land_listings(village);
CREATE INDEX idx_land_listings_property_type ON public.land_listings(property_type);
CREATE INDEX idx_land_listings_status ON public.land_listings(status);
CREATE INDEX idx_land_listings_price ON public.land_listings(expected_price);
CREATE INDEX idx_land_listings_area ON public.land_listings(area);
CREATE INDEX idx_land_listing_photos_listing_id ON public.land_listing_photos(listing_id);