import type { OpenStatus } from "@/types";
import { OrderLink } from "@/components/OrderLink";

const STATE_TINT: Record<OpenStatus["state"], string> = {
  open: "border-(--open)/40 bg-(--open)/8",
  low: "border-(--amber)/40 bg-(--amber)/8",
  "sold-out": "border-(--closed)/40 bg-(--closed)/8",
  closed: "border-(--text-muted)/30 bg-(--bg-card)",
  catering: "border-(--amber)/40 bg-(--amber)/8",
};

const STATE_LABEL_TINT: Record<OpenStatus["state"], string> = {
  open: "text-(--open)",
  low: "text-(--amber)",
  "sold-out": "text-(--closed)",
  closed: "text-(--text-soft)",
  catering: "text-(--amber)",
};

export function OpenStatusHero({ status }: { status: OpenStatus }) {
  const showOrder = status.state === "open" || status.state === "low";
  const pct =
    status.remaining !== undefined && status.max
      ? Math.max(0, Math.min(100, Math.round((status.remaining / status.max) * 100)))
      : null;

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
                status.state === "low" ? "Almost gone" :
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

        {showOrder && (
          <div className="shrink-0">
            <OrderLink className="block text-center bg-(--russet) hover:bg-(--russet-deep) text-(--text) px-5 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors">
              Order now
            </OrderLink>

            {/* What's actually left, per potato — so nobody clicks through to
                Heartland only to find the one they wanted is gone. */}
            {status.stock && status.stock.length > 0 && (
              <ul className="mt-3 space-y-1.5 text-sm">
                {status.stock.map((s) => {
                  const out = s.today <= 0;
                  return (
                    <li
                      key={s.itemId}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <span
                        className={out ? "text-(--text-muted) line-through" : "text-(--text-soft)"}
                      >
                        {s.name.replace(/ Baked Potato$/, "")}
                      </span>
                      <span
                        className={
                          out
                            ? "text-(--closed) font-medium whitespace-nowrap"
                            : "text-(--amber) font-medium whitespace-nowrap"
                        }
                      >
                        {out ? "Sold out" : `${s.today} left`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {pct !== null && status.state !== "closed" && status.state !== "catering" && (
        <div className="mt-5">
          <div className="h-1.5 bg-(--bg) rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${status.state === "low" ? "bg-(--amber)" : status.state === "sold-out" ? "bg-(--closed)" : "bg-(--open)"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
