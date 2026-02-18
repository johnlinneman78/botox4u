-- Create provider_pricing table to store city-level pricing data
create table if not exists public.provider_pricing (
  id uuid default gen_random_uuid() primary key,
  city text not null,
  state text not null, -- Two-letter state code e.g. 'NY', 'CA'
  toxin text not null check (toxin in ('botox', 'dysport', 'xeomin', 'jeuveau', 'daxxify')),
  tier text not null check (tier in ('budget', 'mid', 'premium')),
  price_per_unit numeric not null,
  currency text default 'USD',
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  source_count integer default 0, -- Number of providers this average is based on
  
  -- Unique constraint to prevent duplicate entries for the same city/toxin/tier combo
  unique(city, state, toxin, tier)
);

-- Enable RLS
alter table public.provider_pricing enable row level security;

-- Policy: Everyone can read pricing data
create policy "Pricing data is public"
  on public.provider_pricing for select
  using (true);

-- Policy: Only service role can insert/update (for backend scripts)
create policy "Service role can manage pricing"
  on public.provider_pricing for all
  using (auth.role() = 'service_role');

-- Create an index for faster lookups by city
create index provider_pricing_city_idx on public.provider_pricing (city);

-- Comment on table
comment on table public.provider_pricing is 'Aggregated pricing data for neurotoxins by city and tier';
