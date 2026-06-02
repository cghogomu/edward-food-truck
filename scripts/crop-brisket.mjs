import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.join(root, "images", "Brisket Baked Potato.jpeg");
const out = path.join(root, "public", "menu", "brisket-baked-potato.jpg");

const img = sharp(src);
const meta = await img.metadata();
const cropTop = Math.round(meta.height * 0.3);

await img
  .extract({ left: 0, top: cropTop, width: meta.width, height: meta.height - cropTop })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(out);

console.log(`wrote ${out} (${meta.width}x${meta.height - cropTop})`);
