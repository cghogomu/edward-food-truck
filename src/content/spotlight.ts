export type SpotlightPartner = {
  name: string;
  category: string;
  blurb: string;
  location?: string;
  url?: string;
  placeholder?: boolean;
};

export const HOST_BUSINESS = {
  name: "Construction Specialties",
  blurb:
    "Construction Specialties is a family-owned shop that's spent 30-plus years selling and fixing tools for this community — the kind of place pros and weekend homeowners both trust, with a 4.5-star Google rating to prove it. They give us a corner to park on. The least we can do is point good people their way.",
  url: "https://conspecs.com/",
};

// Description placeholder shared until Edward writes each one up.
const PARTNER_BLURB_TODO = "Description coming soon";

export const COMMUNITY_PARTNERS: SpotlightPartner[] = [
  {
    name: "Fraga's Barbershop",
    category: "Barber",
    location: "Pflugerville",
    blurb: PARTNER_BLURB_TODO,
    placeholder: true,
  },
  {
    name: "Dutch Bros",
    category: "Coffee",
    location: "Parmer Ln & Wells Branch",
    blurb: PARTNER_BLURB_TODO,
    placeholder: true,
  },
  {
    name: "Botanic Bliss",
    category: "Cafe",
    location: "Pflugerville",
    blurb: PARTNER_BLURB_TODO,
    placeholder: true,
  },
  {
    name: "Jimmy's Auto Repair",
    category: "Auto Repair",
    location: "Austin",
    blurb: PARTNER_BLURB_TODO,
    placeholder: true,
  },
  {
    name: "Tony's Mobile Repair",
    category: "Mobile Mechanic",
    blurb: PARTNER_BLURB_TODO,
    placeholder: true,
  },
  {
    name: "Matt's Lifted Lemonades",
    category: "Drinks",
    blurb: PARTNER_BLURB_TODO,
    placeholder: true,
  },
];

export const COMMUNITY_VALUE =
  "We are all we got. The shops we share corners with, the trades that keep us moving, the cooks doing the same thing two blocks over — when you eat with us, you're feeding a whole street.";
