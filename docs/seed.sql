-- Halal Map Initial Data Migration
-- Execute this in Supabase SQL Editor after running schema.sql
-- This seeds the database with the 3 initial mock venues

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

-- Verify data insertion
SELECT id, name, halal_status, venue_type FROM public.venues ORDER BY name;
