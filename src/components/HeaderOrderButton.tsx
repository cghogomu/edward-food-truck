import { OrderLink } from "@/components/OrderLink";

export function HeaderOrderButton({
  orderable,
  reason,
}: {
  orderable: boolean;
  reason?: string;
}) {
  return (
    <OrderLink
      disabled={!orderable}
      disabledReason={reason}
      className="hidden md:inline-flex items-center gap-1.5 bg-(--russet) hover:bg-(--russet-deep) text-(--text) text-sm font-medium px-4 py-2 rounded transition-colors"
    >
      {orderable ? "Order" : "Closed"}
      {orderable && <ExternalIcon />}
    </OrderLink>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="opacity-70"
    >
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
      <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </svg>
  );
}
