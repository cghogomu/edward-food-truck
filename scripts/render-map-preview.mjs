import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ZONE_PATH =
  "M 215,120 L 360,118 L 395,180 L 430,250 L 445,335 L 430,420 L 400,495 L 360,560 L 250,565 L 205,490 L 185,400 L 175,315 L 185,225 Z";

const ZIPS = [
  { zip: "78664", cx: 305, cy: 150 },
  { zip: "78660", cx: 320, cy: 240 },
  { zip: "78758", cx: 285, cy: 320 },
  { zip: "78757", cx: 240, cy: 380 },
  { zip: "78753", cx: 330, cy: 395 },
  { zip: "78754", cx: 365, cy: 450 },
  { zip: "78752", cx: 290, cy: 510 },
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 680" width="900" height="1020">
  <rect width="600" height="680" fill="#252220"/>
  <defs>
    <pattern id="hatch-out" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="10" stroke="#7D766B" stroke-opacity="0.28" stroke-width="1.25"/>
    </pattern>
    <linearGradient id="zone-fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#D89A3A" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#D89A3A" stop-opacity="0.10"/>
    </linearGradient>
    <mask id="outside-zone">
      <rect width="600" height="680" fill="white"/>
      <path d="${ZONE_PATH}" fill="black"/>
    </mask>
  </defs>
  <rect x="40" y="60" width="520" height="580" rx="8" fill="#1C1A17" stroke="#3A332B" stroke-width="1"/>
  <g mask="url(#outside-zone)">
    <rect x="40" y="60" width="520" height="580" fill="url(#hatch-out)"/>
  </g>
  <g font-family="sans-serif" font-size="13" font-weight="600" fill="#B8B0A3" letter-spacing="1.4">
    <text x="300" y="45" text-anchor="middle">HWY 79</text>
    <text x="300" y="665" text-anchor="middle">HWY 290</text>
    <text x="22" y="350" text-anchor="middle" transform="rotate(-90 22 350)">MOPAC · LOOP 1</text>
    <text x="578" y="350" text-anchor="middle" transform="rotate(90 578 350)">TOLL 130</text>
  </g>
  <g stroke="#3A332B" stroke-width="1">
    <line x1="40" y1="60" x2="560" y2="60"/>
    <line x1="40" y1="640" x2="560" y2="640"/>
    <line x1="40" y1="60" x2="40" y2="640"/>
    <line x1="560" y1="60" x2="560" y2="640"/>
  </g>
  <line x1="300" y1="80" x2="300" y2="620" stroke="#3A332B" stroke-width="1.5" stroke-dasharray="4 5"/>
  <text x="308" y="92" font-family="sans-serif" font-size="10" fill="#7D766B" letter-spacing="0.8">I-35</text>
  <path d="${ZONE_PATH}" fill="url(#zone-fill)" stroke="#D89A3A" stroke-width="2.25" stroke-linejoin="round"/>
  ${ZIPS.map(
    (p) =>
      `<g><circle cx="${p.cx}" cy="${p.cy}" r="4" fill="#D89A3A"/><text x="${p.cx + 9}" y="${p.cy + 4}" font-family="sans-serif" font-size="12" font-weight="600" fill="#F2EDE5">${p.zip}</text></g>`
  ).join("\n  ")}
  <g font-family="sans-serif" font-size="11" fill="#7D766B" letter-spacing="1.2">
    <text x="475" y="290" text-anchor="middle">MANOR</text>
    <text x="475" y="305" text-anchor="middle" font-size="9">(not yet)</text>
    <text x="110" y="475" text-anchor="middle">SOUTH AUSTIN</text>
    <text x="110" y="490" text-anchor="middle" font-size="9">(not yet)</text>
  </g>
  <g transform="translate(60, 605)">
    <rect x="0" y="0" width="14" height="10" fill="url(#zone-fill)" stroke="#D89A3A" stroke-width="1.5"/>
    <text x="20" y="9" font-family="sans-serif" font-size="11" fill="#B8B0A3">Free delivery</text>
  </g>
</svg>`;

const out = path.join(__dirname, "..", "images", "_map-preview.png");
await sharp(Buffer.from(svg)).png().toFile(out);
console.log("wrote", out);
