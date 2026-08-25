import type { OpenStatus } from "@/types";
import { OrderLink } from "@/components/OrderLink";

const STATE_TINT: Record<OpenStatus["state"], string> = {
  open: "border-(--open)/40 bg-(--open)/8",
  "sold-out": "border-(--closed)/40 bg-(--closed)/8",
  closed: "border-(--text-muted)/30 bg-(--bg-card)",
  catering: "border-(--amber)/40 bg-(--amber)/8",
};

const STATE_LABEL_TINT: Record<OpenStatus["state"], string> = {
  open: "text-(--open)",
  "sold-out": "text-(--closed)",
  closed: "text-(--text-soft)",
  catering: "text-(--amber)",
};

export function OpenStatusHero({ status }: { status: OpenStatus }) {
  // The order button shows in every state. It used to appear only while the
  // truck was serving, so the home page announced "Closed today" with no way to
  // order ahead for the next service — the dead end customers complained about.
  const serving = status.state === "open";
  return (
    <div
      className={[
        "rounded-2xl border backdrop-blur-sm p-6 sm:p-7",
        STATE_TINT[status.state],
      ].join(" ")}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className={`inline-block w-2 h-2 rounded-full ${STATE_LABEL_TINT[status.state]} bg-current ${status.state === "open" ? "animate-pulse" : ""}`} />
            <span className={`text-xs uppercase tracking-[0.18em] font-semibold ${STATE_LABEL_TINT[status.state]}`}>
              {status.state === "open" ? "We're open" :
                status.state === "sold-out" ? "Sold out" :
                status.state === "catering" ? "Catering today" :
                "Closed"}
            </span>
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-(--text) leading-tight">
            {status.label}
          </div>
          {status.detail && (
            <p className="mt-2 text-(--text-soft) text-sm sm:text-base">
              {status.detail}
            </p>
          )}
        </div>

        <div className="shrink-0">
          <OrderLink className="block text-center bg-(--russet) hover:bg-(--russet-deep) text-(--text) px-5 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors">
            {serving ? "Order now" : "Order ahead"}
          </OrderLink>

          {!serving && (
            <p className="mt-2 max-w-[13rem] text-xs text-(--text-muted) leading-snug">
              Put it in now — we&apos;ll make it next service.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
