-- Scoresheet photo upload + free-OCR review flow.

alter table fixtures
  add column scoresheet_url text,
  add column scoresheet_suggestions jsonb;

insert into storage.buckets (id, name, public)
values ('scoresheets', 'scoresheets', true)
on conflict (id) do nothing;

create policy "Admins can upload scoresheets"
  on storage.objects for insert
  with check (bucket_id = 'scoresheets' and is_admin());

create policy "Admins can replace scoresheets"
  on storage.objects for update
  using (bucket_id = 'scoresheets' and is_admin());

create policy "Admins can delete scoresheets"
  on storage.objects for delete
  using (bucket_id = 'scoresheets' and is_admin());

create policy "Anyone can view scoresheets"
  on storage.objects for select
  using (bucket_id = 'scoresheets');
