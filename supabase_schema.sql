-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  email text,
  role text default 'member' check (role in ('admin', 'trainer', 'member')),
  phone text,
  specialization text,
  membership_plan text check (membership_plan in ('basic', 'pro', 'elite')),
  membership_expiry timestamptz,
  assigned_trainer uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- 2. Workouts table
create table if not exists public.workouts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  muscle_group text,
  difficulty text default 'beginner',
  sets int default 3,
  reps text,
  rest_time text,
  gif_url text,
  video_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- 3. Workout Plans table
create table if not exists public.workout_plans (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  member_id uuid references public.profiles(id),
  assigned_by uuid references public.profiles(id),
  workouts jsonb default '[]',
  notes text,
  created_at timestamptz default now()
);

-- 4. Diet Plans table
create table if not exists public.diet_plans (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  member_id uuid references public.profiles(id),
  assigned_by uuid references public.profiles(id),
  meals jsonb default '[]',
  total_calories int default 0,
  notes text,
  created_at timestamptz default now()
);

-- 5. Payments table
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  amount numeric not null,
  plan text,
  duration int default 1,
  status text default 'paid',
  receipt_id text,
  notes text,
  payment_date timestamptz default now(),
  created_at timestamptz default now()
);

-- 6. Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_plans enable row level security;
alter table public.diet_plans enable row level security;
alter table public.payments enable row level security;

-- 7. RLS Policies — Allow all for authenticated users (simple for dev)
create policy "Allow all for authenticated" on public.profiles for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on public.workouts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on public.workout_plans for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on public.diet_plans for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on public.payments for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- 8. Auto-create profile on signup (trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'member')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
