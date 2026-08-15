-- Prime Hospital Prescription App
-- Run this script once in Supabase Dashboard -> SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  patient_id text unique,
  name text not null,
  age integer,
  gender text,
  mobile text,
  created_at timestamptz not null default now()
);

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  visit_date date not null default current_date,
  bp text, pulse text, spo2 text, temperature text, weight text, blood_sugar text,
  complaints text, diagnosis text, investigations text, advice text,
  created_at timestamptz not null default now()
);

create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  medicine_name text not null,
  strength text,
  dose text,
  frequency text,
  duration text,
  instruction text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.medicines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  strength text,
  default_frequency text,
  default_duration text,
  default_instruction text,
  created_at timestamptz not null default now()
);

alter table public.patients enable row level security;
alter table public.visits enable row level security;
alter table public.prescriptions enable row level security;
alter table public.medicines enable row level security;

-- Initial development policy. Replace with authenticated-user policies before storing real patient data.
drop policy if exists "dev patients" on public.patients;
create policy "dev patients" on public.patients for all to anon using (true) with check (true);
drop policy if exists "dev visits" on public.visits;
create policy "dev visits" on public.visits for all to anon using (true) with check (true);
drop policy if exists "dev prescriptions" on public.prescriptions;
create policy "dev prescriptions" on public.prescriptions for all to anon using (true) with check (true);
drop policy if exists "dev medicines" on public.medicines;
create policy "dev medicines" on public.medicines for all to anon using (true) with check (true);
