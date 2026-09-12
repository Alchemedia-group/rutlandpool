// From the committee's RCPL26AGMminutes.docx (AGM 2026/27).
export type AgmSection = { heading: string | null; items: string[] };

export const agmIntro = [
  "Greetings Captains,",
  "Looking forward to the new season, I would like to forward some points that were discussed and voted on at the AGM.",
];

export const agmSections: AgmSection[] = [
  {
    heading: null,
    items: [
      "It has been decided that cash prizes will be given from this season onwards! £150 for the winning team and £80 for the runners up (yes, even if it's split between multiple teams).",
      "The team subscription fees are being dropped to £20 per team.",
      "Scotch Doubles will be incorporated throughout the league.",
      "Should we have referees for doubles games? That is up to the players to request one, should they feel the need.",
      "Presentation evening will be held on 07/04/2027, venue to be confirmed.",
      "League start date: 30/09/26.",
      "Christmas break: no fixtures on the 23/12 or 30/12.",
      "Back to business on the 06/01/27.",
      "We need to ask captains to ensure the tables are match ready each week. Should there be any issues please get in touch ASAP!",
      "Coaching: we need to ask referees to be vigilant about specifically team mates “coaching” during a match. Random civilians expressing an opinion is none of our concern, however team mates audibly expressing an opinion that could impact the flow of play is. If the ref can hear it, it's a safe bet the player can hear it.",
    ],
  },
  {
    heading: "Start Times and Incomplete Teams",
    items: [
      "Ideal 8pm start time with 15 minutes grace.",
      "Early starts can be arranged between the captains concerned, preferably in the RCPL Captains Lounge WhatsApp chat.",
      "Less than 6 should be declared either on the captains chat or clearly marked as a BYE on the score sheets.",
      "How many fixtures should teams be allowed to play with less than 6 before forfeiting whole fixtures? Provided they have 4+ players there will be no further sanctions.",
      "If you are missing 2 players the team forfeits 2 singles and a double frame; missing 1 would lose a single and a double. Less than 4 players is a whole fixture forfeit.",
      "Late arrivals: the order of play should be decided and put onto the score cards before the break of the first frame. This allows captains to make decisions accordingly. If the allocated player has not arrived in time to play their frame, then the frame is forfeited and ALL singles must be played before the doubles. Amendments to the order of play for any reason must be discussed and agreed between the captains on site before the first break (for example, should a player be expected to be late for a legitimate reason, the sixth single game could potentially be played amidst the doubles, preferably as soon as the table is available after their arrival).",
    ],
  },
  {
    heading: "Doubles and Singles Buy-In Tournaments",
    items: [
      "We are going to run the tournaments alongside the league. This means drawing the fixtures, with opponents playing at a time and place decided between themselves within a fixed time frame. They also need to agree on a referee or ask us to allocate one. (We strongly recommend players check table availability at their agreed venue in advance.)",
      "The entry fees remain the same as previous years: £3 for the singles and £5 for the doubles.",
      "The first stage would be drawn and given say, 3 weeks to play and submit their results, then the next stage can be drawn. This can start around the same time as the main league.",
      "We now also have cash prizes for these tournaments. The prizes will be made up of 70% of the entry fees, 2/3 of which will go to the winners and 1/3 to the runners up of each tournament.",
    ],
  },
];

export const agmCommitteeNote =
  "The AGM also resulted in Graeme formally stepping down as Chairman and, by way of a no-opposition vote, Shaun was ushered in as our new Chairman. I am remaining his right-hand woman / Secretary, and Ian Bain remains as our treasurer.";

export const agmClosing = ["We look forward to seeing you all soon,", "Shaun & Kel"];

export const agmPs =
  "PS: Please captains, keep an eye on the Captains Lounge for more interesting upgrades that are in the pipeline.";
