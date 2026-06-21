-- Supabase Database Schema for Roomora (Rutgers Roommate Matching)
-- Includes Profiles, Swipes, Matches, and Messages, with an automatic matching trigger and RLS Policies.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

----------------------------------------------------
-- 1. TABLES DEFINITIONS
----------------------------------------------------

-- Profiles Table (holds roommate profile data)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  age integer check (age >= 16),
  university text not null default 'Rutgers University',
  pronouns text,
  country text,
  major text,
  bio text check (char_length(bio) <= 500),
  interests text[] default '{}',
  sleep text check (sleep in ('early', 'balanced', 'late')),
  cleanliness text check (cleanliness in ('relaxed', 'moderate', 'very-clean')),
  study text check (study in ('quiet-room', 'library', 'social-study')),
  guests text check (guests in ('rarely', 'sometimes', 'often')),
  noise text check (noise in ('low', 'medium', 'high')),
  budget_min integer default 800,
  budget_max integer default 1200,
  housing text check (housing in ('dorm', 'apartment', 'either')),
  campus text check (campus in ('college-ave', 'busch', 'livingston', 'cook-douglass', 'any')),
  year text check (year in ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Transfer')),
  temperature_preference text default 'Flexible',
  willing_to_share boolean default false,
  cleanliness_score integer default 50 check (cleanliness_score >= 0 and cleanliness_score <= 100),
  noise_tolerance_score integer default 50 check (noise_tolerance_score >= 0 and noise_tolerance_score <= 100),
  guests_frequency_score integer default 50 check (guests_frequency_score >= 0 and guests_frequency_score <= 100),
  avatar text default 'RS',
  looking_for text,
  is_complete boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Swipes Table (records user swipes: likes and passes)
create table if not exists public.swipes (
  swiper_id uuid references public.profiles(id) on delete cascade not null,
  target_id uuid references public.profiles(id) on delete cascade not null,
  decision text check (decision in ('like', 'pass')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (swiper_id, target_id),
  constraint no_self_swipe check (swiper_id <> target_id)
);

-- Matches Table (mutual likes are paired here)
create table if not exists public.matches (
  id uuid default gen_random_uuid() primary key,
  user_a uuid references public.profiles(id) on delete cascade not null,
  user_b uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_match_pair unique (user_a, user_b),
  constraint user_order_check check (user_a < user_b)
);

-- Messages Table (chat logs between matched users)
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  body text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

----------------------------------------------------
-- 2. AUTOMATIC MATCHING TRIGGER
----------------------------------------------------

-- Function to check for mutual like and create a match
create or replace function public.check_mutual_like()
returns trigger as $$
declare
  is_mutual boolean;
  first_user uuid;
  second_user uuid;
begin
  -- Only execute on 'like' swipe decisions
  if NEW.decision = 'like' then
    -- Check if the target user has already liked the swiper
    select exists (
      select 1 from public.swipes
      where swiper_id = NEW.target_id
        and target_id = NEW.swiper_id
        and decision = 'like'
    ) into is_mutual;

    -- If mutual, create a row in the matches table
    if is_mutual then
      -- Sort UUIDs to enforce the user_a < user_b check constraint
      if NEW.swiper_id < NEW.target_id then
        first_user := NEW.swiper_id;
        second_user := NEW.target_id;
      else
        first_user := NEW.target_id;
        second_user := NEW.swiper_id;
      end if;

      -- Insert into matches, ignore if already exists (safeguard)
      insert into public.matches (user_a, user_b)
      values (first_user, second_user)
      on conflict (user_a, user_b) do nothing;
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger to fire check_mutual_like on insert
create or replace trigger on_swipe_inserted
  after insert on public.swipes
  for each row execute function public.check_mutual_like();

----------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
----------------------------------------------------

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

-- profiles Policies:
-- 1. Read: Authenticated users can view completed profiles
create policy "Allow authenticated users to read profiles"
  on public.profiles for select
  to authenticated
  using (is_complete = true or id = auth.uid());

-- 2. Write: Users can manage (insert/update) their own profiles
create policy "Allow users to manage their own profile"
  on public.profiles for all
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- swipes Policies:
-- 1. Read: Users can view swipes they created
create policy "Allow users to read their own swipes"
  on public.swipes for select
  to authenticated
  using (swiper_id = auth.uid());

-- 2. Write: Users can record their own swipes
create policy "Allow users to create their own swipes"
  on public.swipes for insert
  to authenticated
  with check (swiper_id = auth.uid());

-- matches Policies:
-- 1. Read: Users can view matches they are a part of
create policy "Allow users to view their own matches"
  on public.matches for select
  to authenticated
  using (user_a = auth.uid() or user_b = auth.uid());

-- messages Policies:
-- 1. Read: Users can read messages in their match chats
create policy "Allow users to read messages in matches they are part of"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.matches
      where id = messages.match_id
        and (user_a = auth.uid() or user_b = auth.uid())
    )
  );

-- 2. Write: Users can send messages in their match chats
create policy "Allow users to insert messages in matches they are part of"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.matches
      where id = match_id
        and (user_a = auth.uid() or user_b = auth.uid())
    )
  );
