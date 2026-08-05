export const SETTINGS = {
  brand: {
    name: "Iron Oaks",
    tagline: "Loaded potatoes · Austin",
    positioning: "Upscale quality, for blue collar pockets.",
  },
  location: {
    venue: "Construction Specialties",
    street: "406 W. Braker Ln.",
    cityState: "Austin, TX 78753",
    // No Google Maps / directions link while the truck stop isn't finalised —
    // the address is shown, but the site doesn't route anyone there yet. To
    // restore, add:
    //   directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${
    //     encodeURIComponent("406 W Braker Ln, Austin, TX 78753")}`
    // and link it from the four "Get directions" spots (home, order, calendar,
    // community) plus the delivery-zone map.
  },
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
