-- Halal Map Venues Table Schema
-- Execute this in Supabase SQL Editor: https://app.supabase.com/project/_/sql

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

  -- Indexes for performance
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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_venues_updated_at ON public.venues;
CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON public.venues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
