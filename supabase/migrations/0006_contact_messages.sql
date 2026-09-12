-- Contact form submissions.
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

create policy "anyone can submit a contact message" on contact_messages
  for insert with check (true);
create policy "admins read contact messages" on contact_messages
  for select using (is_admin());
create policy "admins delete contact messages" on contact_messages
  for delete using (is_admin());
