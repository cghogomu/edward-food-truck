import type { NextConfig } from "next";

/**
 * Vercel gives every project a permanent `*.vercel.app` address that can't be
 * deleted, so the site answers on two hostnames. Left alone that's a second
 * fully indexable copy competing with the real domain in search.
 *
 * We keep the vercel.app host serving — it's the only way back in if the
 * domain's DNS (which lives at HostGator, not here) ever breaks — but tell
 * crawlers to ignore it. The canonical tag in app/layout.tsx does the other
 * half, pointing any credit at ironoaksbbq.com.
 */
const VERCEL_APP_HOST = "edward-food-truck.vercel.app";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: VERCEL_APP_HOST }],
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
