-- Prime Hospital: Automatic UHID + patient history migration
-- Run once in Supabase SQL Editor.
alter table public.patients add column if not exists doctor_id uuid references auth.users(id);
alter table public.visits add column if not exists doctor_id uuid references auth.users(id);
alter table public.prescriptions add column if not exists doctor_id uuid references auth.users(id);
alter table public.medicines add column if not exists doctor_id uuid references auth.users(id);

create sequence if not exists public.patient_uhid_seq start 1;

create or replace function public.next_patient_uhid()
returns text language plpgsql security definer set search_path=public as $$
begin
  return 'PH-' || lpad(nextval('public.patient_uhid_seq')::text, 6, '0');
end; $$;

-- Keep the existing patient_id column as the UHID field.
-- Existing manually entered IDs are preserved. New patients created by the app receive PH-XXXXXX.
create index if not exists patients_doctor_name_idx on public.patients(doctor_id, name);
create index if not exists patients_doctor_mobile_idx on public.patients(doctor_id, mobile);
create index if not exists visits_patient_date_idx on public.visits(patient_id, visit_date desc);
create index if not exists prescriptions_visit_idx on public.prescriptions(visit_id, sort_order);
