export type Bio = {
  name: string;
  role: string;
  body: string;
  image: string;
  placeholder?: boolean;
};

export const BIOS: Bio[] = [
  {
    name: "Edward",
    role: "Owner & pitmaster",
    body: "Edward built Iron Oaks on a simple idea: a few things, done really well. Every potato is hand-finished, plated to order, and built around the smoke he tends himself.",
    image:
      "https://images.unsplash.com/photo-1583394293214-28a4b0028a5b?w=600&q=80&auto=format&fit=crop",
    placeholder: false,
  },
  {
    name: "Edward's right hand",
    role: "Kitchen lead",
    body: "(Placeholder bio — Edward's one full-time teammate. We'll swap in the real name, photo, and a couple sentences about how long they've been together once Edward sends them over.)",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80&auto=format&fit=crop",
    placeholder: true,
  },
];
