-- Removes the scoresheet photo-scan feature — replaced by a simpler,
-- free-text match-result entry form.

drop policy if exists "Admins can upload scoresheets" on storage.objects;
drop policy if exists "Admins can replace scoresheets" on storage.objects;
drop policy if exists "Admins can delete scoresheets" on storage.objects;
drop policy if exists "Anyone can view scoresheets" on storage.objects;

-- The now-unwritable 'scoresheets' bucket and any objects in it are left
-- in place rather than deleted here — Supabase blocks direct SQL deletes
-- on storage tables (must go through the Storage API); clean up from the
-- dashboard if desired, it's otherwise harmless and unused.

alter table fixtures
  drop column if exists scoresheet_url,
  drop column if exists scoresheet_suggestions;
