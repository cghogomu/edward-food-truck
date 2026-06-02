import type { SiteState } from "@/types";

export function PromoBanner({ state }: { state: SiteState }) {
  if (!state.freeDeliveryBanner) return null;
  return (
    <div className="bg-(--amber) text-(--bg) text-center text-sm font-medium py-2 px-4">
      <span className="font-semibold">Free delivery</span>
      <span className="text-(--bg)/70 mx-2">·</span>
      <span>Limited time, on the house.</span>
    </div>
  );
}
