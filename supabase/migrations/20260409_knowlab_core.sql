-- Knowlab core schema for role-governed SOP workflows + RAG knowledge bank
create extension if not exists vector;

create type public.app_role as enum ('staff', 'supervisor', 'hod');
create type public.sop_stage as enum (
  'draft',
  'in_review',
  'changes_requested',
  'awaiting_hod_validation',
  'validated_published',
  'archived'
);
create type public.task_decision as enum ('pending', 'approved', 'changes_requested', 'rejected');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  role public.app_role not null default 'staff',
  unit text not null,
  status text not null default 'active',
  must_reset_password boolean not null default false,
  created_by uuid references public.profiles(id),
  approved_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sops (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  owner_id uuid not null references public.profiles(id),
  unit text not null,
  category text not null,
  current_version integer not null default 1,
  current_stage public.sop_stage not null default 'draft',
  published_version_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sop_versions (
  id uuid primary key default gen_random_uuid(),
  sop_id uuid not null references public.sops(id) on delete cascade,
  version_number integer not null,
  content jsonb not null,
  change_summary text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique(sop_id, version_number)
);

alter table public.sops
  add constraint if not exists sops_published_version_fk
  foreign key (published_version_id) references public.sop_versions(id);

create table if not exists public.sop_review_tasks (
  id uuid primary key default gen_random_uuid(),
  sop_id uuid not null references public.sops(id) on delete cascade,
  sop_version_id uuid not null references public.sop_versions(id) on delete cascade,
  assigned_reviewer_id uuid not null references public.profiles(id),
  assigned_by_id uuid not null references public.profiles(id),
  due_date date,
  decision public.task_decision not null default 'pending',
  comments text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sop_validation_tasks (
  id uuid primary key default gen_random_uuid(),
  sop_id uuid not null references public.sops(id) on delete cascade,
  sop_version_id uuid not null references public.sop_versions(id) on delete cascade,
  assigned_hod_id uuid not null references public.profiles(id),
  assigned_by_id uuid not null references public.profiles(id),
  due_date date,
  decision public.task_decision not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_creation_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id),
  requested_user_email text not null,
  requested_user_name text not null,
  requested_user_role public.app_role not null,
  requested_unit text not null,
  decision public.task_decision not null default 'pending',
  decided_by uuid references public.profiles(id),
  decision_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id bigserial primary key,
  actor_id uuid references public.profiles(id),
  event_type text not null,
  resource_type text not null,
  resource_id text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  source_type text not null, -- sop, test, job_aid
  source_id text not null,
  title text not null,
  unit text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(source_type, source_id)
);

create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.knowledge_documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  embedding vector(1536),
  token_count integer,
  created_at timestamptz not null default now(),
  unique(document_id, chunk_index)
);

alter table public.profiles enable row level security;
alter table public.sops enable row level security;
alter table public.sop_versions enable row level security;
alter table public.sop_review_tasks enable row level security;
alter table public.sop_validation_tasks enable row level security;
alter table public.user_creation_requests enable row level security;
alter table public.audit_events enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.document_chunks enable row level security;

create or replace function public.current_user_role() returns public.app_role
language sql stable as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "profiles_self_or_hod"
on public.profiles for select
using (
  auth.uid() = id or public.current_user_role() = 'hod'
);

create policy "sops_visible_to_all_roles"
on public.sops for select using (auth.role() = 'authenticated');

create policy "staff_supervisor_hod_write_sops"
on public.sops for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "sop_versions_visible_to_all_roles"
on public.sop_versions for select using (auth.role() = 'authenticated');

create policy "review_tasks_visible_to_all_roles"
on public.sop_review_tasks for select using (auth.role() = 'authenticated');

create policy "validation_tasks_visible_to_all_roles"
on public.sop_validation_tasks for select using (auth.role() = 'authenticated');

create policy "user_requests_visible_to_supervisor_hod"
on public.user_creation_requests for select
using (public.current_user_role() in ('supervisor', 'hod'));

create policy "insert_user_requests_by_supervisor"
on public.user_creation_requests for insert
with check (public.current_user_role() = 'supervisor');

create policy "update_user_requests_by_hod"
on public.user_creation_requests for update
using (public.current_user_role() = 'hod');

create policy "audit_visible_to_hod"
on public.audit_events for select
using (public.current_user_role() = 'hod');

create policy "knowledge_docs_read_authenticated"
on public.knowledge_documents for select
using (auth.role() = 'authenticated');

create policy "document_chunks_read_authenticated"
on public.document_chunks for select
using (auth.role() = 'authenticated');
