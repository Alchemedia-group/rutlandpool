-- Lets an admin sign in with a username instead of their email. Supabase
-- Auth itself is still email-based under the hood (every admin has a real
-- or synthetic email in auth.users) — this just adds a narrow, unauthenticated
-- lookup from a chosen username to that email, so the login form can accept
-- either.

alter table admins add column if not exists username text unique;
alter table admins add column if not exists email text;

create function email_for_username(p_username text) returns text
language sql security definer stable
set search_path = public
as $$
  select email from admins where username = p_username;
$$;

grant execute on function email_for_username(text) to anon, authenticated;
