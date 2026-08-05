/**
 * Builds the delivery-zone map data from real ZIP boundaries.
 *
 * The map used to be a hand-drawn SVG blob with invented pin positions — it
 * didn't correspond to any actual geography. This pulls the real ZCTA (ZIP Code
 * Tabulation Area) polygons from the US Census TIGERweb service, simplifies
 * them, projects them to SVG coordinates, and writes a committed TypeScript
 * file. The site then renders local data: no API key, no runtime network call,
 * and nothing loaded from a third-party host.
 *
 * Re-run after changing DELIVERY_ZIPS in src/content/zips.ts:
 *   node scripts/build-delivery-zone.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ZIPS_FILE = resolve(ROOT, "src/content/zips.ts");
const OUT_FILE = resolve(ROOT, "src/content/delivery-zone.ts");

const CENSUS =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/1/query";

// Pickup address from SETTINGS.location, geocoded via OpenStreetMap Nominatim.
// Hardcoded rather than geocoded on every run so the build stays offline-ish and
// deterministic; re-geocode if the truck's home base changes.
const TRUCK = { lat: 30.3806225, lon: -97.6836971 };

/** Single source of truth is zips.ts — parse `"78753", // North Austin`. */
function readZips() {
  const src = readFileSync(ZIPS_FILE, "utf8");
  const zips = [...src.matchAll(/"(\d{5})",\s*\/\/\s*(.+)/g)].map((m) => ({
    zip: m[1],
    city: m[2].trim(),
  }));
  if (zips.length === 0) {
    throw new Error(
      `Parsed no ZIPs from ${ZIPS_FILE}. Has the format changed? Expected: "78753", // North Austin`
    );
  }
  return zips;
}

async function fetchBoundaries(zips) {
  const list = zips.map((z) => `'${z.zip}'`).join(",");
  const url =
    `${CENSUS}?where=${encodeURIComponent(`ZCTA5 IN (${list})`)}` +
    `&outFields=ZCTA5&returnGeometry=true&outSR=4326&f=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Census request failed: ${res.status}`);
  const geo = await res.json();
  if (!geo.features?.length) throw new Error("Census returned no features");
  const missing = zips
    .map((z) => z.zip)
    .filter((z) => !geo.features.some((f) => f.properties.ZCTA5 === z));
  if (missing.length) throw new Error(`No boundary returned for: ${missing.join(", ")}`);
  return geo.features;
}

/** Ramer–Douglas–Peucker. Keeps shape, drops the points nobody can see. */
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const sqTol = tolerance * tolerance;

  const sqSegDist = ([px, py], [x1, y1], [x2, y2]) => {
    let x = x1;
    let y = y1;
    let dx = x2 - x;
    let dy = y2 - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) {
        x = x2;
        y = y2;
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }
    dx = px - x;
    dy = py - y;
    return dx * dx + dy * dy;
  };

  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let maxSq = sqTol;
    let index = -1;
    for (let i = first + 1; i < last; i++) {
      const sq = sqSegDist(points[i], points[first], points[last]);
      if (sq > maxSq) {
        maxSq = sq;
        index = i;
      }
    }
    if (index !== -1) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

/** Outer ring of the largest polygon — ZCTAs occasionally ship slivers. */
function outerRing(geometry) {
  const polys =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polys
    .map((rings) => rings[0])
    .sort((a, b) => Math.abs(ringArea(b)) - Math.abs(ringArea(a)))[0];
}

function ringArea(ring) {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return sum / 2;
}

/** Area-weighted centroid, for label placement. */
function centroid(ring) {
  let x = 0;
  let y = 0;
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    a += f;
    x += (ring[j][0] + ring[i][0]) * f;
    y += (ring[j][1] + ring[i][1]) * f;
  }
  a *= 3;
  return a === 0 ? ring[0] : [x / a, y / a];
}

const TILE = 256;
const ZOOM = 12; // Freeway + arterial detail; ~24 tiles for this bbox.
const PAD_PX = 26;
/** Minimum gap (SVG units) between the truck pin and any ZIP label. */
const LABEL_CLEARANCE = 52;

const BASEMAP_URL = "https://tile.openstreetmap.org";
const BASEMAP_OUT = resolve(ROOT, "public/delivery-basemap.png");
const UA = "iron-oaks-site-build/1.0 (+https://edward-food-truck.vercel.app)";

/** Web Mercator: lon/lat -> global pixel coords at ZOOM. Matches the tiles. */
function lonLatToPixel(lon, lat) {
  const n = TILE * 2 ** ZOOM;
  const x = ((lon + 180) / 360) * n;
  const s = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n;
  return [x, y];
}

/**
 * Downloads the map tiles covering `bounds` and stitches them into one PNG.
 * Baked at build time on purpose: the site then serves its own image, with no
 * API key, no runtime call to a map provider, and no per-view cost.
 */
