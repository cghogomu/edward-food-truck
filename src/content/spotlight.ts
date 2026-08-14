export type SpotlightPartner = {
  name: string;
  category: string;
  blurb: string;
  location?: string;
  url?: string;
  /** Handle with the leading "@" — the card links it to the profile. */
  instagram?: string;
  placeholder?: boolean;
};

export const HOST_BUSINESS = {
  name: "Construction Specialties",
  blurb:
    "Construction Specialties is a family-owned shop that's spent 30-plus years selling and fixing tools for this community — the kind of place pros and weekend homeowners both trust, with a 4.5-star Google rating to prove it. They give us a corner to park on. The least we can do is point good people their way.",
  url: "https://conspecs.com/",
};

// Blurbs are written from what each business publishes about itself, so the
// site doesn't put words in a neighbour's mouth. A partner we can't describe
// accurately gets left off the page rather than given a plausible-sounding
// invention — see Jimmy's in TODO.md.
export const COMMUNITY_PARTNERS: SpotlightPartner[] = [
  {
    // Trades as "Fraga Barbershop" — no apostrophe-s — everywhere it lists itself.
    name: "Fraga Barbershop",
    category: "Barber",
    location: "W Pecan St, Pflugerville",
    blurb:
      "A straight-edge shop on Pecan — fades, line-ups and hot-towel shaves, done the unhurried way. Walk in if they're quiet; book ahead if you'd rather not gamble on a Saturday.",
    instagram: "@fraga_barbershop",
  },
  {
    name: "Dutch Bros",
    category: "Coffee",
    location: "E Parmer Ln, Austin",
    blurb:
      "Doors open at five, which matters when you've been up since four cooking. Coffee, teas, energy drinks and the blended stuff, and a crew that moves the drive-thru line faster than it looks.",
  },
  {
    name: "Botanic Bliss Café & Lounge",
    category: "Cafe",
    location: "FM 685, Pflugerville",
    blurb:
      "A wellness café on 685 — specialty coffee, matcha, smoothies, bowls and wraps in a room built to slow you down. The lighter counterweight to a fully loaded potato, and good people besides.",
    url: "https://thebotanicbliss.org/",
    instagram: "@botanicblissorg",
  },
  {
    // Handle confirmed by Edward. The profile is age-restricted on Instagram,
    // so its bio can't be read without logging in — hence a blurb that points
    // at their feed instead of describing a menu we haven't seen. Swap in a
    // real description once someone asks them what they're pouring.
    name: "LYFTD Lounge",
    category: "Drinks",
    blurb:
      "Cold drinks for hot plates. Their Instagram has what's pouring and where they'll be.",
    instagram: "@lyftdllc",
  },
];

export const COMMUNITY_VALUE =
  "We are all we got. The shops we share corners with, the trades that keep us moving, the cooks doing the same thing two blocks over — when you eat with us, you're feeding a whole street.";
