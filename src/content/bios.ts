export type TeamBio = {
  // A single photo of Edward & Keilone together — to be added by Edward.
  image: string;
  placeholder?: boolean;
  paragraphs: string[];
};

export const TEAM_BIO: TeamBio = {
  // Edward's profile headshot. Swap in a photo of Edward & Keilone together when available.
  image: "/edward-about.jpeg",
  paragraphs: [
    "I'm Edward — founder and pitmaster of Iron Oaks BBQ. Alongside Keilone, who keeps our operations running, we run the truck as a two-person Texas team.",
    "We're two Texans representing our community, culture, and history by contributing to Texas' reputation as the BBQ Capital of the World.",
  ],
};
