// Auto-scrolling photo marquee. The set is rendered twice so the CSS animation
// (translateX 0 → -50%) loops seamlessly. To change the photos, edit STRIP_PHOTOS.
const STRIP_PHOTOS = [
  // Interleaved: food shot → happy locals → truck/scene, so the strip stays varied as it scrolls.
  "/menu/brisket-baked-potato.jpg",
  "/marquee/locals-1.jpeg",
  "/marquee/smoker-tent.jpeg",
  "/marquee/locals-4.jpeg",
  "/menu/loaded-potato.jpg",
  "/marquee/locals-6.jpeg",
  "/marquee/brisket-sign.jpeg",
  "/marquee/locals-2.jpeg",
  "/marquee/locals-9.jpeg",
  "/menu/breakfast-burrito.png",
  "/marquee/locals-11.jpeg",
  "/marquee/ed-sunset-smoker.jpeg",
  "/marquee/locals-5.jpeg",
  "/marquee/refs.jpeg",
  "/menu/sausage-wrap.png",
  "/marquee/locals-14.jpeg",
  "/marquee/street-party.jpeg",
  "/marquee/locals-7.jpeg",
  "/marquee/sonic.jpeg",
  "/marquee/brisket-closeup.jpeg",
  "/marquee/locals-3.jpeg",
  "/marquee/locals-12.jpeg",
  "/menu/brisket.jpg",
  "/marquee/locals-10.jpeg",
  "/marquee/smoker-prep.jpeg",
  "/marquee/locals-15.jpeg",
  "/marquee/locals-13.jpeg",
  "/marquee/locals-8.jpeg",
  "/marquee/locals-16.jpeg",
];

// Crop-focus overrides for tall portrait photos whose subjects sit high in the
// frame. The tiles crop to a centered 4:3 box, which slices the tops of heads off
// these shots — nudging the focus upward keeps faces in view. Default is "center".
const FOCUS: Record<string, string> = {
  "/marquee/locals-15.jpeg": "center 12%",
  "/marquee/locals-14.jpeg": "center 15%",
  "/marquee/locals-8.jpeg": "center 40%",
};

export function PhotoStrip() {
  const tiles = [...STRIP_PHOTOS, ...STRIP_PHOTOS];
  return (
    <section
      className="photo-strip py-3.5"
      aria-label="Photos from Iron Oaks"
    >
      <div className="strip-track">
        {tiles.map((src, i) => (
          <div
            key={i}
            className="strip-tile"
            style={{
              backgroundImage: `url("${src}")`,
              backgroundPosition: FOCUS[src] ?? "center",
            }}
            aria-hidden={i >= STRIP_PHOTOS.length || undefined}
          />
        ))}
      </div>
    </section>
  );
}
