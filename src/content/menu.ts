import type { MenuItem } from "@/types";

export const MENU: MenuItem[] = [
  {
    id: "brisket",
    name: "Brisket Loaded Baked Potato",
    description:
      "Hot baked potato with a quarter pound of slow-smoked prime Texas brisket — butter, cheese, sour cream, BBQ sauce, green onions, and sriracha.",
    price: 15,
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
    name: "Chicken Bacon Ranch Loaded Baked Potato",
    description:
      "Hot baked potato with a quarter pound of fire-grilled chicken — smoked bacon, butter, cheese, homemade ranch, jalapeños, green onions, and sriracha.",
    price: 15,
    image: "/menu/chicken-bacon-ranch.jpeg",
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
    id: "breakfast-burrito",
    name: "Breakfast Burrito",
    description:
      "Scrambled eggs, melted cheese, and your choice of meat wrapped in a warm flour tortilla — a hearty way to start the day.",
    price: 10,
    image: "/menu/breakfast-burrito.png",
  },
  {
    id: "sausage-wrap",
    name: "Sausage Wrap",
    description:
      "A grilled sausage tucked into a soft, warm tortilla — simple, savory, and ready to go.",
    price: 5,
    image: "/menu/sausage-wrap.png",
  },
  {
    id: "cookies",
    name: "Cookies",
    description: "Soft-baked and made fresh. The right way to finish.",
    price: 2,
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=900&q=80&auto=format&fit=crop",
    category: "extra",
  },
  {
    id: "can-drink",
    name: "Can Drink",
    description: "An ice-cold can to wash it all down.",
    price: 2,
    image:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=900&q=80&auto=format&fit=crop",
    category: "extra",
  },
];

export function findItem(id: string): MenuItem | undefined {
  return MENU.find((m) => m.id === id);
}
