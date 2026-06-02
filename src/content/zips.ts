/**
 * Edward's delivery zone — north Austin / Round Rock / Pflugerville / Manor.
 * Bounded by Hwy 79 (N), Hwy 290 (S), Toll 130 (E), Mopac Loop 1 (W).
 */
export const DELIVERY_ZIPS = new Set<string>([
  "78660", // Pflugerville
  "78664", // Round Rock
  "78752", // North Austin
  "78753", // North Austin
  "78754", // North Austin
  "78757", // North Austin
  "78758", // North Austin
]);

export function isDeliverable(zip: string): boolean {
  return DELIVERY_ZIPS.has(zip.trim());
}
