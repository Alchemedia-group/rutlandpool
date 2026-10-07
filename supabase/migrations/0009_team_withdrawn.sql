-- A team that has left the league mid-season. It drops out of the table
-- and the public team lists, and any fixture against it is shown as a bye
-- for the opponent: 0 points, no cancellation penalty.
alter table teams add column if not exists withdrawn boolean not null default false;

update teams set withdrawn = true where name = 'Bill''s Bar B';
