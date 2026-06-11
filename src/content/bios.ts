export type TeamBio = {
  // A single photo of Edward & Keilone together — to be added by Edward.
  image: string;
  placeholder?: boolean;
  paragraphs: string[];
};

export const TEAM_BIO: TeamBio = {
  image:
    "https://images.unsplash.com/photo-1583394293214-28a4b0028a5b?w=900&q=80&auto=format&fit=crop",
  placeholder: true,
  paragraphs: [
    "I'm Edward, the founder and smoker of Iron Oaks BBQ — and this is Keilone, the backbone of operations.",
    "We're two Texans representing our community, culture, and history by contributing to Texas' reputation as the BBQ Capital of the World.",
  ],
};
