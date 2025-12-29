-- Add user tracking and profile fields to users table
alter table public.users
  add column if not exists mobile text,
  add column if not exists dob date,
  add column if not exists kyc_verified boolean not null default false,
  add column if not exists last_signed_in timestamptz,
  add column if not exists total_time_on_site bigint not null default 0,
  add column if not exists number_of_sessions integer not null default 0,
  add column if not exists time_of_last_entry_into_contest timestamptz,
  add column if not exists number_of_contests_entered integer not null default 0,
  add column if not exists number_of_contests_won integer not null default 0,
  add column if not exists total_amount_spent numeric(10, 2) not null default 0;