async function buildBasemap(px0, py0, px1, py1) {
  const tx0 = Math.floor(px0 / TILE);
  const ty0 = Math.floor(py0 / TILE);
  const tx1 = Math.floor(px1 / TILE);
  const ty1 = Math.floor(py1 / TILE);
  const cols = tx1 - tx0 + 1;
  const rows = ty1 - ty0 + 1;
  const count = cols * rows;
  console.log(`Fetching ${count} basemap tiles (z${ZOOM}, ${cols}×${rows})…`);

  const composites = [];
  for (let ty = ty0; ty <= ty1; ty++) {
    for (let tx = tx0; tx <= tx1; tx++) {
      const res = await fetch(`${BASEMAP_URL}/${ZOOM}/${tx}/${ty}.png`, {
        headers: { "User-Agent": UA },
      });
      if (!res.ok) throw new Error(`Tile ${ZOOM}/${tx}/${ty} failed: ${res.status}`);
      composites.push({
        input: Buffer.from(await res.arrayBuffer()),
        left: (tx - tx0) * TILE,
        top: (ty - ty0) * TILE,
      });
      // Be a polite client of a donated service.
      await new Promise((r) => setTimeout(r, 120));
    }
  }

  const stitchedW = cols * TILE;
  const stitchedH = rows * TILE;
  const originX = tx0 * TILE;
  const originY = ty0 * TILE;

  // Crop to the padded bounds so the image matches the SVG viewBox exactly.
  const cropLeft = Math.round(px0 - originX);
  const cropTop = Math.round(py0 - originY);
  const cropW = Math.round(px1 - px0);
  const cropH = Math.round(py1 - py0);

  const { default: sharp } = await import("sharp");
  await sharp({
    create: {
      width: stitchedW,
      height: stitchedH,
      channels: 3,
      background: "#1C1A17",
    },
  })
    .composite(composites)
    .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
    // Muted so the amber zone overlay stays the subject, not the road noise.
    .modulate({ brightness: 0.62, saturation: 0.55 })
    // Palette-quantised: map tiles are flat colour, so this cuts the file to a
    // fraction of full-colour PNG with no visible loss.
    .png({ compressionLevel: 9, palette: true, quality: 82, effort: 10 })
    .toFile(BASEMAP_OUT);

  return { width: cropW, height: cropH };
}

async function main() {
  const zips = readZips();
  console.log(`Fetching boundaries for ${zips.length} ZIPs…`);
  const features = await fetchBoundaries(zips);

  // Simplify in degrees first so tolerance is geographic, not pixel-dependent.
  const rings = new Map();
  for (const f of features) {
    const ring = simplify(outerRing(f.geometry), 0.0006);
    rings.set(f.properties.ZCTA5, ring);
  }

  const all = [...rings.values()].flat();
  const pixels = all.map(([lon, lat]) => lonLatToPixel(lon, lat));
  const truckPx = lonLatToPixel(TRUCK.lon, TRUCK.lat);
  const xs = [...pixels.map((p) => p[0]), truckPx[0]];
  const ys = [...pixels.map((p) => p[1]), truckPx[1]];

  const px0 = Math.min(...xs) - PAD_PX;
  const py0 = Math.min(...ys) - PAD_PX;
  const px1 = Math.max(...xs) + PAD_PX;
  const py1 = Math.max(...ys) + PAD_PX;

  const basemap = await buildBasemap(px0, py0, px1, py1);
  const WIDTH = basemap.width;
  const HEIGHT = basemap.height;
  console.log(`Basemap ${WIDTH}×${HEIGHT} -> ${BASEMAP_OUT}`);

  // Same Mercator space as the tiles, shifted to the cropped image origin —
  // this is what keeps the polygons registered to the roads underneath.
  const project = ([lon, lat]) => {
    const [x, y] = lonLatToPixel(lon, lat);
    return [+(x - px0).toFixed(1), +(y - py0).toFixed(1)];
  };

  const [truckX, truckY] = project([TRUCK.lon, TRUCK.lat]);

  const polygons = zips.map(({ zip, city }) => {
    const ring = rings.get(zip);
    const pts = ring.map(project);
    const d =
      pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join("") + "Z";
    let [cx, cy] = project(centroid(ring));

    // The truck sits inside one of these ZIPs, so its pin can land right on that
    // ZIP's centroid and the two labels collide. Push the ZIP label clear.
    const dist = Math.hypot(cx - truckX, cy - truckY);
    if (dist < LABEL_CLEARANCE) {
      cy = +(truckY + LABEL_CLEARANCE).toFixed(1);
    }
    return { zip, city, d, cx, cy, points: pts.length, nudged: dist < LABEL_CLEARANCE };
  });
  const total = polygons.reduce((s, p) => s + p.points, 0);

  const out = `// GENERATED FILE — do not edit by hand.
// Run: node scripts/build-delivery-zone.mjs
//
// Real ZIP Code Tabulation Area boundaries from the US Census TIGERweb service,
// simplified and projected to SVG coordinates. Source of truth for which ZIPs
// appear here is DELIVERY_ZIPS in ./zips.ts.

export type ZonePolygon = {
  zip: string;
  city: string;
  /** SVG path in VIEWBOX coordinates. */
  d: string;
  /** Centroid, for label placement. */
  cx: number;
  cy: number;
};

export const ZONE_VIEWBOX = { width: ${WIDTH}, height: ${HEIGHT} };

/**
 * Road basemap baked at build time from OpenStreetMap tiles, cropped to exactly
 * the viewBox above. Served from this site — no map API key, no runtime request
 * to a tile provider. Attribution is required wherever this is displayed.
 */
export const BASEMAP = {
  src: "/delivery-basemap.png",
  attribution: "© OpenStreetMap contributors",
};

/** Pickup location (406 W. Braker Ln), projected into the same space. */
export const TRUCK_POINT = { x: ${truckX}, y: ${truckY} };

export const ZONE_POLYGONS: ZonePolygon[] = ${JSON.stringify(
    polygons.map(({ zip, city, d, cx, cy }) => ({ zip, city, d, cx, cy })),
    null,
    2
  )};
`;

  writeFileSync(OUT_FILE, out);
  console.log(
    `Wrote ${OUT_FILE}\n  viewBox ${WIDTH}×${HEIGHT}, ${total} points across ${polygons.length} ZIPs`
  );
  for (const p of polygons)
    console.log(`  ${p.zip} ${p.city} — ${p.points} pts${p.nudged ? " (label nudged clear of truck pin)" : ""}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
