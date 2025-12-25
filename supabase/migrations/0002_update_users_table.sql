-- Update users table to work with Supabase Auth
-- Drop the old users table structure and create a new one linked to auth.users

-- First, drop the old table if it exists (or alter it)
drop table if exists public.users cascade;

-- Create new users table linked to auth.users
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.users enable row level security;

-- Create policy: Users can read all profiles
create policy "Users can view all profiles"
  on public.users for select
  using (true);

-- Create policy: Users can update their own profile
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Create policy: Service role can insert (for trigger)
create policy "Service role can insert users"
  on public.users for insert
  with check (true);

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically create user record when auth user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

