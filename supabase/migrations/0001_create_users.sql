-- Users table for Clanger app
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- Sample user for local testing (public.users)
-- Password hash here is a placeholder; in a real setup you should
-- either let Supabase Auth manage users or hash using your auth strategy.
insert into public.users (email, password_hash)
values ('demo@clanger.app', 'SAMPLE_HASH_REPLACE_ME')
on conflict (email) do nothing;
