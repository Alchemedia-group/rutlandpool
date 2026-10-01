-- Richer per-team venue details (address, phone, opening hours, a short
-- description, and a map link) alongside the existing single-line `venue`
-- field, which stays as the short "name, town" shown in fixture lists.
alter table teams add column if not exists venue_address text;
alter table teams add column if not exists venue_phone text;
alter table teams add column if not exists venue_hours text;
alter table teams add column if not exists venue_description text;
alter table teams add column if not exists venue_map_url text;

-- Populated from the RCPL Venue Listings 2026/27 research doc (Rhys).
-- Two known open questions at time of writing, left as-is pending
-- confirmation: Catmose Club's postcode (CAMRA lists LE15 6BG, not the
-- LE15 6HY used here) and Bill's Bar's street number (not included below).

update teams set
  venue = 'The Royal Duke, Oakham',
  venue_address = '8 West Road, Oakham, LE15 6LU',
  venue_hours = 'Mon-Thu 2pm-10:30pm, Fri 11am-12:30am, Sat 12pm-12:30am, Sun 12pm-10:30pm',
  venue_description = 'A traditional locals'' pub on the west side of Oakham, and a long-standing community hub that fields its own pool and darts teams. Expect bingo a couple of times a month, a monthly quiz and live sport on Sky. Indian takeaway food is served in the evenings (Tue-Sun, closed Mon).',
  venue_map_url = 'https://www.google.com/maps/search/?api=1&query=The+Royal+Duke+8+West+Road+Oakham+LE15+6LU'
where name in ('The Duke A', 'Duke B');

update teams set
  venue = 'Bill''s Bar, Oakham',
  venue_address = 'Melton Road, Oakham, LE15 6AX',
  venue_description = 'Oakham''s sports bar and late-night venue on Melton Road, next door to the Wetherspoon. Multiple screens show the major sporting events, with weekly DJs and regular live music. It serves craft beer rather than real ale and is popular for private events. Bill''s Bar B have a bye every week in 2026/27, so only Bill''s Bar A play competitive home matches here.',
  venue_map_url = 'https://www.google.com/maps/search/?api=1&query=Bill%27s+Bar+Melton+Road+Oakham+LE15+6AX'
where name in ('Bill''s Bar A', 'Bill''s Bar B');

update teams set
  venue = 'Catmose Club, Oakham',
  venue_address = '27 South Street, Oakham, LE15 6HY',
  venue_hours = 'Mon & Fri 12pm-2:30pm and 7pm-11pm, Tue-Thu 7pm-11pm, Sat 12pm-11pm, Sun 11am-11pm',
  venue_description = 'A well-kept members'' social club on South Street in central Oakham. As a club, the bar may be open to members only, but visiting league players are welcome on match nights. It usually has a changing cask ale on.',
  venue_map_url = 'https://www.google.com/maps/search/?api=1&query=Catmose+Club+27+South+Street+Oakham+LE15+6HY'
where name in ('Catmose Club', 'Buff''s Club');

update teams set
  venue = 'The Vaults, Uppingham',
  venue_address = '4 Market Place, Uppingham, LE15 9QH',
  venue_phone = '01572 823259',
  venue_hours = 'Mon 12pm-10:30pm, Tue-Thu 3pm-10:30pm, Fri-Sat 12pm-11pm, Sun 12pm-10pm',
  venue_description = 'A Grade II listed 17th-century stone pub beside the church, overlooking Uppingham''s market square. Inside it''s cosy with sofas and wood-burners; outside, the terrace looks onto the town''s events. Usually five hand pumps including local guest ales, regular beer festivals, live sport on TV, and it welcomes dogs and families.',
  venue_map_url = 'https://www.google.com/maps/search/?api=1&query=The+Vaults+4+Market+Place+Uppingham+LE15+9QH'
where name in ('The Vaults', 'Amps');

update teams set
  venue = 'UTFC Clubhouse, Uppingham',
  venue_address = 'Tod''s Piece, North Street East, Uppingham, LE15 9QJ',
  venue_description = 'The clubhouse of Uppingham Town Football Club, at the North Street East end of Tod''s Piece in the centre of town, a short walk from the High Street and Market Place. The ground is home to the club''s senior side and its junior section. Paid parking is available in the town centre nearby.',
  venue_map_url = 'https://www.google.com/maps/search/?api=1&query=UTFC+Clubhouse+Tod%27s+Piece+North+Street+East+Uppingham+LE15+9QJ'
where name in ('UTFC', 'UTFC 2');

update teams set
  venue = 'The Exeter Arms, Uppingham',
  venue_address = '3 Leicester Road, Uppingham, LE15 9SB',
  venue_phone = '01572 822900',
  venue_description = 'A friendly, independent, old-fashioned locals'' pub just west of Uppingham town centre, where High Street West meets Stockerston Road. It keeps much of its period character, serves a Langton Brewery ale plus at least two changing guests, and has a pool table, patio garden and a big screen for rugby and football. It takes part in the Uppingham beer festival.',
  venue_map_url = 'https://www.google.com/maps/search/?api=1&query=The+Exeter+Arms+3+Leicester+Road+Uppingham+LE15+9SB'
where name in ('The Exeter Arms', 'The Ex-Men');
