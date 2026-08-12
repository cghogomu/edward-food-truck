import type { MenuItem } from "@/types";

/**
 * Mirrors Edward's Heartland ordering page — names, prices, descriptions and
 * photos are taken from there, because that's where customers actually order.
 * If something changes on Heartland, change it here too or the site will quote
 * a price the checkout won't honour.
 *
 * Descriptions are Heartland's own. It stores English and Spanish in a single
 * field separated by " / "; they're split here so each renders as its own
 * paragraph.
 */
export const MENU: MenuItem[] = [
  {
    id: "brisket",
    name: "Brisket Baked Potato",
    description:
      "Baked Potato dressed with Butter and Cheese, loaded with a quarter-pound of Slow Smoked Brisket and topped with Sour Cream, BBQ Sauce, Green Onions, and Sriracha",
    descriptionEs:
      "Papa al horno con mantequilla y queso, cargada con un cuarto de libra de pecho de res ahumado lentamente y cubierta con crema agria, salsa BBQ, cebollín y Sriracha.",
    price: 15.6,
    image: "/menu/brisket-potato.jpg",
    tags: ["Signature"],
  },
  {
    id: "chicken-bacon-ranch",
    name: "Chicken Bacon Ranch Baked Potato",
    description:
      "Baked Potato dressed with Butter and Cheese, loaded with a quarter-pound of fire Grilled Chicken and Crispy Bacon, topped with fresh made Ranch, Chopped Green Onions, Sriracha, and jalapenos",
    descriptionEs:
      "Papa al horno con mantequilla y queso, cargada con un cuarto de libra de pollo a la parrilla y tocino crujiente, y cubierta con aderezo ranchero recién preparado, cebollín picado, salsa Sriracha y jalapeños.",
    price: 15.6,
    image: "/menu/chicken-bacon-ranch.jpg",
    tags: ["Signature"],
  },

  // Drinks — Heartland lists each by name at $2.10. Images are Heartland's.
  {
    id: "big-red",
    name: "Big Red 12oz",
    description: "",
    price: 2.1,
    image: "/menu/drinks/big-red.png",
    category: "extra",
  },
  {
    id: "brisk-tea-lemon",
    name: "Brisk Tea Lemon 12oz",
    description: "",
    price: 2.1,
    image: "/menu/drinks/brisk-tea.png",
    category: "extra",
  },
  {
    id: "coke",
    name: "Coke 12oz",
    description: "",
    price: 2.1,
    image: "/menu/drinks/coke.png",
    category: "extra",
  },
  {
    id: "dr-pepper",
    name: "Dr. Pepper 12oz",
    description: "",
    price: 2.1,
    image: "/menu/drinks/dr-pepper.png",
    category: "extra",
  },
  {
    id: "sprite",
    name: "Sprite 12oz",
    description: "",
    price: 2.1,
    image: "/menu/drinks/sprite.png",
    category: "extra",
  },
];

/**
 * The potatoes. Drinks aren't counted — Edward doesn't run out of cans the way
 * he runs out of brisket, so only these carry per-window stock.
 */
export const MAIN_ITEMS = MENU.filter((m) => m.category !== "extra");

/** Prices carry cents now ($15.60, $2.10) — never render `price` raw. */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function findItem(id: string): MenuItem | undefined {
  return MENU.find((m) => m.id === id);
}
