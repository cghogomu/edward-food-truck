import type { OpenStatus } from "@/types";

const STATE_STYLES: Record<OpenStatus["state"], string> = {
  open: "bg-(--open)/15 text-(--open) border-(--open)/30",
  low: "bg-(--amber)/15 text-(--amber) border-(--amber)/30",
  "sold-out": "bg-(--closed)/15 text-(--closed) border-(--closed)/30",
  closed: "bg-(--text-muted)/15 text-(--text-soft) border-(--text-muted)/30",
  catering: "bg-(--amber)/15 text-(--amber) border-(--amber)/30",
};

const DOT_STYLES: Record<OpenStatus["state"], string> = {
  open: "bg-(--open)",
  low: "bg-(--amber)",
  "sold-out": "bg-(--closed)",
  closed: "bg-(--text-muted)",
  catering: "bg-(--amber)",
};

export function OpenStatusPill({
  status,
  compact = false,
}: {
  status: OpenStatus;
  compact?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border whitespace-nowrap",
        STATE_STYLES[status.state],
        compact ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
      ].join(" ")}
    >
      <span
        className={[
          "rounded-full",
          DOT_STYLES[status.state],
          status.state === "open" ? "animate-pulse" : "",
          compact ? "w-1.5 h-1.5" : "w-2 h-2",
        ].join(" ")}
      />
      <span className="font-medium">{status.label}</span>
      {!compact && status.detail && (
        <span className="text-(--text-soft) font-normal">· {status.detail}</span>
      )}
    </span>
  );
}
