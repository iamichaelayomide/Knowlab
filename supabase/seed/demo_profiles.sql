-- Note: create auth users first (via dashboard/Auth API), then map IDs here.
-- Replace UUID placeholders with actual auth.users ids.

insert into public.profiles (id, full_name, email, role, unit, status, must_reset_password)
values
  ('00000000-0000-0000-0000-000000000101', 'Staff Demo', 'staff123@knowlab.com', 'staff', 'Haematology & Blood Transfusion', 'active', false),
  ('00000000-0000-0000-0000-000000000102', 'Supervisor Demo', 'supervisor123@knowlab.com', 'supervisor', 'Haematology', 'active', false),
  ('00000000-0000-0000-0000-000000000103', 'HOD Demo', 'hod123@knowlab.com', 'hod', 'Laboratory Services', 'active', false)
on conflict (id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role,
  unit = excluded.unit,
  status = excluded.status,
  must_reset_password = excluded.must_reset_password;

