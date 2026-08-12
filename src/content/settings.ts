export const SETTINGS = {
  brand: {
    name: "Iron Oaks",
    // The gold eyebrow above the home-page headline.
    tagline: "Loaded Baked Potatoes",
    positioning: "Upscale quality, for blue collar pockets.",
  },
  // The pickup location is deliberately absent: Edward is delivery-only for
  // now, so the truck's parking spot is published nowhere on the site.
  //
  // To bring pickup back, restore this block and wire it into the "How to
  // order" page (a Pickup card beside the delivery one), the home hero, the
  // calendar header, and the community credit:
  //   location: {
  //     venue: "Construction Specialties",
  //     street: "406 W. Braker Ln.",
  //     cityState: "Austin, TX 78753",
  //     directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${
  //       encodeURIComponent("406 W Braker Ln, Austin, TX 78753")}`,
  //   },
  // The delivery-zone map also has a commented-out truck pin to re-enable.
  contact: {
    phone: "(512) 555-0123",
    ordersEmail: "orders@ironoaks.placeholder",
    cateringEmail: "edward@ironoaks.placeholder",
    instagram: "@ironoaks",
  },
  ordering: {
    deliveryFee: 0,
    deliveryFeePromoActive: true,
    salesTaxRate: 0.0825,
    stripeFeePassThrough: 0.3,
    cateringSmallThreshold: 60,
    // Edward's Heartland "Online Ordering" storefront — the real ordering system:
    // menu, cart, checkout and payment all live there. This site links out to it
    // rather than rebuilding a cart, because Heartland has no documented way to
    // accept an order handed over from an outside site. Always render it through
    // <OrderLink> so every entry point behaves the same.
    orderUrl: "https://ironoaksbbq.hrpos.heartland.us/",
  },
  credits: {
    builder: "Meridian Works",
    builderUrl: "https://www.meridianworksco.com",
  },
};
