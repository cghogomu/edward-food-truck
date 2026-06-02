export type SpotlightPartner = {
  name: string;
  category: string;
  blurb: string;
  url?: string;
  placeholder?: boolean;
};

export const HOST_BUSINESS = {
  name: "Host business",
  blurb:
    "(Placeholder for the company that lets Iron Oaks park on their property. Edward wants to publicly thank them and send business their way — we'll plug in the real name, a short blurb, and a link once it's confirmed.)",
  placeholder: true,
};

export const COMMUNITY_PARTNERS: SpotlightPartner[] = [
  {
    name: "Local lemonade vendor",
    category: "Drinks",
    blurb:
      "(Placeholder partner — a real one Edward already works with to be plugged in.)",
    placeholder: true,
  },
  {
    name: "Local baker",
    category: "Sweets",
    blurb:
      "(Placeholder partner — pies, cookies, or whatever Edward's collaborator is making.)",
    placeholder: true,
  },
  {
    name: "Local barber / mechanic / service",
    category: "Services",
    blurb:
      "(Placeholder partner — folks who keep the rest of life going.)",
    placeholder: true,
  },
];

export const COMMUNITY_VALUE =
  "We are all we got. The shops we share corners with, the trades that keep us moving, the cooks doing the same thing two blocks over — when you eat with us, you're feeding a whole street.";
