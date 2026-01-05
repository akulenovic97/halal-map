-- Halal Map Venues Table Schema
-- Migration: create_venues_table
-- Created: 2026-01-05

-- Create venues table
CREATE TABLE IF NOT EXISTS public.venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,

  -- Basic Information
  name text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,

  -- Geospatial Data
  lat double precision NOT NULL,
  lng double precision NOT NULL,

  -- Classification
  halal_status text NOT NULL CHECK (halal_status IN ('fully-halal', 'partially-halal', 'halal-friendly')),
  venue_type text NOT NULL CHECK (venue_type IN ('restaurant', 'cafe', 'bakery')),
  alcohol_policy text NOT NULL CHECK (alcohol_policy IN ('none', 'non-alcoholic-available')),

  -- Details
  cuisine text[] NOT NULL,
  price_range smallint NOT NULL CHECK (price_range >= 1 AND price_range <= 3),

  -- External Links
  website text,
  instagram text,
  google_maps_url text,
  yelp_url text,

  -- Media
  photos text[],

  -- Constraints
  CONSTRAINT venues_name_key UNIQUE (name)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_venues_halal_status ON public.venues(halal_status);
CREATE INDEX IF NOT EXISTS idx_venues_venue_type ON public.venues(venue_type);
CREATE INDEX IF NOT EXISTS idx_venues_alcohol_policy ON public.venues(alcohol_policy);
CREATE INDEX IF NOT EXISTS idx_venues_lat_lng ON public.venues(lat, lng);

-- Enable Row Level Security (RLS)
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (no authentication required for MVP)
DROP POLICY IF EXISTS "Public venues are viewable by everyone" ON public.venues;
CREATE POLICY "Public venues are viewable by everyone"
  ON public.venues
  FOR SELECT
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_venues_updated_at ON public.venues;
CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON public.venues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert seed data (3 initial NYC venues)
INSERT INTO public.venues (
  name, lat, lng, halal_status, venue_type, alcohol_policy,
  cuisine, price_range, address, website, instagram, google_maps_url,
  yelp_url, photos, description
)
VALUES
  -- The Halal Guys
  (
    'The Halal Guys',
    40.7614,
    -73.9776,
    'fully-halal',
    'restaurant',
    'none',
    ARRAY['Middle Eastern', 'American'],
    1,
    '307 W 53rd St, New York, NY 10019',
    'https://thehalalguys.com',
    'https://instagram.com/thehalalguys',
    'https://maps.google.com/?q=The+Halal+Guys+NYC',
    'https://www.yelp.com/biz/the-halal-guys-new-york',
    ARRAY['https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800'],
    'Famous NYC halal cart serving delicious chicken and gyro platters with signature white and hot sauce. A must-try New York experience.'
  ),

  -- Qahwah House
  (
    'Qahwah House',
    40.7282,
    -73.9942,
    'halal-friendly',
    'cafe',
    'none',
    ARRAY['Yemeni', 'Coffee', 'Middle Eastern'],
    2,
    '176 Orchard St, New York, NY 10002',
    'https://qahwahhouse.com',
    'https://instagram.com/qahwahhouse',
    'https://maps.google.com/?q=Qahwah+House+NYC',
    'https://www.yelp.com/biz/qahwah-house-new-york',
    ARRAY['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'],
    'Authentic Yemeni coffee house serving traditional coffee, tea, and pastries. Beautiful ambiance with Middle Eastern decor and no alcohol served.'
  ),

  -- Nur
  (
    'Nur',
    40.7252,
    -73.9874,
    'partially-halal',
    'restaurant',
    'non-alcoholic-available',
    ARRAY['Middle Eastern', 'Mediterranean', 'Israeli'],
    3,
    '34 E 20th St, New York, NY 10003',
    'https://nurnyc.com',
    'https://instagram.com/nurnyc',
    'https://maps.google.com/?q=Nur+Restaurant+NYC',
    'https://www.yelp.com/biz/nur-new-york',
    ARRAY['https://images.unsplash.com/photo-1544025162-d76694265947?w=800'],
    'Upscale Middle Eastern restaurant with select halal options. Features innovative Israeli cuisine with beautiful plating. Offers creative non-alcoholic beverages alongside their regular menu.'
  )
ON CONFLICT (name) DO NOTHING;
