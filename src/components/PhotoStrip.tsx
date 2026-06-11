// Auto-scrolling photo marquee. The set is rendered twice so the CSS animation
// (translateX 0 → -50%) loops seamlessly. To change the photos, edit STRIP_PHOTOS.
const STRIP_PHOTOS = [
  "/menu/brisket-baked-potato.jpg",
  "/menu/loaded-potato.jpg",
  "/menu/breakfast-burrito.png",
  "/menu/sausage-wrap.png",
  "/menu/brisket.jpg",
  // From images/Marquee Photos — Edward will trim the menu shots above once he has more of these.
  "/marquee/locals-1.jpeg",
  "/marquee/locals-2.jpeg",
  "/marquee/locals-3.jpeg",
  "/marquee/refs.jpeg",
  "/marquee/sonic.jpeg",
];

export function PhotoStrip() {
  const tiles = [...STRIP_PHOTOS, ...STRIP_PHOTOS];
  return (
    <section
      className="photo-strip border-y border-(--color-line) py-3.5"
      aria-label="Photos from Iron Oaks"
    >
      <div className="strip-track">
        {tiles.map((src, i) => (
          <div
            key={i}
            className="strip-tile"
            style={{ backgroundImage: `url("${src}")` }}
            aria-hidden={i >= STRIP_PHOTOS.length || undefined}
          />
        ))}
      </div>
    </section>
  );
}
