-- Add email, first_name, and last_name fields to users table
alter table public.users
  add column if not exists email text,
  add column if not exists first_name text,
  add column if not exists last_name text;

-- Update existing users to set email from auth.users
update public.users
set email = (
  select email
  from auth.users
  where auth.users.id = public.users.id
)
where email is null;

-- Update the trigger function to include email, first_name, and last_name
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username, email, first_name, last_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

