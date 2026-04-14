-- ============================================
-- AG DEALER CONNECT — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- PROFILES TABLE (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  type text not null check (type in ('seller', 'dealer', 'admin')),
  name text not null,
  phone text,
  address text,
  notes text,
  avatar_url text,
  -- dealer-only fields
  business_name text,
  dealer_number text,
  store_location text,
  dealer_status text check (dealer_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- SUBMISSIONS TABLE
create table public.submissions (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  description text,
  price text,
  image_url text,
  image_public_id text,
  is_new boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.submissions enable row level security;

-- PROFILES POLICIES
-- Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Dealers (approved) can view all seller profiles
create policy "Approved dealers can view seller profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.type in ('dealer', 'admin')
      and (p.dealer_status = 'approved' or p.type = 'admin')
    )
  );

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Allow insert on signup
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Admin can do everything
create policy "Admin full access to profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.type = 'admin'
    )
  );

-- SUBMISSIONS POLICIES
-- Sellers can only see their own submissions
create policy "Sellers can view own submissions"
  on public.submissions for select
  using (seller_id = auth.uid());

-- Sellers can insert their own submissions
create policy "Sellers can insert submissions"
  on public.submissions for insert
  with check (seller_id = auth.uid());

-- Sellers can update their own submissions
create policy "Sellers can update own submissions"
  on public.submissions for update
  using (seller_id = auth.uid());

-- Sellers can delete their own submissions
create policy "Sellers can delete own submissions"
  on public.submissions for delete
  using (seller_id = auth.uid());

-- Approved dealers can view all submissions
create policy "Approved dealers can view all submissions"
  on public.submissions for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.type in ('dealer', 'admin')
      and (p.dealer_status = 'approved' or p.type = 'admin')
    )
  );

-- Admin full access to submissions
create policy "Admin full access to submissions"
  on public.submissions for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.type = 'admin'
    )
  );

-- ============================================
-- ADMIN USER SETUP
-- After running this schema, create your admin
-- user through Supabase Auth dashboard, then run:
-- ============================================

-- insert into public.profiles (id, type, name)
-- values ('<your-admin-user-uuid>', 'admin', 'Admin');
