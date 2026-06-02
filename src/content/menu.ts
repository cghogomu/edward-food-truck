import type { MenuItem } from "@/types";

export const MENU: MenuItem[] = [
  {
    id: "brisket",
    name: "Brisket Baked Potato",
    description:
      "Hot baked potato with a quarter pound of slow-smoked prime Texas brisket — butter, cheese, sour cream, BBQ sauce, green onions, and sriracha.",
    price: 17,
    image: "/menu/brisket-baked-potato.jpg",
    tags: ["Signature"],
    modifiers: [
      { id: "extra-brisket", name: "Extra brisket", price: 4 },
      { id: "no-sour", name: "No sour cream" },
      { id: "no-sriracha", name: "No sriracha" },
      { id: "no-green-onions", name: "No green onions" },
      { id: "sauce-side", name: "BBQ sauce on the side" },
    ],
  },
  {
    id: "chicken-bacon-ranch",
    name: "Chicken Bacon Ranch Baked Potato",
    description:
      "Hot baked potato with a quarter pound of fire-grilled chicken — smoked bacon, butter, cheese, homemade ranch, jalapeños, green onions, and sriracha.",
    price: 17,
    image:
      "https://images.unsplash.com/photo-1761712826074-5f1bab2b2f32?w=900&q=80&auto=format&fit=crop",
    tags: ["Signature"],
    modifiers: [
      { id: "extra-bacon", name: "Extra bacon", price: 2 },
      { id: "extra-chicken", name: "Extra chicken", price: 3 },
      { id: "no-jalapenos", name: "No jalapeños" },
      { id: "no-sriracha", name: "No sriracha" },
      { id: "no-green-onions", name: "No green onions" },
      { id: "ranch-side", name: "Ranch on the side" },
    ],
  },
  {
    id: "coming-soon",
    name: "Coming soon",
    description: "A third loaded potato dropping by grand opening. Stay tuned.",
    price: 0,
    image:
      "https://images.unsplash.com/photo-1610631087218-f784839e48f1?w=900&q=80&auto=format&fit=crop",
    comingSoon: true,
  },
];

export function findItem(id: string): MenuItem | undefined {
  return MENU.find((m) => m.id === id);
}
