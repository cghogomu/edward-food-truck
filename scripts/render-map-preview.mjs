/**
 * Renders the delivery-zone map to a PNG so it can be eyeballed without a
 * browser. Reads the generated data, so it always previews what the site ships.
 *
 *   node scripts/render-map-preview.mjs [outfile.png]
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(__dirname, "../src/content/delivery-zone.ts");
const out = process.argv[2] ?? path.resolve(__dirname, "../.map-preview.png");

// The generated file is plain data — pull the literals out without a TS build.
const src = readFileSync(DATA, "utf8");
const viewBox = JSON.parse(
  src.match(/ZONE_VIEWBOX = (\{[^}]*\})/)[1].replace(/(\w+):/g, '"$1":')
);
const truck = JSON.parse(
  src.match(/TRUCK_POINT = (\{[^}]*\})/)[1].replace(/(\w+):/g, '"$1":')
);
const basemapSrc = src.match(/src: "([^"]+)"/)[1];
const basemapPath = path.resolve(__dirname, "../public", basemapSrc.replace(/^\//, ""));
const basemapB64 = readFileSync(basemapPath).toString("base64");
const polygons = JSON.parse(
  src.match(/ZONE_POLYGONS: ZonePolygon\[\] = (\[[\s\S]*?\]);/)[1]
);

const { width, height } = viewBox;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width * 1.5}" height="${height * 1.5}">
  <defs>
    <linearGradient id="zone-fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#D89A3A" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#D89A3A" stop-opacity="0.14"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" rx="10" fill="#1C1A17"/>
  <image href="data:image/png;base64,${basemapB64}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="none"/>
  <mask id="outside-zone">
    <rect x="0" y="0" width="${width}" height="${height}" fill="white"/>
    ${polygons.map((p) => `<path d="${p.d}" fill="black"/>`).join("\n    ")}
  </mask>
  <g mask="url(#outside-zone)"><rect x="0" y="0" width="${width}" height="${height}" fill="#0B0A09" opacity="0.48"/></g>
  ${polygons.map((p) => `<path d="${p.d}" fill="url(#zone-fill)"/>`).join("\n  ")}
  ${polygons
    .map(
      (p) =>
        `<path d="${p.d}" fill="none" stroke="#E0A544" stroke-opacity="0.9" stroke-width="1.6"/>`
    )
    .join("\n  ")}
  ${polygons
    .map(
      (p) => `<text x="${p.cx}" y="${p.cy}" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#F5EFE5" paint-order="stroke" stroke="#0B0A09" stroke-opacity="0.85" stroke-width="4" stroke-linejoin="round">${p.zip}</text>
  <text x="${p.cx}" y="${p.cy + 15}" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#D7CEC0" paint-order="stroke" stroke="#0B0A09" stroke-opacity="0.85" stroke-width="3" stroke-linejoin="round">${p.city}</text>`
    )
    .join("\n  ")}
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log(`Wrote ${out} (${width}×${height} @1.5x, ${polygons.length} ZIPs)`);
